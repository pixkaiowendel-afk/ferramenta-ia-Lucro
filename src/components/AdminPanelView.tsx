import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Mail, 
  Lock, 
  DollarSign, 
  Clock, 
  Calendar, 
  Check, 
  Copy, 
  Send, 
  ExternalLink, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Search, 
  TrendingUp, 
  CreditCard,
  MessageCircle,
  X,
  Plus
} from 'lucide-react';
import { AppUser, SubscriptionPurchase, TOOL_PRICING_PLANS } from '../types/auth';
import { calculateDaysRemaining } from '../services/authService';

interface AdminPanelViewProps {
  currentUser: AppUser;
  users: AppUser[];
  subscriptions: SubscriptionPurchase[];
  onAddUser: (user: AppUser) => Promise<void>;
  onUpdateUser: (user: AppUser) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onBackToApp: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentUser,
  users,
  subscriptions,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onBackToApp
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'purchases' | 'create_user'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  // Create User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPlan, setNewPlan] = useState<'padrao_60' | 'padrao_99' | 'mensal_180' | 'vitalicio_230' | 'custom'>('padrao_60');
  const [customDays, setCustomDays] = useState<number>(30);
  const [newPhone, setNewPhone] = useState('');
  const [createdSuccessUser, setCreatedSuccessUser] = useState<AppUser | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Financial Stats of the Tool
  const totalSubRevenue = subscriptions.reduce((sum, s) => sum + (s.status === 'pago' ? s.amount : 0), 0);
  const totalSubCount = subscriptions.filter(s => s.status === 'pago').length;

  const countByPlan = {
    padrao_60: subscriptions.filter(s => s.planId === 'padrao_60').length,
    padrao_99: subscriptions.filter(s => s.planId === 'padrao_99').length,
    mensal_180: subscriptions.filter(s => s.planId === 'mensal_180').length,
    vitalicio_230: subscriptions.filter(s => s.planId === 'vitalicio_230').length,
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(result);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword) return;

    let daysDuration = 30;
    let isLifetime = false;
    let planPrice = 60.99;
    let planName = 'Plano Padrão Econômico';

    if (newPlan === 'padrao_60') {
      daysDuration = 30;
      isLifetime = false;
      planPrice = 60.99;
      planName = 'Plano Padrão Econômico (30 dias)';
    } else if (newPlan === 'padrao_99') {
      daysDuration = 30;
      isLifetime = false;
      planPrice = 99.99;
      planName = 'Plano Padrão Pro (30 dias com Suporte)';
    } else if (newPlan === 'mensal_180') {
      daysDuration = 90;
      isLifetime = false;
      planPrice = 180.99;
      planName = 'Plano Mensal Avançado (90 dias)';
    } else if (newPlan === 'vitalicio_230') {
      daysDuration = 99999;
      isLifetime = true;
      planPrice = 230.99;
      planName = 'Plano Vitalício Completo (Acesso Permanente)';
    } else {
      daysDuration = customDays || 30;
      isLifetime = customDays >= 9999;
      planPrice = 0;
      planName = `Plano Personalizado (${daysDuration} dias)`;
    }

