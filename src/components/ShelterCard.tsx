import type { Shelter } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    getShelterStatus,
    getStatusLabel,
    getStatusBgClass,
    getOccupancyPercentage,
} from "@/lib/shelterUtils";
import { MapPin, Phone, Users, ImageOff } from "lucide-react";

interface ShelterCardProps {
    shelter: Shelter;
    distance?: number | null;
}

export default function ShelterCard({ shelter, distance }: ShelterCardProps) {
    const status = getShelterStatus(shelter);
    const percentage = getOccupancyPercentage(shelter);
    const statusLabel = getStatusLabel(status);
    const statusBg = getStatusBgClass(status);

    return (
        <Card className="hover:shadow-md transition-shadow overflow-hidden">
            {/* Shelter Photo */}
            {shelter.image_url ? (
                <div className="relative h-32 w-full">
                    <img
                        src={shelter.image_url}
                        alt={shelter.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling;
                            if (fallback) (fallback as HTMLElement).style.display = "flex";
                        }}
                    />
                    <div className="hidden items-center justify-center h-full w-full bg-gray-100 absolute inset-0">
                        <ImageOff className="w-8 h-8 text-gray-300" />
                    </div>
                    <Badge
                        className={`${statusBg} text-white text-[10px] border-0 absolute top-2 right-2`}
                    >
                        {statusLabel}
                    </Badge>
                </div>
            ) : (
                <div className="relative h-24 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <ImageOff className="w-8 h-8 text-gray-300" />
                    <Badge
                        className={`${statusBg} text-white text-[10px] border-0 absolute top-2 right-2`}
                    >
                        {statusLabel}
                    </Badge>
                </div>
            )}

            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm leading-tight">{shelter.name}</h3>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{shelter.address}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>
                            {shelter.current_occupancy}/{shelter.capacity} ({percentage}%)
                        </span>
                    </div>

                    {distance != null && (
                        <span className="text-muted-foreground font-medium">
                            {distance.toFixed(1)} km
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Phone className="w-3 h-3" />
                    <span>{shelter.contact_phone}</span>
                </div>

                {/* Occupancy bar */}
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${statusBg}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
