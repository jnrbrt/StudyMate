import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';

const NoteDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Route param az id-hoz

    const [note, setNote] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`/api/notes/${id}`, {
                    headers: { "x-auth-token": token }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || "Hiba a jegyzet lekérésekor");
                setNote(data);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        };
        fetchNote();
    }, [id]);

    const handleSelect = (index, option) => {
        setSelectedAnswers({ ...selectedAnswers, [index]: option });
    };

    if (!note) return <p>Betöltés...</p>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            <Header logout={handleLogout} />

            <main className="flex-grow p-6 overflow-auto">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Jegyzet összefoglaló */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">{note.title}</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {note.summary}
                        </p>
                    </div>

                    {/* Kvíz */}
                    {note.quizQuestions && note.quizQuestions.length > 0 && (
                        <div className="bg-white p-8 rounded-2xl border border-gray-200">
                            <div className="flex items-center space-x-3 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">Kvíz</h2>
                            </div>

                            <div className="space-y-10">
                                {note.quizQuestions.map((item, index) => (
                                    <div key={index}>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 ml-1">
                                            <span className="text-orange-500 mr-2">{index + 1}.</span>
                                            {item.question}
                                        </h3>

                                        <div className="space-y-3">
                                            {item.options.map((option, optIndex) => {
                                                const isSelected = selectedAnswers[index] === option;
                                                return (
                                                    <div
                                                        key={optIndex}
                                                        onClick={() => handleSelect(index, option)}
                                                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                                                            isSelected
                                                                ? "bg-orange-50 border-orange-500"
                                                                : "border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200"
                                                        }`}
                                                    >
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                                                            isSelected ? "border-orange-500" : "border-gray-300"
                                                        }`}>
                                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                                        </div>
                                                        <span className="font-medium text-gray-700">{option}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NoteDetailPage;
