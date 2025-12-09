
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim());
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-emerald-900 p-3 rounded-2xl shadow-lg mb-4">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <div className="text-emerald-900 font-bold text-4xl tracking-tighter leading-none text-center">
            VARP <span className="text-slate-600 text-xl font-normal tracking-normal">Imóveis</span>
          </div>
          <div className="text-sm text-amber-600 font-serif italic mt-2">Gestão Inteligente &bull; Desde 1978</div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Bem-vindo de volta</h2>
            <p className="text-slate-500 text-sm mb-8">Digite seu nome de usuário ou código de corretor para acessar seu painel.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                  Identificação do Usuário
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-3 px-4 bg-slate-50 text-slate-900 placeholder-slate-400"
                  placeholder="Ex: corretor.joao"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:-translate-y-0.5"
              >
                Acessar Sistema
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </form>
          </div>
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400">
              Ambiente seguro. Seus dados são salvos automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
