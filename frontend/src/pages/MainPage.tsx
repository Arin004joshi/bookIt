import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchExperiences, type IExperience } from '../api/experienceService';
import { Link } from 'react-router-dom';

// NOTE: Removed the redundant Layout component as App.tsx now handles the layout wrapping.
// If you want to keep your internal Layout, merge the logic from the one in App.tsx.

// Component for an individual experience card (Kept the same for consistency)
interface ExperienceCardProps {
    exp: IExperience;
    onBook: (id: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ exp, onBook }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-[1.02]">

            {/* Image - Consistent Size and Aspect Ratio */}
            <div className="w-full h-48">
                <img
                    src={exp.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={exp.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                />
            </div>

            {/* Details and Button */}
            <div className="p-4 flex flex-col justify-between h-auto">
                <div className="mb-3">
                    <h4 className="text-xl font-bold text-gray-900 truncate">{exp.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{exp.description}</p>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>📍 {exp.location}</span>
                        <span>⏳ {exp.duration}</span>
                    </div>

                    <button
                        onClick={() => onBook(exp._id)}
                        className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
                    >
                        Book Now (${exp.price.toFixed(2)})
                    </button>
                </div>
            </div>
        </div>
    );
}


const MainPage: React.FC = () => {
    const [experiences, setExperiences] = useState<IExperience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch experiences when the component mounts
    useEffect(() => {
        const getExperiences = async () => {
            try {
                // Ensure this service is correctly implemented to fetch experiences
                const data = await fetchExperiences();
                setExperiences(data);
            } catch (err) {
                setError('Failed to fetch experiences. Please ensure the backend is running and connected.');
            } finally {
                setLoading(false);
            }
        };
        getExperiences();
    }, []);

    const handleBookNow = (experienceId: string) => {
        // Navigate to the next page in the flow: Select Date
        navigate(`/date?experienceId=${experienceId}`);
    };

    if (loading) {
        return (
            // Simple Loading state
            <div className="text-center p-8 text-xl text-indigo-500">Loading available experiences...</div>
        );
    }

    if (error) {
        return (
            // Simple Error state
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-bold">Connection Error:</p>
                <p>{error}</p>
                <p className="mt-2 text-sm">Check network or backend server status.</p>
            </div>
        );
    }

    return (
        // Removed the introductory search bar section and kept only the list of experiences
        <>
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Recommended for you</h2>

            {/* Experience List - Implemented as a Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.length > 0 ? (
                    experiences.map((exp) => (
                        <ExperienceCard
                            key={exp._id}
                            exp={exp}
                            onBook={handleBookNow}
                        />
                    ))
                ) : (
                    <div className="md:col-span-2 lg:col-span-3">
                        <p className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-md">No experiences are currently available for booking.</p>
                    </div>
                )}
            </div>

            {/* Optional: Add a link to the Search Page if the list is empty or the user wants to browse */}
            <div className="mt-8 text-center">
                <Link to="/search" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    → See all categories and search options
                </Link>
            </div>
        </>
    );
};

export default MainPage;
// End of MainPage.tsx