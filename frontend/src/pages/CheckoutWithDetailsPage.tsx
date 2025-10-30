import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import type { IExperience } from '../api/experienceService';

// ... (CustomerDetails, BookingState, FinalBookingPayload, PromoValidationResponse interfaces remain the same) ...

interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
}

interface BookingState {
    experienceId: string;
    experienceName: string;
    selectedDate: string; // YYYY-MM-DD
    selectedTime: string; // e.g., "10:00 AM"
    totalPrice: number; // Base price before discount
    experience: IExperience; // Must be present
    slotId?: string;
}

interface FinalBookingPayload {
    experienceId: string;
    slotId: string;
    userFullName: string;
    userEmail: string;
    numberOfPeople: number;
    finalPrice: number;
    promoCodeApplied: boolean;
    discountAmount: number;
}


interface PromoValidationResponse {
    isValid: boolean;
    discountAmount: number;
    finalPrice: number;
    promoCode: string;
    message?: string;
}

// FIX: Updated BookingResponse to accurately reflect the response structure
interface BookingResponse {
    message: string;
    booking: { // The nested 'booking' object
        experience: any; // Relaxed type
        experienceTitle: string;
        slotId: string;
        date: any;
        startTime: string;
        userFullName: string;
        userEmail: string;
        promoCodeApplied: string | null;
        discountAmount: number;
        finalPrice: number;
        numberOfPeople: number;
        status: 'Confirmed' | 'Pending';
        bookingReference: string;
        createdAt: any;
        updatedAt: any;
    };
}

interface BookingSummaryBoxProps {
    state: BookingState;
    numberOfPeople: number;
    finalPrice: number;
    discountAmount: number;
}

