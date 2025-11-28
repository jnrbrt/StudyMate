import React from 'react';
import { FiLogOut} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = ({ logout }) => {
    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-orange-600">
                    <Link to="/home">
                        StudyMate AI
                    </Link>
                </h1>
            </div>

            <div className="flex items-center gap-4">

                <Link
                    to="/home"
                    className="flex items-center px-4 py-2 text-bg font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 cursor-pointer"
                >
                    Új jegyzet
                </Link>

                <Link
                    to="/notes"
                    className="flex items-center px-4 py-2 text-bg font-medium bg-gray-50 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                    Jegyzetek
                </Link>

                <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-bg font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer"
                >
                    Kijelentkezés
                </button>
            </div>
        </header>
    );
};

export default Header;