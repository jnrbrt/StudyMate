import React, { useState } from 'react';
import Header from '../components/Header';
import { FiFileText, FiHelpCircle, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NoteDetailPage = () => {
    const navigate = useNavigate();

    const [selectedAnswers, setSelectedAnswers] = useState({});

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    //generált kérdéseket majd hasonlóan kéne lekérni iguess
    const note = {
        title: 'II. világháború',
        summary: 'A II. világháború (1939-1945) az emberiség történetének legpusztítóbb globális konfliktusa volt. A Tengelyhatalmak (élükön Németországgal, Olaszországgal és Japánnal) és a Szövetségesek (élükön Nagy-Britanniával, Franciaországgal, a Szovjetunióval és az Egyesült Államokkal) között zajlott.',
        quizQuestions: [
            {
                question: 'Melyik esemény tekinthető a II. világháború európai kezdetének?',
                options: ['Lengyelország német inváziója', 'Pearl Harbor', 'D-Day', 'Hitler hatalomra jutása']
            },
            {
                question: 'Melyik ország NEM tartozott a Tengelyhatalmak főbb tagjai közé?',
                options: ['Szovjetunió', 'Németország', 'Olaszország', 'Japán']
            },
            {
                question: 'Melyik városra dobták le az első atombombát?',
                options: ['Hirosima', 'Nagaszaki', 'Tokió', 'Berlin']
            }
        ]
    };

    //kiértékelés gomb funkció

    //eredmény %-os kijelzése

    //újabb kérdések generálása?

    const handleSelect = (index, option) => {
        setSelectedAnswers({ ...selectedAnswers, [index]: option });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            <Header logout={handleLogout} />

            <main className="flex-grow p-6 overflow-auto">
                <div className="max-w-3xl mx-auto space-y-8">

                    <div className="bg-white p-8 rounded-2xl border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">{note.title}</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {note.summary}
                        </p>
                    </div>

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

                        <div className="mt-10 pt-6 border-t border-gray-100">
                            <button
                                className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 cursor-pointer"
                            >
                                Kiértékelés
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default NoteDetailPage;