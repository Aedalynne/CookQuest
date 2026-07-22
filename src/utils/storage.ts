import { type UserProfile, DEFAULT_PROFILE } from '../types/storage';

const STORAGE_KEY = 'xp_kitchen_user_profile';

export const loadUserProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_PROFILE;
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load user profile from LocalStorage:', err);
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save user profile to LocalStorage:', err);
  }
};

export const clearUserProfile = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};