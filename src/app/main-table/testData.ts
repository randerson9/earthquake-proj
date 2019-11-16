// ================================================================================================
// ===  The sole purpose of this file is to provide test data for main-table.component.spec.ts  ===
// ===  It makes the file containing the unit tests less cluttered / easier to read             ===
// ================================================================================================

import { IEarthquake} from '../earthquake';

export const testQuake1 = {
  properties: {
    mag: 2.6,
    place: 'somewhere'
  },
  geometry: {
    coordinates: [33.0, 22.4]
  }
};

export const testQuake2 = {
  properties: {
    mag: 4.9,
    place: 'somewhere else'
  },
  geometry: {
    coordinates: [63.0, -82.4]
  }
};

export const testQuake3 = {
  properties: {
    mag: 0.5,
    place: 'a galaxy far, far away'
  },
  geometry: {
    coordinates: [33.0, 22.4]
  }
};

// ================================================================================================
// ===  Below, the three test quakes are logically equivalent to those seen above, except that  ===
// ===  they are now of type IEarthquake.                                                       ===
// ================================================================================================

export const TESTQUAKE1: IEarthquake = {
    magnitude: 2.6,
    latitude: 33.0,
    longitude: 22.4,
    area: 'somewhere'
};

export const TESTQUAKE2: IEarthquake = {
  magnitude: 4.9,
  latitude: 63.0,
  longitude: -82.4,
  area: 'somewhere else'
};

export const TESTQUAKE3: IEarthquake = {
  magnitude: 0.5,
  latitude: 33.0,
  longitude: 22.4,
  area: 'a galaxy far, far away'
};
