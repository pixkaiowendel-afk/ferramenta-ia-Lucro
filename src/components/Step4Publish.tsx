import React, { useState } from 'react';
import { 
  Rocket, 
  Copy, 
  Share2, 
  DollarSign, 
  ArrowLeft, 
  Zap, 
  CreditCard, 
  Eye, 
  Check, 
  CheckCircle2, 
  Edit3, 
  MessageCircle, 
  Compass, 
  MapPin, 
  ExternalLink, 
  Lock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WebsiteData, WebsiteCommercialPlan } from '../types/site';

interface Step4PublishProps {
  site: WebsiteData;
  onUpdateSite: (site: WebsiteData) => void;
  onBack: () => void;
  onViewLive: () => void;
  onGoToSales: () => void;
  onRecordSiteSale?: (site: WebsiteData) => void;
  onGoToMaps?: (query?: string) => void;
  onOpenSalesScripts?: () => void;
}

export const Step4Publish: React.FC<Step4PublishProps> = ({
  site,
  onUpdateSite,
  onBack,
  onViewLive,
  onGoToSales,
  onRecordSiteSale,
  onGoToMaps,
  onOpenSalesScripts
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [subdomain, setSubdomain] = useState(site.domainSlug || 'minhaempresa');
  const [enablePix, setEnablePix] = useState(true);
  const [enableCard, setEnableCard] = useState(true);
  const [enableWhatsAppSync, setEnableWhatsAppSync] = useState(true);

  const commercial: WebsiteCommercialPlan = site.commercial || {
    siteSalePrice: 1500,
    maintenanceMonthlyPrice: 99,
    paymentTerms: '50% entrada + 50% na entrega',
    proposalStatus: 'orcamento',
    saleRecorded: false
  };

  const [siteSalePriceInput, setSiteSalePriceInput] = useState<number>(commercial.siteSalePrice || 1500);
  const [monthlyFeeInput, setMonthlyFeeInput] = useState<number>(commercial.maintenanceMonthlyPrice || 99);
  const [paymentTermsInput, setPaymentTermsInput] = useState<string>(commercial.paymentTerms || '50% de entrada + 50% na entrega');

  const liveDemoUrl = `${window.location.origin}${window.location.pathname}?demo=${site.id}`;
  const fullUrl = liveDemoUrl;
  const customDomainDisplay = `https://${subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '')}.webempresa.app`;

  // Safe clipboard helper
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {
      // fallback below
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      return false;
    }
  };

  const handlePublish = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }

    onUpdateSite({
      ...site,
      published: true,
      domainSlug: subdomain.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      publishedAt: new Date().toISOString()
    });
  };

  const handleSaveCommercialPricing = () => {
    onUpdateSite({
      ...site,
      commercial: {
        ...commercial,
        siteSalePrice: siteSalePriceInput,
        maintenanceMonthlyPrice: monthlyFeeInput,
        paymentTerms: paymentTermsInput
      }
    });
    setIsEditingPrice(false);
  };

  const handleCopyProposal = async () => {
    const formattedProposal = 
`🚀 *PROPOSTA COMERCIAL: NOVO SITE PROFISSIONAL*
*Cliente:* ${commercial.clientBuyerName || site.companyInfo.name}

Olá! Temos o prazer de apresentar a demonstração exclusiva do seu novo site oficial e responsivo:

🌐 *Link de Demonstração Online:*
${fullUrl}

💼 *Investimento do Projeto:*
• *Valor de Criação do Site:* R$ ${siteSalePriceInput.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
${monthlyFeeInput > 0 ? `• *Hospedagem & Suporte Mensal:* R$ ${monthlyFeeInput.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês\n` : ''}• *Condições:* ${paymentTermsInput}

✨ *O que está incluso:*
- Design 100% otimizado para celulares e computadores
- Catálogo virtual integrado com botão de pedidos
- Conexão com Google Maps e radar de clientes
- Botão de WhatsApp direto para atendimento
- Certificado de Segurança SSL e hospedagem de alta velocidade

Estamos à disposição para ativar o site e iniciar o seu faturamento online!`;

    await copyToClipboard(formattedProposal);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 3000);
  };

  const handleRecordSiteSaleAction = () => {
    try {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    if (onRecordSiteSale) {
      onRecordSiteSale({
        ...site,
        commercial: {
          ...commercial,
          siteSalePrice: siteSalePriceInput,
          maintenanceMonthlyPrice: monthlyFeeInput,
          paymentTerms: paymentTermsInput,
          proposalStatus: 'vendido',
          saleRecorded: true
        }
      });
    }
  };

  const handleCopyLink = async () => {
    await copyToClipboard(liveDemoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestDemoLink = () => {
    window.open(liveDemoUrl, '_blank');
  };

  const handleSendWhatsAppDemo = () => {
    const rawPhone = (commercial.clientBuyerPhone || site.companyInfo.whatsapp || '').replace(/\D/g, '');
    const clientName = commercial.clientBuyerName || site.companyInfo.name;
    const msg = 
`Olá, ${clientName}! 👋

Preparei uma demonstração interativa exclusiva do novo site profissional da *${site.companyInfo.name}* com catálogo digital e botão de pedidos!

👉 *Acesse a demonstração online aqui:*
${liveDemoUrl}

O que achou do visual e da facilidade para os clientes fazerem pedidos?`;

    const phoneParam = rawPhone ? (rawPhone.startsWith('55') ? rawPhone : '55' + rawPhone) : '';
    window.open(`https://wa.me/${phoneParam}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      
      {/* Header Info */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-3">
          <Rocket className="w-3.5 h-3.5" />
          Passo 4 de 4: Publicação & Venda Comercial
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Publique seu site e comece a vender
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
          Configure o endereço web, confirme o preço de venda do projeto e ative os pagamentos.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Commercial Proposal & Website Sale Price Card (Green & Black) */}
        <div className="bg-black rounded-2xl border-2 border-emerald-500/40 shadow-xl p-5 sm:p-7 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black shrink-0 mt-0.5">
                <DollarSign className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                    Preço de Venda deste Site para o Cliente
                  </h2>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    commercial.saleRecorded || commercial.proposalStatus === 'vendido'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {commercial.saleRecorded || commercial.proposalStatus === 'vendido' ? '✓ Vendido' : 'Em Negociação'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Valor cobrado para entregar este projeto ao cliente contratante.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditingPrice ? (
                <button
                  type="button"
                  onClick={() => setIsEditingPrice(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition border border-slate-700 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alterar Preço</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveCommercialPricing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Salvar Preço</span>
                </button>
              )}
            </div>
          </div>

          {/* Price Displays or Edit Form */}
          {!isEditingPrice ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  💰 Preço de Venda do Projeto:
                </span>
                <span className="text-2xl font-black text-emerald-400 tracking-tight">
                  R$ {siteSalePriceInput.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Taxa de criação e entrega</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  🔄 Mensalidade de Suporte/Hospedagem:
                </span>
                <span className="text-xl font-bold text-blue-400">
                  {monthlyFeeInput > 0
                    ? `R$ ${monthlyFeeInput.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês`
                    : 'Sem mensalidade'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Recorrente mensal</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  📋 Condições de Pagamento:
                </span>
                <span className="text-sm font-bold text-white line-clamp-1">
                  {paymentTermsInput}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                  Cliente: {commercial.clientBuyerName || site.companyInfo.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/95 border border-emerald-500/40 rounded-xl p-4 my-5 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1">
                    Preço de Venda do Site (R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={siteSalePriceInput}
                    onChange={(e) => setSiteSalePriceInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-slate-700 rounded-lg px-3 py-2 text-sm font-black text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mensalidade de Manutenção (R$/mês)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={monthlyFeeInput}
                    onChange={(e) => setMonthlyFeeInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Condição de Pagamento
                  </label>
                  <input
                    type="text"
                    value={paymentTermsInput}
                    onChange={(e) => setPaymentTermsInput(e.target.value)}
                    placeholder="Ex: 50% entrada + 50% na entrega"
                    className="w-full bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-medium">Sugestões:</span>
                {[
                  { label: 'Landing Page R$ 800', p: 800, m: 49 },
                  { label: 'Institucional R$ 1.500', p: 1500, m: 99 },
                  { label: 'Loja R$ 2.400', p: 2400, m: 149 },
                  { label: 'Premium R$ 3.800', p: 3800, m: 199 }
                ].map((s) => (
                  <button
                    key={s.p}
                    type="button"
                    onClick={() => {
                      setSiteSalePriceInput(s.p);
                      setMonthlyFeeInput(s.m);
                    }}
                    className="px-2 py-0.5 rounded bg-black hover:bg-slate-800 text-[10px] text-slate-300 border border-slate-800 transition cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyProposal}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition border border-slate-700 cursor-pointer"
              >
                {copiedProposal ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span className="text-emerald-400">Proposta Copiada para WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Copiar Proposta Rápida</span>
                  </>
                )}
              </button>

              {onOpenSalesScripts && (
                <button
                  type="button"
                  onClick={onOpenSalesScripts}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition cursor-pointer shadow-sm"
                  title="Abrir scripts completos com quebra de objeções e fechamento"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Mensagens Prontas para Fechar Venda 💬</span>
                </button>
              )}
            </div>

            {commercial.saleRecorded ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Simulação Registrada no Saldo (+ R$ {siteSalePriceInput.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRecordSiteSaleAction}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 hover:scale-102 transition cursor-pointer"
                title="Esta simulação é privada e disponível apenas para o administrador"
              >
                <Lock className="w-4 h-4" />
                <span>Simular Venda do Site (+ R$ {siteSalePriceInput.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) (Apenas para Mim)</span>
              </button>
            )}
          </div>
        </div>

        {/* Functional Real Online Demo Link for Customer */}
        <div className="bg-slate-900/95 rounded-2xl border-2 border-emerald-500/40 shadow-xl p-4 sm:p-7 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-base sm:text-lg font-black text-white">
                  Link de Demonstração Online Funcional (Para Mandar ao Cliente)
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Site 100% online no Firebase. O seu cliente pode abrir no celular ou computador, navegar pelas páginas, ver os produtos e testar fazer pedidos direto no WhatsApp!
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black self-start sm:self-auto shrink-0">
              <Zap className="w-3.5 h-3.5" />
              Firebase Online
            </span>
          </div>

          {/* Actual Clickable & Copyable Demo URL Box */}
          <div className="bg-black/90 border border-slate-800 rounded-xl p-3 sm:p-4 mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-xs text-emerald-400 font-mono font-bold shrink-0">LINK DO SITE:</span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-200 truncate select-all">
                {liveDemoUrl}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-slate-950 stroke-[3]" /> : <Copy className="w-4 h-4 text-slate-950" />}
                <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
              </button>

              <button
                type="button"
                onClick={handleTestDemoLink}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition border border-slate-700 cursor-pointer"
                title="Abrir demonstração em nova aba do navegador"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Testar Link</span>
              </button>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleSendWhatsAppDemo}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Enviar Demonstração no WhatsApp do Cliente</span>
            </button>

            {onOpenSalesScripts && (
              <button
                type="button"
                onClick={onOpenSalesScripts}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Mensagens Prontas para Fechar Venda 💬</span>
              </button>
            )}
          </div>

          {/* Subdomain configuration preview */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium shrink-0">Subdomínio personalizado:</span>
            <div className="flex-1 flex items-center bg-black border border-slate-800 rounded-lg px-2.5 py-1.5">
              <span className="text-[11px] text-slate-500 font-mono">https://</span>
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 bg-transparent px-1 font-bold text-white text-xs outline-none"
                placeholder="nome-da-empresa"
              />
              <span className="text-[11px] text-blue-400 font-semibold">.webempresa.app</span>
            </div>
          </div>
        </div>

        {/* Payment & Checkout Settings */}
        <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl p-4 sm:p-7">
          <h2 className="text-base font-bold text-white mb-1">
            Checkout de Pagamentos & Saldo de Vendas
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Ative os métodos de pagamento para os produtos do site. Todas as compras entrarão diretamente no Painel de Saldo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div 
              onClick={() => setEnablePix(!enablePix)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                enablePix ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/50' : 'border-slate-800 bg-black/40 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" /> PIX Instantâneo
                </span>
                <input type="checkbox" checked={enablePix} readOnly className="accent-emerald-500 rounded" />
              </div>
              <p className="text-xs text-slate-400 leading-tight">
                Recebimento imediato com QR code gerado no checkout do cliente.
              </p>
            </div>

            <div 
              onClick={() => setEnableCard(!enableCard)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                enableCard ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500/50' : 'border-slate-800 bg-black/40 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-400" /> Cartão de Crédito
                </span>
                <input type="checkbox" checked={enableCard} readOnly className="accent-blue-500 rounded" />
              </div>
              <p className="text-xs text-slate-400 leading-tight">
                Aceite as principais bandeiras com parcelamento facilitado.
              </p>
            </div>

            <div 
              onClick={() => setEnableWhatsAppSync(!enableWhatsAppSync)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                enableWhatsAppSync ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/50' : 'border-slate-800 bg-black/40 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-400" /> WhatsApp Direto
                </span>
                <input type="checkbox" checked={enableWhatsAppSync} readOnly className="accent-emerald-500 rounded" />
              </div>
              <p className="text-xs text-slate-400 leading-tight">
                Envia cópia do pedido e comprovante para o seu número comercial.
              </p>
            </div>
          </div>
        </div>

        {/* Google Maps Prospecting Section (For Selling this Site) */}
        <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-black text-white">
                  Prospectar Compradores deste Nicho no Google Maps
                </h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Estratégia IA Lucro
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Nicho deste site: <strong className="text-emerald-400">{site.companyInfo.niche || 'Negócio Local'}</strong> ({site.companyInfo.city || 'Brasil'}).
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Localize empresas desse mesmo segmento no Google Maps que ainda não possuem site profissional e ofereça este projeto já pronto!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onGoToMaps && (
              <button
                type="button"
                onClick={() => onGoToMaps(site.companyInfo.niche)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Abrir Radar no Maps</span>
              </button>
            )}

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((site.companyInfo.niche || 'empresas') + ' ' + (site.companyInfo.city || 'São Paulo'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 hover:text-white font-bold text-xs transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Google Maps Web</span>
            </a>
          </div>
        </div>

        {/* Publish Big Action & Success Box */}
        <div className="bg-black rounded-3xl p-5 sm:p-8 text-white border border-slate-800 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${site.published ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'}`} />
                <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                  {site.published ? 'Status: Site Publicado & Ativo' : 'Status: Pronto para Publicar'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                {site.published ? 'Parabéns! Seu site está 100% no ar.' : 'Tudo pronto para colocar no ar?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg leading-relaxed">
                {site.published
                  ? 'Qualquer visitante que comprar produtos na sua loja gerará receita imediata no seu painel de saldo.'
                  : 'Clique no botão abaixo para ativar o link público seguro e o módulo de checkout.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handlePublish}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/30 hover:scale-102 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5 stroke-[2.5]" />
                <span>{site.published ? 'Atualizar Publicação' : 'Publicar Site Oficial Agora'}</span>
              </button>
            </div>
          </div>

          {/* Published Site Links & Next Steps */}
          {site.published && (
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={onViewLive}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Abrir Vitrine do Site</span>
              </button>

              <button
                type="button"
                onClick={onGoToSales}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <DollarSign className="w-4 h-4 stroke-[3]" />
                <span>Painel de Saldo</span>
              </button>

              {onGoToMaps && (
                <button
                  type="button"
                  onClick={() => onGoToMaps(site.companyInfo.niche)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 shadow-md transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Prospecção no Maps</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Passo 3</span>
          </button>
        </div>

      </div>

    </div>
  );
};
