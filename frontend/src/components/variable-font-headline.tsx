"use client"
import { useRef } from "react"

import { useMousePosition } from "@/hooks/use-mouse-position"
import VariableFontAndCursor from "@/components/variable-font-and-cursor"

interface VariableFontHeadlineProps {
    label: string
}



export default function VariableFontHeadline({ label }: VariableFontHeadlineProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    //@ts-expect-error just send it
    const { x, y } = useMousePosition(containerRef)

    return (
        <div
            className="w-full h-full items-center justify-center font-overusedGrotesk p-4 relative cursor-none overflow-hidden"
            ref={containerRef}
        >
            {/* this is the important stuff */}
            <div className="w-full h-full items-center justify-center flex">

                <VariableFontAndCursor
                    label={label}
                    className="md:text-5xl text-foreground"
                    fontVariationMapping={{
                        y: { name: "wght", min: 700, max: 100 },
                        x: { name: "slnt", min: 0, max: -10 },
                    }}
                    containerRef={containerRef}
                />
            </div>

            {/* this is just fluff for the demo */}
            <div
                className="absolute w-2 h-2 bg-foreground -translate-x-1/2 -translate-y-1/2 rounded-xs"
                style={{
                    top: `${y}px`,
                    left: `${x}px`,
                }}
            />
        </div>
    )
}
