import React from 'react';

interface PinDotsProps {
  length: number;
  maxLength?: number;
}

export const PinDots: React.FC<PinDotsProps> = ({ length, maxLength = 4 }) => {
  return (
    <div className="flex gap-3 justify-center mb-6">
      {Array.from({ length: maxLength }).map((_, idx) => (
        <div
          key={idx}
          className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
            idx < length
              ? 'bg-blue-500 border-blue-400 scale-110'
              : 'bg-transparent border-gray-300'
          }`}
        />
      ))}
    </div>
  );
};
