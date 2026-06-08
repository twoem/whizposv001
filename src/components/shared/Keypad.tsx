import React from 'react';
import { Delete } from 'lucide-react';

interface KeypadProps {
  onInput: (key: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  shake?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({ onInput, onDelete, onSubmit, disabled = false, shake = false }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace']
  ];

  const handleKeyPress = (key: string) => {
    if (key === 'clear') {
      for (let i = 0; i < 4; i++) onDelete();
    } else if (key === 'backspace') {
      onDelete();
    } else {
      onInput(key);
    }
  };

  return (
    <div className={`grid grid-cols-3 gap-3 p-6 bg-white border border-gray-200 rounded-2xl shadow-lg ${shake ? 'animate-shake' : ''}`}>
      {keys.map((row, rowIdx) => (
        <React.Fragment key={rowIdx}>
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              disabled={disabled}
              className={`
                py-4 rounded-xl font-bold text-lg transition-all duration-150
                active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                ${key === 'clear' || key === 'backspace'
                  ? 'col-span-1 bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                }
              `}
            >
              {key === 'clear' ? 'C' : key === 'backspace' ? <Delete size={20} /> : key}
            </button>
          ))}
        </React.Fragment>
      ))}
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="col-span-3 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        VERIFY ACCESS
      </button>
    </div>
  );
};
