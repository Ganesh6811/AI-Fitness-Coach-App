import { useState } from "react";

const FormDetails = ({ 
    currentStep, 
    setCurrentStep, 
    personalDetails, 
    setPersonalDetails,
    goal,
    setGoal,
    fitnessLevel,
    setFitnessLevel,
    workoutLocation,
    setWorkoutLocation,
    dietPreference,
    setDietPreference,
    additionalInfo,
    setAdditionalInfo,
    onGeneratePlan,
    isGenerating,
    darkMode
}) => {
    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return (
                    personalDetails.fullName.trim() !== "" &&
                    personalDetails.age >= 13 &&
                    personalDetails.age <= 100 &&
                    ["male", "female", "other"].includes(personalDetails.gender) &&
                    personalDetails.height >= 100 &&
                    personalDetails.height <= 250 &&
                    personalDetails.weight >= 30 &&
                    personalDetails.weight <= 300
                );
            case 2:
                return goal !== "";
            case 3:
                return fitnessLevel !== "";
            case 4:
                return workoutLocation !== "";
            case 5:
                return dietPreference !== "";
            case 6:
                return true;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (isStepValid() && currentStep < 6) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleInputChange = (e, section = "personal") => {
        const { name, value } = e.target;
        if (section === "personal") {
            setPersonalDetails((prev) => ({ ...prev, [name]: value }));
        } else if (section === "additional") {
            setAdditionalInfo((prev) => ({ ...prev, [name]: value }));
        }
    };

    const progressPercent = (currentStep / 6) * 100;

    return (
        <section
            id="form-section"
            className={`w-full max-w-4xl rounded-3xl shadow-2xl mt-[15vh] p-8 mb-16 transition-colors ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}
        >
            <div className="mb-12 flex items-center justify-between">
                <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Let's Build Your Plan
                </h2>
                <div className={`text-xl font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    Step {currentStep} of 6
                </div>
            </div>

            <div
                className="w-full bg-gray-200 rounded-full h-3 mb-10"
                aria-label="Form completion progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
            >
                <div
                    className="h-3 rounded-full bg-linear-to-r from-purple-600 to-blue-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <form noValidate>
                {/* Step 1 - Personal Details */}
                {currentStep === 1 && (
                    <fieldset>
                        <legend className={`text-xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Personal Details
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <label className=" flex flex-col gap-3">
                                <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Full Name <span className="text-red-500">*</span>
                                </span>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    required
                                    value={personalDetails.fullName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 transition ${
                                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                    }`}
                                />
                            </label>

                            <label className=" flex flex-col gap-3">
                                <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Age <span className="text-red-500">*</span>
                                </span>
                                <input
                                    type="number"
                                    name="age"
                                    placeholder="25"
                                    min={13}
                                    max={100}
                                    required
                                    value={personalDetails.age}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 transition ${
                                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                    }`}
                                />
                            </label>

                            <label className=" flex flex-col gap-3">
                                <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Gender <span className="text-red-500">*</span>
                                </span>
                                <select
                                    name="gender"
                                    required
                                    value={personalDetails.gender}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 transition ${
                                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                    }`}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </label>

                            <label className=" flex flex-col gap-3">
                                <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Height (cm) <span className="text-red-500">*</span>
                                </span>
                                <input
                                    type="number"
                                    name="height"
                                    placeholder="175"
                                    min={100}
                                    max={250}
                                    required
                                    value={personalDetails.height}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 transition ${
                                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                    }`}
                                />
                            </label>

                            <label className=" flex flex-col gap-3">
                                <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Weight (kg) <span className="text-red-500">*</span>
                                </span>
                                <input
                                    type="number"
                                    name="weight"
                                    placeholder="70"
                                    min={30}
                                    max={300}
                                    required
                                    value={personalDetails.weight}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border-2 focus:border-purple-500 transition ${
                                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                                    }`}
                                />
                            </label>
                        </div>
                    </fieldset>
                )}

                {/* Step 2 - Fitness Goal */}
                {currentStep === 2 && (
                    <fieldset>
                        <legend className={`text-xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Fitness Goal
                        </legend>
                        <div className="grid sm:grid-cols-3 gap-6">
                            {[
                                {
                                    value: "weight-loss",
                                    title: "Weight Loss",
                                    description: "Burn fat and get lean",
                                    bgFrom: "red-400",
                                    bgTo: "pink-500",
                                    iconPath: "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
                                },
                                {
                                    value: "muscle-gain",
                                    title: "Muscle Gain",
                                    description: "Build strength and size",
                                    bgFrom: "blue-400",
                                    bgTo: "purple-500",
                                    iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
                                },
                                {
                                    value: "maintenance",
                                    title: "Maintenance",
                                    description: "Stay fit and healthy",
                                    bgFrom: "green-400",
                                    bgTo: "teal-500",
                                    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                                },
                            ].map(({ value, title, description, bgFrom, bgTo, iconPath }) => (
                                <div
                                    key={value}
                                    onClick={() => setGoal(value)}
                                    className={`cursor-pointer p-6 rounded-2xl border-2 hover:border-purple-600 hover:shadow-lg transition ${
                                    goal === value ? "border-purple-600 shadow-lg" : darkMode ? "border-gray-600" : "border-gray-300"
                                } ${darkMode ? 'bg-gray-700/50' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="goal"
                                        value={value}
                                        checked={goal === value}
                                        onChange={() => setGoal(value)}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-14 h-14 sm:w-16 sm:h-16 mb-4 mx-auto rounded-2xl flex items-center justify-center bg-linear-to-br from-${bgFrom} to-${bgTo}`}
                                        aria-hidden="true"
                                    >
                                        <svg
                                            className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d={iconPath}
                                            />
                                        </svg>
                                    </div>
                                    <h3 className={`font-bold text-center mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                                    <p className={`text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
                                </div>
                            ))}
                        </div>
                    </fieldset>
                )}

                {/* Step 3 - Fitness Level */}
                {currentStep === 3 && (
                    <fieldset>
                        <legend className={`text-xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Fitness Level
                        </legend>
                        <div className="space-y-6">
                            {[
                                {
                                    value: "beginner",
                                    title: "Beginner",
                                    description: "New to fitness or returning after a break",
                                    bgFrom: "yellow-400",
                                    bgTo: "orange-500",
                                    iconPath:
                                        "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                                },
                                {
                                    value: "intermediate",
                                    title: "Intermediate",
                                    description: "Regular workout routine, comfortable with exercises",
                                    bgFrom: "blue-400",
                                    bgTo: "indigo-500",
                                    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                                },
                                {
                                    value: "advanced",
                                    title: "Advanced",
                                    description: "Experienced athlete, ready for intense challenges",
                                    bgFrom: "purple-400",
                                    bgTo: "pink-500",
                                    iconPath:
                                        "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
                                },
                            ].map(({ value, title, description, bgFrom, bgTo, iconPath }) => (
                                <div
                                    key={value}
                                    onClick={() => setFitnessLevel(value)}
                                    className={`cursor-pointer p-6 rounded-2xl border-2 hover:border-purple-600 hover:shadow-lg transition flex items-center space-x-6 ${
                                        fitnessLevel === value ? "border-purple-600 shadow-lg" : darkMode ? "border-gray-600" : "border-gray-300"
                                    } ${darkMode ? 'bg-gray-700/50' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="level"
                                        value={value}
                                        checked={fitnessLevel === value}
                                        onChange={() => setFitnessLevel(value)}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-14 h-14 rounded-xl shrink-0 flex items-center justify-center bg-linear-to-br from-${bgFrom} to-${bgTo}`}
                                        aria-hidden="true"
                                    >
                                        <svg
                                            className="w-7 h-7 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d={iconPath}
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </fieldset>
                )}


                {/* Step 4 - Workout Location */}
                {currentStep === 4 && (
                    <fieldset>
                        <legend className={`text-xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Workout Location
                        </legend>
                        <div className="grid sm:grid-cols-3 gap-6">
                            {[
                                {
                                    value: "home",
                                    title: "Home",
                                    description: "Bodyweight & minimal equipment",
                                    bgFrom: "indigo-400",
                                    bgTo: "purple-500",
                                    iconPath:
                                        "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                                },
                                {
                                    value: "gym",
                                    title: "Gym",
                                    description: "Full equipment access",
                                    bgFrom: "red-400",
                                    bgTo: "orange-500",
                                    iconPath:
                                        "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                                },
                                {
                                    value: "outdoor",
                                    title: "Outdoor",
                                    description: "Parks, trails, fresh air",
                                    bgFrom: "green-400",
                                    bgTo: "teal-500",
                                    iconPath:
                                        "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                                },
                            ].map(({ value, title, description, bgFrom, bgTo, iconPath }) => (
                                <div
                                    key={value}
                                    onClick={() => setWorkoutLocation(value)}
                                    className={`cursor-pointer p-6 rounded-2xl border-2 hover:border-purple-600 hover:shadow-lg transition ${workoutLocation === value ? "border-purple-600 shadow-lg" : "border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="location"
                                        value={value}
                                        checked={workoutLocation === value}
                                        onChange={() => setWorkoutLocation(value)}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-14 h-14 sm:w-16 sm:h-16 mb-4 mx-auto rounded-2xl flex items-center justify-center bg-linear-to-br from-${bgFrom} to-${bgTo}`}
                                        aria-hidden="true"
                                    >
                                        <svg
                                            className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d={iconPath}
                                            />
                                        </svg>
                                    </div>
                                    <h3 className={`font-bold text-center mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                                    <p className={`text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
                                </div>
                            ))}
                        </div>
                    </fieldset>
                )}

                {/* Step 5 - Diet Preferences */}
                {currentStep === 5 && (
                    <fieldset>
                        <legend className={`text-xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Diet Preferences
                        </legend>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                {
                                    value: "vegetarian",
                                    title: "Vegetarian",
                                    description: "Plant-based with dairy & eggs",
                                    bgFrom: "green-400",
                                    bgTo: "emerald-500",
                                    iconPath:
                                        "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
                                },
                                {
                                    value: "non-vegetarian",
                                    title: "Non-Vegetarian",
                                    description: "Includes meat, fish & poultry",
                                    bgFrom: "red-400",
                                    bgTo: "pink-500",
                                    iconPath:
                                        "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                                },
                                {
                                    value: "vegan",
                                    title: "Vegan",
                                    description: "100% plant-based diet",
                                    bgFrom: "teal-400",
                                    bgTo: "cyan-500",
                                    iconPath:
                                        "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
                                },
                                {
                                    value: "keto",
                                    title: "Keto",
                                    description: "Low-carb, high-fat diet",
                                    bgFrom: "orange-400",
                                    bgTo: "red-500",
                                    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
                                },
                            ].map(({ value, title, description, bgFrom, bgTo, iconPath }) => (
                                <div
                                    key={value}
                                    onClick={() => setDietPreference(value)}
                                    className={`cursor-pointer p-6 rounded-2xl border-2 hover:border-purple-600 hover:shadow-lg transition flex items-center space-x-6 ${dietPreference === value ? "border-purple-600 shadow-lg" : "border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="diet"
                                        value={value}
                                        checked={dietPreference === value}
                                        onChange={() => setDietPreference(value)}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-14 h-14 rounded-xl shrink-0 flex items-center justify-center bg-linear-to-br from-${bgFrom} to-${bgTo}`}
                                        aria-hidden="true"
                                    >
                                        <svg
                                            className="w-7 h-7 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d={iconPath}
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </fieldset>
                )}

                {/* Step 6 - Additional Information */}
                {currentStep === 6 && (
                    <fieldset>
                        <legend className={`text-xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Additional Information (Optional)
                        </legend>
                            <div className="space-y-6">
                                <label className=" flex flex-col gap-3">
                                    <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Medical History / Injuries
                                    </span>
                                <textarea
                                    name="medicalHistory"
                                    placeholder="Any injuries, conditions, or limitations we should know about..."
                                    rows={3}
                                    value={additionalInfo.medicalHistory}
                                    onChange={(e) => handleInputChange(e, "additional")}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 transition resize-none text-sm sm:text-base"
                                />
                            </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <label className=" flex flex-col gap-3">
                                        <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Stress Level</span>
                                    <select
                                        name="stressLevel"
                                        value={additionalInfo.stressLevel}
                                        onChange={(e) => handleInputChange(e, "additional")}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 transition text-sm sm:text-base"
                                    >
                                        <option value="">Select stress level</option>
                                        <option value="low">Low</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                    </select>
                                </label>
                                    <label className=" flex flex-col gap-3">
                                        <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Sleep Quality (hours/night)
                                        </span>
                                    <input
                                        type="number"
                                        name="sleepHours"
                                        placeholder="7"
                                        min={3}
                                        max={12}
                                        step={0.5}
                                        value={additionalInfo.sleepHours}
                                        onChange={(e) => handleInputChange(e, "additional")}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 transition text-sm sm:text-base"
                                    />
                                </label>
                            </div>
                        </div>
                    </fieldset>
                )}

                <div className="flex justify-between mt-12">
                    <button
                        disabled={currentStep === 1}
                        onClick={prevStep}
                        className={`px-8 py-3 rounded-xl font-semibold border-2 focus:outline-none transition ${
                            currentStep === 1
                                ? "opacity-50 cursor-not-allowed"
                                : darkMode 
                                    ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                        type="button"
                    >
                        ← Back
                    </button>
                    {currentStep < 6 ? (
                        <button
                            disabled={!isStepValid()}
                            onClick={nextStep}
                            className={`px-8 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-purple-600 to-blue-500 shadow-lg focus:outline-none transform hover:scale-105 transition ${!isStepValid() ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl"
                                }`}
                            type="button"
                        >
                            Next Step →
                        </button>
                        ) : (
                            <button
                                onClick={onGeneratePlan}
                                disabled={isGenerating}
                                className={`px-8 py-3 rounded-xl font-semibold text-white bg-linear-to-r from-purple-600 to-blue-500 shadow-lg focus:outline-none transform transition-all hover:shadow-xl ${
                                    isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                                } flex items-center gap-2`}
                                type="button"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <span>Generating Plan...</span>
                                    </>
                                ) : (
                                    'Generate My AI Plan'
                                )}
                            </button>
                        )}
                </div>
            </form>
        </section>
    );
};

export default FormDetails;

