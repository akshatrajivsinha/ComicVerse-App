// constants.ts
import Config from 'react-native-config';
// @ts-ignore
import MapboxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import Mapbox from '@rnmapbox/maps';

export const MAP_TOKEN = Config.MAP_TOKEN ?? '';
export const DRAW_ACTION_GAP = 16;

Mapbox.setAccessToken(MAP_TOKEN);
export const geocodingClient = MapboxGeocoding({ accessToken: MAP_TOKEN });

export const standardLocationsArray = [
  {
    id: '1',
    latitude: 35.186104,
    longitude: -111.672827,
    price: '900K',
  },
  {
    id: '2',
    latitude: 35.189197,
    longitude: -111.656351,
    price: '500K',
  },
  {
    id: '3',
    latitude: 35.937389,
    longitude: -113.721664,
    price: '1000K',
  },
  {
    id: '4',
    latitude: 34.711053,
    longitude: -112.60734,
    price: '200K',
  },
  {
    id: '5',
    latitude: 35.937389,
    longitude: -113.621664,
    price: '700K',
  },
];

export const EXTERNAL_AREA_DATA: Coordinate[] = [
    [
        -118.66818,
        34.18493
    ],
    [
        -118.56479,
        34.13018
    ],
    [
        -118.5701,
        33.98873
    ],
    [
        -118.49441,
        34.05058
    ],
    [
        -118.44353,
        34.01657
    ],
    [
        -118.53752,
        33.96666
    ],
    [
        -118.49869,
        33.91598
    ],
    [
        -118.36842,
        33.92902
    ],
    [
        -118.37019,
        33.98164
    ],
    [
        -118.29169,
        33.95895
    ],
    [
        -118.301,
        33.75772
    ],
    [
        -118.3625,
        33.67349
    ],
    [
        -118.22526,
        33.69059
    ],
    [
        -118.22662,
        33.82951
    ],
    [
        -118.29913,
        33.7977
    ],
    [
        -118.2992,
        33.84633
    ],
    [
        -118.28209,
        33.9232
    ],
    [
        -118.23027,
        33.92898
    ],
    [
        -118.25639,
        33.98939
    ],
    [
        -118.1553,
        34.09863
    ],
    [
        -118.18392,
        34.14905
    ],
    [
        -118.34511,
        34.14266
    ],
    [
        -118.37017,
        34.19629
    ],
    [
        -118.26687,
        34.22185
    ],
    [
        -118.23855,
        34.28151
    ],
    [
        -118.50381,
        34.33731
    ],
    [
        -118.63348,
        34.26972
    ],
    [
        -118.66818,
        34.18493
    ]
]

export const getDistanceBetweenScreenPoints = (
  first: { x: number; y: number },
  second: { x: number; y: number },
) => {
  const dx = first.x - second.x;
  const dy = first.y - second.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export type Coordinate = [number, number];
