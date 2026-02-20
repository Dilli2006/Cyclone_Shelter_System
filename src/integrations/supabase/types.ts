export interface Shelter {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    capacity: number;
    current_occupancy: number;
    contact_phone: string;
    image_url?: string;
    last_updated: string;
    status: string;
}

export interface Database {
    public: {
        Tables: {
            shelters: {
                Row: Shelter;
                Insert: Omit<Shelter, "id"> & { id?: string };
                Update: Partial<Shelter>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}
