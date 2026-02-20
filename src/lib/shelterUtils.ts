import type { Shelter } from "@/integrations/supabase/types";

export type ShelterStatus = "available" | "filling" | "full";

export function getShelterStatus(shelter: Shelter): ShelterStatus {
    const percentage = (shelter.current_occupancy / shelter.capacity) * 100;
    if (percentage >= 95) return "full";
    if (percentage >= 70) return "filling";
    return "available";
}

export function getStatusLabel(status: ShelterStatus): string {
    switch (status) {
        case "available":
            return "Available";
        case "filling":
            return "Filling Up";
        case "full":
            return "Full";
    }
}

export function getStatusColor(status: ShelterStatus): string {
    switch (status) {
        case "available":
            return "#16A34A";
        case "filling":
            return "#EAB308";
        case "full":
            return "#DC2626";
    }
}

export function getStatusBgClass(status: ShelterStatus): string {
    switch (status) {
        case "available":
            return "bg-status-green";
        case "filling":
            return "bg-status-yellow";
        case "full":
            return "bg-status-red";
    }
}

export function getStatusTextClass(status: ShelterStatus): string {
    switch (status) {
        case "available":
            return "text-status-green";
        case "filling":
            return "text-status-yellow";
        case "full":
            return "text-status-red";
    }
}

export function getOccupancyPercentage(shelter: Shelter): number {
    return Math.round((shelter.current_occupancy / shelter.capacity) * 100);
}

export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
