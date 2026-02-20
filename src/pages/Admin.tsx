import { useState } from "react";
import { useShelters } from "@/hooks/useShelters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    getShelterStatus,
    getStatusLabel,
    getStatusBgClass,
    getOccupancyPercentage,
} from "@/lib/shelterUtils";
import { toast } from "sonner";
import {
    LogIn,
    LogOut,
    Minus,
    Plus,
    Users,
    Loader2,
    PlusCircle,
    Trash2,
    ChevronDown,
    ChevronUp,
    ImagePlus,
} from "lucide-react";

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@shelter.com";
const ADMIN_PASSWORD = "admin123";

const EMPTY_FORM = {
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    capacity: "",
    current_occupancy: "0",
    contact_phone: "",
    image_url: "",
};

export default function Admin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [exactValues, setExactValues] = useState<Record<string, string>>({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newShelter, setNewShelter] = useState(EMPTY_FORM);
    const { shelters, loading, updateOccupancy, addShelter, deleteShelter } =
        useShelters();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        await new Promise((r) => setTimeout(r, 500));
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            setIsLoggedIn(true);
            toast.success("Logged in successfully!");
        } else {
            toast.error("Invalid credentials. Use admin@shelter.com / admin123");
        }
        setAuthLoading(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setEmail("");
        setPassword("");
        toast.success("Logged out");
    };

    const handleAdjust = async (id: string, delta: number) => {
        const shelter = shelters.find((s) => s.id === id);
        if (!shelter) return;
        try {
            await updateOccupancy(id, shelter.current_occupancy + delta);
            toast.success(`Occupancy updated by ${delta > 0 ? "+" : ""}${delta}`);
        } catch {
            toast.error("Failed to update occupancy");
        }
    };

    const handleSetExact = async (id: string) => {
        const val = parseInt(exactValues[id] || "0");
        if (isNaN(val) || val < 0) {
            toast.error("Please enter a valid number");
            return;
        }
        try {
            await updateOccupancy(id, val);
            setExactValues((prev) => ({ ...prev, [id]: "" }));
            toast.success(`Occupancy set to ${val}`);
        } catch {
            toast.error("Failed to update occupancy");
        }
    };

    const handleAddShelter = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, address, latitude, longitude, capacity, current_occupancy, contact_phone } =
            newShelter;

        if (!name || !address || !latitude || !longitude || !capacity || !contact_phone) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            await addShelter({
                name,
                address,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                capacity: parseInt(capacity),
                current_occupancy: parseInt(current_occupancy) || 0,
                contact_phone,
                image_url: newShelter.image_url || undefined,
            });
            setNewShelter(EMPTY_FORM);
            setShowAddForm(false);
            toast.success(`Shelter "${name}" added successfully!`);
        } catch {
            toast.error("Failed to add shelter");
        }
    };

    const handleDeleteShelter = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await deleteShelter(id);
            toast.success(`"${name}" deleted`);
        } catch {
            toast.error("Failed to delete shelter");
        }
    };

    // Login form
    if (!isLoggedIn) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-navy rounded-full w-12 h-12 flex items-center justify-center mb-3">
                            <LogIn className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">Admin Login</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Sign in to manage shelter occupancy
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@shelter.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-navy hover:bg-navy-dark"
                                disabled={authLoading}
                            >
                                {authLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                            <div className="text-center text-xs text-muted-foreground mt-3 p-2 bg-gray-50 rounded-md">
                                <p className="font-medium">Demo Credentials:</p>
                                <p>
                                    Email:{" "}
                                    <code className="bg-gray-200 px-1 rounded">admin@shelter.com</code>
                                </p>
                                <p>
                                    Password:{" "}
                                    <code className="bg-gray-200 px-1 rounded">admin123</code>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Admin panel
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Admin Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-navy">Admin Panel</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage shelter occupancy in real-time
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="text-status-green border-status-green hover:bg-green-50"
                        >
                            {showAddForm ? (
                                <ChevronUp className="w-4 h-4 mr-1" />
                            ) : (
                                <PlusCircle className="w-4 h-4 mr-1" />
                            )}
                            {showAddForm ? "Close" : "Add Shelter"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Add Shelter Form */}
                {showAddForm && (
                    <Card className="mb-6 border-status-green/30 shadow-md">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <PlusCircle className="w-5 h-5 text-status-green" />
                                Add New Shelter
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddShelter} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="s-name">Shelter Name *</Label>
                                        <Input
                                            id="s-name"
                                            value={newShelter.name}
                                            onChange={(e) =>
                                                setNewShelter({ ...newShelter, name: e.target.value })
                                            }
                                            placeholder="e.g. Community Hall Adyar"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s-phone">Contact Phone *</Label>
                                        <Input
                                            id="s-phone"
                                            value={newShelter.contact_phone}
                                            onChange={(e) =>
                                                setNewShelter({ ...newShelter, contact_phone: e.target.value })
                                            }
                                            placeholder="e.g. +91-44-1234-5678"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="s-address">Address *</Label>
                                    <Input
                                        id="s-address"
                                        value={newShelter.address}
                                        onChange={(e) =>
                                            setNewShelter({ ...newShelter, address: e.target.value })
                                        }
                                        placeholder="e.g. 10 Main St, Adyar, Chennai 600020"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="s-lat">Latitude *</Label>
                                        <Input
                                            id="s-lat"
                                            type="number"
                                            step="any"
                                            value={newShelter.latitude}
                                            onChange={(e) =>
                                                setNewShelter({ ...newShelter, latitude: e.target.value })
                                            }
                                            placeholder="13.0065"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s-lng">Longitude *</Label>
                                        <Input
                                            id="s-lng"
                                            type="number"
                                            step="any"
                                            value={newShelter.longitude}
                                            onChange={(e) =>
                                                setNewShelter({ ...newShelter, longitude: e.target.value })
                                            }
                                            placeholder="80.2571"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s-cap">Capacity *</Label>
                                        <Input
                                            id="s-cap"
                                            type="number"
                                            min={1}
                                            value={newShelter.capacity}
                                            onChange={(e) =>
                                                setNewShelter({ ...newShelter, capacity: e.target.value })
                                            }
                                            placeholder="200"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="s-occ">Initial Occupancy</Label>
                                        <Input
                                            id="s-occ"
                                            type="number"
                                            min={0}
                                            value={newShelter.current_occupancy}
                                            onChange={(e) =>
                                                setNewShelter({ ...newShelter, current_occupancy: e.target.value })
                                            }
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="s-img" className="flex items-center gap-1">
                                        <ImagePlus className="w-3.5 h-3.5" />
                                        Shelter Photo URL
                                    </Label>
                                    <Input
                                        id="s-img"
                                        type="url"
                                        value={newShelter.image_url}
                                        onChange={(e) =>
                                            setNewShelter({ ...newShelter, image_url: e.target.value })
                                        }
                                        placeholder="https://example.com/shelter-photo.jpg"
                                    />
                                    <p className="text-[11px] text-muted-foreground">
                                        Paste an image URL. Leave blank for default placeholder.
                                    </p>
                                    {newShelter.image_url && (
                                        <div className="relative h-24 w-full rounded-md overflow-hidden border">
                                            <img
                                                src={newShelter.image_url}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '';
                                                    (e.target as HTMLImageElement).alt = 'Invalid image URL';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setNewShelter(EMPTY_FORM);
                                            setShowAddForm(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        className="bg-status-green hover:bg-status-green/90 text-white"
                                    >
                                        <PlusCircle className="w-4 h-4 mr-1" />
                                        Add Shelter
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Shelter List */}
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-navy mx-auto" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {shelters.map((shelter) => {
                            const status = getShelterStatus(shelter);
                            const percentage = getOccupancyPercentage(shelter);
                            const statusBg = getStatusBgClass(status);

                            return (
                                <Card key={shelter.id}>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            {/* Shelter Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold truncate">{shelter.name}</h3>
                                                    <Badge
                                                        className={`${statusBg} text-white text-[10px] border-0`}
                                                    >
                                                        {getStatusLabel(status)}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Users className="w-3.5 h-3.5" />
                                                    <span>
                                                        {shelter.current_occupancy} / {shelter.capacity} (
                                                        {percentage}%)
                                                    </span>
                                                </div>
                                                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${statusBg}`}
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Controls */}
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleAdjust(shelter.id, -10)}
                                                        disabled={shelter.current_occupancy <= 0}
                                                    >
                                                        <Minus className="w-3 h-3 mr-1" /> 10
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleAdjust(shelter.id, 10)}
                                                        disabled={
                                                            shelter.current_occupancy >= shelter.capacity
                                                        }
                                                    >
                                                        <Plus className="w-3 h-3 mr-1" /> 10
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleDeleteShelter(shelter.id, shelter.name)
                                                        }
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={shelter.capacity}
                                                        value={exactValues[shelter.id] || ""}
                                                        onChange={(e) =>
                                                            setExactValues((prev) => ({
                                                                ...prev,
                                                                [shelter.id]: e.target.value,
                                                            }))
                                                        }
                                                        placeholder="Set exact"
                                                        className="w-24 h-9 text-sm"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSetExact(shelter.id)}
                                                        className="bg-navy hover:bg-navy-dark"
                                                    >
                                                        Set
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
