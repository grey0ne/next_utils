import { GeoPoint, Bounds } from "./types";

function deg2rad(deg: number) {
    return deg * (Math.PI/180)
}

export function getDistanceInMeters(point1: GeoPoint, point2: GeoPoint) {
    var EarthRadius = 6371000; // meters
    var dLat = deg2rad(point2[0]-point1[0]);  // deg2rad below
    var dLon = deg2rad(point2[1]-point1[1]); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(point1[0])) * Math.cos(deg2rad(point2[0])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = EarthRadius * c; // Distance in m
    return d;
}
  

export function getDistance(point1: GeoPoint, point2: GeoPoint) {
    return Math.sqrt(Math.pow((point1[0] - point2[0]), 2) + Math.pow((point1[1] - point2[1]), 2));
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

