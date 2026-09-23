import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  Download, 
  Search, 
  Eye, 
  Receipt, 
  Check, 
  X, 
  Compass, 
  Globe,
  Calendar,
  CalendarDays,
  Clock,
  RotateCcw,
  ArrowRight,
  Filter,
  Lock
} from 'lucide-react';
import { SaleOrder, WebsiteData } from '../types/site';

interface SalesDashboardProps {
  orders: SaleOrder[];
  activeSite: WebsiteData;
  onViewLiveSite: () => void;
  onGoToMaps?: () => void;
}

type DateFilterPreset = 'all' | 'today' | 'yesterday' | '7days' | '30days' | 'this_month' | 'custom_day' | 'custom_range';

export const SalesDashboard: React.FC<SalesDashboardProps> = ({
  orders,
  onViewLiveSite,
  onGoToMaps
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<'all' | 'pix' | 'credit_card'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'sites' | 'products'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<SaleOrder | null>(null);

  // Date Filter States
  const [datePreset, setDatePreset] = useState<DateFilterPreset>('all');
  const [customDay, setCustomDay] = useState<string>('');
  const [customRangeStart, setCustomRangeStart] = useState<string>('');
  const [customRangeEnd, setCustomRangeEnd] = useState<string>('');

  // Helper to format local date string as YYYY-MM-DD
  const formatLocalDate = (d: Date | string): string => {
    const date = typeof d === 'string' ? new Date(d) : d;
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper for friendly BR date
  const formatBRDate = (ymdOrIso: string): string => {
    if (!ymdOrIso) return '';
    if (ymdOrIso.includes('-') && ymdOrIso.length === 10) {
      const [y, m, d] = ymdOrIso.split('-');
      return `${d}/${m}/${y}`;
    }
    const date = new Date(ymdOrIso);
    if (isNaN(date.getTime())) return ymdOrIso;
    return date.toLocaleDateString('pt-BR');
  };

  // Pre-calculated comparison dates
  const todayStr = useMemo(() => formatLocalDate(new Date()), []);
  
  const yesterdayStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatLocalDate(d);
  }, []);

  const sevenDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const thirtyDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const startOfMonth = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
  }, []);

  // Compute daily sales breakdown for quick day filtering pills
  const salesByDayList = useMemo(() => {
    const map = new Map<string, { total: number; count: number; dateStr: string; label: string; weekday: string }>();

    orders.forEach(order => {
      if (order.status !== 'pago') return;
      const d = new Date(order.createdAt);
      const dayKey = formatLocalDate(d);
      if (!dayKey) return;

      const current = map.get(dayKey) || {
        total: 0,
        count: 0,
        dateStr: dayKey,
        label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        weekday: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
      };
      current.total += order.totalAmount;
      current.count += 1;
      map.set(dayKey, current);
    });

    return Array.from(map.values()).sort((a, b) => b.dateStr.localeCompare(a.dateStr));
  }, [orders]);

  // Overall all-time metrics
  const allPaidOrders = useMemo(() => orders.filter(o => o.status === 'pago'), [orders]);
  const allTimeRevenue = useMemo(() => allPaidOrders.reduce((sum, o) => sum + o.totalAmount, 0), [allPaidOrders]);

  // Filtered orders list based on Search, Category, Payment Method, and DATE
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const isSiteSale = order.items.some(i => 
        i.productId.startsWith('site_') || 
        i.productName.toLowerCase().includes('site') || 
        i.productName.toLowerCase().includes('criação')
      );
      
      // Text Search
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Payment Method
      const matchesMethod = filterMethod === 'all' || order.paymentMethod === filterMethod;
      
      // Category
      const matchesCategory = 
        filterCategory === 'all' ||
        (filterCategory === 'sites' && isSiteSale) ||
        (filterCategory === 'products' && !isSiteSale);

      // Date Filter
      const orderDate = new Date(order.createdAt);
      const orderDayStr = formatLocalDate(orderDate);

      let matchesDate = true;
      if (datePreset === 'today') {
        matchesDate = orderDayStr === todayStr;
      } else if (datePreset === 'yesterday') {
        matchesDate = orderDayStr === yesterdayStr;
      } else if (datePreset === '7days') {
        matchesDate = orderDate >= sevenDaysAgo;
      } else if (datePreset === '30days') {
        matchesDate = orderDate >= thirtyDaysAgo;
      } else if (datePreset === 'this_month') {
        matchesDate = orderDate >= startOfMonth;
      } else if (datePreset === 'custom_day') {
        matchesDate = customDay ? orderDayStr === customDay : true;
      } else if (datePreset === 'custom_range') {
        if (customRangeStart && customRangeEnd) {
          matchesDate = orderDayStr >= customRangeStart && orderDayStr <= customRangeEnd;
        } else if (customRangeStart) {
          matchesDate = orderDayStr >= customRangeStart;
        } else if (customRangeEnd) {
          matchesDate = orderDayStr <= customRangeEnd;
        }
      }

      return matchesSearch && matchesMethod && matchesCategory && matchesDate;
    });
  }, [orders, searchTerm, filterMethod, filterCategory, datePreset, customDay, customRangeStart, customRangeEnd, todayStr, yesterdayStr, sevenDaysAgo, thirtyDaysAgo, startOfMonth]);

  // Metrics specifically for the currently filtered view
  const paidFilteredOrders = useMemo(() => filteredOrders.filter(o => o.status === 'pago'), [filteredOrders]);
  const filteredRevenue = useMemo(() => paidFilteredOrders.reduce((sum, order) => sum + order.totalAmount, 0), [paidFilteredOrders]);
  const filteredSalesCount = paidFilteredOrders.length;
  const filteredAverageTicket = filteredSalesCount > 0 ? filteredRevenue / filteredSalesCount : 0;

  // Site Sales vs Product Sales in filtered view
  const siteSalesFiltered = useMemo(() => 
    paidFilteredOrders.filter(o => 
      o.items.some(i => i.productId.startsWith('site_') || i.productName.toLowerCase().includes('site') || i.productName.toLowerCase().includes('criação'))
    ), [paidFilteredOrders]
  );
  const siteSalesFilteredRevenue = useMemo(() => siteSalesFiltered.reduce((sum, o) => sum + o.totalAmount, 0), [siteSalesFiltered]);

  // Helper text describing active date filter
  const activeDateLabel = useMemo(() => {
    switch (datePreset) {
      case 'today': return 'Hoje (' + formatBRDate(todayStr) + ')';
      case 'yesterday': return 'Ontem (' + formatBRDate(yesterdayStr) + ')';
      case '7days': return 'Últimos 7 dias';
      case '30days': return 'Últimos 30 dias';
      case 'this_month': return 'Este mês';
      case 'custom_day': return customDay ? `Dia ${formatBRDate(customDay)}` : 'Dia específico';
      case 'custom_range': 
        if (customRangeStart && customRangeEnd) return `De ${formatBRDate(customRangeStart)} até ${formatBRDate(customRangeEnd)}`;
        if (customRangeStart) return `A partir de ${formatBRDate(customRangeStart)}`;
        if (customRangeEnd) return `Até ${formatBRDate(customRangeEnd)}`;
        return 'Período personalizado';
      default: return 'Todos os dias (Histórico Geral)';
    }
  }, [datePreset, todayStr, yesterdayStr, customDay, customRangeStart, customRangeEnd]);

  // Export CSV of currently filtered orders
  const handleExportCSV = () => {
    const headers = 'ID,Data,Cliente,Itens,Total (R$),Metodo,Status\n';
    const rows = filteredOrders.map(o => {
      const itemsList = o.items.map(i => `${i.quantity}x ${i.productName}`).join(' | ');
      return `"${o.id}","${new Date(o.createdAt).toLocaleString('pt-BR')}","${o.customerName}","${itemsList}","${o.totalAmount.toFixed(2)}","${o.paymentMethod}","${o.status}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_vendas_${datePreset}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetDateFilter = () => {
    setDatePreset('all');
    setCustomDay('');
    setCustomRangeStart('');
    setCustomRangeEnd('');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              Painel Financeiro & Vendas em Tempo Real
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Lock className="w-3 h-3" />
              <span>Acesso Privado: Exclusivo para Você</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Saldo de Vendas & Faturamento
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Acompanhe o faturamento total acumulado e filtre as vendas por dia, semana, mês ou data personalizada.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onGoToMaps && (
            <button
              type="button"
              onClick={onGoToMaps}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 hover:scale-102 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Clientes no Maps</span>
            </button>
          )}

          <button
            type="button"
            onClick={onViewLiveSite}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-blue-400" />
            <span>Abrir Loja</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
            title="Exportar dados filtrados em planilha CSV"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Date Filter & Day Selector Section (Green/Blue/Black) */}
      <section aria-label="Filtro de vendas por data" className="bg-black/80 rounded-2xl border border-slate-800 p-4 mb-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                Filtrar Vendas por Dias & Período
                {datePreset !== 'all' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-extrabold">
                    Filtro Ativo
                  </span>
                )}
              </span>
              <p className="text-[11px] text-slate-400">
                Selecione um dia específico ou período para ver as vendas correspondentes.
              </p>
            </div>
          </div>

          {datePreset !== 'all' && (
            <button
              type="button"
              onClick={handleResetDateFilter}
              className="self-start lg:self-auto flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-emerald-400" />
              <span>Ver Todos os Dias</span>
            </button>
          )}
        </div>

        {/* Quick Date Preset Buttons */}
        <div className="pt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => { setDatePreset('all'); setCustomDay(''); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              datePreset === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            Todos os Dias
          </button>

          <button
            type="button"
            onClick={() => { setDatePreset('today'); setCustomDay(''); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              datePreset === 'today'
                ? 'bg-emerald-600 text-slate-950 font-black shadow-md shadow-emerald-600/30 ring-1 ring-emerald-300'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hoje</span>
          </button>

          <button
            type="button"
            onClick={() => { setDatePreset('yesterday'); setCustomDay(''); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              datePreset === 'yesterday'
                ? 'bg-emerald-600 text-slate-950 font-black shadow-md shadow-emerald-600/30 ring-1 ring-emerald-300'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            Ontem
          </button>

          <button
            type="button"
            onClick={() => { setDatePreset('7days'); setCustomDay(''); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              datePreset === '7days'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            Últimos 7 Dias
          </button>

          <button
            type="button"
            onClick={() => { setDatePreset('30days'); setCustomDay(''); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              datePreset === '30days'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            Últimos 30 Dias
          </button>

          <button
            type="button"
            onClick={() => { setDatePreset('this_month'); setCustomDay(''); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              datePreset === 'this_month'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            Este Mês
          </button>

          <button
            type="button"
            onClick={() => setDatePreset('custom_day')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              datePreset === 'custom_day'
                ? 'bg-emerald-600 text-slate-950 font-black shadow-md shadow-emerald-600/30 ring-1 ring-emerald-300'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dia Específico</span>
          </button>

          <button
            type="button"
            onClick={() => setDatePreset('custom_range')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              datePreset === 'custom_range'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>Período (De / Até)</span>
          </button>
        </div>

        {/* Custom Specific Day Picker */}
        {datePreset === 'custom_day' && (
          <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-emerald-500/30 flex flex-wrap items-center gap-3 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              Escolha o dia das vendas:
            </span>
            <input
              type="date"
              value={customDay}
              onChange={(e) => setCustomDay(e.target.value)}
              className="bg-black border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
            />
            {customDay && (
              <span className="text-xs text-emerald-400 font-extrabold">
                Exibindo vendas de: {formatBRDate(customDay)}
              </span>
            )}
          </div>
        )}

        {/* Custom Range Picker */}
        {datePreset === 'custom_range' && (
          <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-blue-500/30 flex flex-wrap items-center gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">De:</span>
              <input
                type="date"
                value={customRangeStart}
                onChange={(e) => setCustomRangeStart(e.target.value)}
                className="bg-black border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Até:</span>
              <input
                type="date"
                value={customRangeEnd}
                onChange={(e) => setCustomRangeEnd(e.target.value)}
                className="bg-black border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
              />
            </div>
            {(customRangeStart || customRangeEnd) && (
              <span className="text-xs text-blue-400 font-extrabold flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                Filtrando intervalo selecionado
              </span>
            )}
          </div>
        )}

        {/* Timeline breakdown of recorded sales per day */}
        {salesByDayList.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span className="font-bold flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
                Dias com vendas registradas (clique para filtrar direto no dia):
              </span>
              <span>{salesByDayList.length} dia(s) com faturamento</span>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {salesByDayList.map((day) => {
                const isSelected = datePreset === 'custom_day' && customDay === day.dateStr;
                const isToday = day.dateStr === todayStr;
                const isYesterday = day.dateStr === yesterdayStr;

                return (
                  <button
                    key={day.dateStr}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setDatePreset('all');
                        setCustomDay('');
                      } else {
                        setDatePreset('custom_day');
                        setCustomDay(day.dateStr);
                      }
                    }}
                    className={`shrink-0 px-3 py-2 rounded-xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-600 text-slate-950 border-emerald-400 ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black uppercase ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                        {isToday ? 'Hoje' : isYesterday ? 'Ontem' : day.weekday}
                      </span>
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-slate-950' : 'text-white'}`}>
                        {day.label}
                      </span>
                    </div>
                    <div className={`text-xs font-black mt-0.5 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`}>
                      R$ {day.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                      {day.count} {day.count === 1 ? 'venda' : 'vendas'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </section>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        
        {/* Card 1: Saldo de Vendas no Período */}
        <div className="bg-black p-5 rounded-2xl border border-emerald-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {datePreset === 'all' ? 'Saldo Total de Vendas' : 'Saldo no Período'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-400">
            R$ {filteredRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400/80 font-bold truncate">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 shrink-0">
              {activeDateLabel}
            </span>
            {datePreset !== 'all' && (
              <span className="text-slate-400 font-normal">
                (Geral: R$ {allTimeRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Faturamento com Vendas de Sites */}
        <div className="bg-black p-5 rounded-2xl border border-blue-500/40 shadow-xl relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Vendas de Sites (Projetos)
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-tight text-blue-400">
            R$ {siteSalesFilteredRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400 font-semibold">
            <span>{siteSalesFiltered.length} site(s) no período filtrado</span>
          </div>
        </div>

        {/* Card 3: Quantas Vendas Já Vendi */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-sm relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Vendas no Período
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {filteredSalesCount} <span className="text-sm font-semibold text-slate-400">pedidos</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% de pagamentos confirmados</span>
          </div>
        </div>

        {/* Card 4: Ticket Médio */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ticket Médio
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            R$ {filteredAverageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
            <span>Média por transação no período</span>
          </div>
        </div>

      </div>

      {/* Orders Table Section */}
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Table Filter and Search bar */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por cliente, pedido ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-black border border-slate-800 text-white placeholder:text-slate-600 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category tabs */}
            <div className="flex items-center bg-black p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todas ({filteredOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('sites')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  filterCategory === 'sites' ? 'bg-emerald-600 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                💼 Sites ({siteSalesFiltered.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('products')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === 'products' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                🛒 Produtos ({filteredOrders.length - siteSalesFiltered.length})
              </button>
            </div>

            {/* Payment method filters */}
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                type="button"
                onClick={() => setFilterMethod('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterMethod === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFilterMethod('pix')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  filterMethod === 'pix' ? 'bg-emerald-600 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" /> PIX
              </button>
              <button
                type="button"
                onClick={() => setFilterMethod('credit_card')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  filterMethod === 'credit_card' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3 h-3" /> Cartão
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Summary Bar */}
        <div className="bg-black/60 px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Filtro de Data: <strong className="text-white">{activeDateLabel}</strong></span>
            <span>•</span>
            <span><strong className="text-emerald-400">{filteredOrders.length}</strong> vendas encontradas</span>
          </div>

          {datePreset !== 'all' && (
            <button
              type="button"
              onClick={handleResetDateFilter}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
            >
              Remover filtro de data
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-black/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Pedido / ID</th>
                <th className="py-3 px-4">Data & Horário</th>
                <th className="py-3 px-4">Cliente / Contratante</th>
                <th className="py-3 px-4">Item / Projeto de Site</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4">Valor Total</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isSiteSale = order.items.some(i => i.productId.startsWith('site_') || i.productName.toLowerCase().includes('site') || i.productName.toLowerCase().includes('criação'));
                  const dateStr = new Date(order.createdAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={order.id} className={`hover:bg-slate-800/40 transition-colors ${isSiteSale ? 'bg-emerald-950/20' : ''}`}>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {order.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-xs">
                        <div className="font-semibold text-slate-300">
                          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{order.customerName}</div>
                        {order.customerPhone && (
                          <div className="text-[11px] text-slate-500">{order.customerPhone}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        {isSiteSale ? (
                          <div className="flex items-center gap-1.5">
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                              💼 Projeto de Site
                            </span>
                            <span className="truncate font-semibold text-white">
                              {order.items[0]?.productName}
                            </span>
                          </div>
                        ) : (
                          <div className="truncate text-slate-300">
                            {order.items.map(item => `${item.quantity}x ${item.productName}`).join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {order.paymentMethod === 'pix' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Zap className="w-3 h-3" /> PIX
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            <CreditCard className="w-3 h-3" /> Cartão
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-black text-white whitespace-nowrap">
                        R$ {order.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3 stroke-[3]" /> Pago
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(order)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    Nenhuma venda encontrada para o período selecionado ({activeDateLabel}).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-800 animate-in fade-in zoom-in duration-200">
            
            <div className="bg-black text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">Comprovante de Venda Oficial</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center pb-4 border-b border-slate-800">
                <div className="text-xs text-slate-400 font-mono">ID: {selectedReceipt.id}</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">
                  R$ {selectedReceipt.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pagamento Aprovado no Saldo
                </div>
              </div>

              <div className="text-xs space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Site Vendedor:</span>
                  <span className="font-bold text-white">{selectedReceipt.siteName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Cliente:</span>
                  <span className="font-bold text-white">{selectedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Forma de Pagamento:</span>
                  <span className="font-bold text-white uppercase">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data e Hora:</span>
                  <span className="font-bold text-white">{new Date(selectedReceipt.createdAt).toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">Itens:</span>
                <div className="space-y-1.5">
                  {selectedReceipt.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-300">{item.quantity}x {item.productName}</span>
                      <span className="font-bold text-white">
                        R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-colors mt-4 cursor-pointer"
              >
                Fechar Comprovante
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
