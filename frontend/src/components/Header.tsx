import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        // Removed max-w-6xl mx-auto here. Use bg-white and shadow-md on the header element.
        <header className="w-full p-4 bg-white shadow-lg sticky top-0 z-10">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-8">
                {/* 🏡 Logo and Title Section */}
                <Link to="/" className="flex items-center space-x-2 text-indigo-700 hover:text-indigo-900 transition flex-shrink-0">
                    {/* Placeholder for your actual logo image */}
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        <img src="https://www.highwaydelite.com/assets/logo2-B7c2KXHT.webp" alt="logo" />
                    </div>
                    <span className="text-3xl font-extrabold tracking-tight">BookIt</span>
                </Link>

                {/* 🔍 Search Bar Section (Constrained within the max-width of the header content div) */}
                <form onSubmit={handleSearch} className="flex flex-grow max-w-md w-full">
                    <input
                        type="text"
                        placeholder="Search experiences by location or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-3 bg-indigo-500 text-white font-semibold rounded-r-lg shadow-md hover:bg-indigo-600 transition disabled:opacity-50"
                        disabled={!searchTerm.trim()}
                    >
                        Search
                    </button>
                </form>

                {/* 🛒 User/Checkout Section */}
                <div className="flex items-center space-x-4 flex-shrink-0">
                    <Link to="/checkout" className="text-gray-500 hover:text-indigo-700 transition">
                        Checkout
                    </Link>
                    <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white font-medium cursor-pointer hover:shadow-lg transition">
                        JP
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;