import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft, 
  Edit3, 
  Plus, 
  Trash2, 
  Monitor, 
  Smartphone, 
  Tablet, 
  AlertCircle
} from 'lucide-react';
import { WebsiteData, ProductOrService } from '../types/site';
import { THEME_PRESETS } from '../data/stylePresets';

interface Step3AIGeneratorProps {
  site: WebsiteData;
  onUpdateSite: (updated: WebsiteData) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenLiveModal: () => void;
}

export const Step3AIGenerator: React.FC<Step3AIGeneratorProps> = ({
  site,
  onUpdateSite,
  onNext,
  onBack
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'editor'>('preview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editingSection, setEditingSection] = useState<'hero' | 'products' | 'about' | 'contact'>('hero');

  // Generation steps for animated feedback
  const generationSteps = [
    'Analisando nicho de mercado e público-alvo...',
    'Redigindo copywriting persuasivo para headline e chamada de ação...',
    'Criando catálogo de produtos e serviços com precificação...',
    'Estruturando depoimentos de clientes, diferenciais e FAQ...',
    'Aplicando paleta de cores e finalizando o site corporativo...'
  ];

  const handleGenerateSiteWithAI = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setProgressStep(0);

    const timer1 = setTimeout(() => setProgressStep(1), 700);
    const timer2 = setTimeout(() => setProgressStep(2), 1500);
    const timer3 = setTimeout(() => setProgressStep(3), 2300);
    const timer4 = setTimeout(() => setProgressStep(4), 3100);

    try {
      const response = await fetch('/api/ai/generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyInfo: site.companyInfo,
          stylePreferences: site.style
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao comunicar com o gerador.');
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        const aiData = resData.data;
        
        onUpdateSite({
          ...site,
          hero: {
            ...site.hero,
            headline: aiData.hero.headline,
            subheadline: aiData.hero.subheadline,
            ctaPrimary: aiData.hero.ctaPrimary,
            ctaSecondary: aiData.hero.ctaSecondary,
            badgeText: aiData.hero.badgeText,
            heroImageUrl: aiData.hero.heroImageUrl || site.hero.heroImageUrl
          },
          about: {
            ...site.about,
            title: aiData.about.title,
            story: aiData.about.story,
            mission: aiData.about.mission,
            stats: aiData.about.stats || site.about.stats,
            aboutImageUrl: aiData.about.aboutImageUrl || site.about.aboutImageUrl
          },
          products: aiData.products && aiData.products.length > 0 ? aiData.products : site.products,
          features: aiData.features && aiData.features.length > 0 ? aiData.features : site.features,
          testimonials: aiData.testimonials && aiData.testimonials.length > 0 ? aiData.testimonials : site.testimonials,
          faq: aiData.faq && aiData.faq.length > 0 ? aiData.faq : site.faq,
          contact: {
            ...site.contact,
            ctaText: aiData.contact?.ctaText || site.contact.ctaText
          }
        });
      }
    } catch (err: any) {
      console.warn('AI generation error:', err);
      setErrorMessage('Não foi possível conectar à IA no momento, mas os dados foram mantidos.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      setIsGenerating(false);
    }
  };

  const handleProductChange = (index: number, field: keyof ProductOrService, value: any) => {
    const updatedProducts = [...site.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: field === 'price' ? Number(value) || 0 : value
    };
    onUpdateSite({
      ...site,
      products: updatedProducts
    });
  };

  const handleAddProduct = () => {
    const newProd: ProductOrService = {
      id: 'prod_' + Math.random().toString(36).substring(2, 9),
      name: 'Novo Produto ou Serviço',
      description: 'Descrição com detalhes do item e benefícios para o comprador.',
      price: 99.90,
      category: 'Geral',
      badge: 'Novidade',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
    };
    onUpdateSite({
      ...site,
      products: [...site.products, newProd]
    });
  };

  const handleDeleteProduct = (index: number) => {
    const updated = site.products.filter((_, idx) => idx !== index);
    onUpdateSite({
      ...site,
      products: updated
    });
  };

  const activeTheme = THEME_PRESETS.find(t => t.id === site.style.themeId) || THEME_PRESETS[0];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      
      {/* Header Info & Central "Criar Site com IA" Button */}
      <div className="bg-black text-white p-5 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl mb-6 sm:mb-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Passo 3 de 4: Geração com IA & Editor em Tempo Real
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Crie todo o site da sua empresa com IA
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Nossa IA irá estruturar cada linha de texto persuasivo, fotos e catálogo completo de produtos prontos para venda online.
            </p>
          </div>

          {/* MAIN AI GENERATION BUTTON */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateSiteWithAI}
              className={`flex items-center justify-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-black text-sm sm:text-base transition-all shadow-xl cursor-pointer ${
                isGenerating
                  ? 'bg-slate-800 text-slate-400 cursor-wait'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-slate-950 shadow-emerald-500/25 hover:scale-103 active:scale-98 ring-2 ring-emerald-400/40'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                  <span>A IA está criando seu site...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                  <span>Criar Site com IA</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400">
              Gera copywriting, produtos com preços e catálogo instantâneo
            </span>
          </div>
        </div>

        {/* Loading Animated Step Tracker */}
        {isGenerating && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center animate-spin">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-emerald-300 animate-pulse">
                {generationSteps[progressStep]}
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 mt-3 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 transition-all duration-500 rounded-full"
                style={{ width: `${((progressStep + 1) / generationSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Control Tabs: Preview Canvas vs Content Editor */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Pré-Visualização do Site
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Editar Textos & Produtos
          </button>
        </div>

        {/* Device Switcher (when in preview mode) */}
        {activeTab === 'preview' && (
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                previewDevice === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Celular"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Container: Interactive Preview or Editor */}
      {activeTab === 'preview' ? (
        <div className="bg-black/60 p-3 sm:p-6 rounded-3xl border border-slate-800 flex justify-center">
          <div 
            className={`transition-all duration-300 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700 ${
              previewDevice === 'mobile' 
                ? 'w-[375px] max-w-full' 
                : previewDevice === 'tablet' 
                ? 'w-[768px] max-w-full' 
                : 'w-full'
            }`}
          >
            {/* Mock browser header */}
            <div className="bg-slate-900 text-slate-400 px-4 py-2.5 flex items-center justify-between text-xs border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="bg-black text-slate-300 px-3 py-1 rounded-md text-[11px] font-mono truncate max-w-[260px] border border-slate-800">
                https://{site.domainSlug || 'minhaempresa'}.webempresa.app
              </div>
              <div className="text-[10px] uppercase font-bold text-emerald-400">
                Site Gerado com IA
              </div>
            </div>

            {/* Render Site Content Preview */}
            <div className="max-h-[600px] overflow-y-auto text-slate-900">
              
              {/* Site Mini Navbar */}
              <nav className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between z-20">
                <div className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                  {site.companyInfo.name || 'Nome da Empresa'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: activeTheme.hex }}>
                    {site.hero.ctaPrimary}
                  </span>
                </div>
              </nav>

              {/* Hero Section */}
              {site.style.enabledSections.hero && (
                <div className="relative py-12 px-6 sm:px-10 text-center bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-100">
                  <div className="max-w-2xl mx-auto">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold mb-3 shadow-xs" style={{ backgroundColor: `${activeTheme.hex}18`, color: activeTheme.hex }}>
                      {site.hero.badgeText}
                    </span>
                    <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
                      {site.hero.headline}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                      {site.hero.subheadline}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button 
                        type="button"
                        className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md cursor-pointer"
                        style={{ backgroundColor: activeTheme.hex }}
                      >
                        {site.hero.ctaPrimary}
                      </button>
                      <button type="button" className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
                        {site.hero.ctaSecondary}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Section with Purchase Cards */}
              {site.style.enabledSections.products && site.products.length > 0 && (
                <div className="py-10 px-6 sm:px-8 bg-white border-b border-slate-100">
                  <div className="text-center max-w-xl mx-auto mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Produtos & Serviços em Destaque
                    </span>
                    <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1">
                      Compre Online com Segurança & Entrega Rápida
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {site.products.map((prod) => (
                      <div key={prod.id} className="rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
                        <div className="h-32 bg-slate-100 overflow-hidden relative">
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                          {prod.badge && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-xs" style={{ backgroundColor: activeTheme.hex }}>
                              {prod.badge}
                            </span>
                          )}
                        </div>
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{prod.name}</h4>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{prod.description}</p>
                          </div>
                          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="font-black text-sm text-slate-900">
                              R$ {prod.price.toFixed(2).replace('.', ',')}
                            </span>
                            <span 
                              className="px-2.5 py-1 rounded-lg text-white font-bold text-[10px] shadow-xs"
                              style={{ backgroundColor: activeTheme.hex }}
                            >
                              Comprar
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* About Section */}
              {site.style.enabledSections.about && (
                <div className="py-10 px-6 sm:px-10 bg-slate-50 border-b border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Nossa História
                      </span>
                      <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-1 mb-3">
                        {site.about.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        {site.about.story}
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {site.about.stats.map((st, i) => (
                          <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                            <div className="font-black text-sm text-slate-900">{st.value}</div>
                            <div className="text-[10px] text-slate-500">{st.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-md max-h-56">
                      <img src={site.about.aboutImageUrl} alt="Sobre" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Section */}
              {site.style.enabledSections.contact && (
                <div className="py-8 px-6 text-center bg-white">
                  <h4 className="font-bold text-sm text-slate-900">Fale Conosco</h4>
                  <p className="text-xs text-slate-500 mt-1">{site.contact.address || 'Endereço Comercial'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">WhatsApp: {site.contact.whatsapp || '(11) 99999-8888'}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        /* Content Editor Mode */
        <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl p-4 sm:p-7">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
            {(['hero', 'products', 'about', 'contact'] as const).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setEditingSection(sec)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  editingSection === sec
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {sec === 'hero' ? 'Cabeçalho (Hero)' : sec === 'products' ? 'Produtos & Preços' : sec === 'about' ? 'Sobre' : 'Contato'}
              </button>
            ))}
          </div>

          {/* Edit Hero */}
          {editingSection === 'hero' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Título Principal (Headline)</label>
                <input
                  type="text"
                  value={site.hero.headline}
                  onChange={(e) => onUpdateSite({ ...site, hero: { ...site.hero, headline: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-black/70 border border-slate-800 text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Subtítulo Explicativo</label>
                <textarea
                  rows={2}
                  value={site.hero.subheadline}
                  onChange={(e) => onUpdateSite({ ...site, hero: { ...site.hero, subheadline: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-black/70 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Texto do Botão Principal</label>
                  <input
                    type="text"
                    value={site.hero.ctaPrimary}
                    onChange={(e) => onUpdateSite({ ...site, hero: { ...site.hero, ctaPrimary: e.target.value } })}
                    className="w-full p-2.5 rounded-xl bg-black/70 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Selo do Topo (Badge)</label>
                  <input
                    type="text"
                    value={site.hero.badgeText}
                    onChange={(e) => onUpdateSite({ ...site, hero: { ...site.hero, badgeText: e.target.value } })}
                    className="w-full p-2.5 rounded-xl bg-black/70 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Edit Products & Prices */}
          {editingSection === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-slate-400">
                  Gerencie os itens da vitrine virtual. Os preços em R$ são cobrados diretamente dos compradores!
                </span>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-slate-950 text-xs font-black shadow-xs hover:bg-emerald-500 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar Produto</span>
                </button>
              </div>

              <div className="space-y-3">
                {site.products.map((prod, idx) => (
                  <div key={prod.id} className="p-4 rounded-xl border border-slate-800 bg-black/50 flex flex-col sm:flex-row gap-4 items-start">
                    <img src={prod.imageUrl} alt={prod.name} className="w-16 h-16 rounded-lg object-cover border border-slate-800" />
                    
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Nome do Item</label>
                        <input
                          type="text"
                          value={prod.name}
                          onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-800 text-xs font-bold bg-slate-950 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-emerald-400 uppercase">Preço (R$)</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2 text-xs font-bold text-emerald-400">R$</span>
                          <input
                            type="number"
                            step="0.10"
                            value={prod.price}
                            onChange={(e) => handleProductChange(idx, 'price', e.target.value)}
                            className="w-full pl-8 pr-2 py-2 rounded-lg border border-emerald-500/40 text-xs font-black bg-slate-950 text-emerald-300 focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Descrição</label>
                        <input
                          type="text"
                          value={prod.description}
                          onChange={(e) => handleProductChange(idx, 'description', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-800 text-xs bg-slate-950 text-slate-300 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(idx)}
                      className="p-2 text-rose-400 hover:bg-rose-500/20 rounded-lg cursor-pointer transition-colors"
                      title="Excluir Produto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit About */}
          {editingSection === 'about' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Título da Seção Sobre</label>
                <input
                  type="text"
                  value={site.about.title}
                  onChange={(e) => onUpdateSite({ ...site, about: { ...site.about, title: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-black/70 border border-slate-800 text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">História & Compromisso</label>
                <textarea
                  rows={4}
                  value={site.about.story}
                  onChange={(e) => onUpdateSite({ ...site, about: { ...site.about, story: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-black/70 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Edit Contact */}
          {editingSection === 'contact' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">WhatsApp Comercial</label>
                <input
                  type="text"
                  value={site.contact.whatsapp}
                  onChange={(e) => onUpdateSite({ ...site, contact: { ...site.contact, whatsapp: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-black/70 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Endereço Comercial</label>
                <input
                  type="text"
                  value={site.contact.address}
                  onChange={(e) => onUpdateSite({ ...site, contact: { ...site.contact, address: e.target.value } })}
                  className="w-full p-2.5 rounded-xl bg-black/70 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 sm:pt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Passo 2</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/25 transition-all hover:scale-101 cursor-pointer"
        >
          <span>Avançar para Passo 4: Publicar & Vender</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
