/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BookedSlots {
  [dateKey: string]: string[]; // e.g. "2026-06-10": ["10:00 AM"]
}

export default function CalendarWidget() {
  // Current month being viewed in calendar
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 5, 1)); // Default June 2026
  
  // Selected date for scheduling
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 5, 10)); // Default June 10, 2026

  // Tracking slots booked by the user during this session
  const [bookedSlots, setBookedSlots] = useState<BookedSlots>({
    "2026-06-04": ["09:30 AM", "02:00 PM"],
    "2026-06-12": ["03:30 PM", "05:00 PM"],
    "2026-06-18": ["10:00 AM", "04:00 PM"],
  });

  // Track state of slot currently being animated as "just booked"
  const [justBooked, setJustBooked] = useState<string | null>(null);

  // Drag-to-book states for multiselection of contiguous slots
  const [dragStartIdx, setDragStartIdx] = useState<number | null>(null);
  const [dragCurrentIdx, setDragCurrentIdx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleSlotMouseDown = (sIdx: number) => {
    setIsDragging(true);
    setDragStartIdx(sIdx);
    setDragCurrentIdx(sIdx);
  };

  const handleSlotMouseEnter = (sIdx: number) => {
    if (isDragging) {
      setDragCurrentIdx(sIdx);
    }
  };

  const handleSlotMouseUp = () => {
    if (isDragging && dragStartIdx !== null && dragCurrentIdx !== null) {
      const start = Math.min(dragStartIdx, dragCurrentIdx);
      const end = Math.max(dragStartIdx, dragCurrentIdx);
      const selectedRangeSlots = availableTimeSlots.slice(start, end + 1);
      
      const dateKey = selectedDate ? getDateKey(selectedDate) : "";
      const currentBookings = bookedSlots[dateKey] || [];
      
      // Determine if they are already booked
      const allSelectedBooked = selectedRangeSlots.every(slot => currentBookings.includes(slot));
      
      let newBookings: string[];
      if (allSelectedBooked) {
        // Toggle them all off
        newBookings = currentBookings.filter(slot => !selectedRangeSlots.includes(slot));
        setJustBooked(null);
      } else {
        // Book all slots in the range
        newBookings = Array.from(new Set([...currentBookings, ...selectedRangeSlots]));
        // Set dynamic success feedback
        if (selectedRangeSlots.length > 1) {
          setJustBooked(`multiple-${selectedRangeSlots.length}-${selectedRangeSlots[0]}-${selectedRangeSlots[selectedRangeSlots.length - 1]}`);
        } else {
          setJustBooked(selectedRangeSlots[0]);
        }
        
        setTimeout(() => {
          setJustBooked(null);
        }, 4000);
      }
      
      setBookedSlots(prev => ({
        ...prev,
        [dateKey]: newBookings
      }));
    }
    
    // Clear selection
    setIsDragging(false);
    setDragStartIdx(null);
    setDragCurrentIdx(null);
  };

  // Available time slots daily
  const availableTimeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "02:00 PM",
    "03:30 PM",
    "04:00 PM",
    "05:00 PM"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper to change month
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build calendar grid days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sun = 0, Mon = 1, etc.
    // Shift index so Monday is first (Mon = 0, Tue = 1 ... Sun = 6)
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prior month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = totalDaysInPrevMonth - i;
      days.push({
        dayNum: d,
        date: new Date(year, month - 1, d),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      days.push({
        dayNum: d,
        date: new Date(year, month, d),
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill grid (multiple of 7, let's go up to 42 items)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        dayNum: d,
        date: new Date(year, month + 1, d),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  // Format helper for comparison of dates
  const getDateKey = (date: Date) => {
    const yKey = date.getFullYear();
    const mKey = String(date.getMonth() + 1).padStart(2, "0");
    const dKey = String(date.getDate()).padStart(2, "0");
    return `${yKey}-${mKey}-${dKey}`;
  };

  // Check if a day is today
  const isToday = (date: Date) => {
    const today = new Date(2026, 4, 28); // sandbox today: May 28, 2026
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a day has booked meetings
  const getBookingsForDate = (date: Date) => {
    const key = getDateKey(date);
    return bookedSlots[key] || [];
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setJustBooked(null);
  };

  const handleBookSlot = (slot: string) => {
    if (!selectedDate) return;
    const dateKey = getDateKey(selectedDate);
    const dateBookings = bookedSlots[dateKey] || [];
    
    if (dateBookings.includes(slot)) {
      // Toggle off / cancel booking
      setBookedSlots({
        ...bookedSlots,
        [dateKey]: dateBookings.filter((b) => b !== slot),
      });
      setJustBooked(null);
    } else {
      // Book slot
      setJustBooked(slot);
      setBookedSlots({
        ...bookedSlots,
        [dateKey]: [...dateBookings, slot],
      });
      
      // Clear secondary feedback after a bit
      setTimeout(() => {
        setJustBooked(null);
      }, 3000);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const selectedDateString = selectedDate
    ? selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : "";

  return (
    <div id="calendar-widget-root" className="relative w-full max-w-full">
      {/* Floating interactive card with tilt hover */}
      <div 
        id="tempo-calendar-card"
        className="w-full bg-[#F2EFE8] border border-[#D4CEC5] rounded-3xl p-6 md:p-8 shadow-[0_40px_80px_rgba(26,23,20,0.08)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_48px_96px_rgba(26,23,20,0.12)] text-[#1A1714] font-sans"
      >
        {/* Ambient Top Indicator */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF4D00] via-[#F2EFE8] to-[#1DB954]" />

        {/* Floating live badge */}
        <div 
          id="hero-floating-badge" 
          className="absolute right-4 top-4 md:right-8 md:top-8 bg-white border border-[#D4CEC5] px-3 py-1.5 rounded-full shadow-sm text-xs font-mono text-[#7A736B] flex items-center space-x-2 animate-bounce cursor-pointer z-10"
          style={{ animationDuration: "3.5s" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#FF4D00] inline-block animate-pulse" />
          <span>3 meetings today</span>
        </div>

        {/* Dynamic Title Row */}
        <div className="flex justify-between items-center mb-6 pt-2">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-[#7A736B]">Live Sandbox</h3>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-[#FF4D00]" />
              <span className="text-xl font-semibold tracking-tight font-sans text-[#1A1714]">
                {monthNames[month]} {year}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 bg-[#E8E2D9] p-1 rounded-lg">
            <button
              id="prev-month-btn"
              onClick={prevMonth}
              className="p-1 px-2 hover:bg-[#F2EFE8] rounded text-[#3D3733] transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="next-month-btn"
              onClick={nextMonth}
              className="p-1 px-2 hover:bg-[#F2EFE8] rounded text-[#3D3733] transition"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Split Grid Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[380px]">
          {/* Calendar Day Grid - standard 7 Column (8 cols in Grid, responsive) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Day Name Headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono text-[#7A736B] uppercase tracking-[0.1em] mb-3">
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
                <span>Su</span>
              </div>

              {/* Day Numbers Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  const dateString = getDateKey(day.date);
                  const isDaySelected = selectedDate && getDateKey(selectedDate) === dateString;
                  const isCurrent = day.isCurrentMonth;
                  const meetings = getBookingsForDate(day.date);
                  const hasMeetings = meetings.length > 0;
                  const dayIsToday = isToday(day.date);

                  return (
                    <button
                      key={idx}
                      onClick={() => handleDayClick(day.date)}
                      className={`relative aspect-square rounded-full flex flex-col items-center justify-center text-sm font-sans transition-all group focus:outline-none ${
                        !isCurrent 
                          ? "text-[#B5AFA8]" 
                          : "text-[#1A1714] font-medium"
                      } ${
                        dayIsToday && !isDaySelected
                          ? "border border-[#FF4D00] text-[#FF4D00]" 
                          : ""
                      } ${
                        isDaySelected 
                          ? "bg-[#FF4D00] text-white scale-105 shadow-md shadow-[#FF4D00]/20" 
                          : "hover:bg-[#E8E2D9] hover:scale-105"
                      }`}
                    >
                      <span>{day.dayNum}</span>
                      
                      {/* Meeting dots indicator */}
                      {hasMeetings && (
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                          isDaySelected ? "bg-white" : "bg-[#FF4D00]"
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Helper Legend */}
            <div className="mt-4 pt-4 border-t border-[#D4CEC5] flex items-center justify-between text-xs font-mono text-[#7A736B]">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full border border-[#FF4D00] inline-block" />
                <span>Today</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D00] inline-block" />
                <span>Bookings</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-[#FF4D00] rounded-full inline-block" />
                <span>Active</span>
              </div>
            </div>
          </div>

          {/* Time Slots Drawer / Panel on right */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[#D4CEC5] pt-6 lg:pt-0 lg:pl-6 flex flex-col h-full bg-[#E8E2D9]/30 rounded-2xl p-4 lg:bg-transparent lg:p-0">
            {selectedDate ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="mb-4">
                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-[#7A736B]">Availability for</span>
                    <h4 className="text-base font-semibold text-[#1A1714] font-sans">
                      {selectedDateString}
                    </h4>
                  </div>

                  <div 
                    className="space-y-2 max-h-[260px] overflow-y-auto pr-1 select-none cursor-default"
                    onMouseUp={handleSlotMouseUp}
                  >
                    {availableTimeSlots.map((slot, sIdx) => {
                      const dateKey = selectedDate ? getDateKey(selectedDate) : "";
                      const isSlotBooked = (bookedSlots[dateKey] || []).includes(slot);
                      
                      // Check if slot lies inside current drag selection range
                      const isInActiveDragRange = isDragging && dragStartIdx !== null && dragCurrentIdx !== null && 
                        sIdx >= Math.min(dragStartIdx, dragCurrentIdx) && sIdx <= Math.max(dragStartIdx, dragCurrentIdx);

                      return (
                        <button
                          key={sIdx}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSlotMouseDown(sIdx);
                          }}
                          onMouseEnter={() => handleSlotMouseEnter(sIdx)}
                          onMouseUp={(e) => {
                            e.stopPropagation();
                            handleSlotMouseUp();
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left font-mono text-xs cursor-row-resize ${
                            isSlotBooked
                              ? "bg-[#FFF0EB] border-[#FF4D00] text-[#1A1714]"
                              : isInActiveDragRange
                              ? "bg-[#FFF0EB] border-[#FF4D00] ring-1 ring-[#FF4D00] text-[#FF4D00] font-semibold pl-3 scale-[1.01]"
                              : "bg-[#FAFAF7] border-[#D4CEC5] text-[#3D3733] hover:border-[#FF4D00]/50 hover:bg-[#FFF0EB]/10 hover:pl-3"
                          }`}
                        >
                          <span className="font-medium">{slot}</span>
                          
                          {/* Book Pill Status */}
                          <span className="flex items-center">
                            {isSlotBooked ? (
                              <span className="flex items-center space-x-1 text-[#1DB954] font-sans font-semibold">
                                <motion.span 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-4 h-4 bg-[#1DB954] rounded-full flex items-center justify-center"
                                >
                                  <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />
                                </motion.span>
                                <span>Booked</span>
                              </span>
                            ) : isInActiveDragRange ? (
                              <span className="text-[#FF4D00] font-sans font-semibold text-[10px] uppercase tracking-wider animate-pulse">
                                Draged
                              </span>
                            ) : (
                              <span className="text-[#FF4D00] font-sans font-medium text-[11px] bg-[#FFF0EB] px-2 py-0.5 rounded-md hover:bg-[#FF4D00] hover:text-white transition-colors duration-150">
                                Drag or Click
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Active dragging micro-HUD display */}
                  {isDragging && dragStartIdx !== null && dragCurrentIdx !== null && (
                    <div className="mt-3.5 bg-[#FFF0EB] border border-[#FF4D00]/30 p-2 rounded-xl text-center">
                      <span className="font-mono text-[10px] text-[#FF4D00] font-bold block animate-pulse">
                        DRAGGING ACTION ACTIVE
                      </span>
                      <p className="text-xs text-[#1A1714] font-semibold mt-1">
                        Selected: {availableTimeSlots[Math.min(dragStartIdx, dragCurrentIdx)]} – {availableTimeSlots[Math.max(dragStartIdx, dragCurrentIdx)]}
                      </p>
                      <span className="text-[10px] text-[#7A736B] block font-mono mt-0.5">
                        Duration: {((Math.abs(dragCurrentIdx - dragStartIdx) + 1) * 30) >= 60 ? `${((Math.abs(dragCurrentIdx - dragStartIdx) + 1) * 30) / 60} hour(s)` : `${((Math.abs(dragCurrentIdx - dragStartIdx) + 1) * 30)} mins`} ({(Math.abs(dragCurrentIdx - dragStartIdx) + 1)} slots)
                      </span>
                    </div>
                  )}
                </div>

                {/* Micro Confirmation Animation Block */}
                <div className="mt-4 pt-3 border-t border-[#D4CEC5]/60 min-h-[48px] flex items-center">
                  <AnimatePresence mode="wait">
                    {justBooked ? (
                      <motion.div
                        key="booking-success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center space-x-2 text-xs font-sans text-[#1DB954] bg-[#1DB954]/10 p-2.5 rounded-xl w-full"
                      >
                        {/* Animated SVG Checkmark */}
                        <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <div>
                          {justBooked.startsWith("multiple-") ? (
                            (() => {
                              const parts = justBooked.split("-");
                              const count = parts[1];
                              const startSlot = parts[2];
                              const endSlot = parts[3];
                              return (
                                <>
                                  <span className="font-semibold block">Meeting Booked ({count} slots)!</span>
                                  <span className="text-[10px] text-[#7A736B] font-mono">{startSlot} to {endSlot} booked</span>
                                </>
                              );
                            })()
                          ) : (
                            <>
                              <span className="font-semibold block">Booking Confirmed!</span>
                              <span className="text-[10px] text-[#7A736B] font-mono">Slot {justBooked} scheduled</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.p
                        key="non-booking-prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[11px] text-[#7A736B] font-sans italic"
                      >
                        Drag over multiple slots to book longer durations or click a single slot.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <CalendarIcon className="w-8 h-8 text-[#B5AFA8] mb-2 animate-pulse" />
                <p className="text-xs font-mono text-[#7A736B] uppercase tracking-[0.1em]">Select a Day</p>
                <p className="text-xs text-[#7A736B] max-width-[200px] mt-1 font-sans">
                  Click on any day of the month to view available slots.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
