import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// NOTE: Must ensure IExperience interface is accessible
import type { IExperience } from '../api/experienceService';

const PageContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    // Reverted max-width for consistency with other single-column pages
    <div className="p-6 bg-white shadow-xl rounded-xl max-w-lg mx-auto my-8">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700 border-b pb-2">{title}</h2>
        {children}
    </div>
);

// Define the required state structure coming from SelectDatePage.tsx
interface BookingState {
    experienceId: string;
    experienceName: string;
    selectedDate: string;
    selectedTime: string;
    totalPrice: number;
    // CRITICAL: Ensure the full experience object is passed through for the next page
    experience?: IExperience;
}

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingState = location.state as BookingState | undefined;

    // Check for state existence (minimal check)
    if (!bookingState || !bookingState.experienceId) {
        // Redirect if direct access or missing state
        navigate('/', { replace: true });
        return null;
    }

    const { experienceName, selectedDate, selectedTime, totalPrice } = bookingState;

    // Display logic assumes selectedDate is YYYY-MM-DD
    const displayDate = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    const displayTime = selectedTime; // Use selectedTime directly from state

    const handleContinueAsGuest = () => {
        // FIX: Pass the WHOLE existing bookingState object to the details page
        navigate('/checkout/details', { state: bookingState });
    };

    const handleLogin = () => {
        // Placeholder for a real login flow - navigate to a login route
        alert('Simulating login... (Should navigate to /login)');
    }

    return (
        <PageContainer title="Confirm & Proceed">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Booking Details</h3>

            <div className="bg-indigo-50 p-4 rounded-lg space-y-2 mb-6 border border-indigo-200">
                <div className="flex justify-between">
                    <span className="text-gray-700">Experience:</span>
                    <span className="font-medium text-indigo-700">{experienceName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700">Date:</span>
                    <span className="font-medium text-indigo-700">{displayDate}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-700">Time:</span>
                    <span className="font-medium text-indigo-700">{displayTime}</span>
                </div>
                <div className="flex justify-between border-t mt-2 pt-2 border-indigo-300">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-green-600">${totalPrice?.toFixed(2)}</span>
                </div>
            </div>

            <h3 className="text-lg font-semibold mb-3 text-gray-800">How would you like to proceed?</h3>

            <div className="space-y-4">
                <button
                    onClick={handleContinueAsGuest}
                    className="w-full px-4 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition"
                >
                    Continue as Guest
                </button>
                <button
                    onClick={handleLogin}
                    className="w-full px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition"
                >
                    Login to Continue
                </button>
            </div>

        </PageContainer>
    );
};

export default CheckoutPage;