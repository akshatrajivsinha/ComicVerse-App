# MapBox and MapView Component README

This document explains the Mapbox integration and the MapView feature implemented in this React Native project.

## Overview

The map feature is implemented as a React Native screen component at:

```text
src/components/organism/MapView/index.tsx
```

The screen uses Mapbox for map rendering, markers, clustered points, polygon overlays, geocoding search, reverse geocoding, and camera control. Location permission and current device location are handled through `@react-native-community/geolocation` and native Android/iOS permission configuration.

The feature is registered in navigation as the `MapView` screen:

```text
src/navigation/AppNavigator.tsx
src/navigation/screenName.ts
src/navigation/types.ts
```

## Libraries Used

The MapView implementation depends on these packages from `frontendSection/package.json`:

```json
{
  "@rnmapbox/maps": "^10.3.1",
  "@mapbox/mapbox-sdk": "^0.16.2",
  "@react-native-community/geolocation": "^3.4.0",
  "react-native-config": "^1.6.1",
  "react-native-linear-gradient": "^2.8.3"
}
```

Purpose of each package:

- `@rnmapbox/maps`: Renders the native Mapbox map, camera, shape sources, layers, and annotations.
- `@mapbox/mapbox-sdk`: Provides Mapbox geocoding and reverse geocoding APIs.
- `@react-native-community/geolocation`: Reads the user's current GPS location.
- `react-native-config`: Loads the Mapbox access token from environment variables.
- `react-native-linear-gradient`: Styles the draw/apply/submit buttons.

## Mapbox Token Integration

The Mapbox token is loaded from `react-native-config` in `constants.ts`:

```ts
export const MAP_TOKEN = Config.MAP_TOKEN ?? '';

Mapbox.setAccessToken(MAP_TOKEN);
export const geocodingClient = MapboxGeocoding({ accessToken: MAP_TOKEN });
```

Expected environment variable:

```env
MAP_TOKEN=your_mapbox_access_token_here
```

The same token is used for:

- Native Mapbox map rendering through `Mapbox.setAccessToken`.
- Forward geocoding through `geocodingClient.forwardGeocode`.
- Reverse geocoding through `geocodingClient.reverseGeocode`.

## Native Setup

### Android

Android permissions are declared in:

```text
android/app/src/main/AndroidManifest.xml
```

Configured permissions:

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

Mapbox's Maven repository is configured in:

```text
android/build.gradle
```

```gradle
allprojects {
    repositories {
        maven {
            url 'https://api.mapbox.com/downloads/v2/releases/maven'
        }
    }
}
```

### iOS

iOS location usage is declared in:

```text
ios/frontendSection/Info.plist
```

Configured key:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string/>
```

Recommendation: replace the empty string with user-facing copy, for example:

```xml
<string>This helps the app show your current location and nearby properties.</string>
```

## File Structure

```text
src/components/organism/MapView/
  index.tsx
  useMapController.ts
  constants.ts
  types.ts
  styles.ts
  components/
    AreaBoundaryOverlay.tsx
    CustomMapMarkers.tsx
    DrawablePolyline.tsx
    LocationPermissionModal.tsx
    LocationSearchModal.tsx
    MapMarkers.tsx
    NearbyPOIsComponent.tsx
    SearchBar.tsx
    SearchedPlacesList.tsx
