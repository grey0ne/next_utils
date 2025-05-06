export type GeoPoint = [number, number];
export type PolygonData = Array<GeoPoint>;
export type PolylineData = Array<GeoPoint>;
export type Bounds = [[number, number], [number, number]]; 

export type MaskedMapProps = {
    polygons?: Array<PolygonData>;
    routes?: Array<RouteData>;
    bounds?: Bounds;
    height?: string; 
}

export type RouteData = {
    id: string | number;
    polyline: PolygonData;
    routeType: string;
    title?: string;
    routeDate?: string;
    color?: string;
    opacity?: number;
}

export interface AnimatedMaskedMapProps {
    routes: Array<RouteData>;
    animationSpeed?: number;
    revealRadius?: number;
    height?: string; 
    routeTypeOptions?: {[ key: string ]: RouteTypeOptions };
    maxDrawnRoutes?: number;
    showInterface?: boolean;
    cycleAnimation?: boolean;
    loadRoutes?: () => void;
}

export interface RouteTypeOptions {
    label: string;
}