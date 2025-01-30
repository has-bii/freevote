"use client";

import { useTheme } from "next-themes";
import React from "react";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      size="icon"
      variant="ghost"
      className="h-7 w-7"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
