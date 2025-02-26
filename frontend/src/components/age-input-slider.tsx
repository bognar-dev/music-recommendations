"use client"

import { useState, useEffect } from "react"
import { motion} from "motion/react"
import { Slider } from "@/components/ui/slider"
import { useTranslations } from 'next-intl';

interface AgeInputSliderProps {
    minimumAge?: number
    initialAge?: number
    onChange: (value: string) => void
}

const AgeInputSlider = ({ minimumAge = 18, initialAge, onChange }: AgeInputSliderProps) => {
    const [hasInteracted, setHasInteracted] = useState(false)
    const [age, setAge] = useState(initialAge ?? minimumAge)
    const t = useTranslations('AgeInputSlider');

    // On mount, override age from localStorage if available
    useEffect(() => {
        const storedAge = localStorage.getItem("age")
        if (storedAge !== null) {
            setAge(Number(storedAge))
        }
    }, [])

   

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-8">
            <h2 className="text-2xl font-bold text-center mb-6">{t("selectYourAge")}</h2>

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
            {age === minimumAge && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="text-center text-sm text-gray-500 mt-2"
                >
                    {t("minimumAgeReached")}
                </motion.div>
            )}
        </div>
    )
}

export default AgeInputSlider