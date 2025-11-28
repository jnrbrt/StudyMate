import React, { useState } from 'react';
import Header from '../components/Header';
import { FiUpload, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();

    const [topic, setTopic] = useState("");
    const [questionCount, setQuestionCount] = useState(5);
    const [isQuizEnabled, setIsQuizEnabled] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleGenerate = () => {
        if (!topic.trim()) {
            alert("Kérlek adj meg egy témát!");
            return;
        }

        //itt majd lehet loading-ot rakni vagy valami

        //generálás után vigyen át a generált id-ju oldalra
        navigate(`/notes/id`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
            <Header logout={handleLogout} />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">

                    <div className="text-center mb-8">
                        <h1 className="text-6xl font-bold text-orange-600 mb-2">Üdvözöl a StudyMate</h1>
                        <p className="text-gray-600">Az AI alapú tanulótársad.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Téma vagy szöveg</label>
                            <textarea
                                rows="3"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Miről szeretnél tanulni? Írd le..."
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 resize-none"
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <FiUpload />
                                    <span>PDF feltöltése</span>
                                </div>
                                <input type="file" className="hidden" />
                            </label>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">

                            <div className="flex items-center gap-4">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isQuizEnabled}
                                        onChange={(e) => setIsQuizEnabled(e.target.checked)}
                                        className="accent-orange-600 w-4 h-4"
                                    />
                                    <span className="text-gray-700 text-sm font-medium">Kvízt is kérek</span>
                                </label>

                                {isQuizEnabled && (
                                    <select
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(e.target.value)}
                                        className="border border-gray-300 text-gray-700 text-sm rounded p-1.5 focus:outline-none focus:border-orange-500 cursor-pointer"
                                    >
                                        <option value="3">3 kérdés</option>
                                        <option value="5">5 kérdés</option>
                                        <option value="10">10 kérdés</option>
                                    </select>
                                )}
                            </div>

                            <button
                                onClick={handleGenerate}
                                className="flex items-center px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded cursor-pointer"
                            >
                                <FiPlus className="mr-2" /> Jegyzet generálása
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainPage;