import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';

const Quiz = ({ noteId, questions, initialCount = 5, questionsPerBatch = 3 }) => {
    const [displayedQuestions, setDisplayedQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
    const [score, setScore] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [totalCorrect, setTotalCorrect] = useState(0);

    // Betöltjük az első batch-et
    useEffect(() => {
        if (questions && questions.length > 0) {
            const firstBatch = questions.slice(0, initialCount);
            setDisplayedQuestions(firstBatch);
        }
    }, [questions, initialCount]);

    const getCorrectText = (question) => {
        const ans = question.correctAnswer ? question.correctAnswer.trim() : "";
        if (ans === 'A' && question.options.length > 0) return question.options[0];
        if (ans === 'B' && question.options.length > 1) return question.options[1];
        if (ans === 'C' && question.options.length > 2) return question.options[2];
        if (ans === 'D' && question.options.length > 3) return question.options[3];
        return ans;
    };

    const handleSelect = (index, option) => {
        if (submittedQuestions.has(index)) return;
        setSelectedAnswers({ ...selectedAnswers, [index]: option });
    };

    const handleSubmitQuiz = async () => {
        const currentBatch = displayedQuestions
            .map((q, i) => ({ q, i }))
            .filter(({ i }) => !submittedQuestions.has(i));

        if (currentBatch.length === 0) return; // nincs új kérdés -> ne értékeljünk

        const unansweredIndices = currentBatch.map(({ i }) => i)
            .filter(i => !selectedAnswers[i]);
        if (unansweredIndices.length > 0) return; // válaszolj minden új kérdésre

        setSubmitting(true);

        let correctCount = 0;
        currentBatch.forEach(({ q, i }) => {
            const selected = selectedAnswers[i];
            const correct = getCorrectText(q);
            if (selected === correct) correctCount++;
        });

        // Frissítjük az összesített eredményt
        const newTotalCorrect = totalCorrect + correctCount;
        const newTotalQuestions = submittedQuestions.size + currentBatch.length;
        const calculatedScore = Math.round((newTotalCorrect / newTotalQuestions) * 100);

        setTotalCorrect(newTotalCorrect);
        setScore(calculatedScore);

        try {
            const token = localStorage.getItem("token");
            const answersPayload = currentBatch.map(({ q, i }) => ({
                questionId: q._id || i.toString(),
                selectedAnswer: selectedAnswers[i] || ""
            }));

            await fetch(`/api/quiz/${noteId}/submit`, {
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

            // Jelöljük ki az értékelt kérdéseket
            setSubmittedQuestions(prev => new Set([...prev, ...currentBatch.map(c => c.i)]));
        } catch (err) {
            console.error("Hiba a mentéskor:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleNextQuestions = () => {
        const currentLength = displayedQuestions.length;
        const nextBatch = questions.slice(currentLength, currentLength + questionsPerBatch);
        if (nextBatch.length === 0) return;

        setDisplayedQuestions(prev => [...prev, ...nextBatch]);
    };

    const getOptionStyle = (qIndex, option) => {
        const question = displayedQuestions[qIndex];
        const correctAnswer = getCorrectText(question);
        const isSelected = selectedAnswers[qIndex] === option;
        const isSubmitted = submittedQuestions.has(qIndex);

        if (!isSubmitted) {
            return isSelected
                ? "border-orange-500"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100";
        }

        if (isSubmitted) {
            if (option === correctAnswer) return "border-green-500";
            if (isSelected && option !== correctAnswer) return "border-red-500";
        }

        return "opacity-50";
    };

    const allAnsweredCurrentBatch = displayedQuestions
        .map((_, i) => i)
        .filter(i => !submittedQuestions.has(i))
        .every(i => selectedAnswers[i]);

    if (!questions || questions.length === 0) return null;

    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Kvíz</h2>
            </div>

            <div className="space-y-10">
                {displayedQuestions.map((item, index) => (
                    <div key={index}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 ml-1 flex items-start">
                            <span className="text-orange-500 mr-2">{index + 1}.</span>
                            {item.question}
                        </h3>

                        <div className="space-y-3">
                            {item.options.map((option, optIndex) => {
                                const styleClass = getOptionStyle(index, option);
                                const correctAnswer = getCorrectText(item);
                                const isSelected = selectedAnswers[index] === option;
                                const isSubmitted = submittedQuestions.has(index);

                                return (
                                    <div
                                        key={optIndex}
                                        onClick={() => handleSelect(index, option)}
                                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${styleClass}`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0
                                                ${isSubmitted && option === correctAnswer
                                                    ? "border-green-600 bg-green-600 text-white"
                                                    : isSubmitted && isSelected && option !== correctAnswer
                                                    ? "border-red-500 bg-red-500 text-white"
                                                    : isSelected
                                                    ? "border-orange-500"
                                                    : "border-gray-300"
                                                }`}
                                        >
                                            {isSubmitted && option === correctAnswer
                                                ? <FiCheck size={14} />
                                                : isSubmitted && isSelected && option !== correctAnswer
                                                    ? <FiX size={14} />
                                                    : isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
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
                <div className="w-full flex flex-col items-end gap-2">
                    <button
                        onClick={handleSubmitQuiz}
                        disabled={!allAnsweredCurrentBatch || submitting}
                        className={`px-8 py-3 font-bold rounded-xl transition-all shadow-lg
                            ${allAnsweredCurrentBatch
                                ? "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200 cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                            }`}
                    >
                        {submitting ? "Kiértékelés..." : "Kvíz Kiértékelése"}
                    </button>
                    {!allAnsweredCurrentBatch && <span className="text-sm text-gray-400">Válaszolj minden új kérdésre a kiértékeléshez</span>}
                </div>

                {/* Összesített eredmény */}
                {score !== null && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-lg font-semibold text-center">
                        Helyes válaszok: {totalCorrect} / {submittedQuestions.size} ({score}%)
                    </div>
                )}

                {displayedQuestions.length < questions.length && (
                    <button
                        onClick={handleNextQuestions}
                        className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <FiRefreshCw /> Újabb kérdések generálása
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quiz;
