import { IExperience, ISlot } from "../src/models/interfaces";

// Helper to create a slot starting from today
const createSlot = (offsetDays: number, startTime: string, capacity: number, availableSeats: number): ISlot => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays); // Set date 'offsetDays' from today
    date.setHours(0, 0, 0, 0); // Normalize time to midnight for date comparison

    return {
        date,
        startTime,
        endTime: (parseInt(startTime.split(':')[0]) + 2).toString().padStart(2, '0') + ':00', // Assumes 2-hour duration
        capacity,
        availableSeats,
        isSoldOut: availableSeats === 0,
    };
};

// Define mock data (must match IExperience structure)
export const experienceData: Partial<IExperience>[] = [
    {
        title: "Venice Gondola Ride & Aperitivo",
        description: "Experience the magic of Venice's canals with a private gondola ride, followed by a classic Italian Aperitivo.",
        price: 99.50,
        duration: "1.5 hours",
        location: "Venice, Italy",
        imageUrl: "https://images.unsplash.com/photo-1549487922-b5b4a7d6e4a2",
        slots: [
            createSlot(3, '16:00', 5, 5), // Available
            createSlot(3, '18:00', 5, 2), // Limited Availability (Test case for booking)
            createSlot(4, '10:00', 10, 0), // Sold Out (Test case for filtering)
            createSlot(5, '17:00', 8, 8),
        ],
    },
    {
        title: "Japanese Sushi Making Masterclass",
        description: "Learn the art of Nigiri and Maki from a seasoned Tokyo chef. All ingredients and sake tasting included.",
        price: 75.00,
        duration: "3 hours",
        location: "Kyoto, Japan",
        imageUrl: "https://images.unsplash.com/photo-1596773344605-64c8d374467c",
        slots: [
            createSlot(7, '11:00', 12, 12),
            createSlot(7, '15:00', 12, 1), // Very Limited
            createSlot(8, '18:30', 15, 15),
        ],
    },
    {
        title: "Sahara Desert Stargazing Camp",
        description: "An overnight experience in the Moroccan desert. Includes camel trek, traditional dinner, and guided astronomy session.",
        price: 150.00,
        duration: "1 Day",
        location: "Marrakech, Morocco",
        imageUrl: "https://images.unsplash.com/photo-1555734289-566d21f8a85f",
        slots: [
            createSlot(14, '14:00', 20, 20),
            createSlot(21, '14:00', 15, 15),
        ],
    },
];