import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Shelter } from "@/integrations/supabase/types";

// Mock data fallback — 8 Chennai shelters with varied occupancy
const MOCK_SHELTERS: Shelter[] = [
    {
        id: "1a000000-0000-0000-0000-000000000001",
        name: "Chennai Convention Centre",
        address: "Anna Salai, Teynampet, Chennai 600018",
        latitude: 13.0418,
        longitude: 80.2341,
        capacity: 500,
        current_occupancy: 180,
        contact_phone: "+91-44-2345-6789",
        image_url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=250&fit=crop",
        last_updated: new Date().toISOString(),
        status: "active",
    },
    {
        id: "1a000000-0000-0000-0000-000000000002",
        name: "Nehru Indoor Stadium",
        address: "Periyar EVR High Rd, Kilpauk, Chennai 600010",
        latitude: 13.0827,
        longitude: 80.2377,
        capacity: 400,
        current_occupancy: 350,
        contact_phone: "+91-44-2536-7890",
        image_url: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=250&fit=crop",
        last_updated: new Date().toISOString(),
        status: "active",
    },
    {
        id: "1a000000-0000-0000-0000-000000000003",
        name: "YMCA Nandanam",
        address: "68 Nandanam Main Rd, Nandanam, Chennai 600035",
        latitude: 13.0299,
        longitude: 80.2386,
        capacity: 200,
        current_occupancy: 195,
        contact_phone: "+91-44-2434-5678",
        image_url: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=400&h=250&fit=crop",
        last_updated: new Date().toISOString(),
        status: "active",
    },
    {
        id: "1a000000-0000-0000-0000-000000000004",
        name: "Govt Higher Secondary School T.Nagar",
        address: "12 Bazullah Rd, T. Nagar, Chennai 600017",
        latitude: 13.0382,
        longitude: 80.234,
        capacity: 300,
        current_occupancy: 120,
        contact_phone: "+91-44-2815-2345",
        image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=250&fit=crop",
        last_updated: new Date().toISOString(),
        status: "active",
    },
    {
        id: "1a000000-0000-0000-0000-000000000005",
        name: "Anna University Shelter Hall",
        address: "Sardar Patel Rd, Guindy, Chennai 600025",
        latitude: 13.0067,
        longitude: 80.2206,
        capacity: 350,
        current_occupancy: 90,
        contact_phone: "+91-44-2235-1234",
        image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=250&fit=crop",
        last_updated: new Date().toISOString(),
        status: "active",
    },
    {
        id: "1a000000-0000-0000-0000-000000000006",
        name: "Corporation Community Hall Mylapore",
        address: "42 Dr Radhakrishnan Rd, Mylapore, Chennai 600004",
        latitude: 13.0339,
        longitude: 80.2676,
        capacity: 150,
        current_occupancy: 142,
        contact_phone: "+91-44-2498-6543",
        image_url: "https://images.unsplash.com/photo-1564429238961-bf8f8be2a4c3?w=400&h=250&fit=crop",
        last_updated: new Date().toISOString(),
        status: "active",
    },
    {
        id: "1a000000-0000-0000-0000-000000000007",
        name: "Perambur Community Centre",
        address: "15 Paper Mills Rd, Perambur, Chennai 600011",
        latitude: 13.1143,
        longitude: 80.233,
        capacity: 250,
        current_occupancy: 60,
        contact_phone: "+91-44-2551-9876",
        image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
        last_updated: new Date().toISOString(),
        status: "active",
    },
    {
        id: "1a000000-0000-0000-0000-000000000008",
        name: "Besant Nagar Beach Shelter",
        address: "3rd Cross St, Besant Nagar, Chennai 600090",
        latitude: 12.998,
        longitude: 80.2668,
        capacity: 200,
        current_occupancy: 155,
        contact_phone: "+91-44-2491-4321",
        image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=250&fit=crop",
        last_updated: new Date().toISOString(),
        status: "active",
    },
];

export function useShelters(autoRefresh = false, intervalMs = 60000) {
    const [shelters, setShelters] = useState<Shelter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usingMock, setUsingMock] = useState(false);

    const fetchShelters = useCallback(async () => {
        try {
            const { data, error: fetchError } = await supabase
                .from("shelters")
                .select("*")
                .order("name");

            if (fetchError) throw fetchError;

            if (data && data.length > 0) {
                setShelters(data);
                setUsingMock(false);
            } else {
                // No data in Supabase — use mock data
                console.warn("No shelters found in Supabase. Using mock data.");
                setShelters(MOCK_SHELTERS);
                setUsingMock(true);
            }
            setError(null);
        } catch (err) {
            // Supabase connection failed — use mock data
            console.warn("Supabase fetch failed. Using mock data:", err);
            setShelters(MOCK_SHELTERS);
            setUsingMock(true);
            setError(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateOccupancy = useCallback(
        async (id: string, newOccupancy: number) => {
            const shelter = shelters.find((s) => s.id === id);
            if (!shelter) return;

            const clamped = Math.max(0, Math.min(newOccupancy, shelter.capacity));

            // If using mock data, just update locally
            if (!usingMock) {
                const { error: updateError } = await supabase
                    .from("shelters")
                    .update({
                        current_occupancy: clamped,
                        last_updated: new Date().toISOString(),
                    })
                    .eq("id", id);

                if (updateError) {
                    console.warn("Supabase update failed, updating locally:", updateError);
                }
            }

            setShelters((prev) =>
                prev.map((s) =>
                    s.id === id
                        ? {
                            ...s,
                            current_occupancy: clamped,
                            last_updated: new Date().toISOString(),
                        }
                        : s
                )
            );
        },
        [shelters, usingMock]
    );

    useEffect(() => {
        fetchShelters();
    }, [fetchShelters]);

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(fetchShelters, intervalMs);
        return () => clearInterval(interval);
    }, [autoRefresh, intervalMs, fetchShelters]);

    const addShelter = useCallback(
        async (newShelter: Omit<Shelter, "id" | "last_updated" | "status">) => {
            const shelter: Shelter = {
                ...newShelter,
                id: crypto.randomUUID(),
                last_updated: new Date().toISOString(),
                status: "active",
            };

            if (!usingMock) {
                const { error: insertError } = await supabase
                    .from("shelters")
                    .insert(shelter);
                if (insertError) {
                    console.warn("Supabase insert failed, adding locally:", insertError);
                }
            }

            setShelters((prev) => [...prev, shelter]);
            return shelter;
        },
        [usingMock]
    );

    const deleteShelter = useCallback(
        async (id: string) => {
            if (!usingMock) {
                const { error: deleteError } = await supabase
                    .from("shelters")
                    .delete()
                    .eq("id", id);
                if (deleteError) {
                    console.warn("Supabase delete failed, deleting locally:", deleteError);
                }
            }
            setShelters((prev) => prev.filter((s) => s.id !== id));
        },
        [usingMock]
    );

    return { shelters, loading, error, refetch: fetchShelters, updateOccupancy, addShelter, deleteShelter };
}
