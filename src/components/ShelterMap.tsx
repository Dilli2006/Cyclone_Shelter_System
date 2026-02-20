import { useEffect, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Shelter } from "@/integrations/supabase/types";
import {
    getShelterStatus,
    getStatusColor,
    getStatusLabel,
    getOccupancyPercentage,
} from "@/lib/shelterUtils";
import { Users, Phone, MapPin } from "lucide-react";

// Fix default Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function createColoredIcon(color: string) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="11" r="5" fill="white" opacity="0.9"/>
    </svg>
  `;
    return L.divIcon({
        html: svg,
        className: "custom-marker",
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -42],
    });
}

interface ShelterMapProps {
    shelters: Shelter[];
    userLocation?: { lat: number; lng: number } | null;
}

function FitBounds({ shelters }: { shelters: Shelter[] }) {
    const map = useMap();
    const hasFitted = useRef(false);

    useEffect(() => {
        if (shelters.length > 0 && !hasFitted.current) {
            const bounds = L.latLngBounds(
                shelters.map((s) => [s.latitude, s.longitude] as [number, number])
            );
            map.fitBounds(bounds, { padding: [30, 30] });
            hasFitted.current = true;
        }
    }, [shelters, map]);

    return null;
}

export default function ShelterMap({ shelters, userLocation }: ShelterMapProps) {
    // Center on Chennai
    const center: [number, number] = [13.0827, 80.2707];

    return (
        <MapContainer
            center={center}
            zoom={12}
            className="w-full h-full rounded-lg"
            style={{ minHeight: "400px" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds shelters={shelters} />

            {/* User location marker */}
            {userLocation && (
                <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={L.divIcon({
                        html: `<div style="width:16px;height:16px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 8px rgba(59,130,246,0.5);"></div>`,
                        className: "user-marker",
                        iconSize: [16, 16],
                        iconAnchor: [8, 8],
                    })}
                >
                    <Popup>
                        <strong>Your Location</strong>
                    </Popup>
                </Marker>
            )}

            {/* Shelter markers */}
            {shelters.map((shelter) => {
                const status = getShelterStatus(shelter);
                const color = getStatusColor(status);
                const percentage = getOccupancyPercentage(shelter);

                return (
                    <Marker
                        key={shelter.id}
                        position={[shelter.latitude, shelter.longitude]}
                        icon={createColoredIcon(color)}
                    >
                        <Popup>
                            <div className="min-w-[220px]">
                                {shelter.image_url && (
                                    <img
                                        src={shelter.image_url}
                                        alt={shelter.name}
                                        className="w-full h-28 object-cover rounded-t mb-2"
                                        loading="lazy"
                                    />
                                )}
                                <h3 className="font-bold text-base mb-1">{shelter.name}</h3>
                                <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                                    <span>📍</span>
                                    <span>{shelter.address}</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Occupancy:</span>
                                        <span className="font-semibold" style={{ color }}>
                                            {shelter.current_occupancy} / {shelter.capacity} ({percentage}%)
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span
                                            className="font-semibold text-xs px-2 py-0.5 rounded-full text-white"
                                            style={{ backgroundColor: color }}
                                        >
                                            {getStatusLabel(status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600 pt-1">
                                        <span>📞</span>
                                        <span>{shelter.contact_phone}</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
