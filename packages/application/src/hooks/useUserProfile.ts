
import { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState<boolean>(!isLoaded);

  // Use Clerk user data directly
  useState(() => {
    if (!isLoaded) return;
    
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    // Map Clerk user to our UserProfile format
    const mappedProfile: UserProfile = {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress || '',
      full_name: user.fullName,
      created_at: user.createdAt?.toISOString() || new Date().toISOString(),
    };

    setProfile(mappedProfile);
    setIsLoading(false);
  });

  // Stub for profile updates (using Clerk's user update methods)
  const updateProfile = async (
    updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at'>>
  ) => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Update the user's full name in Clerk
      if (updates.full_name) {
        await user.update({
          firstName: updates.full_name.split(' ')[0] || '',
          lastName: updates.full_name.split(' ').slice(1).join(' ') || '',
        });

        // Update local state
        setProfile(prev => prev ? { ...prev, ...updates } : null);
        return { success: true };
      }

      return { success: false, error: 'No changes to apply' };
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false, error: String(error) };
    }
  };

  return { profile, isLoading, updateProfile };
};
