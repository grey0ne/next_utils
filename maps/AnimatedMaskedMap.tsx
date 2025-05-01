import MaskedMap from "./MaskedMap";
import { useEffect, useState } from "react";
import { AnimatedMaskedMapProps, PolygonData, Bounds, PolylineData, RouteData } from "./types";
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

const MAX_INTERMEDIATE_POINTS = 40;

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

function copyRouteData(route: RouteData): RouteData {
    const result = { ...route };
    result.polyline = [];
    return result;
}

export default function AnimatedMaskedMap({ animationSpeed, height, routes }: AnimatedMaskedMapProps) {
    const [linesCounter, setLinesCounter] = useState(0);
    const [pointCounter, setPointCounter] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const [distanceByType, setDistanceByType] = useState<{[key: string]: number}>({});
    const [maskPolygons, setMaskPolygons] = useState<Array<PolygonData>>([]);
    const [revealedCells, setRevealedCells] = useState<Map<string, number>>(new Map<string, number>());
    const [animationSteps, setAnimationSteps] = useState(ANIMATION_STEPS);
    const [paused, setPaused] = useState(false);
    if (!routes || routes.length === 0) {
        return null;
    }
    const firstRoute = routes[0];
    const firstPoint = firstRoute.polyline[0];
    const defaultBounds: Bounds = [
        [firstPoint[0] - BOUND_SIZE, firstPoint[1] - BOUND_SIZE],
        [firstPoint[0] + BOUND_SIZE, firstPoint[1] + BOUND_SIZE]
    ];
    const [bounds, setBounds] = useState<Bounds>(defaultBounds);
    const [drawnRoutes, setDrawnRoutes] = useState<RouteData[]>([copyRouteData(firstRoute)]);

    useEffect(() => {
        const tm = setTimeout(() => {
            if (paused) {
                return;
            }
            let stepDistance = 0;
            let newPolygons: PolygonData[] = [...maskPolygons];
            let newBounds: Bounds = [...bounds] as Bounds;
            let newDrawnRoutes: RouteData[] = [...drawnRoutes];
            let newPointCounter = pointCounter;
            let newLinesCounter = linesCounter;
            let currentRoute = routes[newLinesCounter];
            let newDistanceByType = {...distanceByType};
            for (let i = 0; i < animationSteps; i++) {
                if (newLinesCounter >= routes.length) {
                    clearTimeout(tm);
                    continue;
                }
                if (newPointCounter >= currentRoute.polyline.length) {
                    newLinesCounter++;
                    currentRoute = routes[newLinesCounter];
                    newPointCounter = 0;
                    if (currentRoute) {
                        newDrawnRoutes.push(copyRouteData(currentRoute));
                    }
                    continue;
                }
                const newPoint = currentRoute.polyline[newPointCounter];
                const prevPoint = currentRoute.polyline[newPointCounter - 1];
                const intervalDistance = revealPolygonsFromPoint(revealedCells, newPolygons, newPoint, MAP_REVEAL_RADIUS, prevPoint);
                stepDistance += intervalDistance;
                newDistanceByType[currentRoute.routeType] = (newDistanceByType[currentRoute.routeType] || 0) + intervalDistance;
                const lastRoute = newDrawnRoutes[newDrawnRoutes.length - 1];
                lastRoute.polyline = [...lastRoute.polyline, newPoint]; // This trickery is needed to mutate the array pointer

                extendBounds(newBounds, newPoint);
                newPointCounter++;
            }
            setBounds(newBounds);
            setMaskPolygons(newPolygons);
            setDrawnRoutes(newDrawnRoutes);
            setTotalDistance((prev) => prev + stepDistance);
            setDistanceByType(newDistanceByType);
            setRevealedCells(revealedCells);
            setPointCounter(newPointCounter);
            setLinesCounter(newLinesCounter);
        }, animationSpeed || DEFAULT_ANIMATION_SPEED);

        return () => {
            clearTimeout(tm);
        }
    }, [
        maskPolygons, linesCounter, pointCounter, bounds, routes,
        revealedCells, animationSpeed, animationSteps, paused, distanceByType, drawnRoutes
    ]);

    return (
        <Box>
            <MaskedMap
                bounds={bounds}
                polygons={maskPolygons}
                routes={drawnRoutes}
                height={height}
            />
            <Stack spacing={1} direction="row" mt={1} alignItems={"start"}>
                <Typography variant="h6" p={1}>
                    {`Distance: ${(totalDistance / 1000).toFixed(2)} km`}
                </Typography>
                <Box>
                    {Object.entries(distanceByType).map(([key, value]) => (
                        <Typography key={key} variant="h6" p={1}>
                            {`${key}: ${(value / 1000).toFixed(2)} km`}
                        </Typography>
                    ))}
                </Box>
                { animationSteps > 1 && (
                <Button variant="contained" onClick={() => { setAnimationSteps((prev) => prev - 1); }}>
                    -
                </Button> 
                )}
                <Typography variant="h6" p={1}>
                    {`Animation speed: ${animationSteps}`}
                </Typography>
                <Button variant="contained" onClick={() => { setAnimationSteps((prev) => prev + 1); }}>
                    +
                </Button> 
                <Button variant="contained" onClick={() => { setPaused(!paused); }}>
                    { paused ? 'Resume' : 'Pause' }
                </Button> 
            </Stack>
        </Box>
    )
}