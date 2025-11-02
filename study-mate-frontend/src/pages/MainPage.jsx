import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { FiSend, FiPlus } from 'react-icons/fi';

const MainPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-900">
            <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />

            <div
                className={`flex flex-col h-screen
                    transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'ml-64' : 'ml-20'}`}
            >
                <Header />

                <main className="flex-grow overflow-auto p-4 space-y-4">
                    {/* teszt kinézet */}
                    <div className="p-4 bg-orange-100 rounded-lg max-w-xl">
                        <p>Üdvözöllek a StudyMate AI-ban! Tölts fel egy jegyzetet, vagy tegyél fel egy kérdést.</p>
                    </div>
                    <div className="flex justify-end">
                        <div className="p-4 bg-gray-200 rounded-lg max-w-xl">
                            <p>Szia! Készíts egy 100 szavas beadandót a 3. világháborúról!</p>
                        </div>
                    </div>
                </main>

                {/* input sáv */}
                <footer className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center max-w-3xl mx-auto space-x-2">
                        <button className="p-2 rounded-full hover:bg-gray-200">
                            <FiPlus className="w-5 h-5 text-orange-600 cursor-pointer" />
                        </button>
                        <input
                            type="text"
                            placeholder="Kérdezz bármit, vagy tölts fel egy fájlt..."
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            className="p-2 rounded-full text-white bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600 cursor-pointer"
                        >
                            <FiSend className="w-5 h-5" />
                        </button>
                    </div>
                </footer>

            </div>
        </div>
    );
};

export default MainPage;