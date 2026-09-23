import React from 'react';
import { 
  Globe, 
  Plus, 
  Check, 
  Trash2, 
  Eye, 
  Calendar, 
  DollarSign 
} from 'lucide-react';
import { WebsiteData } from '../types/site';

interface SitesListModalProps {
  sites: WebsiteData[];
  activeSiteId: string;
  onSelectSite: (site: WebsiteData) => void;
  onCreateNewSite: () => void;
  onDeleteSite: (siteId: string) => void;
  onClose: () => void;
  onOpenLive: () => void;
}

export const SitesListModal: React.FC<SitesListModalProps> = ({
  sites,
  activeSiteId,
  onSelectSite,
  onCreateNewSite,
  onDeleteSite,
  onOpenLive
}) => {
  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-400 text-xs font-bold mb-2">
            <Globe className="w-3.5 h-3.5" />
            Central de Sites Criados
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gerenciador de Sites da Empresa
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Alterne entre diferentes sites corporativos ou crie um novo negócio em 4 passos.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNewSite}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Criar Novo Site</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sites.map((site) => {
          const isActive = site.id === activeSiteId;
          const dateStr = new Date(site.createdAt).toLocaleDateString('pt-BR');

          return (
            <div
              key={site.id}
              className={`rounded-2xl border bg-slate-900/90 overflow-hidden shadow-xl transition-all flex flex-col justify-between ${
                isActive ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="h-36 bg-black relative overflow-hidden">
                  <img src={site.hero.heroImageUrl} alt={site.companyInfo.name} className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="font-black text-sm truncate max-w-[180px]">
                      {site.companyInfo.name || 'Sem nome'}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      site.published ? 'bg-emerald-500 text-slate-950' : 'bg-blue-500 text-white'
                    }`}>
                      {site.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 truncate">{site.companyInfo.niche}</span>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <DollarSign className="w-3 h-3 stroke-[2.5]" />
                      R$ {Number(site.commercial?.siteSalePrice || 1500).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {site.companyInfo.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                    {(site.commercial?.maintenanceMonthlyPrice || 0) > 0 && (
                      <span className="text-slate-400 font-medium">
                        + R$ {site.commercial?.maintenanceMonthlyPrice}/mês
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-800 mt-2 flex items-center justify-between gap-2">
                {isActive ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Site Ativo
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectSite(site)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
                  >
                    Ativar no Construtor
                  </button>
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSite(site);
                      onOpenLive();
                    }}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-950/30 rounded-lg transition-colors cursor-pointer"
                    title="Visualizar Loja"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {sites.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteSite(site.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      title="Excluir Site"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
