import React from 'react';
import { 
  Globe, 
  DollarSign, 
  Layers, 
  Eye, 
  TrendingUp, 
  Compass, 
  Sparkles,
  Check,
  ShieldCheck,
  MessageCircle,
  Clock,
  LogOut,
  Zap,
  CreditCard,
  Bell,
  Copy
} from 'lucide-react';
import { WebsiteData, SaleOrder } from '../types/site';
import { AppUser } from '../types/auth';
import { calculateDaysRemaining } from '../services/authService';

interface NavbarProps {
  currentView: 'builder' | 'sales' | 'maps' | 'sites_list' | 'live_preview' | 'admin' | 'pricing' | 'login';
  setCurrentView: (view: 'builder' | 'sales' | 'maps' | 'sites_list' | 'live_preview' | 'admin' | 'pricing' | 'login') => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  activeSite: WebsiteData;
  orders: SaleOrder[];
  currentUser: AppUser | null;
  onOpenSalesScripts: () => void;
  onOpenAdminPanel: () => void;
  onOpenPricing: () => void;
  onLogout: () => void;
  newPurchasesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentStep,
  setCurrentStep,
  activeSite,
  orders,
  currentUser,
  onOpenSalesScripts,
  onOpenAdminPanel,
  onOpenPricing,
  onLogout,
  newPurchasesCount = 0
}) => {
  const totalRevenue = orders.reduce((sum, order) => sum + (order.status === 'pago' ? order.totalAmount : 0), 0);
  const totalSalesCount = orders.filter(o => o.status === 'pago').length;

  const steps = [
    { num: 1, label: 'Informações & Preço' },
    { num: 2, label: 'Design & Estrutura' },
    { num: 3, label: 'Criar com IA' },
    { num: 4, label: 'Publicar & Vender' }
  ];

  const isAdmin = currentUser?.role === 'admin';
  const { days, isExpired } = currentUser ? calculateDaysRemaining(currentUser) : { days: 0, isExpired: false };
  const [copiedDemo, setCopiedDemo] = React.useState(false);

  const handleCopyDemoLink = async () => {
    const demoUrl = `${window.location.origin}${window.location.pathname}?demo=${activeSite.id}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(demoUrl);
      } else {
        const ta = document.createElement('textarea');
        ta.value = demoUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedDemo(true);
      setTimeout(() => setCopiedDemo(false), 2000);
    } catch {}
  };

  return (
    <header className="sticky top-0 z-40 bg-black border-b border-slate-800 text-white shadow-xl">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Tool Name: Ferramenta IA Lucro */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              type="button"
              onClick={() => setCurrentView('builder')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-blue-600 to-black flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-base tracking-tight text-white">
                    Ferramenta IA <span className="text-emerald-400">Lucro</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40">
                    Pro
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[130px] sm:max-w-[200px]">
                  Site: <strong className="text-slate-200">{activeSite.companyInfo.name || 'Sem nome'}</strong>
                </div>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs (Desktop & Tablet) */}
          <nav aria-label="Navegação principal" className="hidden lg:flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentView('builder')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'builder'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-300" />
              <span>Criador de Site</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('sales')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                currentView === 'sales'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saldo & Vendas</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                {totalSalesCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('maps')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                currentView === 'maps'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Maps & Radar</span>
            </button>

            <button
              type="button"
              onClick={onOpenSalesScripts}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Copie mensagens de alta conversão prontas para fechar vendas no WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Mensagens Prontas</span>
            </button>

            <button
              type="button"
              onClick={onOpenPricing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                currentView === 'pricing'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Planos</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAdminPanel}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-amber-300 hover:text-white hover:bg-amber-950/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Painel Admin</span>
                {newPurchasesCount > 0 && (
                  <span className="animate-pulse px-1.5 py-0.2 rounded-full text-[9px] bg-red-600 text-white font-black">
                    {newPurchasesCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setCurrentView('sites_list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentView === 'sites_list'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Meus Sites</span>
            </button>
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* User Plan & Days Widget */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                {currentUser.isLifetime || isAdmin ? (
                  <span className="flex items-center gap-1 text-[11px] font-black text-amber-300">
                    <span>♾️</span>
                    <span>Vitalício</span>
                  </span>
                ) : (
                  <span className={`flex items-center gap-1 text-[11px] font-black ${
                    isExpired ? 'text-red-400' : days <= 5 ? 'text-amber-300' : 'text-emerald-400'
                  }`}>
                    <Clock className="w-3 h-3" />
                    <span>{days}d restantes</span>
                  </span>
                )}
              </div>
            )}

            {/* Quick Balance Widget (Green & Black) */}
            <button
              type="button"
              onClick={() => setCurrentView('sales')}
              title="Clique para abrir detalhes do saldo e histórico de vendas"
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/40 text-emerald-400 transition-all hover:scale-102 group cursor-pointer shadow-sm shadow-emerald-500/10"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-[10px] uppercase font-bold text-emerald-300">Saldo</div>
                <div className="text-xs sm:text-sm font-black text-white">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </button>

            {/* Quick Copy Demo Link */}
            <button
              type="button"
              onClick={handleCopyDemoLink}
              title="Copiar Link Demonstrativo para Enviar ao Cliente"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 transition-all cursor-pointer"
            >
              {copiedDemo ? <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{copiedDemo ? 'Link Copiado!' : 'Copiar Link Demo'}</span>
            </button>

            {/* Live Preview Button (Blue/Cyan) */}
            <button
              type="button"
              onClick={() => setCurrentView('live_preview')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Site no Ar</span>
              <span className="sm:hidden">Ver Site</span>
            </button>

            {/* Logout button */}
            {currentUser && (
              <button
                type="button"
                onClick={onLogout}
                title="Sair da conta"
                className="p-2 rounded-xl bg-slate-900 hover:bg-red-950 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

          </div>
        </div>

        {/* 4 Steps Indicator Bar when inside Builder */}
        {currentView === 'builder' && (
          <div className="py-2.5 border-t border-slate-800/90 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-3 min-w-max mx-auto px-1">
              {steps.map((step, idx) => {
                const isActive = currentStep === step.num;
                const isPast = currentStep > step.num;
                return (
                  <React.Fragment key={step.num}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step.num)}
                      className={`flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white ring-2 ring-blue-400/50 shadow-md shadow-blue-600/20'
                          : isPast
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40'
                          : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                        isActive 
                          ? 'bg-white text-blue-700' 
                          : isPast 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : step.num}
                      </span>
                      <span className="whitespace-nowrap">
                        Passo {step.num}: {step.label}
                      </span>
                    </button>
                    {idx < steps.length - 1 && (
                      <div className={`w-4 sm:w-8 h-0.5 shrink-0 ${isPast ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Phones) */}
      <nav aria-label="Navegação mobile" className="lg:hidden flex items-center justify-around bg-black border-t border-slate-800 px-2 py-2">
        <button
          type="button"
          onClick={() => setCurrentView('builder')}
          className={`flex flex-col items-center gap-1 min-h-[44px] justify-center px-2 rounded-lg cursor-pointer ${
            currentView === 'builder' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px]">Construtor</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('sales')}
          className={`flex flex-col items-center gap-1 min-h-[44px] justify-center px-2 rounded-lg cursor-pointer ${
            currentView === 'sales' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-[10px]">Saldo ({totalSalesCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('maps')}
          className={`flex flex-col items-center gap-1 min-h-[44px] justify-center px-2 rounded-lg cursor-pointer ${
            currentView === 'maps' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span className="text-[10px]">Maps</span>
        </button>

        <button
          type="button"
          onClick={onOpenSalesScripts}
          className="flex flex-col items-center gap-1 min-h-[44px] justify-center px-2 rounded-lg text-amber-400 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-[10px]">Textos</span>
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={onOpenAdminPanel}
            className={`flex flex-col items-center gap-1 min-h-[44px] justify-center px-2 rounded-lg cursor-pointer ${
              currentView === 'admin' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px]">Admin</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenPricing}
          className={`flex flex-col items-center gap-1 min-h-[44px] justify-center px-2 rounded-lg cursor-pointer ${
            currentView === 'pricing' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-[10px]">Planos</span>
        </button>
      </nav>
    </header>
  );
};
