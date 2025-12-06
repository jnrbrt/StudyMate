import React, { useState } from 'react';
import Header from '../components/Header';
import { FiUpload, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();

    const [topic, setTopic] = useState("");
    const [questionCount, setQuestionCount] = useState(5);
    const [summaryLength, setSummaryLength] = useState("short");
    const [isQuizEnabled, setIsQuizEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleGenerate = async () => {
        if (!topic.trim()) {
            alert("Kérlek adj meg egy témát!");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const aiRes = await fetch("/api/ai/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                },
                body: JSON.stringify({
                    content: topic,
                    summaryLength
                })
            });

            const newNote = await aiRes.json();
            if (!aiRes.ok) throw new Error(newNote.msg || "Hiba a jegyzet generálás során");

            if (isQuizEnabled) {
                const quizRes = await fetch("/api/ai/quiz", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-auth-token": token
                    },
                    body: JSON.stringify({
                        noteId: newNote._id,
                        questionCount
                    })
                });

                if (!quizRes.ok) {
                    const errData = await quizRes.json();
                    console.error("Hiba a kvíz generálás során:", errData);
                }
            }

            navigate(`/notes/${newNote._id}`);

        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 relative">
            <Header logout={handleLogout} />

            {loading && (
                <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-all">
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-bold text-gray-800">StudyMate jegyzet generálása folyamatban...</h2>
                    <p className="text-sm mt-1">Ez eltarthat pár másodpercig.</p>
                </div>
            )}

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-6xl font-bold text-orange-600 mb-2">Üdvözöl a StudyMate</h1>
                        <p className="text-gray-600">Az AI alapú tanulótársad.</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Téma vagy szöveg</label>
                            <textarea
                                rows="3"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Miről szeretnél tanulni? Írd le, vagy másolj be egy szövegrészletet..."
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-orange-500 resize-none transition-colors"
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-all">
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <FiUpload />
                                    <span>PDF feltöltése (Hamarosan)</span>
                                </div>
                                <input type="file" className="hidden" disabled />
                            </label>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center space-x-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={isQuizEnabled}
                                        onChange={(e) => setIsQuizEnabled(e.target.checked)}
                                        className="accent-orange-600 w-4 h-4 cursor-pointer"
                                    />
                                    <span className="text-gray-700 text-sm font-medium">Kvízt is kérek</span>
                                </label>

                                <select
                                    value={summaryLength}
                                    onChange={(e) => setSummaryLength(e.target.value)}
                                    className="border border-gray-300 text-gray-700 text-sm rounded p-1.5 focus:outline-none focus:border-orange-500 cursor-pointer bg-white"
                                >
                                    <option value="short">Rövid</option>
                                    <option value="medium">Közepes</option>
                                    <option value="long">Hosszú</option>
                                </select>

                                {isQuizEnabled && (
                                    <select
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(e.target.value)}
                                        className="border border-gray-300 text-gray-700 text-sm rounded p-1.5 focus:outline-none focus:border-orange-500 cursor-pointer bg-white"
                                    >
                                        <option value="3">3 kérdés</option>
                                        <option value="5">5 kérdés</option>
                                        <option value="10">10 kérdés</option>
                                    </select>
                                )}
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="flex items-center px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded cursor-pointer disabled:opacity-50 transition-colors shadow-sm hover:shadow-md"
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