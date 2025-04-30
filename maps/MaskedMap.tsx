'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Polygon, Polyline, LayerGroup } from 'react-leaflet';
import { Box } from '@mui/material';
import { GeoPoint, PolygonData, Bounds, MaskedMapProps, PolylineData } from './types';
import 'leaflet/dist/leaflet.css';

const DEFAULT_MASK_OPTIONS = {
    color: "#3388FF",
    weight: 0,
    fillColor: "#888888",
    fillOpacity: 0.95,
}

const DEFAULT_POLYLINE_OPTIONS = {
    color: 'red',
    weight: 2,
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


function RouteLayer({ polylines }: { polylines?: PolylineData[]} ) {
    if (!polylines || polylines.length === 0) {
        return null;
    }
    const elems = polylines.map((polyline, index) => {
        if (polyline.length === 0) {
            return null;
        }
        return (
            <Polyline
                key={index}
                positions={polyline}
                pathOptions={DEFAULT_POLYLINE_OPTIONS}
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


export default function MaskedMap({ polygons, bounds, height, polylines }: MaskedMapProps) {
    return (
        <Box sx={{ height: height || '400px', width: '100%', position: 'relative' }}>
            <MapContainer
                id="map"
                zoom={18}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MaskLayer polygons={ polygons } />
                <RouteLayer polylines={ polylines } />
                <BoundsUpdater bounds={ bounds } />
            </MapContainer>
        </Box>
    );
} 