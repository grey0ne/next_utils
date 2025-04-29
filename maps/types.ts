export type GeoPoint = [number, number];
export type PolygonData = Array<GeoPoint>;
export type Bounds = [[number, number], [number, number]]; 

export type MaskedMapComponentProps = {
    polygons: Array<PolygonData>;
    animationSpeed?: number;
}

