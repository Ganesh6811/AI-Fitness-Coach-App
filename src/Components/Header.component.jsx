import { IoPersonOutline } from "react-icons/io5";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";

const Home = ({ darkMode, toggleDarkMode }) => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div>
            <section>
                <div className={`fixed h-[10vh] w-full left-0 flex justify-around items-center ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-[10px] border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} z-50`}>
                    <div>
                        <p className={`text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent cursor-pointer`}>FitAI Coach</p>
                    </div>

                    <div className="flex items-center gap-7">
                        <button 
                            onClick={() => scrollToSection('hero')} 
                            className={`${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'} font-medium transition-all focus-visible:focus cursor-pointer`}
                        >
                            Home
                        </button>
                        <button 
                            onClick={() => scrollToSection('form-section')} 
                            className={`${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'} font-medium transition-all focus-visible:focus cursor-pointer`}
                        >
                            Get Started
                        </button>
                        <button 
                            onClick={() => scrollToSection('result-section')} 
                            className={`${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'} font-medium transition-all focus-visible:focus cursor-pointer`}
                        >
                            Results
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleDarkMode}
                            className={`${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-600 hover:text-gray-800'} transition-all p-2 rounded-lg`}
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <IoSunnyOutline className="w-6 h-6" /> : <IoMoonOutline className="w-6 h-6" />}
                        </button>
                        <IoPersonOutline className={`w-10 h-10 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'} transition-all focus-visible:focus p-2 rounded-lg cursor-pointer`} />
                    </div>
                </div>
            </section>

            <section
                id="hero"
                className="w-full max-w-7xl pt-32 px-8 pb-20 flex items-center justify-center"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 text-left">
                        <h1 className={`text-6xl md:text-7xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Your{" "}
                            <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 bg-clip-text text-transparent">
                                AI Fitness Coach
                            </span>
                        </h1>
                        <p className={`text-2xl leading-relaxed max-w-md ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Personalized Workouts, Diets & Motivation powered by Advanced AI
                        </p>
                        <button
                            onClick={() => scrollToSection('form-section')}
                            className="inline-block mt-4 px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-2xl shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all cursor-pointer text-lg font-semibold"
                        >
                            Get Started
                        </button>
                    </div>

                    <div className="rounded-3xl shadow-2xl overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop"
                            alt="Person working out in gym"
                            className="w-full h-[600px] object-cover"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home;