"use client"

import { useTransition } from "react"
import { Languages } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Locale } from "@/i18n/config"
import { setUserLocale } from "@/lib/locale"

type Props = {
  defaultValue: string
  items: Array<{ value: string; label: string }>
  label: string
}

export default function LocaleSwitcherSelect({ defaultValue, items, label }: Props) {
  const [isPending, startTransition] = useTransition()

  function onValueChange(value: string) {
    const locale = value as Locale
    startTransition(() => {
      setUserLocale(locale)
    })
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger aria-label={label} className={`w-[40px] px-0 ${isPending ? "opacity-50" : ""}`}>
        <SelectValue>
          <Languages className="h-4 w-4" />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <div className="flex items-center justify-between">
              <span>{item.label}</span>
              {item.value === defaultValue}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

