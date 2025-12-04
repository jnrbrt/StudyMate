import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FiArrowRight, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const NotesPage = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // Jegyzetek betöltése az API-ról
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:3000/api/notes", {
                    headers: { "x-auth-token": token }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || "Hiba a jegyzetek lekérésekor");
                setNotes(data);
            } catch (err) {
                console.error(err);
                alert(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    // Jegyzet törlése
    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd a jegyzetet?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/notes/${id}`, {
                method: "DELETE",
                headers: { "x-auth-token": token }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Hiba a törlés során");
            setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    if (loading) return <p className="p-6 text-gray-600">Jegyzetek betöltése...</p>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            <Header logout={handleLogout} />

            <main className="flex-grow p-6 overflow-auto">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Előző jegyzetek</h2>

                    {notes.length === 0 ? (
                        <p className="text-gray-500">Még nincsenek jegyzeteid.</p>
                    ) : (
                        <div className="space-y-4">
                            {notes.map(note => (
                                <div key={note._id} className="flex items-center gap-3 group">

                                    {/* Törlés gomb */}
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 flex-shrink-0 cursor-pointer"
                                        title="Törlés"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>

                                    {/* Jegyzet link */}
                                    <Link
                                        to={`/notes/${note._id}`}
                                        className="flex-grow bg-white p-4 rounded border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-between"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-800">
                                                {note.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(note.createdAt).toLocaleDateString('hu-HU')}
                                            </p>
                                        </div>
                                        <FiArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                    </Link>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NotesPage;
