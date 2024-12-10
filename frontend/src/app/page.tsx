"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import StudyStep from '@/components/StudyStep'
import FinalSurvey from '@/components/FinalSurvey'

const TOTAL_STEPS = 4

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(() => {
    const step = searchParams.get('step')
    return step ? parseInt(step) : 1
  })

  useEffect(() => {
    const handleRouteChange = () => {
      const step = searchParams.get('step')
      if (step) {
        const parsedStep = parseInt(step)
        setCurrentStep(parsedStep)
      }
    }

    handleRouteChange()
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [searchParams])

  const handleNextStep = () => {
    const nextStep = currentStep < TOTAL_STEPS ? currentStep + 1 : TOTAL_STEPS + 1
    setCurrentStep(nextStep)
    router.push(`/?step=${nextStep}`)
  }

  return (
    <div className="flex h-screen pb-24">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6">
          {currentStep <= TOTAL_STEPS ? (
            <StudyStep 
              key={currentStep}
              step={currentStep} 
              totalSteps={TOTAL_STEPS} 
              onNextStep={handleNextStep} 
            />
          ) : (
            <FinalSurvey />
          )}
        </div>
      </main>
    </div>
  )
}

