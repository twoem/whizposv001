import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Keypad } from '../../components/shared/Keypad';
import { PinDots } from '../../components/shared/PinDots';
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

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative flex items-center justify-center"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1600")',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40" />

      <div className="relative z-10 w-full max-w-6xl px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch min-h-[600px]">
          {/* Left Panel - Branding & Info */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-shadow">
                <Shield size={56} className="text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-black text-white mb-4 leading-tight">
                  {BUSINESS_NAME}
                </h1>
                <p className="text-2xl text-blue-100 font-light">Your Daily Dose, Secured</p>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4 pt-8">
              <div className="flex items-start gap-4 text-white/90">
                <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Secure PIN Authentication</p>
                  <p className="text-sm text-white/70">Role-based access control</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-white/90">
                <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Multi-Outlet Management</p>
                  <p className="text-sm text-white/70">Manage all locations in one place</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-white/90">
                <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Real-Time Analytics</p>
                  <p className="text-sm text-white/70">Track sales and inventory instantly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex flex-col justify-center">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-12 space-y-8 border border-white/20">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Enter your PIN to access your account</p>
              </div>

              {/* PIN Input Display */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Security PIN</label>
                <PinDots length={pin.length} maxLength={4} />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex-1 h-14 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">•</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg text-center font-semibold animate-pulse">
                  {error}
                </div>
              )}

              {/* Keypad */}
              <Keypad
                onInput={handleInput}
                onDelete={handleDelete}
                onSubmit={handleSubmit}
                shake={shake}
              />

              {/* Demo Credentials */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-3 font-semibold">Demo Credentials:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-blue-50 px-3 py-2 rounded-lg text-center">
                    <p className="font-bold text-blue-700">Admin</p>
                    <p className="text-blue-600 font-mono">9999</p>
                  </div>
                  <div className="bg-purple-50 px-3 py-2 rounded-lg text-center">
                    <p className="font-bold text-purple-700">Manager</p>
                    <p className="text-purple-600 font-mono">8888</p>
                  </div>
                  <div className="bg-green-50 px-3 py-2 rounded-lg text-center">
                    <p className="font-bold text-green-700">Cashier</p>
                    <p className="text-green-600 font-mono">1234</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
