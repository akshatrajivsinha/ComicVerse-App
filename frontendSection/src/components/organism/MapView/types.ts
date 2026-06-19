export type Coordinate = [number, number];

export interface AreaBoundaryOverlayProps {
  coordinates: Coordinate[];
  visible?: boolean;
  fillColor?: string;
  strokeColor?: string;
}

export interface SearchedPlace {
  id: string;
  coordinates: [number, number];
  placeName: string;
  displayName: string;
  geometry?: GeoJSON.Geometry | any;
}

export interface DrawablePolylineProps {
  coordinates: Coordinate[];
  sourceId?: string;
  lineLayerId?: string;
  fillLayerId?: string;
  vertexLayerId?: string;
  lineColor?: string;
  lineWidth?: number;
  fillColor?: string;
  fillOpacity?: number;
  showVertexHandles?: boolean;
  visibleVertexIndexes?: number[];
  isDrawingActive?: boolean;
}

export interface LocationPermissionModalProps {
  visible: boolean;
  isLoading?: boolean;
  onAllowAccess: () => void;
}

export interface LocationSearchModalProps {
  visible: boolean;
  searchQuery: string;
  searchResults: any[];
  isSearching?: boolean;
  setSearchQuery: (query: string) => void;
  onClose: () => void;
  onSelectLocation: (feature: any) => void | Promise<void>;
  onSearchSubmit: () => void;
}

export interface MapMarkersProps {
  places: SearchedPlace[];
  userLocation: [number, number] | null;
  currentAddress: string;
}

export interface MarkerType {
  id: string;
  coordinates: [number, number];
  title: string;
}

export interface NearbyPOIsComponentProps {
  mapToken: string;
  userLocation: [number, number] | null;
  cameraRef: React.RefObject<any>;
  routeActive: boolean;
  hasActiveCard: boolean;
  dynamicStyles: any;
  onPOIsUpdated: (pois: MarkerType[]) => void;
  registerClearRef?: (clearFn: () => void) => void;
  isVisible: boolean;
  onClose: () => void;
}

export interface SearchBarProps {
  searchQuery: string;
  onPress?: () => void;
}

export interface SearchedPlacesListProps {
  places: SearchedPlace[];
  onRemovePlace: (id: string) => void;
  onSelectPlace: (place: SearchedPlace) => void;
  onAddMorePress?: () => void;
  onSubmitPress?: () => void;
  onHeightChange?: (height: number) => void;
}

export interface MarkerLocation {
  id: string | number;
  latitude: number;
  longitude: number;
  price?: string;
}
export interface CustomMapMarkersProps {
  locations: MarkerLocation[];
  onMarkerPress?: (location: any) => void;
}