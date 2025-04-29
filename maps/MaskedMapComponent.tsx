'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Polygon, LayerGroup } from 'react-leaflet';
import { Box } from '@mui/material';
import { GeoPoint, PolygonData, Bounds, MaskedMapComponentProps } from './types';
import 'leaflet/dist/leaflet.css';

const DEFAULT_MASK_OPTIONS = {
    color: "#3388FF",
    weight: 0,
    fillColor: "#FFFFFF",
    fillOpacity: 0.9,
}

const DEFAULT_MASK_POLYGON: PolygonData = [
    [-360, -90],
    [-360, 90],
    [360, 90],
    [360, -90],
];

const BOUND_SIZE = 0.005;
const DEFAULT_ANIMATION_SPEED = 1000;


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

function MaskLayer({ polygons, animationSpeed }: MaskedMapComponentProps) {
    const [animationCounter, setAnimationCounter] = useState(0);
    const [maskPolygons, setMaskPolygons] = useState<Array<PolygonData>>([
        DEFAULT_MASK_POLYGON
    ]);

    if (polygons.length === 0) {
        return null;
    }
    const firstPoint = polygons[0][0];
    const defaultBounds: Bounds = [
        [firstPoint[0], firstPoint[1]],
        [firstPoint[0] + BOUND_SIZE, firstPoint[1] + BOUND_SIZE]
    ];
    const [bounds, setBounds] = useState<Bounds>(defaultBounds);
    const map = useMap();

    useEffect(() => {
        map.fitBounds(bounds);
        const tm = setTimeout(() => {
            if (animationCounter >= polygons.length) {
                clearTimeout(tm);
                return;
            }
            const newPolygon = polygons[animationCounter];
            setMaskPolygons((prev) => {
                const newPolygons = [...prev];
                newPolygons.push(newPolygon);
                return newPolygons;
            });
            for (const point of newPolygon) {
                extendBounds(bounds, point);
            }
            setBounds(bounds);
            map.fitBounds(bounds);
            setAnimationCounter((prev) => prev + 1);
        }, animationSpeed || DEFAULT_ANIMATION_SPEED);

        return () => {
            clearTimeout(tm);
        }
    }, [maskPolygons, map])
    return (
        <LayerGroup>
            <Polygon
                positions={maskPolygons}
                pathOptions={DEFAULT_MASK_OPTIONS}
            />
        </LayerGroup>
    )
}



export default function MaskedMapComponent({ polygons, animationSpeed }: MaskedMapComponentProps) {
    return (
        <Box sx={{ height: '800px', width: '100%', position: 'relative' }}>
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
                <MaskLayer polygons={ polygons } animationSpeed={ animationSpeed } />
            </MapContainer>
        </Box>
    );
} 