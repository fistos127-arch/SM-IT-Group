
import React from 'react';
import { TeamIcon } from './icons';

interface TeamInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const TeamInput: React.FC<TeamInputProps> = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="w-full">
      <label htmlFor={label} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <TeamIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          id={label}
          name={label}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full rounded-md border-0 bg-white/5 py-3 pl-10 pr-3 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 transition-colors"
        />
      </div>
    </div>
  );
};

export default TeamInput;
