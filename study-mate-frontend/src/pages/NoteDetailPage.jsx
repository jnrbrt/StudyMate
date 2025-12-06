import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FiCheck, FiX, FiEye, FiEyeOff, FiRefreshCw } from 'react-icons/fi'; // FiRefreshCw hozzáadva
import { useNavigate, useParams } from 'react-router-dom';

const NoteDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [note, setNote] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showSummary, setShowSummary] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const getCorrectText = (question) => {
        const ans = question.correctAnswer ? question.correctAnswer.trim() : "";

        if (ans === 'A' && question.options.length > 0) return question.options[0];
        if (ans === 'B' && question.options.length > 1) return question.options[1];
        if (ans === 'C' && question.options.length > 2) return question.options[2];
        if (ans === 'D' && question.options.length > 3) return question.options[3];

        return ans;
    };

    const handleSelect = (index, option) => {
        if (isSubmitted) return;
        setSelectedAnswers({ ...selectedAnswers, [index]: option });
    };

    const handleSubmitQuiz = async () => {
        if (Object.keys(selectedAnswers).length < note.quizQuestions.length) {
            return;
        }

        setSubmitting(true);
        let correctCount = 0;

        const answersPayload = note.quizQuestions.map((q, index) => {
            const selected = selectedAnswers[index];
            const actualCorrectAnswer = getCorrectText(q);
            const isCorrect = selected === actualCorrectAnswer;

            if (isCorrect) correctCount++;

            return {
                questionId: q._id || index.toString(),
                selectedAnswer: selected || ""
            };
        });

        const calculatedScore = Math.round((correctCount / note.quizQuestions.length) * 100);
        setScore(calculatedScore);

        try {
            const token = localStorage.getItem("token");
            await fetch(`/api/quiz/${note._id}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                },
                body: JSON.stringify({
                    score: calculatedScore,
                    answers: answersPayload
                })
            });
            setIsSubmitted(true);
            setShowSummary(true);
        } catch (err) {
            console.error("Hiba a mentéskor:", err);
            setIsSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    };

    const getOptionStyle = (qIndex, option) => {
        const question = note.quizQuestions[qIndex];
        const actualCorrectAnswer = getCorrectText(question);

        const isSelected = selectedAnswers[qIndex] === option;
        const isCorrectAnswer = option === actualCorrectAnswer;

        if (!isSubmitted) {
            return isSelected
                ? "border-orange-500"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100";
        }

        if (isCorrectAnswer) {
            return "border-green-500";
        }

        if (isSelected && !isCorrectAnswer) {
            return "border-red-500";
        }

        return "opacity-10";
    };

    if (!note) return <p className="p-6 text-center text-gray-500">Betöltés...</p>;

    const allAnswered = note.quizQuestions ? Object.keys(selectedAnswers).length === note.quizQuestions.length : false;

    const handleGenerateNewQuestions = () => {
        //majd uj kerdes generalas ide jöjjön, gomb van hozzá
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
            <Header logout={handleLogout} />

            <main className="flex-grow p-6 overflow-auto">
                <div className="max-w-3xl mx-auto space-y-8">

                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">{note.title}</h2>

                            <button
                                onClick={() => setShowSummary(!showSummary)}
                                className="px-2 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-bold rounded-lg cursor-pointer"
                            >
                                {showSummary ? "Jegyzet elrejtése" : "Jegyzet megjelenítése"}
                            </button>
                        </div>

                        {showSummary && (
                            <p className="text-gray-600 leading-relaxed text-lg animate-fadeIn">
                                {note.summary}
                            </p>
                        )}
                    </div>

                    {note.quizQuestions && note.quizQuestions.length > 0 && (
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-800">Kvíz</h2>
                            </div>

                            <div className="space-y-10">
                                {note.quizQuestions.map((item, index) => (
                                    <div key={index}>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 ml-1 flex items-start">
                                            <span className="text-orange-500 mr-2">{index + 1}.</span>
                                            {item.question}
                                        </h3>

                                        <div className="space-y-3">
                                            {item.options.map((option, optIndex) => {
                                                const styleClass = getOptionStyle(index, option);

                                                const actualCorrectAnswer = getCorrectText(item);
                                                const isCorrectAnswer = option === actualCorrectAnswer;
                                                const isSelected = selectedAnswers[index] === option;

                                                return (
                                                    <div
                                                        key={optIndex}
                                                        onClick={() => handleSelect(index, option)}
                                                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${styleClass}`}
                                                    >
                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0
                                                            ${
                                                            isSubmitted && isCorrectAnswer ? "border-green-600 bg-green-600 text-white" :
                                                                isSubmitted && isSelected && !isCorrectAnswer ? "border-red-500 bg-red-500 text-white" :
                                                                    isSelected ? "border-orange-500" : "border-gray-300"
                                                        }`}
                                                        >
                                                            {isSubmitted && isCorrectAnswer ? <FiCheck size={14} /> :
                                                                isSubmitted && isSelected && !isCorrectAnswer ? <FiX size={14} /> :
                                                                    isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                                                            }
                                                        </div>
                                                        <span className="font-medium">{option}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
                                {!isSubmitted ? (
                                    <div className="w-full flex flex-col items-end gap-2">
                                        <button
                                            onClick={handleSubmitQuiz}
                                            disabled={!allAnswered || submitting}
                                            className={`px-8 py-3 font-bold rounded-xl transition-all shadow-lg 
                                                ${allAnswered
                                                ? "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200 cursor-pointer"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                            }`}
                                        >
                                            {submitting ? "Kiértékelés..." : "Kvíz Kiértékelése"}
                                        </button>

                                        {!allAnswered}
                                    </div>
                                ) : (
                                    <div className="text-center w-full bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            A kvíz eredménye:
                                        </h3>
                                        <div className="text-4xl font-extrabold text-orange-600 my-4">
                                            {score}%
                                        </div>

                                        <button
                                            onClick={handleGenerateNewQuestions}
                                            className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto cursor-pointer"
                                        >
                                            <FiRefreshCw /> Újabb kérdések generálása
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NoteDetailPage;