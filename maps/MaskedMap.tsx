'use client'
import dynamic from 'next/dynamic';
import { GeoPoint, PolygonData, Bounds, MaskedMapComponentProps } from './types';

const DynamicMap = dynamic(() => import("@/next_utils/maps/MaskedMapComponent"), { ssr:false })

export function MaskedMap(props: MaskedMapComponentProps) {
    return (
        <DynamicMap {...props} />
    )
}