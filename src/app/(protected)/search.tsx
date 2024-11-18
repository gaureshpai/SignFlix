import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce, useDebouncedCallback } from 'use-debounce';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [debouncedValueDelayed] = useDebounce(debouncedValue, 500);
  

  useEffect(() => {
    onChange(debouncedValueDelayed);
  }, [debouncedValueDelayed, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDebouncedValue(newValue);
  };



  return (
    <div className="relative w-full max-w-md">

    <input
      type="search"
      value={debouncedValue}
      onChange={handleChange}
      placeholder="Search..."
      className="w-full py-2 pl-4 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-blue-500"
      >
        <Search size={20} />
      </button>
    </div>
  );
}