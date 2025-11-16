import React from 'react';
import Header from '../components/Header';
import { FiFileText, FiHelpCircle } from 'react-icons/fi';

//fake data
const studyData = {
    title: 'II. világháború',
    summary: 'A II. világháború (1939-1945) az emberiség történetének legpusztítóbb globális konfliktusa volt. A Tengelyhatalmak (élükön Németországgal, Olaszországgal és Japánnal) és a Szövetségesek (élükön Nagy-Britanniával, Franciaországgal, a Szovjetunióval és az Egyesült Államokkal) között zajlott. A háború Európában Lengyelország 1939-es német inváziójával kezdődött és Németország 1945-ös kapitulációjával ért véget. A konfliktus kulcsfontosságú eseményei közé tartozott a holokauszt, a Pearl Harbor elleni támadás, a sztálingrádi csata, a normandiai partraszállás (D-Day) és a háborút végleg lezáró atombombázások Hirosimában és Nagaszakiban.',
    quiz: [
        {
            id: 1,
            q: 'Melyik esemény tekinthető a II. világháború európai kezdetének?',
            a: [
                'Lengyelország német inváziója (1939)',
                'A Pearl Harbor elleni támadás (1941)',
                'A normandiai partraszállás (1944)',
                'Hitler hatalomra jutása (1933)'
            ]
        },
        {
            id: 2,
            q: 'Melyik ország NEM tartozott a Tengelyhatalmak főbb tagjai közé?',
            a: [
                'Szovjetunió',
                'Németország',
                'Olaszország',
                'Japán'
            ]
        },
        {
            id: 3,
            q: 'Mi volt a "D-Day" fedőneve?',
            a: [
                'A szövetségesek normandiai partraszállása',
                'A hirosimai atombomba ledobása',
                'Németország kapitulációja',
                'A sztálingrádi csata vége'
            ]
        }
    ]
};

const NoteDetailPage = () => {

    return (
        <div className="relative min-h-screen bg-gray-50 text-gray-900">
            <div className="flex flex-col h-screen">
                <Header />
                <main className="flex-grow p-6 overflow-auto">
                    <div className="max-w-3xl mx-auto space-y-8">

                        {/*summary*/}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3 mb-4">
                                <FiFileText className="w-6 h-6 text-orange-600" />
                                <h2 className="text-2xl font-bold text-gray-800">{studyData.title}</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                {studyData.summary}
                            </p>
                        </div>

                        {/*kviz*/}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center space-x-3 mb-6">
                                <FiHelpCircle className="w-6 h-6 text-orange-600" />
                                <h2 className="text-2xl font-bold text-gray-800">Kvíz</h2>
                            </div>

                            <form className="space-y-6">
                                {studyData.quiz.map((item, index) => (
                                    <div key={item.id} className="border-b border-gray-100 pb-4">
                                        <h3 className="text-md font-semibold mb-3">{index + 1}. {item.q}</h3>
                                        <div className="space-y-2">
                                            {item.a.map((answer, ansIndex) => (
                                                <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer" key={ansIndex}>
                                                    <input type="radio" name={`question-${item.id}`} value={answer}/>
                                                    <span className="ml-3 text-sm text-gray-700">{answer}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <button type="submit" className="w-full mt-6 px-6 py-2 font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer">
                                    Kiértékelés
                                </button>
                            </form>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default NoteDetailPage;