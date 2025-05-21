'use strict';

function py2_round(value: number) {
    return Math.floor(Math.abs(value) + 0.5) * (value >= 0 ? 1 : -1);
}

type PolylineCoords = Array<[number, number]>;

function encodePoint(current: number, previous: number, factor: number) {
    current = py2_round(current * factor);
    previous = py2_round(previous * factor);
    let coordinate = (current - previous) * 2;
    if (coordinate < 0) {
        coordinate = -coordinate - 1
    }
    let output = '';
    while (coordinate >= 0x20) {
        output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
        coordinate /= 32;
    }
    output += String.fromCharCode((coordinate | 0) + 63);
    return output;
}

const DEFAULT_PRECISION = 5;

export function decodePolyline(str: string, precision: number = DEFAULT_PRECISION): PolylineCoords {
    let index = 0, lat = 0, lng = 0;
    const coordinates: PolylineCoords = [];
    const factor = Math.pow(10, Number.isInteger(precision) ? precision : DEFAULT_PRECISION);

    while (index < str.length) {
        let byte = null;
        let shift = 1;
        let result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result += (byte & 0x1f) * shift;
            shift *= 32;
        } while (byte >= 0x20);

        let latitude_change = (result & 1) ? ((-result - 1) / 2) : (result / 2);

        shift = 1;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result += (byte & 0x1f) * shift;
            shift *= 32;
        } while (byte >= 0x20);

        let longitude_change = (result & 1) ? ((-result - 1) / 2) : (result / 2);

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};


export function encodePolyline(coordinates: PolylineCoords, precision: number): string {
    if (!coordinates.length) { return ''; }

    const factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);
    let output = encodePoint(coordinates[0][0], 0, factor) + encodePoint(coordinates[0][1], 0, factor);

    for (let i = 1; i < coordinates.length; i++) {
        const a = coordinates[i], b = coordinates[i - 1];
        output += encodePoint(a[0], b[0], factor);
        output += encodePoint(a[1], b[1], factor);
    }

    return output;
};