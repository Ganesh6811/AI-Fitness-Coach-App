import { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

import Home from "../Components/Header.component.jsx";
import FormDetails from "../Components/FormDetails.component.jsx";
import DisplayResult from "../Components/DisplayResult.component.jsx";

const HomeAndForm = () => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const [currentStep, setCurrentStep] = useState(1);

    // State for personal details (Step 1)
    const [personalDetails, setPersonalDetails] = useState({
        fullName: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
    });

    // Other steps states
    const [goal, setGoal] = useState("");
    const [fitnessLevel, setFitnessLevel] = useState("");
    const [workoutLocation, setWorkoutLocation] = useState("");
    const [dietPreference, setDietPreference] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState({
        medicalHistory: "",
        stressLevel: "",
        sleepHours: "",
    });

    const [resultGenerated, setResultGenerated] = useState(false);
    const [workoutPlan, setWorkoutPlan] = useState([]);
    const [dietPlan, setDietPlan] = useState([]);
    const [motivationQuote, setMotivationQuote] = useState("");


    const [isGenerating, setIsGenerating] = useState(false);

    const generatePlan = async () => {
        setIsGenerating(true);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) {
                throw new Error("API key not found in environment variables");
            }
            
            const ai = new GoogleGenAI({ apiKey });
        const prompt = `
You are an AI Fitness and Nutrition Coach.

Create a JSON object with exactly 3 main keys: "workoutPlan", "dietPlan", and "motivation".

1. "workoutPlan": an array of 6 exercise objects.
   Each exercise object must contain ONLY these 5 keys:
   - "name": string — exercise name (e.g., "Push-ups")
   - "muscle": string — main muscle or area affected (e.g., "Chest", "Legs", "Core")
   - "sets": number — number of sets
   - "reps": string — number of reps or duration (e.g., "12-15", "45s")
   - "rest": string — rest time (e.g., "60s", "90s")

2. "dietPlan": an object containing 4 inner keys — "breakfast", "lunch", "dinner", and "snacks".
   Each of these must be an array containing exactly 3 food items as strings.

3. "motivation": an object with a single key:
   - "quote": string — a short motivational quote.

User Details:
Full Name: ${personalDetails.fullName}
Age: ${personalDetails.age}
Gender: ${personalDetails.gender}
Height: ${personalDetails.height} cm
Weight: ${personalDetails.weight} kg
Fitness Goal: ${goal}
Fitness Level: ${fitnessLevel}
Workout Location: ${workoutLocation}
Dietary Preference: ${dietPreference}
Medical History: ${additionalInfo.medicalHistory}
Stress Level: ${additionalInfo.stressLevel}
Sleep Hours: ${additionalInfo.sleepHours}

Rules:
- The entire output must be valid JSON.
- No markdown, no text outside JSON.
- Do not include day names like "monday" or "tuesday".
- Use only the specified keys and structure.
- Keep the plan realistic, based on the user’s details.
Return only the JSON.
`;


            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: prompt,
            });
            const responseText = response.text;
            const cleanedText = responseText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const parserData = await JSON.parse(cleanedText);
            if (parserData) {
                setResultGenerated(true);
                setWorkoutPlan(parserData.workoutPlan);
                setDietPlan(parserData.dietPlan);
                setMotivationQuote(parserData.motivation);
                
                setTimeout(() => {
                    const resultSection = document.getElementById('result-section');
                    if (resultSection) {
                        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 500);
            }
        } catch (error) {
            console.error("Error generating plan:", error);
            alert("Failed to generate plan. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center transition-colors duration-300 ${
            darkMode 
                ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
                : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }`}>
            <Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            <FormDetails
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                personalDetails={personalDetails}
                setPersonalDetails={setPersonalDetails}
                goal={goal}
                setGoal={setGoal}
                fitnessLevel={fitnessLevel}
                setFitnessLevel={setFitnessLevel}
                workoutLocation={workoutLocation}
                setWorkoutLocation={setWorkoutLocation}
                dietPreference={dietPreference}
                setDietPreference={setDietPreference}
                additionalInfo={additionalInfo}
                setAdditionalInfo={setAdditionalInfo}
                onGeneratePlan={generatePlan}
                isGenerating={isGenerating}
                darkMode={darkMode}
            />

            {resultGenerated && (
                <div id="result-section">
                    <DisplayResult
                        workoutPlan={workoutPlan}
                        dietPlan={dietPlan}
                        motivationQuote={motivationQuote}
                        onRegenerate={generatePlan}
                        isRegenerating={isGenerating}
                        darkMode={darkMode}
                    />
                </div>
            )}


        </div>
    );
};

export default HomeAndForm;
