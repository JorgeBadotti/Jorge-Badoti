
import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';

const defaultProfile: UserProfile = {
  name: '',
  baseImage: '',
  personalStyle: '',
  bodyType: '',
  measurements: { bust: 0, waist: 0, hips: 0, height: 0 },
};

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [isProfileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        setUserProfile(parsedProfile);
        // A profile is complete if it has a name and a base image.
        if (parsedProfile.name && parsedProfile.baseImage) {
          setProfileComplete(true);
        }
      }
    } catch (error) {
      console.error("Failed to load user profile from localStorage", error);
    }
  }, []);

  const saveUserProfile = useCallback((profile: UserProfile) => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setUserProfile(profile);
      if (profile.name && profile.baseImage) {
        setProfileComplete(true);
      } else {
        setProfileComplete(false);
      }
    } catch (error) {
      console.error("Failed to save user profile to localStorage", error);
    }
  }, []);

  return { userProfile, saveUserProfile, isProfileComplete };
};
