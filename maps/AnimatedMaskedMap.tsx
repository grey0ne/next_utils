import MaskedMap from "./MaskedMap";
import { useEffect, useState } from "react";
import { AnimatedMaskedMapProps, PolygonData, Bounds, RouteData } from "./types";
import { Box, Typography, Stack, Button } from "@mui/material";
import { getDistance, getDistanceInMeters, extendBounds, calculateSquareArea, getBounds } from "./helpers";
import { 
    Speed as SpeedIcon, Pause as PauseIcon,
    PlayArrow, Remove as RemoveIcon, Add as AddIcon
} from '@mui/icons-material';
import { useTranslations, useLocale } from "next-intl";
import { latLngToCell, cellToBoundary, gridDisk, cellArea, UNITS } from "h3-js";

const BOUND_SIZE = 0.005;
const MAX_BOUND_SIZE = 20000; // meters
const DEFAULT_ANIMATION_SPEED = 50;

const MAP_REVEAL_RADIUS = 0.0005;
const DEFAULT_ANIMATION_STEPS = 1;

const MAX_INTERMEDIATE_POINTS = 40;
const MAX_DRAWN_ROUTES = 10;

const DEFAULT_H3_SCALE = 11;

function revealPolygonFromPoint(
    revealed: Map<string, number>, 
    polygons: PolygonData[],
    point: [number, number],
) {
    const centerCell = latLngToCell(point[0], point[1], DEFAULT_H3_SCALE);
    const revealedCells = gridDisk(centerCell, 1);
    let revealedArea = 0;
    for (const cell of revealedCells) {
        if (revealed.has(cell)) {
            //TODO increase counter and build heatmap
            continue;
        }
        revealedArea += cellArea(cell, UNITS.km2);
        revealed.set(cell, 1);
        polygons.push(cellToBoundary(cell));
    }
    return revealedArea;
}


function revealPolygonsFromPoint(
    revealed: Map<string, number>, polygons: PolygonData[],
    point: [number, number],
    revealRadius: number,
    prevPoint?: [number, number],
) {
    const pointsToReveal = [point];
    let totalDistance = 0;
    let revealedArea = 0;

    if (prevPoint) {
        let curPoint = point;
        let distance = getDistance(curPoint, prevPoint);
        totalDistance = getDistanceInMeters(curPoint, prevPoint);
        let vector = [
            (prevPoint[0] - curPoint[0]) / distance,
            (prevPoint[1] - curPoint[1]) / distance
        ];
        let counter = 0;
        while (distance > revealRadius && counter < MAX_INTERMEDIATE_POINTS) {
            curPoint = [
                curPoint[0] + (vector[0] * revealRadius),
                curPoint[1] + (vector[1] * revealRadius)
            ];
            pointsToReveal.push(curPoint);
            distance = getDistance(curPoint, prevPoint);
            counter++;
        }
    }

    for (const newPoint of pointsToReveal) {
        const lat = newPoint[0];
        const lon = newPoint[1];
        revealedArea += revealPolygonFromPoint(revealed, polygons, [lat, lon]);
    }
    return { totalDistance, revealedArea };
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
                { paused ? <PlayArrow /> : <PauseIcon /> }
            </Button> 
        </>
    )

    return (
        <Stack spacing={1} direction="row" p={1} alignItems={"start"} position={'absolute'} bottom={0} right={0} zIndex={1000}>
            { stepControl }
        </Stack>
    )
}

function animationIteration(
    animationSteps: number, routes: RouteData[],
    pointCounter: number, linesCounter: number,
    distanceByType: {[key: string]: number},
    revealedArea: number,
    maskPolygons: PolygonData[],
    bounds: Bounds,
    drawnRoutes: RouteData[],
    revealedCells: Map<string, number>,
    revealRadius: number,
    maxDrawnRoutes: number,
    loadRoutes?: (() => void),
) {
    let stepDistance = 0;
    let newPointCounter = pointCounter;
    let newLinesCounter = linesCounter;
    let newRevealedArea = revealedArea;
    let newDrawnRoutes: RouteData[] = [...drawnRoutes];
    let newBounds: Bounds = [...bounds] as Bounds;
    let newPolygons: PolygonData[] = [...maskPolygons];
    const newDistanceByType = {...distanceByType};
    let currentRoute = routes[newLinesCounter];
    for (let i = 0; i < animationSteps; i++) {
        if (newLinesCounter >= routes.length) {
            break;
        }
        if (newPointCounter >= currentRoute.polyline.length) {
            newLinesCounter++;
            currentRoute = routes[newLinesCounter];
            newPointCounter = 0;
            if (currentRoute) {
                if (newDrawnRoutes.length >= ( maxDrawnRoutes )) {
                    newDrawnRoutes.shift();
                }
                newDrawnRoutes.push(copyEmptyRouteData(currentRoute));
                for (let i = 0; i < newDrawnRoutes.length; i++) {
                    newDrawnRoutes[i].opacity = (i / newDrawnRoutes.length + 0.01);
                }
            }
            if ( loadRoutes && newLinesCounter == routes.length - 2) {
                console.log('Loading more routes. Total routes:', routes.length);
                loadRoutes();
            }
            continue;
        }
        const newPoint = currentRoute.polyline[newPointCounter];
        const prevPoint = currentRoute.polyline[newPointCounter - 1];
        const { totalDistance: intervalDistance, revealedArea: additionalArea } = revealPolygonsFromPoint(revealedCells, newPolygons, newPoint, revealRadius, prevPoint);
        newRevealedArea += additionalArea;
        stepDistance += intervalDistance;
        newDistanceByType[currentRoute.routeType] = (newDistanceByType[currentRoute.routeType] || 0) + intervalDistance;
        const lastRoute = newDrawnRoutes[newDrawnRoutes.length - 1];
        lastRoute.polyline = [...lastRoute.polyline, newPoint]; // This trickery is needed to mutate the array pointer
        
        if (getDistanceInMeters(newPoint, newBounds[0]) > MAX_BOUND_SIZE) {
            newBounds = getBounds(newPoint, BOUND_SIZE);
        } else {
            extendBounds(newBounds, newPoint);
        }
        newPointCounter++;
    }
    return {
        newPointCounter, newLinesCounter, newBounds, newDrawnRoutes, newPolygons,
        newDistanceByType, newRevealedArea, stepDistance
    };
}

