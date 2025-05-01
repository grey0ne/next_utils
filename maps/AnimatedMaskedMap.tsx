import MaskedMap from "./MaskedMap";
import { useEffect, useState } from "react";
import { AnimatedMaskedMapProps, PolygonData, Bounds, PolylineData } from "./types";
import { Box, Typography, Stack, Button } from "@mui/material";
import { getDistance, getDistanceInMeters, extendBounds } from "./helpers";

const BOUND_SIZE = 0.005;
const DEFAULT_ANIMATION_SPEED = 1000;

const MAP_REVEAL_RADIUS = 0.0005;

function revealPolygonFromPoint(
    revealed: Map<string, number>, 
    polygons: PolygonData[],
    point: [number, number],
    revealRadius: number
) {
    const lat = point[0] - point[0] % (revealRadius);
    const lon = point[1] - point[1] % (revealRadius);
    const revealedKey = [lat, lon].toString();
    if (revealed.has(revealedKey)) {
        return;
    }
    revealed.set(revealedKey, 1);
    polygons.push([
        [lat, lon],
        [lat + revealRadius, lon],
        [lat + revealRadius, lon + revealRadius],
        [lat, lon + revealRadius],
        [lat, lon],
    ])
}

const MAX_INTERMEDIATE_POINTS = 10;

function revealPolygonsFromPoint(
    revealed: Map<string, number>, polygons: PolygonData[],
    point: [number, number],
    revealRadius: number,
    prevPoint?: [number, number],
) {
    const pointsToReveal = [point];
    let totalDistance = 0;

    if (prevPoint) {
        let curPoint = point;
        let distance = getDistance(curPoint, prevPoint);
        totalDistance = getDistanceInMeters(curPoint, prevPoint);
        let vector = [
            (prevPoint[0] - curPoint[0]) / distance,
            (prevPoint[1] - curPoint[1]) / distance
        ];
        let counter = 0;
        while (distance > MAP_REVEAL_RADIUS && counter < MAX_INTERMEDIATE_POINTS) {
            curPoint = [
                curPoint[0] + (vector[0] * MAP_REVEAL_RADIUS),
                curPoint[1] + (vector[1] * MAP_REVEAL_RADIUS)
            ];
            pointsToReveal.push(curPoint);
            distance = getDistance(curPoint, prevPoint);
            counter++;
        }
    }

    for (const newPoint of pointsToReveal) {
        const lat = newPoint[0];
        const lon = newPoint[1];
        revealPolygonFromPoint(revealed, polygons, [lat, lon], revealRadius);
        revealPolygonFromPoint(revealed, polygons, [lat - revealRadius, lon], revealRadius);
        revealPolygonFromPoint(revealed, polygons, [lat + revealRadius, lon], revealRadius);
        revealPolygonFromPoint(revealed, polygons, [lat, lon + revealRadius], revealRadius);
        revealPolygonFromPoint(revealed, polygons, [lat, lon - revealRadius], revealRadius);
    }
    return totalDistance;
}

const ANIMATION_STEPS = 1;

export default function AnimatedMaskedMap({ animationSpeed, height, polylines }: AnimatedMaskedMapProps) {
    const [linesCounter, setLinesCounter] = useState(0);
    const [pointCounter, setPointCounter] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const [maskPolygons, setMaskPolygons] = useState<Array<PolygonData>>([]);
    const [drawnPoints, setDrawnPoints] = useState<PolylineData[]>([[]]);
    const [revealedCells, setRevealedCells] = useState<Map<string, number>>(new Map<string, number>());
    const [animationSteps, setAnimationSteps] = useState(ANIMATION_STEPS);
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
            let stepDistance = 0;
            let newPolygons: PolygonData[] = [...maskPolygons];
            let newBounds: Bounds = [...bounds] as Bounds;
            let newDrawnPoints: PolylineData[] = [...drawnPoints];
            let newPointCounter = pointCounter;
            let newLinesCounter = linesCounter;
            for (let i = 0; i < animationSteps; i++) {
                if (newLinesCounter >= polylines.length) {
                    clearTimeout(tm);
                    continue;
                }
                if (newPointCounter >= polylines[newLinesCounter].length) {
                    newLinesCounter++;
                    newPointCounter = 0;
                    newDrawnPoints.push([]);
                    continue;
                }
                const newPoint = polylines[newLinesCounter][newPointCounter];
                const prevPoint = polylines[newLinesCounter][newPointCounter - 1];
                stepDistance += revealPolygonsFromPoint(revealedCells, newPolygons, newPoint, MAP_REVEAL_RADIUS, prevPoint);
                const lastPolyline = newDrawnPoints[newDrawnPoints.length - 1];
                newDrawnPoints[newDrawnPoints.length - 1] = [...lastPolyline, newPoint];
                extendBounds(newBounds, newPoint);
                newPointCounter++;
            }
            setBounds(newBounds);
            setMaskPolygons(newPolygons);
            setDrawnPoints(newDrawnPoints);
            setTotalDistance((prev) => prev + stepDistance);
            setRevealedCells(revealedCells);
            setPointCounter(newPointCounter);
            setLinesCounter(newLinesCounter);
        }, animationSpeed || DEFAULT_ANIMATION_SPEED);

        return () => {
            clearTimeout(tm);
        }
    }, [maskPolygons, linesCounter, pointCounter, bounds, polylines, revealedCells, animationSpeed, animationSteps]);

    return (
        <Box>
            <MaskedMap
                bounds={bounds}
                polygons={maskPolygons}
                polylines={drawnPoints}
                height={height}
            />
            <Stack spacing={1} direction="row" mt={1}>
                <Typography variant="h6" p={1}>
                    {`Distance: ${(totalDistance / 1000).toFixed(2)} km`}
                </Typography>
                <Button variant="contained" onClick={() => { setAnimationSteps((prev) => prev + 1); }}>
                    +
                </Button> 
                <Typography variant="h6" p={1}>
                    {`Animation speed: ${animationSteps}`}
                </Typography>
                <Button variant="contained" onClick={() => { setAnimationSteps((prev) => prev - 1); }}>
                    -
                </Button> 
            </Stack>
        </Box>
    )
}