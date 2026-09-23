import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Sparkles, 
  Star, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CreditCard, 
  Zap, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign,
  MessageCircle,
  Lock,
  Eye,
  Copy,
  ExternalLink,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WebsiteData, ProductOrService, SaleOrder } from '../types/site';
import { THEME_PRESETS } from '../data/stylePresets';

interface WebsiteLivePreviewProps {
  site: WebsiteData;
  isPublicDemo?: boolean;
  onBackToBuilder: () => void;
  onGoToSales?: () => void;
  onCompleteSale: (orderData: Omit<SaleOrder, 'id' | 'createdAt'>) => void;
}

export const WebsiteLivePreview: React.FC<WebsiteLivePreviewProps> = ({
  site,
  isPublicDemo = false,
  onBackToBuilder,
  onGoToSales,
  onCompleteSale
}) => {
  // Cart state
  const [cart, setCart] = useState<{ product: ProductOrService; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Private Admin Mode for Sales Simulation (Default to false if isPublicDemo)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(!isPublicDemo);

  // Customer Checkout Form
  const [customerName, setCustomerName] = useState('Mariana Alves');
  const [customerPhone, setCustomerPhone] = useState('(11) 98765-4321');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [orderSuccess, setOrderSuccess] = useState<SaleOrder | null>(null);

  const activeTheme = THEME_PRESETS.find(t => t.id === site.style.themeId) || THEME_PRESETS[0];

  const handleAddToCart = (product: ProductOrService) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleBuyNow = (product: ProductOrService) => {
    setCart([{ product, quantity: 1 }]);
    setIsCheckoutOpen(true);
  };

  // Build formatted WhatsApp message for real orders
  const getWhatsAppOrderText = () => {
    const itemsList = cart.map(i => `• ${i.quantity}x ${i.product.name} - R$ ${(i.product.price * i.quantity).toFixed(2).replace('.', ',')}`).join('\n');
    return `🛍️ *NOVO PEDIDO REALIZADO NO SITE*\n*Cliente:* ${customerName}\n*Telefone:* ${customerPhone}\n*Forma de Pagamento:* ${paymentMethod === 'pix' ? 'PIX Instantâneo' : 'Cartão de Crédito'}\n\n*Itens:* \n${itemsList}\n\n*Total a Pagar:* R$ ${cartTotal.toFixed(2).replace('.', ',')}`;
  };

  // Real WhatsApp order flow (Public / Visitor mode)
  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const phone = site.companyInfo.whatsapp.replace(/\D/g, '') || '5511999999999';
    const text = encodeURIComponent(getWhatsAppOrderText());
    window.open(`https://wa.me/${phone.startsWith('55') ? phone : '55' + phone}?text=${text}`, '_blank');
    setIsCheckoutOpen(false);
    setCart([]);
  };

  const [copiedDemoLink, setCopiedDemoLink] = useState(false);

  // Copy current working demo link
  const handleCopyDemoLink = async () => {
    const demoUrl = `${window.location.origin}${window.location.pathname}?demo=${site.id}`;
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
      setCopiedDemoLink(true);
      setTimeout(() => setCopiedDemoLink(false), 2500);
    } catch (e) {
      console.warn('Copy error:', e);
    }
  };

  // Simulated & Real Order flow
  const handleSimulateSaleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const items = cart.map(i => ({
      productId: i.product.id,
      productName: i.product.name,
      price: i.product.price,
      quantity: i.quantity
    }));

    const orderData = {
      siteId: site.id,
      siteName: site.companyInfo.name,
      customerName: customerName.trim() || (isPublicDemo ? 'Cliente do Site' : 'Cliente Visitante (Simulação)'),
      customerPhone: customerPhone.trim() || '(11) 99999-9999',
      items,
      totalAmount: cartTotal,
      paymentMethod,
      status: 'pago' as const
    };

    onCompleteSale(orderData);

    const randomId = 'PED-' + Math.floor(1000 + Math.random() * 9000);
    setOrderSuccess({
      ...orderData,
      id: randomId,
      createdAt: new Date().toISOString()
    });

    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Banner - Distinguish Public Customer Demo vs Builder Creator View */}
      {isPublicDemo ? (
        <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md text-white border-b border-slate-800 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md text-xs">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-slate-300">Demonstração Interativa do Site</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="font-black text-white hidden sm:inline">{site.companyInfo.name}</span>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>100% Online & Funcional</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct WhatsApp approval button for the client */}
            <a
              href={`https://wa.me/${(site.commercial?.clientBuyerPhone || site.companyInfo.whatsapp || '5511999999999').replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Gostei muito da demonstração do site de ${site.companyInfo.name} e gostaria de aprovar o projeto e falar sobre a ativação!`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black transition-all cursor-pointer shadow-md shadow-emerald-500/20 hover:scale-102"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Aprovar Projeto no WhatsApp</span>
            </a>

            <button
              onClick={handleCopyDemoLink}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold transition-colors cursor-pointer border border-slate-800"
              title="Copiar Link Desta Demonstração"
            >
              {copiedDemoLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedDemoLink ? 'Link Copiado!' : 'Copiar Link'}</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer relative shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Carrinho ({cartItemCount})</span>
            </button>

            <button
              onClick={onBackToBuilder}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded transition-colors cursor-pointer"
              title="Acessar a Ferramenta Construtora"
            >
              Área do Criador
            </button>
          </div>
        </div>
      ) : (
        <div className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md text-white border-b border-slate-800 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 shadow-md text-xs">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBackToBuilder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold transition-colors cursor-pointer border border-slate-750"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Construtor</span>
            </button>
            
            {/* Private Admin Simulation Controls */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-lg">
              <Lock className="w-3 h-3 text-amber-400" />
              <span className="text-[11px] font-bold text-slate-300 hidden md:inline">Simulação de Venda:</span>
              <button
                type="button"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-extrabold transition-all cursor-pointer ${
                  isAdminMode
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                }`}
              >
                {isAdminMode ? '🔒 Apenas Para Mim (Admin)' : '👁️ Modo Público / Cliente'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyDemoLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold transition-colors cursor-pointer border border-slate-800"
              title="Copiar Link Demonstrativo Funcional do Site"
            >
              {copiedDemoLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{copiedDemoLink ? 'Link Copiado!' : 'Copiar Link Demo'}</span>
            </button>

            {isAdminMode && onGoToSales && (
              <button
                onClick={onGoToSales}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black transition-colors cursor-pointer shadow-xs"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver Saldo de Vendas</span>
                <span className="sm:hidden">Saldo</span>
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer relative"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Carrinho ({cartItemCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Website Official Header / Nav */}
      <header className="bg-white border-b border-slate-100 sticky top-10 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md"
              style={{ backgroundColor: activeTheme.hex }}
            >
              {site.companyInfo.name.charAt(0) || 'E'}
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 block leading-tight">
                {site.companyInfo.name}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {site.companyInfo.niche}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            {site.style.enabledSections.products && (
              <a href="#produtos" className="hover:text-indigo-600 transition-colors">Produtos</a>
            )}
            {site.style.enabledSections.about && (
              <a href="#sobre" className="hover:text-indigo-600 transition-colors">Sobre Nós</a>
            )}
            {site.style.enabledSections.features && (
              <a href="#diferenciais" className="hover:text-indigo-600 transition-colors">Diferenciais</a>
            )}
            {site.style.enabledSections.testimonials && (
              <a href="#depoimentos" className="hover:text-indigo-600 transition-colors">Depoimentos</a>
            )}
            {site.style.enabledSections.contact && (
              <a href="#contato" className="hover:text-indigo-600 transition-colors">Contato</a>
            )}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/55${site.companyInfo.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => {
                const prodEl = document.getElementById('produtos');
                if (prodEl) prodEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: activeTheme.hex }}
            >
              {site.hero.ctaPrimary}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {site.style.enabledSections.hero && (
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-slate-50 via-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-7 text-center lg:text-left">
                <div 
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 shadow-xs"
                  style={{ backgroundColor: `${activeTheme.hex}15`, color: activeTheme.hex }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{site.hero.badgeText}</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
                  {site.hero.headline}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                  {site.hero.subheadline}
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <button
                    onClick={() => {
                      const el = document.getElementById('produtos');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-lg transition-all hover:scale-102 cursor-pointer"
                    style={{ backgroundColor: activeTheme.hex }}
                  >
                    {site.hero.ctaPrimary}
                  </button>

                  <a
                    href={`https://wa.me/55${site.companyInfo.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-200 shadow-sm transition-all"
                  >
                    {site.hero.ctaSecondary}
                  </a>
                </div>

                <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Compra 100% Segura</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>PIX com Envio Imediato</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img 
                    src={site.hero.heroImageUrl} 
                    alt={site.companyInfo.name} 
                    className="w-full h-[380px] sm:h-[460px] object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{site.companyInfo.name}</div>
                        <div className="text-[11px] text-slate-500">Qualidade certificada e garantia</div>
                      </div>
                      <div className="flex text-amber-400">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Products & Services Store Section */}
      {site.style.enabledSections.products && site.products.length > 0 && (
        <section id="produtos" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span 
                className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ backgroundColor: `${activeTheme.hex}15`, color: activeTheme.hex }}
              >
                Catálogo Oficial & Venda Direta
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Faça Seu Pedido Online
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Escolha o produto desejado e finalize com PIX ou Cartão. A compra é confirmada na hora!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {site.products.map((product) => (
                <div 
                  key={product.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="h-52 overflow-hidden relative bg-slate-100">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {product.badge && (
                      <span 
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black text-white shadow-md"
                        style={{ backgroundColor: activeTheme.hex }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mb-1.5 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-xs text-slate-400">Valor</span>
                        <span className="text-xl font-black text-slate-900">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Carrinho</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleBuyNow(product)}
                          className="py-2.5 px-3 rounded-xl text-white font-black text-xs shadow-md transition-all hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer"
                          style={{ backgroundColor: activeTheme.hex }}
                        >
                          <span>Comprar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* About Section */}
      {site.style.enabledSections.about && (
        <section id="sobre" className="py-20 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6">
                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                  <img 
                    src={site.about.aboutImageUrl} 
                    alt="Sobre Nós" 
                    className="w-full h-[400px] object-cover" 
                  />
                </div>
              </div>

              <div className="lg:col-span-6">
                <span 
                  className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${activeTheme.hex}15`, color: activeTheme.hex }}
                >
                  Conheça Nossa Empresa
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3 mb-5">
                  {site.about.title}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                  {site.about.story}
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                  {site.about.mission}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {site.about.stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
                      <div className="text-xl sm:text-2xl font-black text-slate-900">{stat.value}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {site.style.enabledSections.testimonials && site.testimonials.length > 0 && (
        <section id="depoimentos" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Avaliações de Clientes
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
                O que dizem sobre nossa qualidade
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {site.testimonials.map((t) => (
                <div key={t.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex text-amber-400 mb-3">
                      {'★'.repeat(t.rating)}
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm italic leading-relaxed mb-6">
                      "{t.comment}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
                    <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{t.name}</div>
                      <div className="text-[11px] text-slate-500">{t.role} {t.company && `• ${t.company}`}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Accordion */}
      {site.style.enabledSections.faq && site.faq.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Perguntas Frequentes
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Tire suas principais dúvidas sobre pedidos, pagamentos e prazos.
              </p>
            </div>

            <div className="space-y-3">
              {site.faq.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                      className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:text-indigo-600"
                    >
                      <span>{item.question}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {site.style.enabledSections.contact && (
        <section id="contato" className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Atendimento Exclusivo
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black mt-2 mb-4">
                    {site.contact.ctaText}
                  </h3>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>WhatsApp: <strong>{site.contact.whatsapp}</strong></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      <span>E-mail: <strong>{site.contact.email}</strong></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span>{site.contact.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>{site.contact.openingHours}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                  <span className="text-sm font-bold text-white">Prefere atendimento pelo WhatsApp?</span>
                  <p className="text-xs text-slate-300 max-w-xs">
                    Nossa equipe responde em menos de 5 minutos para tirar dúvidas e fechar pedidos.
                  </p>
                  <a
                    href={`https://wa.me/55${site.companyInfo.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Iniciar Conversa no WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Official Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="font-bold text-slate-200 text-sm">{site.companyInfo.name}</p>
          <p className="text-slate-500">{site.companyInfo.description}</p>
          <p className="text-[11px] text-slate-600 pt-4 border-t border-slate-900">
            Site gerado com Inteligência Artificial • Todos os direitos reservados © {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Seu Carrinho de Compras</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="font-bold text-xs text-slate-900">{item.product.name}</div>
                      <div className="text-[11px] text-slate-500">Qtd: {item.quantity}x</div>
                      <div className="font-black text-xs text-slate-900 mt-1">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="text-rose-500 hover:text-rose-700 text-xs font-semibold p-1"
                    >
                      Remover
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-400">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  Seu carrinho está vazio. Adicione um produto para testar a compra!
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-slate-600">Total do Pedido:</span>
                  <span className="text-2xl font-black text-slate-900">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 rounded-xl text-white font-extrabold text-sm shadow-md cursor-pointer transition-all hover:opacity-95"
                  style={{ backgroundColor: activeTheme.hex }}
                >
                  Avançar para Pagamento
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Checkout Seguro - {site.companyInfo.name}</span>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateSaleOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Seu Nome Completo</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp / Telefone para Confirmação</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-medium"
                />
              </div>

              {/* Payment selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'pix' ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-500' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" /> PIX Instantâneo
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Aprovação em segundos</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      paymentMethod === 'credit_card' ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" /> Cartão de Crédito
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Até 12x no cartão</div>
                  </button>
                </div>
              </div>

              {/* Order total */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Total a Pagar:</span>
                <span className="text-xl font-black text-slate-900">
                  R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Admin vs Public Simulation Privacy Notice */}
              {isAdminMode ? (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Simulação de Venda (Apenas para Mim - Admin):</strong> Este teste adiciona a venda ao seu painel de saldo. Clientes reais usarão o WhatsApp.
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Pedido Oficial:</strong> Seu pedido será encaminhado diretamente para o WhatsApp oficial de atendimento da loja.
                  </div>
                </div>
              )}

              {isAdminMode ? (
                <div className="space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Simular Venda & Adicionar ao Saldo (Apenas para Mim)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendWhatsAppOrder}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Ou Testar Envio Real via WhatsApp</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSendWhatsAppOrder}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Finalizar Pedido pelo WhatsApp da Loja</span>
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Order Success Congratulations Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 text-center border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">Venda Realizada com Sucesso!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Pedido <strong>{orderSuccess.id}</strong> aprovado no valor de:
            </p>

            <div className="text-3xl font-black text-emerald-600 my-3">
              R$ {orderSuccess.totalAmount.toFixed(2).replace('.', ',')}
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-left mb-5">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Saldo Atualizado!
              </div>
              <div>
                O valor foi adicionado automaticamente ao seu <strong>Painel de Saldo de Vendas</strong>.
              </div>
            </div>

            <div className={`grid ${onGoToSales ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
              <button
                type="button"
                onClick={() => setOrderSuccess(null)}
                className="py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Continuar Navegando
              </button>

              {onGoToSales && (
                <button
                  type="button"
                  onClick={() => {
                    setOrderSuccess(null);
                    onGoToSales();
                  }}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Ver no Painel de Saldo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
