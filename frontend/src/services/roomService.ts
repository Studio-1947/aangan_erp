import { supabase } from '../supabaseClient';

export interface Room {
    id: string;
    homestay_id: string;
    name: string;
    type: string;
    capacity: number;
    price: number;
    amenities: string[]; // Stored as JSONB in DB, parsed as string[]
    is_available: boolean;
    created_at?: string;
}

export const roomService = {
    /**
     * Get all rooms for a specific homestay
     */
    getRoomsByHomestay: async (homestayId: string): Promise<Room[] | null> => {
        const { data, error } = await supabase
            .from('rooms')
            .select('*')
            .eq('homestay_id', homestayId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching rooms:', error);
            throw error;
        }

        return data;
    },

    /**
     * Create a new room
     */
    createRoom: async (room: Omit<Room, 'id' | 'created_at'>): Promise<Room | null> => {
        const { data, error } = await supabase
            .from('rooms')
            .insert([room])
            .select()
            .single();

        if (error) {
            console.error('Error creating room:', error);
            throw error;
        }

        return data;
    },

    /**
     * Update an existing room
     */
    updateRoom: async (id: string, updates: Partial<Room>): Promise<Room | null> => {
        const { data, error } = await supabase
            .from('rooms')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating room:', error);
            throw error;
        }

        return data;
    },

    /**
     * Delete a room
     */
    deleteRoom: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('rooms')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting room:', error);
            throw error;
        }
    }
};
