import React, { useState, useMemo, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import { CustomerLead, WebsiteData } from '../types/site';
import {
  Search,
  MapPin,
  Phone,
  Mail,
  UserPlus,
  Compass,
  DollarSign,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Building2,
  Trash2,
  Filter,
  CheckCircle2,
  Target,
  Sparkles,
  Layers,
  X,
  Navigation,
  UtensilsCrossed,
  Scissors,
  HeartPulse,
  Scale,
  Car,
  Star,
  Copy,
  Check,
  Building
} from 'lucide-react';
import { saveCustomerToDatabase, deleteCustomerFromDatabase } from '../services/storeService';
import { CATEGORY_COMPANIES_CATALOG, CategoryBusinessItem } from '../data/categoryCompaniesCatalog';
import { NICHE_CATEGORIES } from '../data/stylePresets';

interface CustomerMapExplorerProps {
  customers: CustomerLead[];
  activeSite: WebsiteData;
  onRefreshCustomers?: () => void;
  initialSearchTerm?: string;
  onBackToBuilder?: () => void;
}

// Map helper to pan programmatically
function MapController({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);
  return null;
}

// Map category icons helper
function getCategoryIcon(categoryId: string) {
  switch (categoryId) {
    case 'gastronomia':
      return <UtensilsCrossed className="w-4 h-4" />;
    case 'beleza':
      return <Scissors className="w-4 h-4" />;
    case 'saude':
      return <HeartPulse className="w-4 h-4" />;
    case 'servicos':
      return <Scale className="w-4 h-4" />;
    case 'varejo':
      return <ShoppingBag className="w-4 h-4" />;
    case 'automotivo':
      return <Car className="w-4 h-4" />;
    case 'imoveis':
      return <Building2 className="w-4 h-4" />;
    default:
      return <Sparkles className="w-4 h-4" />;
  }
}

// Map category color for pins
function getCategoryPinColor(category?: string): { background: string; border: string } {
  switch (category) {
    case 'gastronomia':
      return { background: '#f59e0b', border: '#b45309' }; // Amber
    case 'beleza':
      return { background: '#ec4899', border: '#be185d' }; // Pink
    case 'saude':
      return { background: '#10b981', border: '#047857' }; // Emerald
    case 'servicos':
      return { background: '#6366f1', border: '#4338ca' }; // Indigo
    case 'varejo':
      return { background: '#8b5cf6', border: '#6d28d9' }; // Purple
    case 'automotivo':
      return { background: '#ef4444', border: '#b91c1c' }; // Red
    case 'imoveis':
      return { background: '#0ea5e9', border: '#0369a1' }; // Sky
    default:
      return { background: '#3b82f6', border: '#1d4ed8' }; // Blue
  }
}

// Subcategories map for quick filtering
const SUBCATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  gastronomia: ['Todas', 'Pizzaria', 'Hamburgueria', 'Cafeteria', 'Italiana', 'Japonesa', 'Churrascaria', 'Sobremesas', 'Padaria'],
  beleza: ['Todas', 'Barbearia', 'Salão de Beleza', 'Estética', 'Cílios & Sobrancelhas', 'Spa & Massagem', 'Depilação'],
  saude: ['Todas', 'Academia', 'Odontologia', 'Pilates', 'Veterinária', 'Psicologia', 'Nutrição', 'Cross Training', 'Clínica Médica'],
  servicos: ['Todas', 'Advocacia', 'Contabilidade', 'Marketing Digital', 'Despachante', 'Consultoria', 'Fotografia', 'Segurança'],
  varejo: ['Todas', 'Moda Feminina', 'Ótica', 'Pet Shop', 'Suplementos', 'Decoração', 'Joias', 'Orgânicos'],
  automotivo: ['Todas', 'Mecânica', 'Estética & Detailing', 'Pneus & Alinhamento', 'Ar Condicionado', 'Martelinho', 'Lavagem'],
  imoveis: ['Todas', 'Imobiliária', 'Arquitetura', 'Construtora', 'Engenharia', 'Lançamentos', 'Marcenaria']
};

