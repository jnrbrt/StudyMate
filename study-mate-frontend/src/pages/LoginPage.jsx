import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-orange-600">
                    StudyMate AI
                </h1>
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                    Bejelentkezés
                </h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Felhasználónév vagy Email</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Jelszó</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 top-6 flex items-center px-3 text-gray-500 cursor-pointer"
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
                    >
                        Bejelentkezés
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Még nincs fiókod?{' '}
                    <Link to="/register" className="font-medium text-orange-600 hover:underline">
                        Regisztrálj
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;