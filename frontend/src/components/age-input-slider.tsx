"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Slider } from "@/components/ui/slider"

interface AgeInputSliderProps {
    minimumAge?: number
    initialAge?: number
    onChange: (value: string) => void
}

const AgeInputSlider = ({ minimumAge = 18, initialAge, onChange }: AgeInputSliderProps) => {
    const [hasInteracted, setHasInteracted] = useState(false)
    const [age, setAge] = useState(initialAge ?? minimumAge)

    // On mount, override age from localStorage if available
    useEffect(() => {
        const storedAge = localStorage.getItem("age")
        if (storedAge !== null) {
            setAge(Number(storedAge))
        }
    }, [])

    const getAgeGroup = useMemo(
        () => (age: number) => {
            if (age === minimumAge) return "Minimum Age"
            if (age < 18) return "Teen"
            if (age < 30) return "Young Adult"
            if (age < 50) return "Adult"
            if (age < 70) return "Middle Aged"
            return "Senior"
        },
        [minimumAge],
    )

    const ageGroups = useMemo(() => ["Minimum Age", "Teen", "Young Adult", "Adult", "Middle Aged", "Senior"], [])

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-8">
            <h2 className="text-2xl font-bold text-center mb-6">Select Your Age</h2>

            <div className="relative">
                <Slider
                    min={minimumAge}
                    max={100}
                    step={1}
                    value={[age]}
                    onValueChange={(value) => {
                        const newAge = value[0]
                        if (!hasInteracted) setHasInteracted(true)
                        setAge(newAge)
                        localStorage.setItem("age", newAge.toString())
                        onChange(newAge.toString())
                    }}
                    className="z-10"
                />
                <div className="absolute top-8 left-0 right-0 flex justify-between text-sm text-gray-500">
                    {[minimumAge, 25, 50, 75, 100].map((value) => (
                        <span key={value}>{value}</span>
                    ))}
                </div>
            </div>

            <motion.div
                className="text-6xl font-bold text-center p-8"
                key={age}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {age}
            </motion.div>

            <div className="flex justify-between mt-8">
                {ageGroups.map((group) => (
                    <motion.div
                        key={group}
                        className={`text-sm ${getAgeGroup(age) === group ? "text-primary font-bold" : "text-gray-500"}`}
                        animate={{
                            scale: getAgeGroup(age) === group ? 1.1 : 1,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        {group}
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={getAgeGroup(age)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="text-center text-lg font-semibold mt-4"
                >
                    You are a {getAgeGroup(age)}
                </motion.div>
            </AnimatePresence>

            {age === minimumAge && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="text-center text-sm text-gray-500 mt-2"
                >
                    Minimum age reached
                </motion.div>
            )}
        </div>
    )
}

export default AgeInputSlider
