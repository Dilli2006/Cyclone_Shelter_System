import type { ShelterStatus } from "@/lib/shelterUtils";
import { Button } from "@/components/ui/button";

interface StatusFilterProps {
    selected: ShelterStatus | "all";
    onChange: (status: ShelterStatus | "all") => void;
}

const filters: { value: ShelterStatus | "all"; label: string; color?: string }[] = [
    { value: "all", label: "All" },
    { value: "available", label: "Available", color: "bg-status-green" },
    { value: "filling", label: "Filling Up", color: "bg-status-yellow" },
    { value: "full", label: "Full", color: "bg-status-red" },
];

export default function StatusFilter({ selected, onChange }: StatusFilterProps) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
                <Button
                    key={f.value}
                    variant={selected === f.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange(f.value)}
                    className={`text-xs ${selected === f.value && f.color
                            ? `${f.color} text-white border-0 hover:opacity-90`
                            : ""
                        }`}
                >
                    {f.color && (
                        <span className={`w-2 h-2 rounded-full ${f.color} mr-1.5 inline-block`} />
                    )}
                    {f.label}
                </Button>
            ))}
        </div>
    );
}
