import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Keypad } from '../../components/shared/Keypad';
import { PinDots } from '../../components/shared/PinDots';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { PIN_MAP, BUSINESS_NAME } from '../../shared/constants';

export const Login: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const { setRole, setAuthenticated, mode } = useAuthStore();

  const handleInput = (key: string) => {
    if (pin.length < 4) {
      const newPin = pin + key;
      setPin(newPin);
      setError('');
      if (newPin.length === 4) {
        validatePin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const validatePin = (pinToValidate: string) => {
    const role = PIN_MAP[pinToValidate as keyof typeof PIN_MAP];

    if (!role) {
      setError('Invalid PIN');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setPin(''), 500);
      return;
    }

    if (mode === 'server' && role === 'cashier') {
      setError('Unauthorized: Admin & Manager Access Only');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setPin(''), 500);
      return;
    }

    setRole(role);
    setAuthenticated(true);
    navigate(mode === 'server' ? '/server/dashboard' : '/outlet/pos');
  };

  const handleSubmit = () => {
    if (pin.length === 4) {
      validatePin(pin);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleInput(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Enter') {
        if (pin.length === 4) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative flex items-center justify-center"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1600")',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40" />

      <div className="relative z-10 grid grid-cols-2 gap-16 max-w-6xl px-8">
        {/* Left Panel */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Shield size={40} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-3 leading-tight">
              {BUSINESS_NAME}
            </h1>
            <p className="text-2xl text-blue-100 font-light">Your Daily Dose, Secured</p>
          </div>

          <PinDots length={pin.length} maxLength={4} />

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-center mb-6 animate-pulse">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={pin.length < 4}
            size="lg"
            className="mt-auto"
          >
            VERIFY ACCESS
          </Button>
        </div>

        {/* Right Panel - Keypad */}
        <div className="flex items-center justify-center">
          <Keypad
            onInput={handleInput}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
            shake={shake}
          />
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};