export const CustomerMapExplorer: React.FC<CustomerMapExplorerProps> = ({
  customers,
  activeSite,
  onRefreshCustomers,
  initialSearchTerm = '',
  onBackToBuilder
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Merge loaded customers with catalog (prevent duplicates by ID)
  const allAvailableCompanies = useMemo(() => {
    const list = [...customers];
    const existingIds = new Set(list.map(c => c.id));
    for (const catalogItem of CATEGORY_COMPANIES_CATALOG) {
      if (!existingIds.has(catalogItem.id)) {
        list.push(catalogItem);
      }
    }
    return list;
  }, [customers]);

  // Determine initial category from initialSearchTerm if applicable
  const detectedInitialCategory = useMemo(() => {
    if (!initialSearchTerm) return 'all';
    const t = initialSearchTerm.toLowerCase();
    if (t.includes('gastro') || t.includes('alimento') || t.includes('pizz') || t.includes('hamburg') || t.includes('restaurante') || t.includes('caf')) {
      return 'gastronomia';
    }
    if (t.includes('belez') || t.includes('barbear') || t.includes('salão') || t.includes('salao') || t.includes('cabel') || t.includes('estetica')) {
      return 'beleza';
    }
    if (t.includes('saud') || t.includes('fitness') || t.includes('academ') || t.includes('odonto') || t.includes('dentist') || t.includes('pilates') || t.includes('pet') || t.includes('veterin')) {
      return 'saude';
    }
    if (t.includes('servic') || t.includes('advoga') || t.includes('contabil') || t.includes('market') || t.includes('despachant') || t.includes('b2b')) {
      return 'servicos';
    }
    if (t.includes('varejo') || t.includes('moda') || t.includes('roupa') || t.includes('loja') || t.includes('otic') || t.includes('joia')) {
      return 'varejo';
    }
    if (t.includes('auto') || t.includes('mecanic') || t.includes('carro') || t.includes('oficina') || t.includes('detailing')) {
      return 'automotivo';
    }
    if (t.includes('imov') || t.includes('imobili') || t.includes('arquitet') || t.includes('reform') || t.includes('constru')) {
      return 'imoveis';
    }
    return 'all';
  }, [initialSearchTerm]);

  const [selectedCategory, setSelectedCategory] = useState<string>(detectedInitialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filterType, setFilterType] = useState<'all' | 'cliente' | 'lead'>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: -23.565,
    lng: -46.660
  });
  const [mapZoom, setMapZoom] = useState(13);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isScanningCategory, setIsScanningCategory] = useState(false);
  const [leadSearchCity, setLeadSearchCity] = useState('São Paulo, SP');

  // React to initialSearchTerm updates
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
      if (detectedInitialCategory !== 'all') {
        setSelectedCategory(detectedInitialCategory);
      }
    }
  }, [initialSearchTerm, detectedInitialCategory]);

  // When selectedCategory changes, reset subcategory and re-center map to the companies in that category
  useEffect(() => {
    setSelectedSubCategory('Todas');
  }, [selectedCategory]);

  // Filtered companies based on category, subcategory, search term, and client/lead type
  const filteredCompanies = useMemo(() => {
    return allAvailableCompanies.filter(company => {
      // 1. Type filter
      if (filterType !== 'all' && company.type !== filterType) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        const compCat = (company.category || '').toLowerCase();
        const compNiche = (company.niche || '').toLowerCase();
        const compNotes = (company.notes || '').toLowerCase();
        const catTarget = selectedCategory.toLowerCase();

        const matchCat = compCat === catTarget ||
          compNiche.includes(catTarget) ||
          compNotes.includes(catTarget) ||
          (selectedCategory === 'gastronomia' && (compNiche.includes('pizza') || compNiche.includes('burger') || compNiche.includes('café') || compNiche.includes('massas') || compNiche.includes('restaurante') || compNiche.includes('gastronomia') || compNiche.includes('churrasco') || compNiche.includes('sushi'))) ||
          (selectedCategory === 'beleza' && (compNiche.includes('barbearia') || compNiche.includes('salão') || compNiche.includes('estética') || compNiche.includes('beleza') || compNiche.includes('spa') || compNiche.includes('cílios') || compNiche.includes('laser'))) ||
          (selectedCategory === 'saude' && (compNiche.includes('academia') || compNiche.includes('odonto') || compNiche.includes('pilates') || compNiche.includes('saúde') || compNiche.includes('veterinária') || compNiche.includes('nutrição') || compNiche.includes('médico'))) ||
          (selectedCategory === 'servicos' && (compNiche.includes('advocacia') || compNiche.includes('contabil') || compNiche.includes('marketing') || compNiche.includes('despachante') || compNiche.includes('consultoria') || compNiche.includes('segurança') || compNiche.includes('fotografia'))) ||
          (selectedCategory === 'varejo' && (compNiche.includes('moda') || compNiche.includes('ótica') || compNiche.includes('pet') || compNiche.includes('suplementos') || compNiche.includes('decoração') || compNiche.includes('joias') || compNiche.includes('orgânicos'))) ||
          (selectedCategory === 'automotivo' && (compNiche.includes('mecânica') || compNiche.includes('detailing') || compNiche.includes('pneus') || compNiche.includes('ar condicionado') || compNiche.includes('martelinho') || compNiche.includes('lavagem') || compNiche.includes('automotivo'))) ||
          (selectedCategory === 'imoveis' && (compNiche.includes('imobili') || compNiche.includes('arquitetura') || compNiche.includes('construtora') || compNiche.includes('engenharia') || compNiche.includes('reformas') || compNiche.includes('interiores')));

        if (!matchCat) return false;
      }

      // 3. Subcategory filter
      if (selectedSubCategory !== 'Todas') {
        const subLower = selectedSubCategory.toLowerCase();
        const nicheLower = (company.niche || '').toLowerCase();
        const nameLower = company.name.toLowerCase();
        if (!nicheLower.includes(subLower) && !nameLower.includes(subLower)) {
          return false;
        }
      }

      // 4. Text Search filter
      const term = searchTerm.toLowerCase().trim();
      if (term) {
        const matchName = company.name.toLowerCase().includes(term);
        const matchNiche = (company.niche || '').toLowerCase().includes(term);
        const matchAddress = (company.address || '').toLowerCase().includes(term);
        const matchCity = (company.city || '').toLowerCase().includes(term);
        const matchNotes = (company.notes || '').toLowerCase().includes(term);
        const matchOpp = (company.commercialOpportunity || '').toLowerCase().includes(term);
        if (!matchName && !matchNiche && !matchAddress && !matchCity && !matchNotes && !matchOpp) {
          return false;
        }
      }

      return true;
    });
  }, [allAvailableCompanies, selectedCategory, selectedSubCategory, searchTerm, filterType]);

  // Update map bounds/center when filtered companies change and list is not empty
  useEffect(() => {
    if (filteredCompanies.length > 0 && selectedCategory !== 'all') {
      const avgLat = filteredCompanies.reduce((acc, c) => acc + (c.location?.lat || 0), 0) / filteredCompanies.length;
      const avgLng = filteredCompanies.reduce((acc, c) => acc + (c.location?.lng || 0), 0) / filteredCompanies.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setMapZoom(13);
    }
  }, [selectedCategory, selectedSubCategory]);

  // Selected company object
  const selectedCustomer = useMemo(() => {
    return allAvailableCompanies.find(c => c.id === selectedCustomerId) || null;
  }, [allAvailableCompanies, selectedCustomerId]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allAvailableCompanies.length };
    NICHE_CATEGORIES.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = allAvailableCompanies.filter(c => {
          const compCat = (c.category || '').toLowerCase();
          const compNiche = (c.niche || '').toLowerCase();
          return compCat === cat.id || compNiche.includes(cat.id);
        }).length;
      }
    });
    return counts;
  }, [allAvailableCompanies]);

  // Statistics
  const stats = useMemo(() => {
    const totalClients = allAvailableCompanies.filter(c => c.type === 'cliente').length;
    const totalLeads = allAvailableCompanies.filter(c => c.type === 'lead').length;
    const totalRevenue = allAvailableCompanies.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    return { totalClients, totalLeads, totalRevenue };
  }, [allAvailableCompanies]);

  const handleSelectCustomer = (cust: CustomerLead) => {
    setSelectedCustomerId(cust.id);
    if (cust.location && typeof cust.location.lat === 'number') {
      setMapCenter(cust.location);
      setMapZoom(15);
    }
  };

  // Scan & save all companies of the selected category into database
  const handleScanCategory = async () => {
    setIsScanningCategory(true);
    try {
      const targetCompanies = filteredCompanies;
      for (const comp of targetCompanies) {
        await saveCustomerToDatabase(comp);
      }
      if (onRefreshCustomers) onRefreshCustomers();
    } catch (e) {
      console.error('Error saving scanned category companies', e);
    } finally {
      setTimeout(() => {
        setIsScanningCategory(false);
      }, 600);
    }
  };

  const handleCopyPitch = (company: CustomerLead) => {
    const pitch = `Olá! Vi a ${company.name} no Google Maps e notei uma grande oportunidade comercial de atrair mais clientes locais com um site profissional moderno e canal próprio sem intermediários. Criei um modelo exclusivo para o seu segmento (${company.niche}). Podemos conversar rapidinho?`;
    navigator.clipboard.writeText(pitch);
    setCopiedPitchId(company.id);
    setTimeout(() => setCopiedPitchId(null), 2500);
  };

  // New customer form state
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustCity, setNewCustCity] = useState('São Paulo');
  const [newCustNiche, setNewCustNiche] = useState('Comércio Local');
  const [newCustType, setNewCustType] = useState<'cliente' | 'lead'>('lead');
  const [newCustNotes, setNewCustNotes] = useState('');
  const [newCustLat, setNewCustLat] = useState(-23.5620);
  const [newCustLng, setNewCustLng] = useState(-46.6540);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    setIsSaving(true);

    const newCustomer: CustomerLead = {
      id: `cust_${Date.now()}`,
      name: newCustName.trim(),
      phone: newCustPhone.trim() || '(11) 99999-9999',
      email: newCustEmail.trim() || `${newCustName.toLowerCase().replace(/\s+/g, '')}@exemplo.com`,
      address: newCustAddress.trim() || `${newCustCity} - Brasil`,
      city: newCustCity.trim() || 'São Paulo',
      state: 'SP',
      location: {
        lat: Number(newCustLat),
        lng: Number(newCustLng)
      },
      niche: newCustNiche.trim() || 'Varejo & Serviços',
      category: selectedCategory !== 'all' ? selectedCategory : 'servicos',
      notes: newCustNotes.trim(),
      totalSpent: newCustType === 'cliente' ? 150 : 0,
      ordersCount: newCustType === 'cliente' ? 1 : 0,
      type: newCustType,
      siteId: activeSite.id,
      createdAt: new Date().toISOString()
    };

    await saveCustomerToDatabase(newCustomer);
    setIsSaving(false);
    setShowAddModal(false);
    setSelectedCustomerId(newCustomer.id);
    setMapCenter(newCustomer.location);
    setMapZoom(15);

    // Reset form
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustAddress('');
    setNewCustNotes('');
    if (onRefreshCustomers) onRefreshCustomers();
  };

  const handleDeleteCustomer = async (id: string) => {
    if (confirm('Deseja realmente remover este registro do radar?')) {
      await deleteCustomerFromDatabase(id);
      if (selectedCustomerId === id) setSelectedCustomerId(null);
      if (onRefreshCustomers) onRefreshCustomers();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header */}
      <div className="p-4 md:p-6 bg-slate-950 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-900/30">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Radar Google Maps & Prospecção
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                {allAvailableCompanies.length} Empresas Mapeadas
              </span>
            </h2>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Pesquise e visualize todas as empresas da categoria selecionada no Google Maps para fechar criação de sites e serviços.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {searchTerm && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchTerm + ' ' + leadSearchCity)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-blue-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              title="Abrir pesquisa direta no Google Maps Oficial"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Maps Web</span>
            </a>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-emerald-900/30 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Novo Registro
          </button>

          {onBackToBuilder && (
            <button
              onClick={onBackToBuilder}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Voltar ao Construtor</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-900/90 border-b border-slate-800 divide-x divide-slate-800 text-sm">
        <div className="p-3.5 px-5">
          <span className="text-slate-400 text-xs font-medium block">Empresas Visíveis no Mapa</span>
          <span className="text-xl font-bold text-white flex items-center gap-1.5">
            {filteredCompanies.length}
            <span className="text-xs font-normal text-slate-400">/ {allAvailableCompanies.length}</span>
          </span>
        </div>
        <div className="p-3.5 px-5">
          <span className="text-slate-400 text-xs font-medium block flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Oportunidades & Leads
          </span>
          <span className="text-xl font-bold text-blue-400">{filteredCompanies.filter(c => c.type === 'lead').length}</span>
        </div>
        <div className="p-3.5 px-5">
          <span className="text-slate-400 text-xs font-medium block flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Clientes com Vendas
          </span>
          <span className="text-xl font-bold text-emerald-400">{stats.totalClients}</span>
        </div>
        <div className="p-3.5 px-5">
          <span className="text-slate-400 text-xs font-medium block">Sem Site Próprio (Leads Quentes)</span>
          <span className="text-xl font-bold text-amber-400 flex items-center gap-1">
            {filteredCompanies.filter(c => c.hasWebsite === false).length}
            <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded ml-1">Alta Demanda</span>
          </span>
        </div>
      </div>

      {/* 🎯 CATEGORY SELECTOR TABS (Displays all companies of the selected category) */}
      <div className="p-3.5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            Selecione a Categoria para Visualizar Todas as Empresas:
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            {filteredCompanies.length} empresas exibidas no mapa e na lista
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {NICHE_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || (cat.id === 'all' ? allAvailableCompanies.length : 0);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-black ${
                  isSelected ? 'bg-emerald-800/80 text-emerald-100' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subcategories Pills if a category is selected */}
        {selectedCategory !== 'all' && SUBCATEGORIES_BY_CATEGORY[selectedCategory] && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 mt-2 border-t border-slate-850">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Subnichos:</span>
            {SUBCATEGORIES_BY_CATEGORY[selectedCategory].map(sub => {
              const isSubSelected = selectedSubCategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    isSubSelected
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Search & Prospecting Bar */}
      <div className="p-3 md:p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome da empresa, bairro, nicho..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-8 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Type Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterType === 'all'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({filteredCompanies.length})
          </button>
          <button
            onClick={() => setFilterType('lead')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              filterType === 'lead'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Leads & Prospecção
          </button>
          <button
            onClick={() => setFilterType('cliente')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              filterType === 'cliente'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Clientes ({stats.totalClients})
          </button>
        </div>

        {/* Quick Regional Focus */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Cidade:
          </span>
          <button
            onClick={() => {
              setMapCenter({ lat: -23.565, lng: -46.660 });
              setMapZoom(13);
              setLeadSearchCity('São Paulo, SP');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg transition ${
              leadSearchCity.startsWith('São Paulo') ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            São Paulo
          </button>
          <button
            onClick={() => {
              setMapCenter({ lat: -22.9068, lng: -43.1729 });
              setMapZoom(13);
              setLeadSearchCity('Rio de Janeiro, RJ');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg transition ${
              leadSearchCity.startsWith('Rio') ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Rio de Janeiro
          </button>
          <button
            onClick={() => {
              setMapCenter({ lat: -19.9167, lng: -43.9345 });
              setMapZoom(13);
              setLeadSearchCity('Belo Horizonte, MG');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg transition ${
              leadSearchCity.startsWith('Belo') ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            BH
          </button>
          <button
            onClick={() => {
              setMapCenter({ lat: -25.429, lng: -49.267 });
              setMapZoom(13);
              setLeadSearchCity('Curitiba, PR');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg transition ${
              leadSearchCity.startsWith('Curitiba') ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Curitiba
          </button>
        </div>
      </div>

      {/* Main Split: Left Sidebar List & Right Interactive Google Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] h-[680px] relative">
        {/* Left Side: Companies list */}
        <div className="lg:col-span-4 bg-slate-950 border-r border-slate-800 flex flex-col h-full overflow-hidden">
          {/* Category Banner & Scan Action */}
          <div className="p-3 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>Empresas Encontradas ({filteredCompanies.length})</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {selectedCategory !== 'all'
                  ? `Categoria ativa: ${NICHE_CATEGORIES.find(c => c.id === selectedCategory)?.label}`
                  : 'Exibindo todas as categorias'}
              </p>
            </div>
            <button
              onClick={handleScanCategory}
              disabled={isScanningCategory}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow transition cursor-pointer"
              title="Salva e sincroniza todas as empresas desta categoria no banco de dados"
            >
              {isScanningCategory ? (
                <span className="animate-spin text-xs">⏳</span>
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>Sincronizar Todas</span>
            </button>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-850 p-2 space-y-1">
            {filteredCompanies.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">Nenhuma empresa encontrada</p>
                <p className="text-xs mt-1">
                  Tente limpar os termos de busca ou selecione outra categoria acima.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSubCategory('Todas');
                    setSearchTerm('');
                  }}
                  className="mt-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold"
                >
                  Ver Todas as 50+ Empresas
                </button>
              </div>
            ) : (
              filteredCompanies.map(cust => {
                const isSelected = cust.id === selectedCustomerId;
                const isClient = cust.type === 'cliente';
                const hasNoWeb = cust.hasWebsite === false;
                const rating = cust.rating || 4.8;
                const reviews = cust.reviewsCount || 120;

                return (
                  <div
                    key={cust.id}
                    onClick={() => handleSelectCustomer(cust)}
                    className={`p-3 rounded-xl cursor-pointer transition flex flex-col gap-1.5 border ${
                      isSelected
                        ? 'bg-slate-800/95 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/50'
                        : 'bg-slate-900/40 border-transparent hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-white text-sm block leading-tight flex items-center gap-1.5">
                          {cust.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {rating.toFixed(1)}
                            <span className="text-slate-400 font-normal">({reviews})</span>
                          </span>
                          {hasNoWeb && (
                            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded font-bold">
                              Sem Site Próprio
                            </span>
                          )}
                          {isClient ? (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-medium">
                              Cliente
                            </span>
                          ) : (
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-medium">
                              Lead
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[210px]">{cust.address}</span>
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 shrink-0">
                        {cust.totalSpent > 0
                          ? cust.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                          : 'Prospecção'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1.5 border-t border-slate-850">
                      <span className="text-[11px] text-slate-400 truncate max-w-[170px] font-medium">
                        🏷️ {cust.niche}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyPitch(cust);
                          }}
                          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-700"
                          title="Copiar Proposta Comercial para WhatsApp"
                        >
                          {copiedPitchId === cust.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {cust.phone && (
                          <a
                            href={`https://wa.me/55${cust.phone.replace(/\D/g, '')}?text=Ol%C3%A1!%20Vi%20a%20${encodeURIComponent(cust.name)}%20no%20Google%20Maps%20e%20gostaria%20de%20apresentar%20uma%20proposta%20de%20site%20profissional%20para%20o%20seu%20neg%C3%B3cio.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-emerald-400 hover:text-emerald-300 p-1 rounded hover:bg-emerald-950/40"
                            title="Conversar no WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomer(cust.id);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="Remover do radar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Google Map Container */}
        <div className="lg:col-span-8 h-full w-full relative bg-slate-950">
          <APIProvider apiKey={apiKey}>
            <Map
              defaultCenter={mapCenter}
              defaultZoom={mapZoom}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              style={{ width: '100%', height: '100%' }}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              <MapController center={mapCenter} zoom={mapZoom} />

              {/* Company HQ Marker */}
              <AdvancedMarker
                position={{ lat: -23.564, lng: -46.662 }}
                title={`${activeSite.companyInfo.name} (Sua Empresa)`}
              >
                <Pin
                  background="#2563eb"
                  borderColor="#1d4ed8"
                  glyphColor="#ffffff"
                />
              </AdvancedMarker>

              {/* Category Companies Markers */}
              {filteredCompanies.map(cust => {
                if (!cust.location || typeof cust.location.lat !== 'number') return null;
                const isSelected = cust.id === selectedCustomerId;
                const pinColor = getCategoryPinColor(cust.category);

                return (
                  <AdvancedMarker
                    key={cust.id}
                    position={cust.location}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    title={`${cust.name} - ${cust.niche}`}
                  >
                    <Pin
                      background={isSelected ? '#10b981' : pinColor.background}
                      borderColor={isSelected ? '#ffffff' : pinColor.border}
                      glyphColor="#ffffff"
                      scale={isSelected ? 1.25 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}

              {/* InfoWindow for clicked customer */}
              {selectedCustomer && selectedCustomer.location && (
                <InfoWindow
                  position={selectedCustomer.location}
                  onCloseClick={() => setSelectedCustomerId(null)}
                >
                  <div className="p-2 max-w-sm text-slate-900">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className="font-bold text-sm text-slate-950 leading-tight">
                          {selectedCustomer.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            {selectedCustomer.rating || 4.8}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            ({selectedCustomer.reviewsCount || 120} avaliações no Google)
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        selectedCustomer.type === 'cliente'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedCustomer.type === 'cliente' ? 'Cliente Ativo' : 'Oportunidade'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 flex items-center gap-1 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {selectedCustomer.address}
                    </p>

                    <div className="bg-slate-100 rounded-lg p-2 my-1.5 text-xs grid grid-cols-2 gap-1 border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Nicho de Atuação:</span>
                        <span className="font-bold text-slate-800 truncate block">
                          {selectedCustomer.niche}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Status de Site:</span>
                        <span className={`font-bold text-[11px] ${selectedCustomer.hasWebsite === false ? 'text-rose-600' : 'text-slate-700'}`}>
                          {selectedCustomer.hasWebsite === false ? '❌ Sem Site Próprio' : '✔️ Possui Site'}
                        </span>
                      </div>
                    </div>

                    {/* Commercial Opportunity Box */}
                    {selectedCustomer.commercialOpportunity && (
                      <div className="bg-amber-50 rounded-lg p-2 my-2 border border-amber-200 text-xs">
                        <span className="text-[10px] font-bold text-amber-800 block uppercase tracking-wider mb-0.5">
                          💡 Oportunidade Comercial:
                        </span>
                        <p className="text-slate-700 text-[11px] leading-relaxed">
                          {selectedCustomer.commercialOpportunity}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5 pt-1">
                      {selectedCustomer.phone && (
                        <a
                          href={`https://wa.me/55${selectedCustomer.phone.replace(/\D/g, '')}?text=Ol%C3%A1!%20Vi%20a%20${encodeURIComponent(selectedCustomer.name)}%20no%20Google%20Maps%20e%20gostaria%20de%20apresentar%20uma%20proposta%20de%20site%20profissional%20para%20o%20seu%20neg%C3%B3cio.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Iniciar Conversa no WhatsApp</span>
                        </a>
                      )}

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleCopyPitch(selectedCustomer)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 border border-slate-300"
                        >
                          {copiedPitchId === selectedCustomer.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copiar Pitch</span>
                            </>
                          )}
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCustomer.name + ' ' + selectedCustomer.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-blue-700 py-1 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 border border-slate-300"
                        >
                          <ExternalLink className="w-3 h-3 text-blue-600" />
                          <span>Abrir no Maps</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Map Category Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-3 text-xs text-white shadow-xl space-y-1.5 z-10 max-w-xs">
            <div className="font-bold text-slate-300 text-[11px] mb-1 flex items-center justify-between">
              <span>Legenda dos Marcadores:</span>
              <span className="text-emerald-400 font-bold">{filteredCompanies.length} visíveis</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Gastronomia</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                <span>Beleza & Barba</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Saúde & Fitness</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span>Serviços & B2B</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>Comércio & Moda</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Automotivo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span>Imóveis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-1 ring-white"></span>
                <span className="font-bold text-blue-300">Sua Matriz</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Cadastrar Novo Cliente no Mapa */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Cadastrar Empresa no Radar</h3>
                  <p className="text-xs text-slate-400">Salva no Firebase Firestore e fixa marcador no Google Maps</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome do Cliente ou Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="Ex: Pizzaria Bella Forneria ou Barber Club"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    placeholder="contato@empresa.com.br"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    placeholder="Ex: Rua Oscar Freire, 1100 - Cerqueira César, São Paulo - SP"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={newCustCity}
                    onChange={(e) => setNewCustCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tipo de Cadastro
                  </label>
                  <select
                    value={newCustType}
                    onChange={(e) => setNewCustType(e.target.value as 'cliente' | 'lead')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="lead">Lead em Prospecção</option>
                    <option value="cliente">Cliente com Vendas</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nicho ou Categoria
                  </label>
                  <input
                    type="text"
                    value={newCustNiche}
                    onChange={(e) => setNewCustNiche(e.target.value)}
                    placeholder="Ex: Pizzaria, Barbearia, Dentista, Loja de Roupas"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Coordenadas GPS (Lat / Lng)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="any"
                      value={newCustLat}
                      onChange={(e) => setNewCustLat(parseFloat(e.target.value))}
                      placeholder="Latitude (-23.56...)"
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="number"
                      step="any"
                      value={newCustLng}
                      onChange={(e) => setNewCustLng(parseFloat(e.target.value))}
                      placeholder="Longitude (-46.65...)"
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Observações / Oportunidade Comercial
                  </label>
                  <textarea
                    rows={2}
                    value={newCustNotes}
                    onChange={(e) => setNewCustNotes(e.target.value)}
                    placeholder="Ex: Empresa sem site próprio, quer vender direto pelo WhatsApp..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-900/30 disabled:opacity-50 transition"
                >
                  {isSaving ? 'Salvando no Banco...' : 'Salvar no Radar & Banco'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
