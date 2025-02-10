'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'
import { usePostHog } from 'posthog-js/react'

export function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false)
    const [functionalCookies, setFunctionalCookies] = useState(true)
    const [analyticsCookies, setAnalyticsCookies] = useState(true)
    const posthog = usePostHog()
    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent')
        if (!consent) {
            setShowBanner(true)
        } else {
            const { functional, analytics } = JSON.parse(consent)
            setFunctionalCookies(functional)
            setAnalyticsCookies(analytics)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', JSON.stringify({
            functional: functionalCookies,
            analytics: analyticsCookies
        }))
        setShowBanner(false)
        posthog.opt_in_capturing()
    }

    const handleReject = () => {
        localStorage.setItem('cookieConsent', JSON.stringify({
            functional: false,
            analytics: false
        }))
        setShowBanner(false)
        posthog.opt_out_capturing()
    }

    if (!showBanner) return null

    return (
        <Card className="fixed bottom-4 right-4 max-w-lg mx-auto z-50">
            <CardHeader>
                <CardTitle>Cookie Preferences</CardTitle>
                <CardDescription>
                    I use cookies to analyze and enhance my survey and results. Please select your preferences below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="functional"
                        checked={functionalCookies}
                        onCheckedChange={setFunctionalCookies}
                    />
                    <Label htmlFor="functional">Functional Cookies</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                    <Switch
                        id="analytics"
                        checked={analyticsCookies}
                        onCheckedChange={setAnalyticsCookies}
                    />
                    <Label htmlFor="analytics">Analytics Cookies</Label>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleReject}>Reject All</Button>
                <Button onClick={handleAccept}>Accept Selected</Button>
            </CardFooter>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => {
                    setShowBanner(false)
                    handleAccept()
                }
                }
            >
                <X className="h-4 w-4" />
            </Button>
        </Card>
    )
}
