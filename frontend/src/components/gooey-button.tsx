"use client"

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { Button } from './ui/button'

interface GooeyButtonProps {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
}

export default function GooeyButton({ children, className, href, onClick }: GooeyButtonProps) {
  return (
    <>
      <Button variant={"unstyled"} className="select-none p-6 [filter:url('#goo')]">
        <a
          href={href}
          onClick={onClick}
          className={cn(
            "inline-block text-center bg-primary text-primary-foreground/80 font-bold py-[1.18em] px-[1.32em] leading-none rounded-[1em] whitespace-nowrap",
            "relative min-w-[8.23em] no-underline font-[Montserrat] text-xl",
            "before:w-[4.4em] before:h-[2.95em] before:absolute before:content-[''] before:inline-block before:bg-primary",
            "before:rounded-full before:transition-transform before:duration-300 before:ease-in-out before:scale-0 before:-z-10",
            "before:top-[-25%] before:left-[20%]",
            "after:w-[4.4em] after:h-[2.95em] after:absolute after:content-[''] after:inline-block after:bg-primary",
            "after:rounded-full after:transition-transform after:duration-300 after:ease-in-out after:scale-0 after:-z-10",
            "after:bottom-[-25%] after:right-[20%]",
            "hover:before:scale-100 hover:after:scale-100",
            className
          )}
        >
          {children}
        </a>
      </Button>

      <svg
        className="invisible absolute"
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="18" // Adjust this value
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -6" // Adjust these values
              result="goo"
            />
            <feComposite
              in="SourceGraphic"
              in2="goo"
              operator="atop"
            />
          </filter>
        </defs>
      </svg>
    </>
  )
}