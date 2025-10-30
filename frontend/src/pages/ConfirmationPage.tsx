import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Helper function to safely extract the MongoDB $date string
const getMongoDateString = (mongoObject: any): string => {
    if (mongoObject && typeof mongoObject === 'object' && mongoObject.$date) {
        return mongoObject.$date;
    }
    return String(mongoObject || new Date().toISOString());
};

const PageContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="p-6 bg-white shadow-xl rounded-xl max-w-lg mx-auto my-8">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700 border-b pb-2">{title}</h2>
        {children}
    </div>
);

// Interface representing the object passed: response.data.booking
interface BookingConfirmation {
    bookingReference: string;
    finalPrice: number;
    userEmail: string;
    status: 'Confirmed' | 'Pending';
    experienceTitle: string;
    discountAmount: number;
    promoCodeApplied: string | null;
    userFullName: string;
    date: any;
    createdAt: any;
}

const ConfirmationPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Revert to simple object cast, matching the object passed in navigation state: response.data.booking
    const confirmationDetails = location.state as BookingConfirmation | undefined;

    // --- Fallback if state is missing/invalid ---
    if (!confirmationDetails?.bookingReference) {
        return (
            <PageContainer title="Error">
                <p className="text-red-500">No booking details found. Please start the booking process again.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
                >
                    Go to Main Page
                </button>
            </PageContainer>
        );
    }

    // ⭐ CRITICAL FIX: Destructure WITHOUT defaults so the actual values are used.
    // If the data is received, these variables will be correctly populated.
    const {
        bookingReference,
        finalPrice,
        status, // This will be "Confirmed"
        userEmail, // This will be "arinkumarjoshi2004@gmail.com"
        createdAt,
        experienceTitle,
        discountAmount,
        promoCodeApplied,
    } = confirmationDetails;

    // Fix 1: Status styling should now correctly reflect the 'Confirmed' status
    const statusColorClass = status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600';

    const timestampSource = getMongoDateString(createdAt);

    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const formattedTimestamp = new Date(timestampSource).toLocaleString('en-US', dateOptions);

    return (
        <PageContainer title="Booking Confirmed! 🎉">
            <div className="text-center">
                {/* 1. Status and Experience Title Fix */}
                <p className={`text-2xl font-bold ${statusColorClass} mb-4`}>
                    Your booking for {experienceTitle} is {status}
                </p>

                <div className="bg-green-50 p-6 rounded-lg space-y-3 text-left border border-green-200">
                    <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Booking ID:</span>
                        <span className="font-bold text-gray-800">{bookingReference}</span>
                    </div>

                    {/* 4. Payment Status Fix (Uses the correctly populated 'status') */}
                    <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Payment Status:</span>
                        <span className={`font-bold ${statusColorClass}`}>{status}</span>
                    </div>

                    {/* Display Discount/Promo details */}
                    {promoCodeApplied && (
                        <div className="flex justify-between text-sm text-green-700">
                            <span className="font-medium">Promo Applied:</span>
                            <span className="font-semibold">{promoCodeApplied}</span>
                        </div>
                    )}
                    {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-red-600">
                            <span className="font-medium">Discount:</span>
                            <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between border-t border-green-300 pt-2">
                        <span className="text-gray-700 font-medium text-lg">Total Paid:</span>
                        <span className="font-bold text-xl text-green-800">${finalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between pt-2">
                        <span className="text-gray-700 font-medium">Confirmed To:</span>
                        {/* 2. User Email Fix (Uses the correctly populated 'userEmail') */}
                        <span className="text-gray-800 font-semibold">{userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Confirmation Time:</span>
                        <span className="text-gray-800">{formattedTimestamp}</span>
                    </div>
                </div>

                {/* 3. User Email in Paragraph Fix (Uses the correctly populated 'userEmail') */}
                <p className="mt-6 text-gray-600">
                    A confirmation email has been sent to {userEmail}
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="mt-8 w-full px-4 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition"
                >
                    Return to Main Page
                </button>
            </div>
        </PageContainer>
    );
};

export default ConfirmationPage;