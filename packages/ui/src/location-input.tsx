import React, { ChangeEventHandler } from "react";
import { useFocus } from "@bymeisam/use";
import { Search, X } from "lucide-react";

interface LocationInputProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isShowing?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onValueChange,
  placeholder = "Search for a city...",
  className = "",
  isShowing = false,
}) => {
  const { ref: inputRef, focus } = useFocus<HTMLInputElement>();

  const inputHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    onValueChange(e.target.value);
  };

  React.useEffect(() => {
    if (isShowing) focus();
  }, [isShowing, focus]);

  const clearSearch = () => {
    onValueChange("");
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={inputHandler}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
      />
      {value && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-white/50" />
        </button>
      )}
    </div>
  );
};

