import React from 'react';
import { Clock, AlertTriangle, Zap, LogOut, MessageCircle, RefreshCw } from 'lucide-react';
import { AppUser } from '../types/auth';

interface ExpiredSubscriptionNoticeProps {
  user: AppUser;
  onRenewPlan: () => void;
  onLogout: () => void;
}

export const ExpiredSubscriptionNotice: React.FC<ExpiredSubscriptionNoticeProps> = ({
  user,
  onRenewPlan,
  onLogout
}) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
          <Clock className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-500/40 text-[11px] font-bold mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Acesso Suspenso por Término de Prazo</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Seu Plano Expirou!
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Olá, <strong className="text-white">{user.name}</strong>. Os dias do seu <strong>{user.planName}</strong> chegaram ao fim. Para continuar criando sites com IA, buscando clientes no Google Maps e usando os scripts de vendas, renove seu acesso.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5 font-mono text-slate-400">
          <div><strong className="text-slate-200">Conta:</strong> {user.email}</div>
          <div><strong className="text-slate-200">Último Plano:</strong> {user.planName}</div>
          <div><strong className="text-slate-200">Data de Expiração:</strong> {new Date(user.expiresAt).toLocaleDateString('pt-BR')}</div>
          <div><strong className="text-red-400">Status Atual:</strong> Bloqueado até renovação</div>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={onRenewPlan}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 stroke-[3]" />
            <span>Renovar Meu Plano Agora (Reativação Imediata)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const text = encodeURIComponent(`Olá! Minha conta (${user.email}) expirou na Ferramenta IA Lucro e gostaria de renovar meu acesso.`);
                window.open(`https://wa.me/5511999999999?text=${text}`, '_blank');
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Falar no Suporte</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
