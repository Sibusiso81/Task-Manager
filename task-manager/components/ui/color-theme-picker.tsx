import React from 'react'
import { Button } from "@/components/ui/button"
import { Palette } from 'lucide-react'

const themes = ['blue', 'green', 'purple', 'orange', 'red']

interface ColorThemePickerProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
}

export function ColorThemePicker({ currentTheme, setTheme }: ColorThemePickerProps) {
  return (
    <div className="relative">
      <Button variant="outline" className="flex items-center space-x-2">
        <Palette size={16} />
        <span>Theme</span>
      </Button>
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {themes.map((theme) => (
            <button
              key={theme}
              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left ${currentTheme === theme ? 'bg-gray-100' : ''}`}
              role="menuitem"
              onClick={() => setTheme(theme)}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