    const expiryDate = isLifetime 
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 15).toISOString()
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * daysDuration).toISOString();

    const newUser: AppUser = {
      id: 'usr_' + Date.now(),
      name: newName.trim() || 'Usuário Cliente',
      email: newEmail.trim().toLowerCase(),
      password: newPassword.trim(),
      role: 'member',
      plan: newPlan,
      planName,
      planPrice,
      daysTotal: daysDuration,
      isLifetime,
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: expiryDate
    };

    await onAddUser(newUser);
    setCreatedSuccessUser(newUser);

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewPassword('');
  };

  // Build welcome email / credentials message
  const getCredentialsText = (user: AppUser) => {
    const appUrl = window.location.origin + window.location.pathname;
    const { days } = calculateDaysRemaining(user);
    const durationText = user.isLifetime ? 'Acesso Permanente (Vitalício - Nunca Expira)' : `${days} dias restantes`;

    return `🚀 *SUA CONTA NA FERRAMENTA IA LUCRO FOI LIBERADA!*

Olá, ${user.name}! Tudo bem?
Seu acesso ao Criador de Sites com IA e Radar do Google Maps foi ativado com sucesso.

Aqui estão seus dados oficiais de login:
📧 *E-mail:* ${user.email}
🔑 *Senha:* ${user.password}
⭐ *Plano:* ${user.planName}
⏳ *Validade:* ${durationText}

🌐 *Acesse a ferramenta pelo link:*
${appUrl}

Qualquer dúvida ou suporte, estamos à disposição. Boas criações e excelentes vendas! 💰`;
  };

  const handleSendEmailCredentials = (user: AppUser) => {
    const subject = encodeURIComponent('Sua conta na Ferramenta IA Lucro foi ativada!');
    const body = encodeURIComponent(getCredentialsText(user));
    window.location.href = `mailto:${user.email}?subject=${subject}&body=${body}`;
  };

  const handleSendWhatsAppCredentials = (user: AppUser, phone?: string) => {
    const rawNumber = (phone || newPhone).replace(/\D/g, '');
    const validPhone = rawNumber ? (rawNumber.startsWith('55') ? rawNumber : '55' + rawNumber) : '';
    const text = encodeURIComponent(getCredentialsText(user));
    const url = validPhone ? `https://wa.me/${validPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  const handleCopyCredentials = (user: AppUser) => {
    navigator.clipboard.writeText(getCredentialsText(user));
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Quick Account Modification Actions
  const handleAdd30Days = async (user: AppUser) => {
    const currentExpiry = new Date(user.expiresAt).getTime();
    const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
    const newExpiry = new Date(baseTime + 1000 * 60 * 60 * 24 * 30).toISOString();

    await onUpdateUser({
      ...user,
      status: 'active',
      expiresAt: newExpiry
    });
  };

  const handleMakeLifetime = async (user: AppUser) => {
    await onUpdateUser({
      ...user,
      isLifetime: true,
      plan: 'vitalicio_230',
      planName: 'Plano Vitalício Completo (Permanente)',
      status: 'active',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 20).toISOString()
    });
  };

  const handleToggleBlock = async (user: AppUser) => {
    await onUpdateUser({
      ...user,
      status: user.status === 'blocked' ? 'active' : 'blocked'
    });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Banner / Breadcrumb */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-amber-500/30 px-4 sm:px-6 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">
                  Painel Super Admin
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Exclusivo do Dono
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logado como: <strong className="text-amber-300">{currentUser.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('create_user')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-md"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Criar Nova Conta</span>
            </button>

            <button
              onClick={onBackToApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
            >
              <X className="w-3.5 h-3.5" />
              <span>Voltar à Ferramenta</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Total de Faturamento</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              R$ {totalSubRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-emerald-400 font-bold mt-1">
              {totalSubCount} assinaturas pagas
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Usuários Cadastrados</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {users.length}
            </div>
            <div className="text-[10px] text-blue-400 font-bold mt-1">
              {users.filter(u => u.status === 'active').length} ativos no momento
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Plano Vitalício (R$ 230,99)</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300">
              {countByPlan.vitalicio_230}
            </div>
            <div className="text-[10px] text-amber-400/80 font-bold mt-1">
              Acesso Permanente
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Planos Mensal & Padrão</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {countByPlan.padrao_60 + countByPlan.padrao_99 + countByPlan.mensal_180}
            </div>
            <div className="text-[10px] text-slate-400 font-bold mt-1">
              Planos por tempo
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gerenciar Usuários ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'purchases'
                ? 'bg-emerald-600 text-white font-black shadow-md shadow-emerald-600/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Vendas da Ferramenta ({subscriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create_user')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'create_user'
                ? 'bg-blue-600 text-white font-black shadow-md shadow-blue-600/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Conta Manual</span>
          </button>
        </div>

        {/* Tab 1: Users List */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            
            {/* Search Bar */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por nome, e-mail ou plano..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => setActiveTab('create_user')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Criar Conta</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Usuário</th>
                      <th className="p-3.5">E-mail / Senha</th>
                      <th className="p-3.5">Plano Atribuído</th>
                      <th className="p-3.5">Dias Restantes</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Ações do Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredUsers.map((user) => {
                      const { days, isExpired } = calculateDaysRemaining(user);
                      const isOwner = user.role === 'admin';
                      const isPassVisible = showPasswordMap[user.id];

                      return (
                        <tr key={user.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isOwner && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                                  Dono
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-medium text-slate-200">{user.email}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[11px] text-amber-300">
                                {isPassVisible ? user.password : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowPasswordMap(prev => ({ ...prev, [user.id]: !prev[user.id] }))}
                                className="text-slate-400 hover:text-white cursor-pointer"
                                title={isPassVisible ? 'Ocultar senha' : 'Ver senha'}
                              >
                                {isPassVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold text-emerald-400">{user.planName}</div>
                            <div className="text-[10px] text-slate-400">
                              {user.planPrice > 0 ? `R$ ${user.planPrice.toFixed(2)}` : 'Livre'}
                            </div>
                          </td>

                          <td className="p-3.5">
                            {user.isLifetime ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black">
                                ♾️ Vitalício (Permanente)
                              </span>
                            ) : (
                              <div>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black ${
                                  isExpired 
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                    : days <= 5
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  <span>{isExpired ? 'Expirado (0 dias)' : `${days} dias restantes`}</span>
                                </span>
                                <div className="text-[10px] text-slate-400 mt-1">
                                  Expira: {new Date(user.expiresAt).toLocaleDateString('pt-BR')}
                                </div>
                              </div>
                            )}
                          </td>

                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.status === 'blocked'
                                ? 'bg-red-950 text-red-400 border border-red-800'
                                : isExpired
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            }`}>
                              {user.status === 'blocked' ? 'Bloqueado' : isExpired ? 'Expirado' : 'Ativo'}
                            </span>
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* Send Credentials */}
                              <button
                                type="button"
                                onClick={() => handleSendEmailCredentials(user)}
                                title="Enviar credenciais por e-mail (mailto)"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white transition-colors cursor-pointer"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSendWhatsAppCredentials(user)}
                                title="Enviar credenciais pelo WhatsApp"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-white transition-colors cursor-pointer"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyCredentials(user)}
                                title="Copiar credenciais de acesso"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              >
                                {copiedId === user.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>

                              {!isOwner && (
                                <>
                                  {/* Add 30 Days */}
                                  <button
                                    type="button"
                                    onClick={() => handleAdd30Days(user)}
                                    title="Renovar / Adicionar +30 dias"
                                    className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold transition-colors cursor-pointer"
                                  >
                                    +30d
                                  </button>

                                  {/* Make Lifetime */}
                                  {!user.isLifetime && (
                                    <button
                                      type="button"
                                      onClick={() => handleMakeLifetime(user)}
                                      title="Transformar em Plano Vitalício"
                                      className="px-2 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-500/30 text-amber-300 text-[10px] font-bold transition-colors cursor-pointer"
                                    >
                                      Vitalício
                                    </button>
                                  )}

                                  {/* Block / Unblock */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleBlock(user)}
                                    title={user.status === 'blocked' ? 'Desbloquear usuário' : 'Bloquear usuário'}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                      user.status === 'blocked'
                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                        : 'bg-red-950 text-red-300 border border-red-500/30'
                                    }`}
                                  >
                                    {user.status === 'blocked' ? 'Ativar' : 'Travar'}
                                  </button>

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
                                        onDeleteUser(user.id);
                                      }
                                    }}
                                    title="Excluir usuário permanentemente"
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900 text-slate-400 hover:text-red-200 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Purchases / Tool Sales */}
        {activeTab === 'purchases' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">
                  Histórico de Vendas da Ferramenta
                </h3>
                <p className="text-xs text-slate-400">
                  Veja quem comprou, quanto pagou e envie o acesso imediatamente para o cliente.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                Total Recebido: R$ {totalSubRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">ID / Data</th>
                      <th className="p-3.5">Comprador</th>
                      <th className="p-3.5">Plano Escolhido</th>
                      <th className="p-3.5">Valor Pago</th>
                      <th className="p-3.5">Forma</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-3.5">
                          <span className="font-mono text-emerald-400 font-bold">{sub.id}</span>
                          <div className="text-[10px] text-slate-400">
                            {new Date(sub.createdAt).toLocaleString('pt-BR')}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-white">{sub.userName}</div>
                          <div className="text-[11px] text-slate-300">{sub.userEmail}</div>
                          <div className="text-[10px] text-slate-400">{sub.userPhone}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-amber-300">{sub.planName}</div>
                          <div className="text-[10px] text-slate-400">
                            {sub.isLifetime ? 'Acesso Permanente' : `${sub.daysDuration} dias de acesso`}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="font-black text-sm text-white">
                            R$ {sub.amount.toFixed(2).replace('.', ',')}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                            {sub.paymentMethod === 'pix' ? 'PIX' : 'Cartão'}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Aprovado</span>
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setNewName(sub.userName);
                              setNewEmail(sub.userEmail);
                              setNewPhone(sub.userPhone);
                              setNewPlan(sub.planId);
                              handleGeneratePassword();
                              setActiveTab('create_user');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                          >
                            Gerar Conta
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Create User Account Form */}
        {activeTab === 'create_user' && (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Success Card when user is created */}
            {createdSuccessUser && (
              <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 shadow-xl space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Conta criada com sucesso para {createdSuccessUser.name}!</span>
                </div>

                <p className="text-xs text-slate-300">
                  Envie as credenciais abaixo para o usuário via E-mail ou WhatsApp:
                </p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 font-mono text-xs text-slate-200 space-y-1">
                  <div><strong>E-mail:</strong> {createdSuccessUser.email}</div>
                  <div><strong>Senha:</strong> {createdSuccessUser.password}</div>
                  <div><strong>Plano:</strong> {createdSuccessUser.planName}</div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSendEmailCredentials(createdSuccessUser)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Enviar por E-mail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppCredentials(createdSuccessUser)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar pelo WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyCredentials(createdSuccessUser)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                  >
                    {copiedId === createdSuccessUser.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>Copiar Dados</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreatedSuccessUser(null)}
                    className="ml-auto text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Fechar aviso
                  </button>
                </div>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="mb-6">
                <h3 className="text-lg font-black text-white">
                  Criar Nova Conta para Usuário
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Defina o e-mail, senha e o plano de acesso. O sistema contará os dias automaticamente.
                </p>
              </div>

              <form onSubmit={handleCreateUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Nome Completo do Cliente
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      E-mail de Login
                    </label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="cliente@email.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      WhatsApp do Cliente (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Senha de Acesso
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      Gerar Senha Automática
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Ex: senha123 ou clique em gerar"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Plano de Acesso e Contagem de Dias:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    
                    <label className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                      newPlan === 'padrao_60'
                        ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Plano Padrão Econômico</span>
                        <input
                          type="radio"
                          name="planSelect"
                          checked={newPlan === 'padrao_60'}
                          onChange={() => setNewPlan('padrao_60')}
                          className="accent-emerald-500"
                        />
                      </div>
                      <div className="text-emerald-400 font-black text-sm mt-1">R$ 60,99</div>
                      <div className="text-[10px] text-slate-400">30 dias de acesso completo</div>
                    </label>

                    <label className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                      newPlan === 'padrao_99'
                        ? 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Plano Padrão Pro</span>
                        <input
                          type="radio"
                          name="planSelect"
                          checked={newPlan === 'padrao_99'}
                          onChange={() => setNewPlan('padrao_99')}
                          className="accent-emerald-500"
                        />
                      </div>
                      <div className="text-emerald-400 font-black text-sm mt-1">R$ 99,99</div>
                      <div className="text-[10px] text-slate-400">30 dias com Suporte VIP</div>
                    </label>

                    <label className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                      newPlan === 'mensal_180'
                        ? 'bg-blue-950/60 border-blue-500 text-white ring-1 ring-blue-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Plano Mensal Avançado</span>
                        <input
                          type="radio"
                          name="planSelect"
                          checked={newPlan === 'mensal_180'}
                          onChange={() => setNewPlan('mensal_180')}
                          className="accent-blue-500"
                        />
                      </div>
                      <div className="text-blue-400 font-black text-sm mt-1">R$ 180,99</div>
                      <div className="text-[10px] text-slate-400">90 dias de acesso contínuo</div>
                    </label>

                    <label className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                      newPlan === 'vitalicio_230'
                        ? 'bg-amber-950/60 border-amber-500 text-white ring-1 ring-amber-500'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">Plano Vitalício Completo ♾️</span>
                        <input
                          type="radio"
                          name="planSelect"
                          checked={newPlan === 'vitalicio_230'}
                          onChange={() => setNewPlan('vitalicio_230')}
                          className="accent-amber-500"
                        />
                      </div>
                      <div className="text-amber-400 font-black text-sm mt-1">R$ 230,99</div>
                      <div className="text-[10px] text-amber-300/80 font-bold">Acesso Permanente (Nunca expira)</div>
                    </label>

                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all hover:scale-101 cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  <UserPlus className="w-4 h-4 stroke-[3]" />
                  <span>Cadastrar Usuário & Liberar Dias de Acesso</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
