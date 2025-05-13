import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export const useUserProfile = () => {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading Clerk profile into expected format
  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const mappedProfile: UserProfile = {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      full_name: user.fullName || null,
      created_at: user.createdAt.toString(), // Clerk returns a Date
    };

    setProfile(mappedProfile);
    setIsLoading(false);
  }, [user, isLoaded]);

  // Stub for profile updates (not possible if using only Clerk unless metadata is enabled)
  const updateProfile = async (
    updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at'>>
  ) => {
    toast.error('Profile updates are disabled (no Supabase)');
    return { success: false, error: 'Profile updates not supported without Supabase' };
  };

  return { profile, isLoading, updateProfile };
};
