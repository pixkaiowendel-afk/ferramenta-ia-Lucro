import React from 'react';
import { 
  Palette, 
  Layers, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  LayoutTemplate,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  MessageSquare,
  Award,
  PhoneCall
} from 'lucide-react';
import { SiteStyle } from '../types/site';
import { THEME_PRESETS, ThemePreset } from '../data/stylePresets';

interface Step2DesignStyleProps {
  style: SiteStyle;
  onChange: (style: SiteStyle) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2DesignStyle: React.FC<Step2DesignStyleProps> = ({
  style,
  onChange,
  onNext,
  onBack
}) => {

  const handleSelectTheme = (preset: ThemePreset) => {
    onChange({
      ...style,
      themeId: preset.id,
      primaryHex: preset.hex
    });
  };

  const handleToggleSection = (key: keyof SiteStyle['enabledSections']) => {
    onChange({
      ...style,
      enabledSections: {
        ...style.enabledSections,
        [key]: !style.enabledSections[key]
      }
    });
  };

  const sectionsList: { key: keyof SiteStyle['enabledSections']; label: string; desc: string; icon: any; recommended?: boolean }[] = [
    { key: 'hero', label: 'Cabeçalho Principal (Hero)', desc: 'Título chamativo, proposta de valor e botões de conversão', icon: LayoutTemplate, recommended: true },
    { key: 'products', label: 'Vitrine de Produtos / Serviços (Com Venda Online)', desc: 'Itens com fotos, preços em R$ e botão de compra direta para gerar saldo', icon: ShoppingBag, recommended: true },
    { key: 'about', label: 'Sobre a Empresa & História', desc: 'Apresentação institucional, missão e métricas de impacto', icon: Award, recommended: true },
    { key: 'features', label: 'Diferenciais & Vantagens', desc: 'Destaques de qualidade, atendimento e garantia', icon: Sparkles, recommended: true },
    { key: 'testimonials', label: 'Depoimentos de Clientes', desc: 'Avaliações com 5 estrelas para aumentar a confiança', icon: MessageSquare, recommended: true },
    { key: 'faq', label: 'Perguntas Frequentes (FAQ)', desc: 'Respostas para as principais dúvidas dos clientes', icon: HelpCircle, recommended: false },
    { key: 'contact', label: 'Contato & Localização', desc: 'Endereço, mapa, WhatsApp comercial e horário de funcionamento', icon: PhoneCall, recommended: true },
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      
      {/* Header Info */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-400 text-xs font-bold mb-3">
          <Palette className="w-3.5 h-3.5" />
          Passo 2 de 4: Estilo, Cores & Estrutura
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Personalize o visual e as seções do site
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
          Escolha a paleta de cores da marca e selecione os módulos ativos da página.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        
        {/* Color Palette Card */}
        <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl p-4 sm:p-7">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Palette className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">Paleta de Cores da Marca</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            A cor selecionada será aplicada aos botões de compra, títulos e elementos de destaque do site.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {THEME_PRESETS.map((preset) => {
              const isSelected = style.themeId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectTheme(preset)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'border-slate-800 bg-black/60 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-5 h-5 rounded-full shadow-sm border border-slate-700 shrink-0"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span className="font-bold text-sm text-white">{preset.name}</span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{preset.tagline || preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Modules Toggles */}
        <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl p-4 sm:p-7">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">Seções Ativas no Site</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Ative ou desative seções conforme a necessidade do cliente. A Vitrine com Checkout gera saldo diretamente no seu painel!
          </p>

          <div className="space-y-2.5">
            {sectionsList.map((sec) => {
              const Icon = sec.icon;
              const isEnabled = style.enabledSections[sec.key];
              return (
                <div
                  key={sec.key}
                  onClick={() => handleToggleSection(sec.key)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isEnabled
                      ? 'border-slate-700 bg-black/70 hover:border-blue-500/50'
                      : 'border-slate-800 bg-black/30 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isEnabled ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-white">{sec.label}</span>
                        {sec.recommended && (
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{sec.desc}</p>
                    </div>
                  </div>

                  {/* Toggle switch */}
                  <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ml-2 ${
                    isEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-800 justify-start'
                  }`}>
                    <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Passo 1</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/25 transition-all hover:scale-101 cursor-pointer"
          >
            <span>Avançar para Passo 3: Criar Site com IA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
