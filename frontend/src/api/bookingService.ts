import apiClient from './apiClient';

// Minimal interfaces needed for the service layer
interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
}

export interface IBookingPayload {
    experience: string; // The ID of the booked experience
    date: string; // ISO Date String for the booked date
    time: string; // The selected time slot
    totalPrice: number;
    customer: CustomerDetails;
}

export interface IBookingResponse {
    bookingId: string;
    totalAmount: number;
    status: 'Confirmed' | 'Pending';
    timestamp: string;
    customerEmail: string;
    // Add other fields returned by your backend
}

/**
 * Creates a new booking in the database.
 */
export const createBooking = async (bookingData: IBookingPayload): Promise<IBookingResponse> => {
    try {
        // Correct endpoint: /api/v1/bookings (assuming apiClient baseURL is /api)
        const response = await apiClient.post('/api/v1/bookings', bookingData);
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error; // Let the component handle the error display
    }
};

// You would likely have other functions here, e.g., for fetching:
/*
export const fetchAllBookings = async (): Promise<IBookingResponse[]> => {
    try {
        const response = await apiClient.get('/v1/bookings');
        return response.data;
    } catch (error) {
        throw error;
    }
};
*/