import React from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiHome, FiFileText, FiHelpCircle, FiSettings, FiUser } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggle }) => {
    return (
        <div
            className={`fixed top-0 left-0 h-full bg-white shadow-lg z-10
                  flex flex-col
                  transition-all duration-300 ease-in-out
                  ${isOpen ? 'w-64' : 'w-20'}`}
        >
            <div
                className={`flex items-center p-4 border-b h-[73px]
                    justify-start`}
            >
                <button
                    onClick={toggle}
                    className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
                >
                    <FiMenu className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            <nav
                className="flex-grow p-4 space-y-2 overflow-hidden"
            >
                <Link to="/home" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <FiHome className="mr-3 w-6 h-6 flex-shrink-0" />
                    <span className={`whitespace-nowrap transition-opacity ${!isOpen && 'opacity-0'}`}>Főoldal (Chat)</span>
                </Link>
                <Link to="/notes" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <FiFileText className="mr-3 w-6 h-6 flex-shrink-0" />
                    <span className={`whitespace-nowrap transition-opacity ${!isOpen && 'opacity-0'}`}>Jegyzetek</span>
                </Link>
                <Link to="/quizzes" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <FiHelpCircle className="mr-3 w-6 h-6 flex-shrink-0" />
                    <span className={`whitespace-nowrap transition-opacity ${!isOpen && 'opacity-0'}`}>Kvízek</span>
                </Link>
            </nav>

            <div className="p-4 border-t overflow-hidden">
                <Link to="/settings" className="flex items-center p-2 rounded-md text-gray-700 hover:bg-gray-100">
                    <FiSettings className="mr-3 w-6 h-6 flex-shrink-0" />
                    <span className={`whitespace-nowrap transition-opacity ${!isOpen && 'opacity-0'}`}>Beállítások</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;