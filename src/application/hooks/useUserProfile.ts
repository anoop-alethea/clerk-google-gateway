
import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export const useUserProfile = () => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        // Using eq with explicit type casting to handle string ID
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, supabase]);

  // Update user profile
  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at'>>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Using eq with explicit type casting to handle string ID
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update profile');
        return { success: false, error: error.message };
      }

      // Update the local state with the new values
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating profile');
      return { success: false, error: 'An error occurred' };
    }
  };

  return { profile, isLoading, updateProfile };
};