const BookingSummaryBox: React.FC<BookingSummaryBoxProps> = ({ state, numberOfPeople, finalPrice, discountAmount }) => {
    const { experience, selectedDate, selectedTime, totalPrice } = state;

    const dateParts = selectedDate.split('-');
    const displayDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    return (
        <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-lg h-full sticky top-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Your Booking Summary</h3>

            {/* Experience Image and Title */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4 border border-gray-100">
                <div className="w-full h-32">
                    <img
                        src={experience.imageUrl || 'https://via.placeholder.com/300x128?text=Experience+Image'}
                        alt={experience.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x120?text=Experience+Image' }}
                    />
                </div>
                <div className="p-3">
                    <p className="text-lg font-bold text-indigo-700">{experience.title}</p>
                </div>
            </div>

            {/* Date & Time Details */}
            <div className="space-y-3 text-md text-gray-700">
                <div className="flex justify-between">
                    <span>Date & Time:</span>
                    <span className="font-semibold">{displayDate} @ {selectedTime}</span>
                </div>
                <div className="flex justify-between">
                    <span>Number of Guests:</span>
                    <span className="font-semibold">{numberOfPeople}</span>
                </div>
            </div>

            {/* Price Details */}
            <div className="pt-3 space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>Discount:</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                )}
            </div>

            {/* Total Price */}
            <div className="flex justify-between items-center border-t border-gray-300 mt-4 pt-3">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-extrabold text-green-600">${finalPrice.toFixed(2)}</span>
            </div>
        </div>
    );
};


// --- Main Checkout Component ---
const CheckoutWithDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingState = location.state as BookingState | undefined;

    const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
        name: '', email: '', phone: '',
    });
    const [policyAgreed, setPolicyAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [promoCode, setPromoCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(bookingState?.totalPrice || 0);
    const [promoError, setPromoError] = useState<string | null>(null);

    useEffect(() => {
        if (bookingState?.totalPrice) {
            setFinalPrice(bookingState.totalPrice);
        }
    }, [bookingState]);

    if (!bookingState || !bookingState.experience) {
        useEffect(() => { navigate('/', { replace: true }); }, [navigate]);
        return null;
    }

    const { experienceId, selectedDate, selectedTime, totalPrice } = bookingState;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerDetails({
            ...customerDetails,
            [e.target.name]: e.target.value,
        });
    };

    // ⭐ PROMO CODE VALIDATION LOGIC (UPDATED)
    const handleApplyPromo = async (e: React.MouseEvent) => {
        e.preventDefault();
        const code = promoCode.trim();
        if (!code) return;

        setLoading(true);
        setPromoError(null);
        setDiscountAmount(0);

        const validationPayload = {
            code: code,
            originalPrice: totalPrice, // Send the original price before discount
        };

        try {
            const response = await apiClient.post<PromoValidationResponse>('/promo/validate', validationPayload);
            const data = response.data;

            if (data.finalPrice < totalPrice) {
                setDiscountAmount(data.discountAmount);
                setFinalPrice(data.finalPrice);
                setPromoCode(data.promoCode || code);
                setPromoError(`Success! Discount of $${data.discountAmount.toFixed(2)} applied. Final price: $${data.finalPrice.toFixed(2)}`);
            } else {
                setFinalPrice(totalPrice); // Reset price to original
                setPromoError(data.message || 'The promo code is invalid or does not apply.');
            }

        } catch (err: any) {
            console.error('Promo validation failed:', err);
            const apiError = err.response?.data?.message || err.message || 'Unknown network error';
            setPromoError(`Validation failed: ${apiError}. Check backend path /v1/promo/validate.`);
            setFinalPrice(totalPrice); // Ensure final price is original price on error

        } finally {
            setLoading(false);
        }
    };

    const isFormValid = customerDetails.name.trim() !== '' &&
        customerDetails.email.trim() !== '' &&
        policyAgreed &&
        numberOfPeople > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) {
            setBookingError('Please fill in all required details and agree to the safety policy.');
            return;
        }

        setLoading(true);
        setBookingError(null);

        // Ensure slotId is present before creating payload
        if (!bookingState.slotId) {
            setBookingError("Critical error: Slot ID missing. Please restart booking.");
            setLoading(false);
            return;
        }

        const finalBookingPayload: FinalBookingPayload = {
            experienceId: experienceId,
            slotId: bookingState.slotId,
            userFullName: customerDetails.name,
            userEmail: customerDetails.email,
            numberOfPeople: numberOfPeople,
            finalPrice: finalPrice, // Correct final price, including discount
            promoCodeApplied: discountAmount > 0,
            discountAmount: discountAmount,
        };

        try {
            const response = await apiClient.post<BookingResponse>('/bookings', finalBookingPayload);

            // ⭐ CRITICAL FIX: Pass the NESTED 'booking' object directly.
            // This object contains all the necessary top-level fields (status, userEmail, etc.)
            navigate('/confirmation', {
                state: response.data.booking
            });

        } catch (err: any) {
            console.error('Booking submission failed:', err);
            const apiError = err.response?.data?.message || err.message || 'Unknown network error';
            setBookingError(`Booking failed. Server responded with: ${apiError}. 
            Please ensure your backend route POST /api/v1/bookings is correctly defined and running.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 mx-auto my-4 max-w-5xl">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700 border-b pb-2 max-w-6xl mx-auto">Complete Checkout</h2>
            <div className="bg-white p-6 rounded-xl shadow-xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ⬅️ LEFT COLUMN: Booking Summary Box (1/3 width) */}
                    <div className="lg:col-span-1">
                        <BookingSummaryBox
                            state={bookingState}
                            numberOfPeople={numberOfPeople}
                            finalPrice={finalPrice}
                            discountAmount={discountAmount}
                        />
                    </div>

                    {/* ➡️ RIGHT COLUMN: Customer Details & Confirm (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-800">Enter Details & Confirm</h3>

                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name *</label>
                            <input type="text" id="name" name="name" value={customerDetails.name} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" />
                        </div>
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                            <input type="email" id="email" name="email" value={customerDetails.email} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" />
                        </div>
                        {/* Phone Input */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                            <input type="tel" id="phone" name="phone" value={customerDetails.phone} onChange={handleChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" />
                        </div>
                        {/* Number of People Input */}
                        <div>
                            <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700">Number of Guests *</label>
                            <input type="number" id="numberOfPeople" name="numberOfPeople" value={numberOfPeople} onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 0))} required min="1" className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900" />
                        </div>

                        {/* Promo Code Input Box and Validation */}
                        <div className="pt-4 border-t border-gray-200">
                            <h4 className="text-lg font-semibold mb-2 text-gray-800">Apply Promo Code</h4>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="flex-grow p-3 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyPromo}
                                    className="px-4 py-3 bg-indigo-600 text-white font-semibold rounded-r-md shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
                                    disabled={loading || promoCode.trim().length === 0}
                                >
                                    Apply
                                </button>
                            </div>
                            {promoError && (
                                <p className={`mt-2 text-sm ${promoError.startsWith('Success') ? 'text-green-600' : 'text-red-600'}`}>
                                    {promoError}
                                </p>
                            )}
                        </div>

                        {/* 🔒 Safety Policy Checkbox and Submit Button */}
                        <div className="pt-4 border-t border-gray-200 space-y-4">
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    checked={policyAgreed}
                                    onChange={(e) => setPolicyAgreed(e.target.checked)}
                                    className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0"
                                    id="safetyPolicy"
                                />
                                <label htmlFor="safetyPolicy" className="ml-2 block text-sm text-gray-900 cursor-pointer select-none">
                                    I agree to the <Link to="/safety-policy" className="text-indigo-600 hover:text-indigo-800 font-medium underline">Safety Policy</Link> *
                                </label>
                            </div>

                            {bookingError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{bookingError}</div>}

                            <button
                                type="submit"
                                disabled={loading || !isFormValid}
                                className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                            >
                                {loading ? 'Processing Payment...' : 'Complete Booking & Pay'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutWithDetailsPage;