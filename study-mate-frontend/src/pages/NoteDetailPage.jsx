import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Quiz from '../components/Quiz';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const NoteDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [note, setNote] = useState(null);
    const [showSummary, setShowSummary] = useState(true);

    const location = useLocation();
    const questionCount = location.state?.questionCount || 5;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const token = localStorage.getItem("token");

                const noteRes = await fetch(`/api/notes/${id}`, {
                    headers: { "x-auth-token": token }
                });
                const noteData = await noteRes.json();
                if (!noteRes.ok) throw new Error(noteData.msg || "Hiba a jegyzet lekérésekor");

                setNote(noteData);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        };
        fetchNote();
    }, [id]);


    const handleGenerateNewQuestions = async () => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/ai/quiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": token
            },
            body: JSON.stringify({
                noteId: note._id,
                questionCount: 3 // vagy később felhasználó által választható
            })
        });

        const data = await res.json();
        if (!res.ok) {
            alert(data.msg || "Nem sikerült új kérdéseket generálni.");
            return;
        }

        // Új kérdések hozzácsatolása a meglévőhöz
        setNote(prev => ({
            ...prev,
            quizQuestions: [...prev.quizQuestions, ...data.quizQuestions]
        }));

    } catch (err) {
        console.error("Hiba új kérdések generálásakor:", err);
        alert("Server error");
    }
};

    if (!note) return <p className="p-6 text-center text-gray-500">Betöltés...</p>;

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
                        <Quiz
                            noteId={note._id}
                            questions={note.quizQuestions}
                            initialCount={questionCount}
                            onGenerateNew={handleGenerateNewQuestions}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default NoteDetailPage;