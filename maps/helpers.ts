import { GeoPoint, Bounds } from "./types";

function deg2rad(deg: number) {
    return deg * (Math.PI/180)
}

const EARTH_RADIUS = 6378137; // meters

export function getDistanceInMeters(point1: GeoPoint, point2: GeoPoint) {
    const dLat = deg2rad(point2[0]-point1[0]);
    const dLon = deg2rad(point2[1]-point1[1]); 
    const a = (
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(point1[0])) * Math.cos(deg2rad(point2[0])) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = EARTH_RADIUS * c; // Distance in m
    return distance;
}
  

export function getDistance(point1: GeoPoint, point2: GeoPoint) {
    return Math.sqrt(Math.pow((point1[0] - point2[0]), 2) + Math.pow((point1[1] - point2[1]), 2));
}

export function getBounds(center: GeoPoint, size: number): Bounds {
    return [
        [center[0] - size, center[1] - size],
        [center[0] + size, center[1] + size]
    ];
}

export function extendBounds (bounds: Bounds, latlng: GeoPoint) {
    if (latlng[0] < bounds[0][0]) {
        bounds[0][0] = latlng[0];
    }
    if (latlng[0] > bounds[1][0]) {
        bounds[1][0] = latlng[0];
    }
    if (latlng[1] < bounds[0][1]) {
        bounds[0][1] = latlng[1];
    }
    if (latlng[1] > bounds[1][1]) {
        bounds[1][1] = latlng[1];
    }
}

export function calculateSquareArea(corner1: GeoPoint, corner2: GeoPoint) {
    const verticalSize = getDistanceInMeters(corner1, [corner1[0], corner2[1]]);
    const horizontalSize = getDistanceInMeters(corner1, [corner2[0], corner1[1]]);
    return verticalSize * horizontalSize;
}

