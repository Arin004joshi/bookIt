import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PageContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="p-6 bg-white shadow-xl rounded-xl max-w-lg mx-auto my-8">
        <h2 className="text-3xl font-bold mb-6 text-indigo-700 border-b pb-2">{title}</h2>
        {children}
    </div>
);

const SelectTimePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const experienceId = query.get('experienceId') || '';
    const date = query.get('date') || '';

    // In a real app, this would be fetched based on experienceId and date
    const experienceName = "Luxury Spa Package";
    const displayDate = date ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
    const price = 150; // Mock price

    const [selectedTime, setSelectedTime] = useState<string>('');

    const availableTimes = [
        { time: '10:00', label: '10:00 AM - Available' },
        { time: '12:00', label: '12:00 PM - Available' },
        { time: '14:30', label: '02:30 PM - Available' },
        { time: '17:00', label: '05:00 PM - Booked Out' },
    ];

    const handleNext = () => {
        if (selectedTime) {
            // Build the booking state and navigate to the first checkout step
            const bookingState = {
                experienceId,
                experienceName,
                selectedDate: date,
                selectedTime,
                totalPrice: price,
            };

            // We pass the full state object to the next page
            navigate('/checkout', { state: bookingState });
        } else {
            alert('Please select an available time.');
        }
    };

    return (
        <PageContainer title="Select Time">
            <p className="text-gray-600 mb-2">Booking for: <span className="font-semibold text-indigo-600">{experienceName}</span></p>
            <p className="text-gray-600 mb-4">On: <span className="font-semibold text-indigo-600">{displayDate}</span></p>

            <div className="space-y-3 mb-6">
                {availableTimes.map((t) => (
                    <button
                        key={t.time}
                        disabled={t.label.includes('Booked Out')}
                        className={`w-full text-left p-3 border rounded-lg transition duration-150 ${selectedTime === t.time
                            ? 'bg-indigo-600 text-white shadow-md border-indigo-700'
                            : 'bg-gray-50 text-gray-800 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                        onClick={() => setSelectedTime(t.time)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="mb-6 p-3 bg-green-50 border-l-4 border-green-500 text-green-800">
                <p className="font-medium">Total Price: ${price}.00</p>
            </div>

            <button
                onClick={handleNext}
                disabled={!selectedTime}
                className="w-full px-4 py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 disabled:bg-gray-400 transition"
            >
                Proceed to Checkout
            </button>
        </PageContainer>
    );
};

export default SelectTimePage;