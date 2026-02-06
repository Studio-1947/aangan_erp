import { supabase } from '../supabaseClient';

export interface Homestay {
  id: string;
  name: string;
  address: string;
  owner_id: string;
  created_at: string;
}

export const homestayService = {
  /**
   * Checks if the current user has a homestay.
   * Returns the homestay if it exists, otherwise null.
   */
  getUserHomestay: async (userId: string): Promise<Homestay | null> => {
    try {
      console.log('Checking homestay for user:', userId);
      // Use select() with limit instead of maybeSingle() to handle potential duplicate legacy data gracefully
      const { data, error } = await supabase
        .from('homestays')
        .select('*')
        .eq('owner_id', userId)
        .limit(1);

      if (error) {
        console.error('Error fetching user homestay:', error);
        return null;
      }

      const homestay = data && data.length > 0 ? data[0] : null;
      console.log('Homestay fetch result:', homestay);
      return homestay;

    } catch (err) {
      console.error('Unexpected error in getUserHomestay:', err);
      return null;
    }
  }
};
