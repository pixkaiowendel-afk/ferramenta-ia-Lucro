import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { AppUser } from '../types/auth';
import { DEFAULT_ADMIN_USER } from '../services/authService';

interface LoginViewProps {
  users: AppUser[];
  onLoginSuccess: (user: AppUser) => void;
  onGoToPricing: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  users,
  onLoginSuccess,
  onGoToPricing
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Por favor, informe seu e-mail e senha.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find matching user from database or cached users
      const found = users.find(
        u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
      );

      // Check if matches default owner admin
      const isOwner = cleanEmail === DEFAULT_ADMIN_USER.email.toLowerCase() && cleanPass === DEFAULT_ADMIN_USER.password;

      if (found) {
        if (found.status === 'blocked') {
          setErrorMsg('Sua conta foi suspensa temporariamente. Entre em contato com o administrador.');
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        onLoginSuccess(found);
      } else if (isOwner) {
        setIsLoading(false);
        onLoginSuccess(DEFAULT_ADMIN_USER);
      } else {
        setIsLoading(false);
        setErrorMsg('E-mail ou senha incorretos. Verifique suas credenciais enviadas por e-mail.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-600 to-black flex items-center justify-center shadow-xl shadow-emerald-500/20 border border-emerald-400/30 mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Ferramenta IA <span className="text-emerald-400">Lucro</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Entre na sua conta para acessar o Criador de Sites com IA & Radar de Vendas
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Seu E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Sua Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-101 active:scale-99 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span>Verificando credenciais...</span>
            ) : (
              <>
                <span>Entrar na Ferramenta</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </>
            )}
          </button>
        </form>

        {/* Pricing link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onGoToPricing}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors cursor-pointer"
          >
            Não tem uma conta ativa? Conheça os planos e assine agora →
          </button>
        </div>

      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        Ambiente Seguro com Criptografia e Autenticação em Tempo Real
      </div>
    </div>
  );
};
