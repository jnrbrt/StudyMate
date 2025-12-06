import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';

const Quiz = ({ noteId, questions, onGenerateNew }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuizResults = async () => {
            try {
                const token = localStorage.getItem("token");
                const quizRes = await fetch('/api/quiz/results', {
                    headers: { "x-auth-token": token }
                });

                if (quizRes.ok) {
                    const quizData = await quizRes.json();
                    const myResult = quizData.find(r => r.noteId === noteId || r.noteId?._id === noteId);

                    if (myResult) {
                        setIsSubmitted(true);
                        setScore(myResult.score);

                        const restoredAnswers = {};
                        if (myResult.answers && Array.isArray(myResult.answers)) {
                            myResult.answers.forEach(ans => {
                                let qIndex = ans.questionId;
                                if (isNaN(qIndex)) {
                                    const foundIndex = questions.findIndex(q => q._id === ans.questionId);
                                    if (foundIndex !== -1) qIndex = foundIndex;
                                }
                                restoredAnswers[qIndex] = ans.selectedAnswer;
                            });
                        }
                        setSelectedAnswers(restoredAnswers);
                    }
                }
            } catch (err) {
                console.error("Hiba a kvíz eredmények betöltésekor:", err);
            }
        };

        if (noteId && questions.length > 0) {
            fetchQuizResults();
        }
    }, [noteId, questions]);

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
        if (Object.keys(selectedAnswers).length < questions.length) {
            return;
        }

        setSubmitting(true);
        let correctCount = 0;

        const answersPayload = questions.map((q, index) => {
            const selected = selectedAnswers[index];
            const actualCorrectAnswer = getCorrectText(q);
            const isCorrect = selected === actualCorrectAnswer;

            if (isCorrect) correctCount++;

            return {
                questionId: q._id || index.toString(),
                selectedAnswer: selected || ""
            };
        });

        const calculatedScore = Math.round((correctCount / questions.length) * 100);
        setScore(calculatedScore);

        try {
            const token = localStorage.getItem("token");
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
            setIsSubmitted(true);
        } catch (err) {
            console.error("Hiba a mentéskor:", err);
            setIsSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    };

    const getOptionStyle = (qIndex, option) => {
        const question = questions[qIndex];
        const actualCorrectAnswer = getCorrectText(question);
        const isSelected = selectedAnswers[qIndex] === option;
        const isCorrectAnswer = option === actualCorrectAnswer;

        if (!isSubmitted) {
            return isSelected
                ? "border-orange-500"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100";
        }

        if (isCorrectAnswer) return "border-green-500";
        if (isSelected && !isCorrectAnswer) return "border-red-500";

        return "opacity-50";
    };

    const allAnswered = questions ? Object.keys(selectedAnswers).length === questions.length : false;

    if (!questions || questions.length === 0) return null;

    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Kvíz</h2>
            </div>

            <div className="space-y-10">
                {questions.map((item, index) => (
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
                                            ${isSubmitted && isCorrectAnswer ? "border-green-600 bg-green-600 text-white" :
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
                        {!allAnswered && <span className="text-sm text-gray-400">Válaszolj minden kérdésre a kiértékeléshez</span>}
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
                            onClick={onGenerateNew}
                            className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto cursor-pointer"
                        >
                            <FiRefreshCw /> Újabb kérdések generálása
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Quiz;