type DistanceCounterProps = {
    distanceByType: {[key: string]: number};
    totalDistance: number;
    revealedArea: number;
    routeTypeOptions?: {[ key: string ]: { label: string }};
}

function DistanceCounter({ distanceByType, totalDistance, routeTypeOptions, revealedArea }: DistanceCounterProps) {
    const t = useTranslations('AnimatedMaskedMap');
    return (
        <Box p={1} position={'absolute'} top={0} left={0} zIndex={1000}>
            {Object.entries(distanceByType).map(([key, value]) => (
                <Typography key={key} variant="h6">
                    {`${routeTypeOptions?.[key].label || key}: ${(value / 1000).toFixed(2)} ${t('km')}`}
                </Typography>
            ))}
            <Typography variant="h6">
                {t('distance_total', {distance: (totalDistance / 1000).toFixed(2)})}
            </Typography>
            <Typography variant="h6">
                {t('area_total', {area: (revealedArea).toFixed(2)})}
            </Typography>
        </Box>
    )
}

function RouteInfo({ route }: { route?: RouteData }) {
    if (!route) {
        return null;
    }
    const locale = useLocale();
    const formattedDate = new Date(route.routeDate || '').toLocaleString(
        locale, { year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit", hourCycle: "h23"}
    ) 
    return (
        <Box p={1} position={'absolute'} top={0} right={0} zIndex={1000} textAlign="right">
            <Typography variant="body2">
                { route.title || '' }
            </Typography>
            <Typography variant="body2">
                { formattedDate }
            </Typography>
        </Box>
    )
}

export default function AnimatedMaskedMap(props: AnimatedMaskedMapProps) {
    const { animationSpeed, routes, revealRadius, height, routeTypeOptions, maxDrawnRoutes, loadRoutes } = props;
    const showInterface = props.showInterface !== undefined ? props.showInterface : true;
    const cycleAnimation = props.cycleAnimation !== undefined ? props.cycleAnimation : false;
    const [linesCounter, setLinesCounter] = useState(0);
    const [pointCounter, setPointCounter] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const [revealedArea, setRevealedArea] = useState(0);
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
    const defaultBounds: Bounds = getBounds(firstPoint, BOUND_SIZE);
    const [bounds, setBounds] = useState<Bounds>(defaultBounds);
    const [drawnRoutes, setDrawnRoutes] = useState<RouteData[]>([copyEmptyRouteData(firstRoute)]);

    const resetAnimation = () => {
        setLinesCounter(0);
        setRevealedArea(0);
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
                if (cycleAnimation) {
                    resetAnimation();
                }
                return
            }
            const { 
                newPointCounter, newLinesCounter, newBounds, newDrawnRoutes,
                newPolygons, newDistanceByType, stepDistance, newRevealedArea
            } = animationIteration(
                animationSteps, routes, pointCounter, linesCounter,
                distanceByType, revealedArea, maskPolygons, bounds, drawnRoutes, revealedCells,
                actualRevealRadius, maxDrawnRoutes || MAX_DRAWN_ROUTES, loadRoutes
            )
            
            setBounds(newBounds);
            setMaskPolygons(newPolygons);
            setDrawnRoutes(newDrawnRoutes);
            setTotalDistance((prev) => prev + stepDistance);
            setDistanceByType(newDistanceByType);
            setRevealedCells(revealedCells);
            setPointCounter(newPointCounter);
            setLinesCounter(newLinesCounter);
            setRevealedArea(newRevealedArea);
        }, animationSpeed || DEFAULT_ANIMATION_SPEED);

        return () => {
            clearTimeout(tm);
        }
    }, [
        maskPolygons, linesCounter, pointCounter, bounds, routes,
        revealedCells, animationSpeed, animationSteps, paused, distanceByType, drawnRoutes
    ]);


    const animationFinished = linesCounter >= routes.length;
    const currentRoute = routes[linesCounter];
    return (
        <>
            <MaskedMap
                bounds={bounds}
                polygons={maskPolygons}
                routes={drawnRoutes}
                height={height}
            />
            { showInterface && (
                <>
                    <DistanceCounter
                        totalDistance={totalDistance}
                        distanceByType={distanceByType}
                        revealedArea={revealedArea}
                        routeTypeOptions={routeTypeOptions}
                    />
                    <AnimationControl 
                        animationSteps={animationSteps}
                        setAnimationSteps={setAnimationSteps}
                        paused={paused}
                        setPaused={setPaused}
                        animationFinished={animationFinished}
                        resetAnimation={resetAnimation}
                    />
                    <RouteInfo route={currentRoute} />
                </>
            )}
        </>
    )
}