import { useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const mealMeta = {
    breakfast: {
        icon: "☀️",
        bg: "bg-yellow-50",
        border: "border-yellow-100",
        text: "text-yellow-700",
        time: "7:00 AM - 8:00 AM",
        calories: "~450 calories",
    },
    lunch: {
        icon: "🌞",
        bg: "bg-green-50",
        border: "border-green-100",
        text: "text-green-700",
        time: "12:00 PM - 1:00 PM",
        calories: "~550 calories",
    },
    dinner: {
        icon: "🌙",
        bg: "bg-blue-50",
        border: "border-blue-100",
        text: "text-blue-700",
        time: "7:00 PM - 8:00 PM",
        calories: "~480 calories",
    },
    snacks: {
        icon: "💜",
        bg: "bg-pink-50",
        border: "border-pink-100",
        text: "text-pink-700",
        time: "Throughout the day",
        calories: "~320 calories",
    },
};

async function createTheText(text) {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a text narrator and you will be given an object that sometimes contains foods or exercises. Create the text so that it can be hearable. The object is ${text}. Just return the text associated with it, nothing more.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        return response.text;
    } catch (err) {
        console.error("Error creating text:", err);
        throw err;
    }
}

const createSpeech = async (text) => {
    try {
        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
        const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

        const client = new ElevenLabsClient({
            apiKey,
            environment: "https://api.elevenlabs.io/",
        });

        const convertedText = await createTheText(text);
        const res = await client.textToSpeech.convert(voiceId, {
            outputFormat: "mp3_44100_128",
            text: convertedText,
            modelId: "eleven_multilingual_v2",
        });

        const reader = res.getReader();
        const chunks = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        const audioBytes = new Blob(chunks, { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBytes);

        const audio = new Audio(audioUrl);
        await audio.play();

    } catch (err) {
        console.error("Error creating speech:", err);
        throw err;
    }
}


async function fetchGeminiImage(itemName, type) {
    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey });

        let prompt;
        if (type === "exercise") {
            prompt = `Create a realistic, professional photograph of a single person performing the exercise "${itemName}" in a modern gym setting. Show correct form and technique. The person should be alone in the frame, no other people visible. High quality, bright natural lighting, fitness photography style, professional camera work.`;
        } else {
            prompt = `Create a realistic, high-quality professional food photography image of "${itemName}". Beautifully plated and styled, restaurant-quality presentation, mouthwatering appearance, natural daylight, food styling, top-down or slightly angled view, professional photography.`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
        });

        if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const imageData = part.inlineData.data;
                    return `data:image/png;base64,${imageData}`;
                }
            }
        }

        throw new Error("No image data returned from Gemini");
    } catch (error) {
        console.error("Image generation failed:", error);
        throw error;
    }
}

const fallbackImages = {
    exercise: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=800&fit=crop",
    food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop",
};

