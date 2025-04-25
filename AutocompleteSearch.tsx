import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Doctor } from "@/types/doctor";
import { Search } from "lucide-react";

interface AutocompleteSearchProps {
  doctors: Doctor[];
  onSearch: (query: string) => void;
}

const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({ doctors, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      const filteredSuggestions = doctors
        .filter((doctor) =>
          doctor.name.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 3);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      onSearch("");
    }
  };

  const handleSelectSuggestion = (doctorName: string) => {
    setSearchQuery(doctorName);
    setShowSuggestions(false);
    onSearch(doctorName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          data-testid="autocomplete-input"
          ref={inputRef}
          type="text"
          placeholder="Search doctors by name..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(Boolean(searchQuery && suggestions.length))}
          className="pr-10 h-12 border-medical-400 focus:border-medical-600 focus-visible:ring-medical-500"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute mt-1 w-full bg-white shadow-lg rounded-md border z-10"
        >
          {suggestions.map((doctor) => (
            <div
              key={doctor.id}
              data-testid="suggestion-item"
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectSuggestion(doctor.name)}
            >
              {doctor.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearch;
