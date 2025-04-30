import MaskedMap from "./MaskedMap";
import { useEffect, useState } from "react";
import { AnimatedMaskedMapProps, PolygonData, Bounds, PolylineData, GeoPoint } from "./types";

const BOUND_SIZE = 0.005;
const DEFAULT_ANIMATION_SPEED = 1000;

const MAP_REVEAL_RADIUS = 0.0005;

function revealPolygonFromPoint(
    revealed: Map<string, number>, 
    polygons: PolygonData[],
    pointLat: number, pointLon: number
) {
    const lat = pointLat - pointLat % (MAP_REVEAL_RADIUS);
    const lon = pointLon - pointLon % (MAP_REVEAL_RADIUS);
    const revealedKey = [lat, lon].toString();
    if (revealed.has(revealedKey)) {
        return;
    }
    revealed.set(revealedKey, 1);
    polygons.push([
        [lat, lon],
        [lat + MAP_REVEAL_RADIUS, lon],
        [lat + MAP_REVEAL_RADIUS, lon + MAP_REVEAL_RADIUS],
        [lat, lon + MAP_REVEAL_RADIUS],
        [lat, lon],
    ])
}

function extendBounds (bounds: Bounds, latlng: GeoPoint) {
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

function revealPolygonsFromPoint(revealed: Map<string, number>, polygons: PolygonData[], point: [number, number]) {
    const lat = point[0];
    const lon = point[1];

    revealPolygonFromPoint(revealed, polygons, lat, lon);
    revealPolygonFromPoint(revealed, polygons, lat - MAP_REVEAL_RADIUS, lon);
    revealPolygonFromPoint(revealed, polygons, lat + MAP_REVEAL_RADIUS, lon);
    revealPolygonFromPoint(revealed, polygons, lat, lon + MAP_REVEAL_RADIUS);
    revealPolygonFromPoint(revealed, polygons, lat, lon - MAP_REVEAL_RADIUS);
}


export default function AnimatedMaskedMap({ animationSpeed, height, polylines }: AnimatedMaskedMapProps) {
    const [linesCounter, setLinesCounter] = useState(0);
    const [pointCounter, setPointCounter] = useState(0);
    const [maskPolygons, setMaskPolygons] = useState<Array<PolygonData>>([]);
    const [drawnPoints, setDrawnPoints] = useState<PolylineData[]>([[]]);
    const [revealedCells, setRevealedCells] = useState<Map<string, number>>(new Map<string, number>());
    if (!polylines || polylines.length === 0) {
        return null;
    }
    const firstPoint = polylines[0][0];
    const defaultBounds: Bounds = [
        [firstPoint[0] - BOUND_SIZE, firstPoint[1] - BOUND_SIZE],
        [firstPoint[0] + BOUND_SIZE, firstPoint[1] + BOUND_SIZE]
    ];
    const [bounds, setBounds] = useState<Bounds>(defaultBounds);

    useEffect(() => {
        const tm = setTimeout(() => {
            if (linesCounter >= polylines.length) {
                clearTimeout(tm);
                return;
            }
            if (pointCounter >= polylines[linesCounter].length) {
                setLinesCounter((prev) => prev + 1);
                setPointCounter(0);
                drawnPoints.push([]);
                return
            }
            const newPoint = polylines[linesCounter][pointCounter];
            const newPolygons = [...maskPolygons];
            const newDrawnPoints = [...drawnPoints];
            const newBounds = [...bounds] as Bounds;
            revealPolygonsFromPoint(revealedCells, newPolygons, newPoint);
            const lastPolyline = newDrawnPoints[newDrawnPoints.length - 1];
            newDrawnPoints[newDrawnPoints.length - 1] = [...lastPolyline, newPoint];
            setMaskPolygons(newPolygons);
            setRevealedCells(revealedCells);
            setDrawnPoints(newDrawnPoints)
            extendBounds(newBounds, newPoint);
            setBounds(newBounds);
            setPointCounter((prev) => prev + 1);
        }, animationSpeed || DEFAULT_ANIMATION_SPEED);

        return () => {
            clearTimeout(tm);
        }
    }, [maskPolygons, linesCounter, pointCounter, bounds, polylines, revealedCells, animationSpeed]);

    return (
        <MaskedMap
            bounds={bounds}
            polygons={maskPolygons}
            polylines={drawnPoints}
            height={height}
        />
    )
}