```

## Main Component Responsibilities

### `index.tsx`

`MapViewComponent` is the main screen. It composes the full map experience:

- Renders `Mapbox.MapView`.
- Renders `Mapbox.Camera`.
- Shows clustered static markers through `CustomMapMarkers`.
- Shows an external polygon boundary through `AreaBoundaryOverlay`.
- Shows current user marker and selected place markers through `MapMarkers`.
- Shows user-drawn polygons through `DrawablePolyline`.
- Displays search controls through `SearchBar` and `LocationSearchModal`.
- Displays location permission UI through `LocationPermissionModal`.
- Displays selected locations in `SearchedPlacesList`.
- Handles floating utility buttons for draw mode and viewport recentering.

### `useMapController.ts`

`useMapController` owns the feature state and map behavior:

- Map and camera refs.
- Search query and search result state.
- Selected/searched places state.
- Current user location and address.
- Location permission modal state.
- Draw mode state.
- Drawn polygon coordinate state.
- Camera viewport fitting.
- Forward geocoding.
- Reverse geocoding.
- Current GPS fetch with high-accuracy and fallback modes.
- Touch-to-map-coordinate conversion for freehand drawing.

Keeping this logic in a hook keeps `index.tsx` focused on UI composition.

## Feature Details

### 1. Current Location

On screen load, `useMapController` checks Android location permission:

```ts
PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
```

If permission already exists, the app fetches the current GPS location. If not, it opens the custom `LocationPermissionModal`.

When the user taps `Allow Access`, `requestLocationAccess` calls `fetchLocation`.

Location fetch behavior:

1. Requests Android fine location permission if needed.
2. Calls `Geolocation.requestAuthorization()` on iOS.
3. Tries high-accuracy GPS first:

```ts
{ enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
```

4. If high-accuracy lookup fails, falls back to lower accuracy:

```ts
{ enableHighAccuracy: false, timeout: 20000, maximumAge: 3600000 }
```

5. Sets the camera center to the current location with zoom `17`.
6. Reverse geocodes the coordinates into a readable address.

Current location is rendered by `MapMarkers` as a green point annotation.

### 2. Location Search

The search UI starts with `SearchBar`. Tapping it opens `LocationSearchModal`.

Search is debounced in `useMapController`:

```ts
const delayDebounceFn = setTimeout(() => executeSearch(searchQuery), 400);
```

Forward geocoding uses Mapbox:

```ts
geocodingClient.forwardGeocode({
  query: queryText,
  limit: 10,
  types: ['postcode', 'place', 'locality', 'region', 'address'],
})
```

Search supports:

- ZIP/postcode
- City/place
- Locality
- Region
- Address

When a search result is selected:

1. The selected feature center is saved as coordinates.
2. A short place name is extracted from the full place name.
3. For area-like places, boundary geometry is fetched from OpenStreetMap Nominatim.
4. The selected location is added to `searchedPlaces`.
5. Search results and query are cleared.

### 3. Boundary Overlay for Selected Places

When selected places include geometry, `MapMarkers` renders the boundary with:

- `Mapbox.ShapeSource`
- `Mapbox.FillLayer`
- `Mapbox.LineLayer`

The boundary style uses a light fill and dashed outline.

Boundary geometry comes from:

- Nominatim, when selecting a searchable area.
- Custom drawn polygons, when applying draw mode.

### 4. Static Clustered Markers

`CustomMapMarkers` renders predefined marker data from `standardLocationsArray` in `constants.ts`.

Each marker contains:

```ts
{
  id: string;
  latitude: number;
  longitude: number;
  price: string;
}
```

The component converts the array into a GeoJSON `FeatureCollection` and passes it to `Mapbox.ShapeSource` with clustering enabled:

```tsx
<Mapbox.ShapeSource
  id="clustered-source"
  shape={featureCollection}
  cluster={true}
  clusterRadius={50}
  clusterMaxZoomLevel={14}
>
```

Rendered layers:

- Cluster circle layer.
- Cluster count symbol layer.
- Single marker blue dot.
- Single marker shadow.
- Single marker price label.

Marker press handling:

- Cluster press logs the cluster count.
- Single marker press calls `onMarkerPress` with marker properties.

### 5. External Area Boundary

`AreaBoundaryOverlay` renders a predefined polygon from `EXTERNAL_AREA_DATA`.

The component:

1. Accepts an array of longitude/latitude coordinates.
2. Closes the polygon ring if the first and last coordinates differ.
3. Builds a GeoJSON polygon feature.
4. Renders fill and line layers.

In `index.tsx`, it is currently rendered with blue styling:

```tsx
<AreaBoundaryOverlay
  coordinates={EXTERNAL_AREA_DATA}
  fillColor="#133de6ff"
  strokeColor="#133de6b0"
/>
```

### 6. Freehand Area Drawing

Draw mode is controlled by `isDrawingArea`.

When draw mode is active:

- The search header is replaced by a draw header.
- A transparent touch overlay is enabled.
- PanResponder captures finger movement.
- Screen touch points are converted into map coordinates using:

```ts
mapRef.current.getCoordinateFromView([x, y])
```

To avoid excessive coordinate density, points closer than 18 screen pixels to the previous point are ignored.

When the finger is released:

- If at least 3 coordinates exist, the current drawn line is saved as a completed area group.
- The temporary coordinate list is cleared.
- The map viewport is refit.

`DrawablePolyline` displays both:

- The active in-progress drawing.
- Previously completed drawn area groups.
- White vertex handles for each drawn coordinate.

It renders the boundary from the editable coordinates and closes the first and
last points before rendering, so unfinished strokes still become complete
areas.
For dense drawings, vertex handles are spaced by path distance so small areas
do not get crowded and larger areas continue adding handles at a consistent
gap.

After a polygon is drawn, touching and dragging a white vertex handle updates
that coordinate. Touches that do not begin near a handle keep the existing
freehand drawing behavior.

### 7. Applying Drawn Areas

When the user taps `Apply` in draw mode:

1. Each drawn area group is converted into a `SearchedPlace`.
2. The center coordinate is calculated by averaging longitude and latitude values.
3. The polygon ring is closed.
4. The place is named `Custom Boundaries N`.
5. The new drawn area is appended to `searchedPlaces`.
6. Draw mode closes.

This makes drawn areas behave like selected locations in the bottom sheet and marker/boundary rendering.

### 8. Selected Locations Bottom Sheet

`SearchedPlacesList` is displayed at the bottom of the map when draw mode is inactive.

It supports:

- Empty state when no locations are selected.
- Horizontal list of selected locations.
- Remove selected location.
- Tap selected location to move camera to that place.
- Submit selected locations.

On submit, `index.tsx` currently formats selected locations and logs them:

```ts
const selectedAreaCoordinates = searchedPlaces.map(place => ({
  id: place.id,
  name: place.placeName,
  center: place.coordinates,
  area: collectGeometryCoordinates(place.geometry),
}));

console.log('Selected area latitude/longitude:', selectedAreaCoordinates);
```

Current submit output includes:

- `id`
- `name`
- `center`
- `area`

The `area` field is compressed using `AREA_COORDINATE_SKIP_FACTOR = 5`, which keeps every fifth boundary coordinate and always includes the final coordinate.

## Camera Behavior

The map camera is controlled through `cameraRef`.

Current location camera update:

```ts
cameraRef.current?.setCamera({
  centerCoordinate: coords,
  zoomLevel: 17,
  animationDuration: 1000,
});
```

Selected place tap camera update:

```ts
cameraRef.current?.setCamera({
  centerCoordinate: place.coordinates,
  zoomLevel: 5.3,
  animationDuration: 1000,
});
```

Viewport fitting is handled by `fitWorkspaceInViewport`.

It collects coordinates from:

- Selected place centers.
- Selected place geometry.
- Completed drawn areas.
- Current drawn area.

Then it calls:

```ts
cameraRef.current?.fitBounds(
  [maxLng, maxLat],
  [minLng, minLat],
  [60, 60, 60, 60],
  1200,
);
```

## Data Model

Primary coordinate type:

```ts
export type Coordinate = [number, number];
```

Important: Mapbox expects coordinates in `[longitude, latitude]` order.

Selected place shape:

```ts
export interface SearchedPlace {
  id: string;
  coordinates: [number, number];
  placeName: string;
  displayName: string;
  geometry?: GeoJSON.Geometry | any;
}
```

## Component Summary

### `SearchBar`

Compact top search control. It is read-only and opens `LocationSearchModal` when pressed.

### `LocationSearchModal`

Full-screen modal for typing a location query, showing Mapbox geocoding results, clearing input, and selecting a result.

### `LocationPermissionModal`

Full-screen permission prompt shown before current location can be fetched.

### `MapMarkers`

Renders:

- Current user location marker.
- Selected place markers.
- Selected place boundary fills and outlines.

### `CustomMapMarkers`

Renders clustered predefined markers using GeoJSON and Mapbox layers.

### `AreaBoundaryOverlay`

Renders a static polygon boundary from a coordinate array.

### `DrawablePolyline`

Renders in-progress and completed freehand drawn areas.

### `SearchedPlacesList`

Bottom sheet for selected locations and custom drawn areas.

### `NearbyPOIsComponent`

Contains logic for fetching nearby points of interest from Mapbox Searchbox category API. It is present in the component folder, but it is not currently mounted in `MapViewComponent`.

## Current Implementation Notes

- `handleMapPress` exists in `useMapController`, but `onPress` is commented out in `Mapbox.MapView`.
- `NearbyPOIsComponent` exists but is not currently rendered by the main screen.
- The submit action currently logs selected area data instead of sending it to an API.
- `onAddMorePress` is passed into `SearchedPlacesList`, but the main screen does not currently provide it.
- The iOS location usage string exists but is empty.
- `MAP_TOKEN` defaults to an empty string if missing, so geocoding/map rendering will fail silently or through SDK/API errors until the token is configured.

## Typical User Flow

1. User opens the `MapView` screen.
2. App asks for location permission if needed.
3. User allows access.
4. App centers the map on the user's current location and reverse geocodes the address.
5. User searches by city, ZIP/postcode, region, locality, or address.
6. User selects a result.
7. App adds the selected location to the map and bottom sheet.
8. If available, app renders that selected area's boundary.
9. User can draw custom boundaries with the draw tool.
10. User taps apply to add drawn boundaries as selected locations.
11. User taps submit to collect selected centers and area coordinates.

## Future Improvements

- Send submit payload to a backend instead of only logging it.
- Add a visible loading state while boundaries are being fetched from Nominatim.
- Add user-facing error states for Mapbox/Nominatim request failures.
- Add a real iOS location permission message.
- Enable or remove unused `handleMapPress` depending on desired behavior.
- Mount `NearbyPOIsComponent` if nearby category search is required in the product.
- Move sample `standardLocationsArray` data to API-backed data when real property listings are available.
- Avoid hardcoding Mapbox token fallback to an empty string; fail fast in development when `MAP_TOKEN` is missing.
