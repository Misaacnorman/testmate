
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    value?: Date;
    onChange: (date?: Date) => void;
    disabled?: boolean;
}

type ViewMode = 'day' | 'month' | 'year';

export function DatePicker({ value, onChange, disabled = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = React.useState<Date>(value || new Date());

  const handleSelect = (date?: Date) => {
    onChange(date);
    setIsOpen(false);
    setViewMode('day');
  }

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentDate.getFullYear(), month, 1);
    setCurrentDate(newDate);
    setViewMode('day');
  }

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, currentDate.getMonth(), 1);
    setCurrentDate(newDate);
    setViewMode('month');
  }

  const handleMonthYearClick = () => {
    if (viewMode === 'day') {
      setViewMode('month');
    } else if (viewMode === 'month') {
      setViewMode('year');
    }
  }

  const handleBackClick = () => {
    if (viewMode === 'month') {
      setViewMode('day');
    } else if (viewMode === 'year') {
      setViewMode('month');
    }
  }

  const navigateYear = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' 
      ? currentDate.getFullYear() - 1 
      : currentDate.getFullYear() + 1;
    setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  }

  const navigateYearRange = (direction: 'prev' | 'next') => {
    const yearRange = 12; // Show 12 years at a time
    const currentYear = currentDate.getFullYear();
    const startYear = Math.floor(currentYear / yearRange) * yearRange;
    const newStartYear = direction === 'prev' 
      ? startYear - yearRange 
      : startYear + yearRange;
    setCurrentDate(new Date(newStartYear, currentDate.getMonth(), 1));
  }

  const getYearRange = () => {
    const yearRange = 12;
    const currentYear = currentDate.getFullYear();
    const startYear = Math.floor(currentYear / yearRange) * yearRange;
    return Array.from({ length: yearRange }, (_, i) => startYear + i);
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderYearView = () => {
    const years = getYearRange();
    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateYearRange('prev')}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {years[0]} - {years[years.length - 1]}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateYearRange('next')}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {years.map((year) => (
            <Button
              key={year}
              variant={currentDate.getFullYear() === year ? "default" : "ghost"}
              size="sm"
              onClick={() => handleYearSelect(year)}
              className="h-8 text-xs"
            >
              {year}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="p-3">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('year')}
            className="px-2 py-1 text-sm font-medium hover:bg-accent"
          >
            {currentDate.getFullYear()}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('year')}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {months.map((month, index) => (
            <Button
              key={month}
              variant={currentDate.getMonth() === index ? "default" : "ghost"}
              size="sm"
              onClick={() => handleMonthSelect(index)}
              className="h-8 text-xs"
            >
              {month.slice(0, 3)}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Popover open={isOpen && !disabled} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setViewMode('day');
        setCurrentDate(value || new Date());
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {viewMode === 'year' && renderYearView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'day' && (
          <div className="relative">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleSelect}
              month={currentDate}
              onMonthChange={setCurrentDate}
              initialFocus
              components={{
                Caption: ({ displayMonth }) => (
                  <div className="flex items-center justify-between py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMonthYearClick}
                      className="px-2 py-1 text-sm font-medium hover:bg-accent"
                    >
                      {format(displayMonth, 'MMMM yyyy')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      className="h-7 w-7 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
