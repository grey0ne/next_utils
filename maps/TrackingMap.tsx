import { MapContainer, TileLayer } from 'react-leaflet';
import { Box } from '@mui/material';
import { LocationMarker } from './LocationMarker';
import 'leaflet/dist/leaflet.css';


export default function TrackingMap() {
    return (
        <Box sx={{ height: '100vh', width: '100%', position: 'relative' }}>
            <MapContainer
                attributionControl = {false}
                scrollWheelZoom = {false}
                zoomControl = {false}
                zoomAnimation = {false}
                style={{ height: '100%', width: '100%' }}
                zoom={13}
                center={[51.505, -0.09]}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
            </MapContainer>
        </Box>
    )
}