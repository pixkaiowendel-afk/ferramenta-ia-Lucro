import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Target, 
  ArrowRight, 
  Layers, 
  Briefcase, 
  CheckCircle, 
  Wand2,
  DollarSign,
  Compass,
  ExternalLink,
  Navigation,
  UtensilsCrossed,
  Scissors,
  HeartPulse,
  Scale,
  ShoppingBag,
  Car,
  Home,
  Check
} from 'lucide-react';
import { CompanyInfo, WebsiteCommercialPlan } from '../types/site';
import { 
  QUICK_NICHE_EXAMPLES, 
  NICHE_CATEGORIES, 
  NicheQuickTemplate 
} from '../data/stylePresets';

interface Step1CompanyInfoProps {
  companyInfo: CompanyInfo;
  onChange: (info: CompanyInfo) => void;
  commercial?: WebsiteCommercialPlan;
  onChangeCommercial?: (commercial: WebsiteCommercialPlan) => void;
  onNext: () => void;
  onApplyTemplate: (template: NicheQuickTemplate) => void;
  onRedirectToMaps?: (nicheQuery: string) => void;
}

export const Step1CompanyInfo: React.FC<Step1CompanyInfoProps> = ({
  companyInfo,
  onChange,
  commercial,
  onChangeCommercial,
  onNext,
  onApplyTemplate,
  onRedirectToMaps
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentCommercial: WebsiteCommercialPlan = commercial || {
    siteSalePrice: 1500,
    maintenanceMonthlyPrice: 99,
    paymentTerms: '50% entrada + 50% na entrega',
    proposalStatus: 'orcamento',
    saleRecorded: false
  };

  const updateCommercialField = <K extends keyof WebsiteCommercialPlan>(
    key: K,
    value: WebsiteCommercialPlan[K]
  ) => {
    if (onChangeCommercial) {
      onChangeCommercial({
        ...currentCommercial,
        [key]: value
      });
    }
  };

  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    onChange({
      ...companyInfo,
      [field]: value
    });
  };

  const tones = [
    { id: 'profissional', label: 'Profissional & Corporativo', desc: 'Sério, credibilidade, foco em confiança' },
    { id: 'moderno', label: 'Moderno & Descontraído', desc: 'Acessível, jovem, dinâmico e amigável' },
    { id: 'luxo', label: 'Sofisticado & Luxo', desc: 'Exclusivo, refinado, alta gastronomia/estética' },
    { id: 'persuasivo', label: 'Persuasivo & Vendas Fortes', desc: 'Foco em ofertas, urgência e conversão' },
  ] as const;

  const isFormValid = companyInfo.name.trim().length > 1 && companyInfo.niche.trim().length > 1;

  // Filter templates by selected category
  const filteredTemplates = selectedCategory === 'all'
    ? QUICK_NICHE_EXAMPLES
    : QUICK_NICHE_EXAMPLES.filter(tpl => tpl.category === selectedCategory);

  // Determine active query for Google Maps
  const currentTemplate = QUICK_NICHE_EXAMPLES.find(t => t.companyName === companyInfo.name || t.name === companyInfo.niche);
  const activeMapsQuery = companyInfo.niche.trim() || currentTemplate?.googleMapsQuery || 'Empresas e Serviços Locais';

  // Category Icon helper
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'gastronomia': return <UtensilsCrossed className="w-3.5 h-3.5" />;
      case 'beleza': return <Scissors className="w-3.5 h-3.5" />;
      case 'saude': return <HeartPulse className="w-3.5 h-3.5" />;
      case 'servicos': return <Scale className="w-3.5 h-3.5" />;
      case 'varejo': return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'automotivo': return <Car className="w-3.5 h-3.5" />;
      case 'imoveis': return <Home className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      
      {/* Header Info */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-400 text-xs font-bold mb-3">
          <Layers className="w-3.5 h-3.5" />
          Passo 1 de 4: Informações & Precificação do Site
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Conte-nos sobre o seu negócio
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
          Preencha os dados da empresa e defina o preço de venda do site. A Inteligência Artificial criará os textos comerciais, catálogo de produtos e estrutura visual completa.
        </p>
      </div>

      {/* Quick Template Section with Categorization & Google Maps Redirect */}
      <div className="mb-6 sm:mb-8 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
        
        {/* Section Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Modelos Rápidos (Apenas Nomes das Categorias):
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">
            Clique na categoria desejada para preenchimento imediato
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 scrollbar-thin scrollbar-thumb-slate-700">
          {NICHE_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? QUICK_NICHE_EXAMPLES.length 
              : QUICK_NICHE_EXAMPLES.filter(t => t.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isCatActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 border border-emerald-500'
                    : 'bg-black/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isCatActive ? 'bg-emerald-800/80 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Names Grid (Apenas os Nomes das Categorias) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {filteredTemplates.map((tpl) => {
            const isSelected = companyInfo.niche === tpl.name || companyInfo.name === tpl.companyName;
            return (
              <button
                key={tpl.name}
                type="button"
                onClick={() => onApplyTemplate(tpl)}
                className={`p-2.5 px-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-900/40 ring-2 ring-emerald-400'
                    : 'bg-black/70 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />
                  <span className="font-bold text-xs truncate">
                    {tpl.name}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-white shrink-0 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Highlighted Google Maps Redirection Card */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-black via-slate-950 to-blue-950/40 border border-blue-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Radar no Google Maps para Esta Categoria:
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Prospecção Ativa
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Categoria / Nicho: <strong className="text-emerald-400">{activeMapsQuery}</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                Redirecione para o Google Maps para localizar negócios e clientes potenciais deste ramo na sua cidade.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onRedirectToMaps && (
              <button
                type="button"
                onClick={() => onRedirectToMaps(activeMapsQuery)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                title="Abrir no Radar do Google Maps interno"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Ver no Radar Maps</span>
              </button>
            )}

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeMapsQuery + ' ' + (companyInfo.city || 'São Paulo'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white border border-slate-700 font-bold text-xs transition-all shadow-sm cursor-pointer"
              title="Abrir pesquisa de empresas no Google Maps Oficial Web"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Maps Web</span>
            </a>
          </div>
        </div>

      </div>

      {/* Main Form Card */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl p-4 sm:p-7 space-y-6">
        
        {/* Row 1: Name & Niche */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Nome da Empresa / Marca <span className="text-emerald-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={companyInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Pizzaria Forno Nobre"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-white text-xs sm:text-sm font-medium transition-all placeholder:text-slate-600"
              />
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Nome oficial exibido no topo do site e na logo.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Ramo de Atuação / Nicho <span className="text-emerald-400">*</span>
              </label>
              {companyInfo.niche && (
                <button
                  type="button"
                  onClick={() => onRedirectToMaps && onRedirectToMaps(companyInfo.niche)}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Ver no Maps</span>
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={companyInfo.niche}
                onChange={(e) => handleInputChange('niche', e.target.value)}
                placeholder="Ex: Gastronomia & Pizzas Artesanais"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-white text-xs sm:text-sm font-medium transition-all placeholder:text-slate-600"
              />
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Ajuda a IA a escolher os produtos e argumentos certos.
            </p>
          </div>
        </div>

        {/* Description & Value Proposition */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Descrição do Negócio & Proposta de Valor
          </label>
          <textarea
            rows={3}
            value={companyInfo.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Ex: Servimos pizzas artesanais assadas em forno a lenha, preparadas com farinha italiana e ingredientes premium selecionados."
            className="w-full p-3 rounded-xl bg-black/70 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-white text-xs sm:text-sm font-normal transition-all placeholder:text-slate-600"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Explique os diferenciais e especialidades do seu negócio.
          </p>
        </div>

        {/* Target Audience & Featured Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Público-Alvo
            </label>
            <div className="relative">
              <input
                type="text"
                value={companyInfo.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Ex: Famílias, jovens e casais"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-white text-xs sm:text-sm transition-all placeholder:text-slate-600"
              />
              <Target className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Produtos ou Serviços em Destaque
            </label>
            <div className="relative">
              <input
                type="text"
                value={companyInfo.servicesSummary}
                onChange={(e) => handleInputChange('servicesSummary', e.target.value)}
                placeholder="Ex: Pizzas napolitanas, vinhos, sobremesas"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-white text-xs sm:text-sm transition-all placeholder:text-slate-600"
              />
              <Sparkles className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>
        </div>

        {/* Contact Info (WhatsApp, Email, City) */}
        <div className="pt-2 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Dados de Contato & Localização
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1.5">
                WhatsApp Comercial (para pedidos)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={companyInfo.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="(11) 99999-8888"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-slate-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-white text-xs sm:text-sm placeholder:text-slate-600"
                />
                <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1.5">
                E-mail de Atendimento
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contato@empresa.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-slate-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-white text-xs sm:text-sm placeholder:text-slate-600"
                />
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1.5">
                Cidade & Estado
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={companyInfo.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="São Paulo, SP"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-slate-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-white text-xs sm:text-sm placeholder:text-slate-600"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Tone Selection */}
        <div className="pt-2 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Tom de Voz dos Textos
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {tones.map((t) => {
              const active = companyInfo.tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleInputChange('tone', t.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'border-blue-500 bg-blue-950/50 ring-1 ring-blue-500 text-white'
                      : 'border-slate-800 hover:border-slate-700 bg-black/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{t.label}</span>
                    {active && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{t.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Commercial Selling Price Section (Green, Blue, Black) */}
        <div className="pt-6 border-t border-slate-800">
          <div className="bg-black/80 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-6 shadow-xl shadow-emerald-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-emerald-600/30 shrink-0">
                  <DollarSign className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    Preço de Venda deste Site para o Cliente
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Comercial
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Defina quanto você vai cobrar pelo projeto e mensalidade recorrente ao entregar ao cliente.
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <span className="text-[11px] text-slate-400 font-medium">Status:</span>
                <select
                  value={currentCommercial.proposalStatus || 'orcamento'}
                  onChange={(e) => updateCommercialField('proposalStatus', e.target.value as any)}
                  className="text-xs font-bold bg-slate-900 border border-emerald-500/50 rounded-lg px-2.5 py-1 text-emerald-400 shadow-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="orcamento">📝 Orçamento</option>
                  <option value="proposta_enviada">📩 Proposta Enviada</option>
                  <option value="vendido">🎉 Site Vendido!</option>
                </select>
              </div>
            </div>

            {/* Price Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>Valor de Venda do Site (R$)</span>
                  <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-xs text-emerald-400">R$</span>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={currentCommercial.siteSalePrice || ''}
                    onChange={(e) => updateCommercialField('siteSalePrice', Math.max(0, Number(e.target.value) || 0))}
                    placeholder="1500"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-300 font-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Valor cobrado pela criação e entrega.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mensalidade / Manutenção (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-xs text-slate-400">R$</span>
                  <input
                    type="number"
                    step="10"
                    min="0"
                    value={currentCommercial.maintenanceMonthlyPrice || ''}
                    onChange={(e) => updateCommercialField('maintenanceMonthlyPrice', Math.max(0, Number(e.target.value) || 0))}
                    placeholder="99"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Hospedagem, suporte e atualizações.</p>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Condições de Pagamento
                </label>
                <input
                  type="text"
                  value={currentCommercial.paymentTerms || ''}
                  onChange={(e) => updateCommercialField('paymentTerms', e.target.value)}
                  placeholder="Ex: 50% entrada + 50% na entrega"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all placeholder:text-slate-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">Forma combinada com o cliente.</p>
              </div>
            </div>

            {/* Quick Price Presets */}
            <div className="mb-4 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Sugestões Rápidas de Preço de Mercado:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Landing Page Express', price: 800, monthly: 59 },
                  { label: 'Site Institucional Padrão', price: 1500, monthly: 99 },
                  { label: 'Loja / Catálogo Virtual', price: 2400, monthly: 149 },
                  { label: 'Projeto Premium Completo', price: 3800, monthly: 199 }
                ].map((plan) => (
                  <button
                    key={plan.label}
                    type="button"
                    onClick={() => {
                      updateCommercialField('siteSalePrice', plan.price);
                      updateCommercialField('maintenanceMonthlyPrice', plan.monthly);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      currentCommercial.siteSalePrice === plan.price
                        ? 'bg-emerald-600 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-emerald-500/50 hover:text-white'
                    }`}
                  >
                    <span>{plan.label}: </span>
                    <span className={currentCommercial.siteSalePrice === plan.price ? 'text-slate-950 font-black' : 'text-emerald-400'}>
                      R$ {plan.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Buyer Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Nome do Cliente Contratante (Opcional)
                </label>
                <input
                  type="text"
                  value={currentCommercial.clientBuyerName || ''}
                  onChange={(e) => updateCommercialField('clientBuyerName', e.target.value)}
                  placeholder="Ex: Carlos Mendes"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  WhatsApp do Contratante (Opcional)
                </label>
                <input
                  type="text"
                  value={currentCommercial.clientBuyerPhone || ''}
                  onChange={(e) => updateCommercialField('clientBuyerPhone', e.target.value)}
                  placeholder="Ex: (11) 98888-7777"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Summary preview strip */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="text-slate-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Proposta Estimada:</strong> Valor do Site: <strong className="text-emerald-400 font-bold">R$ {Number(currentCommercial.siteSalePrice || 0).toFixed(2).replace('.', ',')}</strong>
                  {(currentCommercial.maintenanceMonthlyPrice || 0) > 0 && (
                    <span> + R$ {Number(currentCommercial.maintenanceMonthlyPrice).toFixed(2).replace('.', ',')}/mês</span>
                  )}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Disponível para fechamento e registro de saldo no Passo 4.
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Go to Step 2 */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs">
            {isFormValid ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Dados essenciais preenchidos
              </span>
            ) : (
              <span className="text-amber-400 font-medium">
                * Preencha o nome e nicho da empresa para avançar
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!isFormValid}
            onClick={onNext}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
              isFormValid
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:scale-101'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Avançar para Passo 2: Design & Estrutura</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
