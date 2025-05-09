"use client"
import React from "react"
import Image from "next/image"

import useScreenSize from "@/hooks/use-screen-size"
import CirclingElements from "@/components/ui/circling-elements"

interface CirclingElementsDemoProps {
    images: string[]
    children?: React.ReactNode
}
export const CirclingElementsDemo: React.FC<CirclingElementsDemoProps> = ({ images, children }) => {
    const screenSize = useScreenSize()
    const filteredImages = images.filter(image => image !== "no");
    const displayedImages = screenSize.lessThan("md") ? filteredImages.slice(0, 8) : filteredImages

    

    return (
        <div className="w-full max-h-screen flex items-center justify-center relative">
            <CirclingElements radius={screenSize.lessThan("md") ? 80 : 390} duration={40}>
                {displayedImages.map((image, index) => (
                    <div
                        key={index}
                        className="w-20 h-20 md:w-40 md:h-40 absolute -translate-x-1/2 -translate-y-1/2"
                    >
                        <Image src={image} fill sizes="(max-width: 768px) 80px, 160px" alt="image" className="object-cover" />
                    </div>
                ))}
            </CirclingElements>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}

export default CirclingElementsDemo