export default function DisplayResult({ workoutPlan, dietPlan, motivationQuote, onRegenerate, isRegenerating, darkMode }) {
    const [checkWorkout, setCheckWorkout] = useState(true);
    const [checkDiet, setCheckDiet] = useState(false);
    const [checkMotivation, setCheckMotivation] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalImage, setModalImage] = useState("");
    const [loadingImage, setLoadingImage] = useState(false);
    const [modalType, setModalType] = useState("");
    const [loadingReadAloud, setLoadingReadAloud] = useState(false);

    const dietPlanRef = useRef(null);

    // Toggle sections
    const clickCheckWorkout = () => {
        setCheckWorkout(true);
        setCheckDiet(false);
        setCheckMotivation(false);
    };
    const clickDiet = () => {
        setCheckWorkout(false);
        setCheckDiet(true);
        setCheckMotivation(false);
    };
    const clickMotivation = () => {
        setCheckWorkout(false);
        setCheckDiet(false);
        setCheckMotivation(true);
    };

    const handleBlockClick = async (title, type) => {
        setModalOpen(true);
        setModalTitle(title);
        setModalType(type);
        setLoadingImage(true);
        setModalImage("");

        try {
            const imageUrl = await fetchGeminiImage(title, type);
            setModalImage(imageUrl);
        } catch (error) {
            console.error("Failed to fetch image, using fallback:", error);
            setModalImage(fallbackImages[type] || fallbackImages.exercise);
        } finally {
            setLoadingImage(false);
        }
    };

    const handleReadAloud = async (data) => {
        setLoadingReadAloud(true);
        try {
            await createSpeech(data);
        } catch (error) {
            console.error("Error reading aloud:", error);
            alert("Failed to read aloud. Please try again.");
        } finally {
            setLoadingReadAloud(false);
        }
    };

    // Export diet plan as PDF
    const exportDietPlanToPDF = async () => {
        if (!dietPlanRef.current) return;

        try {
            const element = dietPlanRef.current;
            const clonedElement = element.cloneNode(true);
            clonedElement.style.position = 'absolute';
            clonedElement.style.left = '-9999px';
            document.body.appendChild(clonedElement);

            await new Promise(resolve => setTimeout(resolve, 100));

            const applyComputedStylesAsInline = (node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const computedStyle = window.getComputedStyle(node);
                    ['color', 'backgroundColor', 'padding', 'margin', 'border', 'borderRadius'].forEach(prop => {
                        const value = computedStyle.getPropertyValue(prop);
                        if (value && !value.includes('oklch')) {
                            node.style.setProperty(prop, value, 'important');
                        }
                    });
                    Array.from(node.children).forEach(child => applyComputedStylesAsInline(child));
                }
            };

            applyComputedStylesAsInline(clonedElement);
            await new Promise(resolve => setTimeout(resolve, 50));

            const canvas = await html2canvas(clonedElement, {
                scale: 1.5,
                backgroundColor: "#ffffff",
                onclone: (clonedDoc) => {
                    const stylesheets = Array.from(clonedDoc.styleSheets);
                    stylesheets.forEach((sheet) => {
                        try {
                            if (sheet.ownerNode) sheet.ownerNode.remove();
                        } catch (e) { }
                    });
                }
            });

            if (document.body.contains(clonedElement)) {
                document.body.removeChild(clonedElement);
            }

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const ratio = pdfWidth / canvas.width;
            const imgHeightInMm = canvas.height * ratio;

            if (imgHeightInMm <= pdfHeight) {
                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeightInMm);
            } else {
                let heightLeft = imgHeightInMm;
                pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeightInMm);
                heightLeft -= pdfHeight;

                while (heightLeft >= 0) {
                    pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, heightLeft - imgHeightInMm, pdfWidth, imgHeightInMm);
                    heightLeft -= pdfHeight;
                }
            }

            pdf.save("diet-plan.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to export PDF. Please try again.");
        }
    };

    return (
        <section className="mt-[20vh] mb-[10vh]">
            <div className="text-center mb-6">
                <h2 className={`text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your personalized <span className="bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">AI fitness plan</span>
                </h2>
                <p className={`text-base sm:text-lg lg:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tailored specifically for your goals and preferences</p>
            </div>

            <div className="flex justify-center gap-8">
                <button className={`py-3 font-semibold text-sm sm:text-base transition-all ${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`} onClick={clickCheckWorkout}>💪 Workout Plan</button>
                <button className={`py-3 font-semibold text-sm sm:text-base transition-all ${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`} onClick={clickDiet}>🥗 Diet Plan</button>
                <button className={`py-3 font-semibold text-sm sm:text-base transition-all ${darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`} onClick={clickMotivation}>🎯 Motivation</button>
            </div>

            {checkWorkout && (
                <section className="mt-9">
                    <div className={`rounded-3xl shadow-2xl p-8 lg:p-12 mb-8 w-[70vw] transition-colors ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                        <div className="flex justify-between gap-2">
                            <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Weekly Workout Schedule</h3>
                            <div className="flex items-center justify-center gap-5">
                                <button 
                                    onClick={() => handleReadAloud(JSON.stringify(workoutPlan))}
                                    disabled={loadingReadAloud}
                                    className={`px-6 py-3 bg-linear-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center space-x-2 text-sm sm:text-base ${
                                        loadingReadAloud ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'
                                    }`}
                                >
                                    {loadingReadAloud ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Reading...</span>
                                        </>
                                    ) : (
                                        'Read Aloud'
                                    )}
                                </button>
                                <button 
                                    onClick={onRegenerate}
                                    disabled={isRegenerating}
                                    className={`px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center space-x-2 text-sm sm:text-base ${
                                        isRegenerating ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'
                                    }`}
                                >
                                    {isRegenerating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Regenerating...</span>
                                        </>
                                    ) : (
                                        'Regenerate'
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="mt-[4vh] flex flex-wrap gap-[4vh]">
                            {workoutPlan.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleBlockClick(item.name, "exercise")}
                                    className={`w-[18vw] flex flex-col gap-6 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                                        darkMode ? 'bg-linear-to-br from-purple-900/50 to-blue-900/50 border border-gray-700' : 'bg-linear-to-br from-purple-50 to-blue-50'
                                    }`}
                                    title="Click for demonstration"
                                >
                                    <div className="flex justify-between">
                                        <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</p>
                                        <p className={`px-3 py-1 h-7 text-xs font-semibold rounded-full ${darkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-200 text-purple-800'}`}>{item.muscle}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Sets:</p>
                                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.sets}</p>
                                    </div>
                                    <div className="flex justify-between gap-10">
                                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Reps:</p>
                                        <p className={`font-bold flex flex-col gap-3 leading-relaxed h-auto ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.reps}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Rest:</p>
                                        <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.rest}</p>
                                    </div>
                                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Click to view exercise demonstration</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {checkDiet && (
                <section className="mt-9">
                    <div className={`rounded-3xl shadow-2xl p-8 lg:p-12 mb-8 w-[70vw] transition-colors ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                        <div className="flex justify-between gap-2">
                            <h3 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Daily nutrition plan</h3>
                            <div className="flex items-center justify-center gap-5">
                                <button 
                                    onClick={() => handleReadAloud(JSON.stringify(dietPlan))}
                                    disabled={loadingReadAloud}
                                    className={`px-6 py-3 bg-linear-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center space-x-2 text-sm sm:text-base ${
                                        loadingReadAloud ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'
                                    }`}
                                >
                                    {loadingReadAloud ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Reading...</span>
                                        </>
                                    ) : (
                                        'Read Aloud'
                                    )}
                                </button>
                                <button
                                    onClick={exportDietPlanToPDF}
                                    className="px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center space-x-2 text-sm sm:text-base"
                                >
                                    Export PDF
                                </button>
                            </div>
                        </div>
                        <div ref={dietPlanRef} className="mt-[4vh] flex flex-col gap-[6vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 p-4">
                                {Object.entries(dietPlan).map(([meal, items]) => {
                                    const meta = mealMeta[meal];
                                    return (
                                        <div
                                            key={meal}
                                            className={`rounded-2xl shadow-lg p-6 ${meta.bg} ${meta.border} flex flex-col justify-between transition-all transform hover:-translate-y-1`}
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-2xl ${meta.text}`}>{meta.icon}</span>
                                                    <span className="font-bold text-lg">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
                                                </div>
                                                <div className="text-xs font-semibold text-gray-500 mb-2">{meta.time}</div>
                                                <ul className="ml-2 mb-4 text-gray-800 flex flex-col gap-3 leading-relaxed h-auto">
                                                    {items.map((item, i) => (
                                                        <li
                                                            key={i}
                                                            className="list-disc cursor-pointer"
                                                            title="Click for realistic food image"
                                                            onClick={() => handleBlockClick(item, "food")}
                                                        >
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex justify-between items-end pt-2 border-t border-gray-200 mt-3"> 
                                                <span className="text-xs text-gray-500 hover:underline cursor-pointer">Click for details</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {checkMotivation && (
                <section className={`mt-[5vh] w-[80vw] bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl p-9 ${darkMode ? 'border border-purple-600' : ''}`}>
                    <div className="flex flex-col gap-6 items-center w-full">
                        <h1 className="text-4xl font-bold text-white mb-4">Daily Motivation</h1>
                        <p className="text-base sm:text-lg lg:text-xl text-white italic mb-6 text-center">{motivationQuote.quote}</p>
                        <div className="flex gap-8 justify-center">
                            <div className={`rounded-2xl p-6 shadow-lg flex flex-col items-center ${darkMode ? 'bg-gray-800/80' : 'bg-white'}`}>
                                <h4 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stay Consistent</h4>
                                <p className={`text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Small daily actions lead to big results</p>
                            </div>
                            <div className={`rounded-2xl p-6 shadow-lg flex flex-col items-center ${darkMode ? 'bg-gray-800/80' : 'bg-white'}`}>
                                <h4 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Push Your Limits</h4>
                                <p className={`text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Growth happens outside your comfort zone</p>
                            </div>
                            <div className={`rounded-2xl p-6 shadow-lg flex flex-col items-center ${darkMode ? 'bg-gray-800/80' : 'bg-white'}`}>
                                <h4 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Love the process</h4>
                                <p className={`text-sm text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Enjoy every step of your journey</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Image preview modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-100 flex justify-center items-center p-4"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-6 text-3xl text-gray-500 hover:text-purple-600 transition-colors"
                            onClick={() => setModalOpen(false)}
                            aria-label="Close modal"
                        >
                            ×
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-gray-900">{modalTitle}</h2>

                        {loadingImage ? (
                            <div className="w-full flex flex-col items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-5"></div>
                                <span className="text-gray-600 font-medium">Generating image...</span>
                                <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
                            </div>
                        ) : modalImage ? (
                            <div className="space-y-4">
                                <img
                                    src={modalImage}
                                    alt={modalTitle}
                                    className="rounded-xl shadow-lg w-full h-auto object-cover"
                                    onError={() => setModalImage(fallbackImages[modalType] || fallbackImages.exercise)}
                                /> 
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-20">
                                <p>Image not available</p>
                                <button
                                    onClick={() => handleBlockClick(modalTitle, modalType)}
                                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
