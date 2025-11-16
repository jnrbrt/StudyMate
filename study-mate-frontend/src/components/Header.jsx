import React, { useState } from 'react';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = ({ logout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        logout();
    };

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
            <h1 className="text-2xl font-bold text-orange-600">
                <Link to="/home" onClick={() => setIsDropdownOpen(false)}>
                    StudyMate AI
                </Link>
            </h1>

            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 rounded-full hover:bg-gray-200 cursor-pointer">
                    <FiUser className="w-6 h-6 text-gray-700"/>
                </button>

                {isDropdownOpen && (
                    <div
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                    >
                        <Link
                            to="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                            <FiUser className="w-5 h-5 mr-2 text-gray-600" /> Profil
                        </Link>

                        <button
                            onClick={handleLogoutClick}
                            className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 cursor-pointer">
                            <FiLogOut className="w-5 h-5 mr-2" /> Kijelentkezés
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;