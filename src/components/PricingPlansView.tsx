import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CreditCard, 
  ArrowLeft, 
  Copy, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  Send,
  X,
  TrendingUp,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TOOL_PRICING_PLANS, ToolPricingPlan, SubscriptionPurchase, AppUser } from '../types/auth';

interface PricingPlansViewProps {
  onBackToApp?: () => void;
  onGoToLogin: () => void;
  onRecordSubscription: (sub: Omit<SubscriptionPurchase, 'id' | 'createdAt'>) => Promise<{ purchase: SubscriptionPurchase; user: AppUser }>;
}

export const PricingPlansView: React.FC<PricingPlansViewProps> = ({
  onBackToApp,
  onGoToLogin,
  onRecordSubscription
}) => {
  const [selectedPlan, setSelectedPlan] = useState<ToolPricingPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Buyer Form
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedPurchaseInfo, setCompletedPurchaseInfo] = useState<{ purchase: SubscriptionPurchase; user: AppUser } | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  const handleOpenCheckout = (plan: ToolPricingPlan) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handlePayOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !buyerEmail.trim() || !buyerName.trim()) return;

    setIsProcessing(true);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setTimeout(async () => {
      const result = await onRecordSubscription({
        userName: buyerName.trim(),
        userEmail: buyerEmail.trim().toLowerCase(),
        userPhone: buyerPhone.trim() || '(11) 99999-9999',
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        paymentMethod,
        status: 'pago',
        daysDuration: selectedPlan.daysDuration,
        isLifetime: selectedPlan.isLifetime
      });

      setIsProcessing(false);
      setCompletedPurchaseInfo(result);
    }, 700);
  };

  const pixKeyRandom = `00020126580014br.gov.bcb.pix0136fa89c314-5b23-41a9-91d1-${Math.floor(1000000000 + Math.random() * 9000000000)}520400005303986540${selectedPlan?.price.toFixed(2)}5802BR5913FERRAMENTA IA6009SAO PAULO62070503***6304`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToApp && (
              <button
                type="button"
                onClick={onBackToApp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-black text-sm sm:text-base text-white">
                Ferramenta IA <span className="text-emerald-400">Lucro</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoToLogin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-bold text-xs transition-colors cursor-pointer border border-emerald-500/30"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Já sou assinante (Entrar)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Pricing Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>Planos Oficiais com Contagem Automática de Dias</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Escolha seu Plano e Comece a <span className="text-emerald-400">Vender Sites Hoje</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Liberação imediata com Inteligência Artificial, radar de prospecção do Google Maps e mensagens prontas para fechar vendas no WhatsApp.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TOOL_PRICING_PLANS.map((plan) => {
            const isLifetime = plan.isLifetime;
            const isHighlight = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:scale-102 ${
                  isHighlight
                    ? 'bg-gradient-to-b from-amber-950/50 via-slate-900 to-slate-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/20'
                    : 'bg-slate-900/90 border border-slate-800 shadow-xl'
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isHighlight
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'bg-emerald-600 text-white shadow-md'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-black text-white mt-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 min-h-[34px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="my-5 pb-5 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl sm:text-4xl font-black tracking-tight ${
                        isHighlight ? 'text-amber-300' : 'text-white'
                      }`}>
                        {plan.priceDisplay}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{plan.periodLabel}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenCheckout(plan)}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                    isHighlight
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-500/25'
                  }`}
                >
                  <Zap className="w-4 h-4 stroke-[3]" />
                  <span>Pagar e Liberar Agora</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">
                Garantia Incondicional & Liberação Automática
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Assim que você concluir o pagamento, o sistema notifica o painel administrativo e ativa os seus dias de acesso imediatamente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenCheckout(TOOL_PRICING_PLANS[3])}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              Garantir Plano Vitalício (R$ 230,99) ♾️
            </button>
          </div>
        </div>

      </main>

      {/* Checkout Modal */}
      {isCheckoutOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-400">Checkout Seguro</div>
                <h3 className="text-base font-black text-white">{selectedPlan.name}</h3>
              </div>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setCompletedPurchaseInfo(null);
                }}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If purchase completed: Show Credentials Screen */}
            {completedPurchaseInfo ? (
              <div className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-white">Pagamento Aprovado com Sucesso!</h4>
                  <p className="text-xs text-slate-300">
                    Sua assinatura de <strong>{selectedPlan.name}</strong> foi ativada.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="text-emerald-400 font-bold uppercase text-[10px]">Dados de Acesso Criados:</div>
                  <div><strong>E-mail:</strong> {completedPurchaseInfo.user.email}</div>
                  <div><strong>Senha:</strong> {completedPurchaseInfo.user.password}</div>
                  <div><strong>Validade:</strong> {selectedPlan.isLifetime ? 'Acesso Permanente (Vitalício)' : `${selectedPlan.daysDuration} dias liberados`}</div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-200 text-xs">
                  🔔 <strong>Notificação Enviada:</strong> O administrador recebeu o aviso desta compra em tempo real no painel de controle!
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    onGoToLogin();
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs cursor-pointer shadow-lg"
                >
                  Ir para a Tela de Login e Começar Agora →
                </button>
              </div>
            ) : (
              <form onSubmit={handlePayOrder} className="p-5 sm:p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Seu E-mail (Para Acesso)</label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Seu WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Forma de Pagamento</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'pix'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>PIX Instantâneo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Cartão de Crédito</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'pix' && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">Chave PIX Copia e Cola:</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(pixKeyRandom);
                          setCopiedPix(true);
                          setTimeout(() => setCopiedPix(false), 3000);
                        }}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPix ? 'Copiado!' : 'Copiar Chave'}</span>
                      </button>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] text-slate-400 break-all select-all">
                      {pixKeyRandom}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total a Pagar:</span>
                  <span className="text-xl font-black text-emerald-400">
                    {selectedPlan.priceDisplay}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Processando Pagamento...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 stroke-[3]" />
                      <span>Confirmar Pagamento & Ativar Acesso Agora</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
