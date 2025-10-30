import type { ReactNode } from 'react';
import apiClient from './apiClient';

// Define the expected data shape from your backend
export interface IExperience {
    location: ReactNode;
    duration: ReactNode;
    _id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    // Add other fields relevant to your UI/UX (e.g., image, location)
}

/**
 * Fetches a list of all experiences from the backend.
 */
export const fetchExperiences = async (): Promise<IExperience[]> => {
    try {
        const response = await apiClient.get('/experiences');
        // Assuming your backend responds with a JSON array directly
        return response.data;
    } catch (error) {
        console.error('Error fetching experiences:', error);
        // You can throw a custom error or handle it as needed
        throw new Error('Failed to load experiences from the server.');
    }
};

/**
 * Fetches details for a single experience by ID.
 */
export const fetchExperienceById = async (id: string): Promise<IExperience> => {
    try {
        const response = await apiClient.get(`/experiences/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching experience ${id}:`, error);
        throw new Error(`Failed to load experience ${id} from the server.`);
    }
};