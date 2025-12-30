"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MonthPickerProps {
  value?: string // Format: "YYYY-MM"
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

export function MonthPicker({
  value,
  onChange,
  placeholder = "월 선택",
  disabled,
  required,
}: MonthPickerProps) {
  const [year, setYear] = React.useState<string>(
    value ? value.split("-")[0] : new Date().getFullYear().toString()
  )
  const [month, setMonth] = React.useState<string>(
    value ? value.split("-")[1] : ""
  )
  const [open, setOpen] = React.useState(false)

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 51 }, (_, i) => (currentYear - 25 + i).toString())
  }, [])

  const months = [
    { value: "01", label: "1월" },
    { value: "02", label: "2월" },
    { value: "03", label: "3월" },
    { value: "04", label: "4월" },
    { value: "05", label: "5월" },
    { value: "06", label: "6월" },
    { value: "07", label: "7월" },
    { value: "08", label: "8월" },
    { value: "09", label: "9월" },
    { value: "10", label: "10월" },
    { value: "11", label: "11월" },
    { value: "12", label: "12월" },
  ]

  const handleSelect = () => {
    if (year && month && onChange) {
      onChange(`${year}-${month}`)
      setOpen(false)
    }
  }

  const displayValue = value
    ? `${value.split("-")[0]}년 ${parseInt(value.split("-")[1])}월`
    : ""

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">연도</label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="연도 선택" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}년
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">월</label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="월 선택" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSelect}
            disabled={!year || !month}
            className="w-full"
          >
            확인
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
