export interface GeoFeatureCollection {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface Properties {
  NAME: string;
  ISO_A2: string;
}

export interface Geometry {
  type: string;
  coordinates: any[][][];
}

export default GeoFeatureCollection;
