import Header from '../components/Header';
import { FiUpload, FiArrowRight, FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const previousStudies = [
        { id: 1, title: 'II. világháború', date: '2025. 11. 16.' },
        { id: 2, title: 'MI vs AI', date: '2025. 11. 01.' },
        { id: 3, title: 'A Föld lapos', date: '2025. 10. 31.' },
        { id: 4, title: 'Test', date: '2025. 10. 29.' },
    ];

    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-900">
            <div className="flex flex-col h-screen">
                <Header logout={handleLogout} />

                <main className="flex-grow p-6 overflow-auto">
                    <div className="max-w-4xl mx-auto space-y-8">

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Új jegyzet</h2>

                            <textarea
                                rows="3"
                                placeholder="Írj be egy témát... (pl. 'A francia forradalom okai')"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            ></textarea>

                            <div className="mt-4 flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex items-center space-x-2 text-gray-500">
                                        <FiUpload className="w-5 h-5" />
                                        <span>vagy tölts fel egy PDF-et</span>
                                    </div>
                                    <input type="file" className="hidden" />
                                </label>
                            </div>

                            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="generateQuiz" className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"/>
                                    <label htmlFor="generateQuiz" className="text-sm font-medium text-gray-700">Kvízt is kérek</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <label htmlFor="questionCount" className="text-sm font-medium text-gray-700">Kérdések száma:</label>
                                    <select id="questionCount" className="border border-gray-300 rounded-md p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer">
                                        <option>3</option>
                                        <option>5</option>
                                        <option>10</option>
                                    </select>
                                </div>
                                <button className="flex items-center px-6 py-2 font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer">
                                    <FiPlus className="mr-2" /> Jegyzet generálás
                                </button>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Előző jegyzetek</h2>
                            <div className="space-y-3">
                                {previousStudies.map(study => (
                                    <Link
                                        key={study.id}
                                        to={`/notes/${study.id}`}
                                        className="block bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex items-center justify-between"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{study.title}</h3>
                                            <p className="text-sm text-gray-500">{study.date}</p>
                                        </div>
                                        <FiArrowRight className="w-5 h-5 text-gray-400" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainPage;
