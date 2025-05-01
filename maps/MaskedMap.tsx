'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Polygon, Polyline, LayerGroup } from 'react-leaflet';
import { Box } from '@mui/material';
import { PolygonData, Bounds, MaskedMapProps, RouteData } from './types';
import 'leaflet/dist/leaflet.css';

const DEFAULT_MASK_OPTIONS = {
    color: "#3388FF",
    weight: 0,
    fillColor: "#888888",
    fillOpacity: 0.95,
}

const DEFAULT_POLYLINE_OPTIONS = {
    color: 'red',
    weight: 1,
    opacity: 0.9,
}

const DEFAULT_MASK_POLYGON: PolygonData = [
    [-360, -90],
    [-360, 90],
    [360, 90],
    [360, -90],
];


function MaskLayer({ polygons }: { polygons?: Array<PolygonData> } ) {
    if (!polygons || polygons.length === 0) {
        return null;
    }
    const maskPolygons = [DEFAULT_MASK_POLYGON, ...polygons]
    return (
        <LayerGroup>
            <Polygon
                positions={maskPolygons}
                pathOptions={DEFAULT_MASK_OPTIONS}
            />
        </LayerGroup>
    )
}


function RouteLayer({ routes }: { routes?: RouteData[]} ) {
    if (!routes || routes.length === 0) {
        return null;
    }
    const elems = routes.map((route) => {
        if (route.polyline.length === 0) {
            return null;
        }
        const options = {...DEFAULT_POLYLINE_OPTIONS, color: route.color || DEFAULT_POLYLINE_OPTIONS.color};
        return (
            <Polyline
                key={route.id}
                positions={route.polyline}
                pathOptions={options}
            />
        )
    })
    return (
        <LayerGroup>
            {elems}
        </LayerGroup>
    )
}


function BoundsUpdater({ bounds }: { bounds?: Bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds);
        }
    }, [bounds, map]);
    return null;
}


export default function MaskedMap({ polygons, bounds, height, routes }: MaskedMapProps) {
    return (
        <Box sx={{ height: height || '400px', width: '100%', position: 'relative' }}>
            <MapContainer
                id="map"
                style={{ height: '100%', width: '100%' }}
                attributionControl = {false}
                scrollWheelZoom = {false}
                zoomControl = {false}
                zoomAnimation = {false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MaskLayer polygons={ polygons } />
                <RouteLayer routes={ routes } />
                <BoundsUpdater bounds={ bounds } />
            </MapContainer>
        </Box>
    );
} 