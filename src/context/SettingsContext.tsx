"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type GradeDisplay = "v-scale" | "difficulty";

interface SettingsContextType {
  gradeDisplay: GradeDisplay;
  setGradeDisplay: (display: GradeDisplay) => void;
  toggleGradeDisplay: () => void;
  showDifficulty: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [gradeDisplay, setGradeDisplay] = useState<GradeDisplay>("v-scale");

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("route-mill-grade-display");
    if ((saved === "v-scale" || saved === "difficulty") && saved !== gradeDisplay) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGradeDisplay(saved);
    }
  }, [gradeDisplay]);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("route-mill-grade-display", gradeDisplay);
  }, [gradeDisplay]);

  const toggleGradeDisplay = () => {
    setGradeDisplay((prev) => (prev === "v-scale" ? "difficulty" : "v-scale"));
  };

  const showDifficulty = gradeDisplay === "difficulty";

  return (
    <SettingsContext.Provider value={{ gradeDisplay, setGradeDisplay, toggleGradeDisplay, showDifficulty }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
