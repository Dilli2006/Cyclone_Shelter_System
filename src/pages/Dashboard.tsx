import { useShelters } from "@/hooks/useShelters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    getShelterStatus,
    getStatusLabel,
    getStatusBgClass,
    getOccupancyPercentage,
    type ShelterStatus,
} from "@/lib/shelterUtils";
import { formatDistanceToNow } from "date-fns";
import { Building2, CheckCircle, AlertTriangle, XCircle, Loader2, RefreshCw } from "lucide-react";

export default function Dashboard() {
    const { shelters, loading } = useShelters(true, 60000); // auto-refresh every 60s

    const counts = shelters.reduce(
        (acc, shelter) => {
            const status = getShelterStatus(shelter);
            acc[status]++;
            acc.total++;
            return acc;
        },
        { total: 0, available: 0, filling: 0, full: 0 } as Record<string, number>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="w-8 h-8 animate-spin text-navy" />
            </div>
        );
    }

    const statCards = [
        {
            label: "Total Shelters",
            value: counts.total,
            icon: Building2,
            color: "text-navy",
            bg: "bg-blue-50",
        },
        {
            label: "Available",
            value: counts.available,
            icon: CheckCircle,
            color: "text-status-green",
            bg: "bg-green-50",
        },
        {
            label: "Filling Up",
            value: counts.filling,
            icon: AlertTriangle,
            color: "text-status-yellow",
            bg: "bg-yellow-50",
        },
        {
            label: "Full",
            value: counts.full,
            icon: XCircle,
            color: "text-status-red",
            bg: "bg-red-50",
        },
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            Real-time shelter availability overview
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Auto-refreshes every 60s</span>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <div className={`${stat.bg} p-2.5 rounded-lg`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Shelter Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Shelter Name</TableHead>
                                        <TableHead className="text-center">Capacity</TableHead>
                                        <TableHead className="text-center">Occupancy</TableHead>
                                        <TableHead className="text-center w-48">Progress</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Last Updated</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {shelters.map((shelter) => {
                                        const status = getShelterStatus(shelter);
                                        const percentage = getOccupancyPercentage(shelter);
                                        const statusBg = getStatusBgClass(status);
                                        const progressColor =
                                            status === "available"
                                                ? "bg-status-green"
                                                : status === "filling"
                                                    ? "bg-status-yellow"
                                                    : "bg-status-red";

                                        return (
                                            <TableRow key={shelter.id}>
                                                <TableCell className="font-medium">{shelter.name}</TableCell>
                                                <TableCell className="text-center">{shelter.capacity}</TableCell>
                                                <TableCell className="text-center">
                                                    {shelter.current_occupancy}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${progressColor}`}
                                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-medium text-muted-foreground w-10 text-right">
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={`${statusBg} text-white text-[10px] border-0`}>
                                                        {getStatusLabel(status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-xs text-muted-foreground">
                                                    {shelter.last_updated
                                                        ? formatDistanceToNow(new Date(shelter.last_updated), {
                                                            addSuffix: true,
                                                        })
                                                        : "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
