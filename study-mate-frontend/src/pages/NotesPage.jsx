import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { FiArrowRight, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const NotesPage = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleDelete = (id) => {
        //itt majd a törlést hivni kell
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
    };

    useEffect(() => {

        // itt majd kell a rendes adatok betöltése
        const mockNotes = [
            { _id: '1', title: 'II. világháború', createdAt: '2025-11-16T10:00:00Z' },
            { _id: '2', title: 'Mesterséges Intelligencia alapjai', createdAt: '2025-11-01T14:30:00Z' },
            { _id: '3', title: 'JavaScript React Hookok', createdAt: '2025-10-31T09:15:00Z' },
        ];
        setNotes(mockNotes);
    }, []);

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

                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100 flex-shrink-0 cursor-pointer"
                                        title="Törlés"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>

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