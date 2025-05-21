import { useState } from 'react';
import { useMapEvents, Marker, Popup } from 'react-leaflet';
import { LocationEvent, LatLng } from 'leaflet';

export function LocationMarker() {
    const [position, setPosition] = useState<LatLng | null>(null)
    const map = useMapEvents({
        click() {
            console.log('Locating')
            map.locate()
        },
        locationfound(e: LocationEvent) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}