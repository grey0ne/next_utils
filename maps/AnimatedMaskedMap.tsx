import MaskedMap from "./MaskedMap";
import { useEffect, useState } from "react";
import { AnimatedMaskedMapProps, PolygonData, Bounds, RouteData } from "./types";
import { Box, Typography, Stack, Button } from "@mui/material";
import { getDistance, getDistanceInMeters, extendBounds, calculateSquareArea } from "./helpers";
import SpeedIcon from '@mui/icons-material/Speed';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTranslations } from "next-intl";

const BOUND_SIZE = 0.005;
const DEFAULT_ANIMATION_SPEED = 50;

const MAP_REVEAL_RADIUS = 0.0005;
const DEFAULT_ANIMATION_STEPS = 1;

const MAX_INTERMEDIATE_POINTS = 40;
const MAX_DRAWN_ROUTES = 10;

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


function copyEmptyRouteData(route: RouteData): RouteData {
    const result = { ...route };
    result.polyline = [];
    return result;
}

type AnimationControlProps = {
    animationSteps: number;
    setAnimationSteps: (steps: number) => void;
    paused: boolean;
    setPaused: (paused: boolean) => void;
    animationFinished: boolean;
    resetAnimation: () => void;
}

function AnimationControl({ animationSteps, setAnimationSteps, animationFinished, paused, setPaused, resetAnimation }: AnimationControlProps) {
    const t = useTranslations('AnimatedMaskedMap');
    const stepControl = animationFinished ? (
        <Button variant="contained" onClick={() => { resetAnimation(); }}>
            {t('reset')}
        </Button> 
    ) : (
        <>
            <Stack direction="row" spacing={1} alignItems={"start"}>
                <Button variant="contained" disabled={animationSteps <= 1} onClick={() => { setAnimationSteps(animationSteps - 1); }}>
                    <RemoveIcon />
                </Button> 
                <Stack direction="row" spacing={1} alignItems={"anchor-center"}>
                    <SpeedIcon/>
                    <Typography variant="h5">
                        {animationSteps}
                    </Typography>
                </Stack>
                <Button variant="contained" onClick={() => { setAnimationSteps(animationSteps + 1); }}>
                    <AddIcon />
                </Button> 
            </Stack>
            <Button variant="contained" onClick={() => { setPaused(!paused); }}>
                { paused ? <PlayArrowIcon /> : <PauseIcon /> }
            </Button> 
        </>
    )

    return (
        <Stack spacing={1} direction="row" p={1} alignItems={"start"} position={'absolute'} bottom={0} right={0} zIndex={1000}>
            { stepControl }
        </Stack>
    )
}

export default function AnimatedMaskedMap({ animationSpeed, height, routes, revealRadius, routeTypeOptions }: AnimatedMaskedMapProps) {
    const [linesCounter, setLinesCounter] = useState(0);
    const [pointCounter, setPointCounter] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const [distanceByType, setDistanceByType] = useState<{[key: string]: number}>({});
    const [maskPolygons, setMaskPolygons] = useState<Array<PolygonData>>([]);
    const [revealedCells, setRevealedCells] = useState<Map<string, number>>(new Map<string, number>());
    const [animationSteps, setAnimationSteps] = useState(DEFAULT_ANIMATION_STEPS);
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
    const [drawnRoutes, setDrawnRoutes] = useState<RouteData[]>([copyEmptyRouteData(firstRoute)]);

    const resetAnimation = () => {
        setLinesCounter(0);
        setPointCounter(0);
        setTotalDistance(0);
        setDistanceByType({});
        setMaskPolygons([]);
        setRevealedCells(new Map<string, number>());
        setDrawnRoutes([copyEmptyRouteData(firstRoute)]);
    }
    const actualRevealRadius = revealRadius || MAP_REVEAL_RADIUS;

    const t = useTranslations('AnimatedMaskedMap');

    useEffect(() => {
        const tm = setTimeout(() => {
            if (paused) {
                return;
            }
            if (linesCounter >= routes.length) {
                return
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
                    break;
                }
                if (newPointCounter >= currentRoute.polyline.length) {
                    newLinesCounter++;
                    currentRoute = routes[newLinesCounter];
                    newPointCounter = 0;
                    if (currentRoute) {
                        newDrawnRoutes.push(copyEmptyRouteData(currentRoute));
                    }
                    continue;
                }
                const newPoint = currentRoute.polyline[newPointCounter];
                const prevPoint = currentRoute.polyline[newPointCounter - 1];
                const intervalDistance = revealPolygonsFromPoint(revealedCells, newPolygons, newPoint, actualRevealRadius, prevPoint);
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

    let revealedSquareArea = 0;
    if (maskPolygons.length > 0) {
        const firstPoint = maskPolygons[0][0];
        revealedSquareArea = calculateSquareArea(
            [firstPoint[0], firstPoint[1]],
            [firstPoint[0] - actualRevealRadius, firstPoint[1] - actualRevealRadius],

        )
    }
    const animationFinished = linesCounter >= routes.length;
    return (
        <Box>
            <MaskedMap
                bounds={bounds}
                polygons={maskPolygons}
                routes={drawnRoutes}
                height={height}
            />
            <Box pl={1} position={'absolute'} top={0} left={0} zIndex={1000}>
                {Object.entries(distanceByType).map(([key, value]) => (
                    <Typography key={key} variant="h6">
                        {`${routeTypeOptions?.[key].label || key}: ${(value / 1000).toFixed(2)} ${t('km')}`}
                    </Typography>
                ))}
                <Typography variant="h6">
                    {t('distance_total', {distance: (totalDistance / 1000).toFixed(2)})}
                </Typography>
                <Typography variant="h6">
                    {t('area_total', {area: (revealedSquareArea * maskPolygons.length / 1000000).toFixed(2)})}
                </Typography>
            </Box>
            <AnimationControl 
                animationSteps={animationSteps}
                setAnimationSteps={setAnimationSteps}
                paused={paused}
                setPaused={setPaused}
                animationFinished={animationFinished}
                resetAnimation={resetAnimation}
            />
        </Box>
    )
}