import { useState, useEffect, useMemo } from "react";
import { useShelters } from "@/hooks/useShelters";
import ShelterMap from "@/components/ShelterMap";
import ShelterCard from "@/components/ShelterCard";
import StatusFilter from "@/components/StatusFilter";
import { getShelterStatus, calculateDistance, type ShelterStatus } from "@/lib/shelterUtils";
import { Loader2, Navigation } from "lucide-react";

export default function Index() {
    const { shelters, loading } = useShelters();
    const [filter, setFilter] = useState<ShelterStatus | "all">("all");
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Get user location
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => {
                // Default to Chennai center if denied
                setUserLocation({ lat: 13.0827, lng: 80.2707 });
                setLocationError("Location access denied. Showing default location.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    // Filter and sort shelters
    const filteredShelters = useMemo(() => {
        let result = shelters;

        if (filter !== "all") {
            result = result.filter((s) => getShelterStatus(s) === filter);
        }

        if (userLocation) {
            result = [...result].sort((a, b) => {
                const distA = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
                const distB = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
                return distA - distB;
            });
        }

        return result;
    }, [shelters, filter, userLocation]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-navy mx-auto mb-3" />
                    <p className="text-muted-foreground">Loading shelters...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
            {/* Map */}
            <div className="flex-1 relative min-h-[300px] lg:min-h-0">
                <ShelterMap shelters={filteredShelters} userLocation={userLocation} />
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-96 bg-gray-50 border-l flex flex-col overflow-hidden">
                {/* Sidebar Header */}
                <div className="p-4 bg-white border-b space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold text-navy">Nearby Shelters</h2>
                        <span className="text-xs text-muted-foreground">
                            {filteredShelters.length} shelter{filteredShelters.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {locationError && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                            <Navigation className="w-3 h-3" />
                            <span>{locationError}</span>
                        </div>
                    )}

                    <StatusFilter selected={filter} onChange={setFilter} />
                </div>

                {/* Shelter list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredShelters.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">No shelters match the selected filter.</p>
                        </div>
                    ) : (
                        filteredShelters.map((shelter) => {
                            const distance = userLocation
                                ? calculateDistance(userLocation.lat, userLocation.lng, shelter.latitude, shelter.longitude)
                                : null;
                            return (
                                <ShelterCard key={shelter.id} shelter={shelter} distance={distance} />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
