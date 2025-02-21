"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"


interface SearchFilterBadgesProps {
    label: string
    paramName: string
    options: { value: string; label: string }[]
}

export function SearchFilterBadges({ label, paramName, options }: SearchFilterBadgesProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateSearchParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, value)
        params.delete("page")
        router.push(`?${params.toString()}`)
    }

    return (
        <div>
            <label className="text-sm font-medium">{label}</label>
            <div className="space-x-2">
                {options.map((option) => (
                    <Badge
                        key={option.value}
                        className="select-none hover:cursor-pointer"
                        variant={searchParams.get(paramName) === option.value ? "default" : "outline"}
                        onClick={() => {
                            if (searchParams.get(paramName) === option.value) {
                                const params = new URLSearchParams(searchParams.toString())
                                params.delete(paramName)
                                router.push(`?${params.toString()}`)
                            } else {
                                updateSearchParam(paramName, option.value)
                            }
                        }}
                    >
                        {option.label}
                    </Badge>
                ))}
            </div>
        </div>
    )
}