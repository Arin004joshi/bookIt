import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { fetchExperienceById, type IExperience } from '../api/experienceService';

// --- NEW INTERFACES FOR SLOTS ---

interface SlotDetail {
    date: string; // The full ISO date string (e.g., "2025-10-31T18:30:00.000+00:00")
    startTime: string; // e.g., "16:00"
    endTime: string; // e.g., "18:00"
    capacity: number;
    availableSeats: number;
    isSoldOut: boolean;
    _id: string; // This is the Slot ID we need!
}

// Extend IExperience to include the slots array
interface ExperienceWithSlots extends IExperience {
    slots: SlotDetail[];
}

interface BookingState {
    experienceId: string;
    experienceName: string;
    selectedDate: string; // YYYY-MM-DD
    selectedTime: string; // e.g., "16:00"
    totalPrice: number;
    experience: ExperienceWithSlots;
    slotId: string; // The unique ID of the selected slot
}

// --- Component to display Experience Info and the 'Confirm Box' ---
interface BookingSummaryProps {
    experience: ExperienceWithSlots;
    selectedDate: Date | null;
    selectedTime: string;
    selectedSlotId: string | null; // Pass the ID to enable the button
    onConfirm: () => void;
    isConfirmDisabled: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ experience, selectedDate, selectedTime, selectedSlotId, onConfirm, isConfirmDisabled }) => {
    const displayDate = selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'N/A';
    const displayTime = selectedTime || 'N/A';
    const isReady = !!selectedDate && !!selectedTime && !!selectedSlotId;

    const buttonClass = isConfirmDisabled || !isReady
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-green-600 hover:bg-green-700';

    return (
        <div className="space-y-4 sticky top-4">
            {/* ... Experience Image and Details (No Change) ... */}
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-full h-40 mb-3">
                    <img
                        src={experience.imageUrl || 'https://via.placeholder.com/400x160?text=Experience+Image'}
                        alt={experience.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x160?text=Experience+Image' }}
                    />
                </div>
                <h4 className="text-lg font-bold text-gray-900">{experience.title}</h4>
                <p className="text-sm text-gray-500">{experience.location}</p>
            </div>

            {/* Confirm Box */}
            <div className="p-4 border border-indigo-300 rounded-lg bg-indigo-50 shadow-inner">
                <h4 className="text-xl font-bold mb-3 text-indigo-800">Booking Summary</h4>
                <p className="text-gray-700">Date: <span className="font-semibold">{displayDate}</span></p>
                <p className="text-gray-700 mb-4">Time: <span className="font-semibold">{displayTime}</span></p>

                <div className="flex justify-between items-center border-t border-indigo-200 pt-3">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-xl font-bold text-green-600">${experience.price?.toFixed(2) || '0.00'}</span>
                </div>

                <button
                    onClick={onConfirm}
                    disabled={isConfirmDisabled || !isReady} // Disable if slotId is missing
                    className={`mt-4 w-full px-4 py-3 text-white font-semibold rounded-lg shadow-lg transition ${buttonClass}`}
                >
                    {isReady ? 'Confirm & Proceed to Checkout' : 'Select Date and Time'}
                </button>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const SelectDatePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const experienceId = query.get('experienceId');

    const [experience, setExperience] = useState<ExperienceWithSlots | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null); // State for the slot's _id

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Fetch Experience Details (Assumes the backend returns slots within the experience object)
    useEffect(() => {
        if (!experienceId) {
            setError('Error: No experience ID provided.');
            setLoading(false);
            return;
        }

        const getExperience = async () => {
            try {
                // Cast the response to the type that includes slots
                const data = await fetchExperienceById(experienceId) as ExperienceWithSlots;
                setExperience(data);
            } catch (err) {
                setError('Failed to fetch experience details.');
            } finally {
                setLoading(false);
            }
        };
        getExperience();
    }, [experienceId]);


    // 2. Filter Slots based on Selected Date
    const availableSlotsForDate = useMemo(() => {
        if (!experience || !selectedDate) return [];

        // Format the selected date to YYYY-MM-DD for comparison
        const dateString = selectedDate.toISOString().split('T')[0];

        return experience.slots.filter(slot => {
            // Check if the slot date (which is a full ISO string) matches the selected date
            const slotDateString = new Date(slot.date).toISOString().split('T')[0];
            return slotDateString === dateString && slot.availableSeats > 0;
        });
    }, [experience, selectedDate]);


    // 3. Handle Time Selection and Capture Slot ID
    const handleTimeSelect = (time: string) => {
        // Find the full slot object based on the selected time (startTime)
        const selectedSlot = availableSlotsForDate.find(slot => slot.startTime === time);

        if (selectedSlot) {
            setSelectedTime(time);
            setSelectedSlotId(selectedSlot._id); // ✨ CRITICAL FIX: Capture the actual slot _id
        } else {
            // This should not happen if the UI only displays valid times
            alert('Selected slot is invalid or unavailable.');
            setSelectedTime('');
            setSelectedSlotId(null);
        }
    };


    // 4. Handle Final Confirmation and Navigation (Passing slotId)
    const handleConfirmBooking = () => {
        if (selectedDate && selectedTime && selectedSlotId && experience) {

            // Note: The slot is already guaranteed to be available because of the filtering logic

            const bookingState: BookingState = {
                experienceId: experience._id,
                experienceName: experience.title,
                selectedDate: selectedDate.toISOString().split('T')[0],
                selectedTime,
                totalPrice: experience.price,
                experience: experience,
                slotId: selectedSlotId, // ✨ The valid slotId is passed here
            };

            // Redirect to the checkout page with the valid slotId in state
            navigate('/checkout/details', { state: bookingState });
        } else {
            alert('Please select a date and time to continue.');
        }
    };

    // --- Render Logic ---
    if (loading) {
        return <p className="text-center p-8">Fetching experience details...</p>;
    }
    if (error || !experience) {
        return <p className="text-red-500 p-8">{error || "Experience not found."}</p>;
    }

    // Determine unique dates available to highlight them in the date picker (optional)
    const availableDates = experience.slots
        .filter(slot => slot.availableSeats > 0)
        .map(slot => new Date(slot.date));


    return (
        <div className="p-4 sm:p-6 bg-white shadow-xl rounded-xl mx-auto my-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700 border-b pb-2">{`Book: ${experience.title}`}</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Booking Summary) */}
                <div className="lg:col-span-1">
                    <BookingSummary
                        experience={experience}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        selectedSlotId={selectedSlotId}
                        onConfirm={handleConfirmBooking}
                        isConfirmDisabled={!selectedDate || !selectedTime || !selectedSlotId}
                    />
                </div>

                {/* Right Column (Calendar and Time Slots) */}
                <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">1. Choose Date</h3>

                    {/* Date Picker (Calendar UI) */}
                    <div className="flex justify-center mb-8">
                        <DatePicker
                            selected={selectedDate}
                            // Reset time and slotId when date changes
                            onChange={(date: Date | null) => { setSelectedDate(date); setSelectedTime(''); setSelectedSlotId(null); }}
                            inline
                            minDate={today}
                            // Highlight dates that have available slots
                            highlightDates={availableDates}
                            className="p-3 border rounded-lg w-full text-center text-gray-800"
                        />
                    </div>

                    {/* Time Slot Picker */}
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 mt-6">2. Choose Time</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {!selectedDate && (
                            <p className="text-gray-500 italic col-span-4">Please select a date first to see available times.</p>
                        )}
                        {selectedDate && availableSlotsForDate.length === 0 && (
                            <p className="text-red-600 italic col-span-4 font-medium">No available slots for this date.</p>
                        )}

                        {/* Render buttons for available slots */}
                        {selectedDate && availableSlotsForDate.map((slot) => (
                            <button
                                key={slot._id}
                                onClick={() => handleTimeSelect(slot.startTime)}
                                disabled={slot.availableSeats <= 0}
                                className={`p-3 border rounded-lg transition duration-150 text-sm font-medium 
                                    ${selectedTime === slot.startTime
                                        ? 'bg-indigo-600 text-white shadow-md border-indigo-700'
                                        : 'bg-white text-gray-800 hover:bg-indigo-100 disabled:bg-gray-200 disabled:text-gray-500'
                                    }`}
                            >
                                {slot.startTime}
                                <span className="text-xs opacity-75 block">({slot.availableSeats} left)</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SelectDatePage;