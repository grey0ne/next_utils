export type GeoPoint = [number, number];
export type PolygonData = Array<GeoPoint>;
export type PolylineData = Array<GeoPoint>;
export type Bounds = [[number, number], [number, number]]; 

export type MaskedMapProps = {
    polygons?: Array<PolygonData>;
    polylines?: Array<PolylineData>;
    bounds?: Bounds;
    height?: string; 
}

export interface AnimatedMaskedMapProps {
    polylines: Array<PolylineData>;
    animationSpeed?: number;
    height?: string; 
}
