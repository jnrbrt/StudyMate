import React from 'react';
import { FiUser } from 'react-icons/fi';

const Header = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
            <h1 className="text-2xl font-bold text-orange-600">
                StudyMate AI
            </h1>

            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-200 cursor-pointer">
                    <FiUser className="w-6 h-6 text-gray-700" />
                </button>
            </div>
        </header>
    );
};

export default Header;