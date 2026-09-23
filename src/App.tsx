import React, { useState, useEffect } from 'react';
import { 
  WebsiteData, 
  SaleOrder, 
  CustomerLead 
} from './types/site';
import { AppUser, SubscriptionPurchase } from './types/auth';
import { 
  createDefaultSite, 
  subscribeSites, 
  subscribeOrders, 
  subscribeCustomers,
  saveSiteToDatabase,
  deleteSiteFromDatabase,
  saveOrderToDatabase,
  fetchSitesFromFirestore,
  fetchSingleSiteFromFirestore,
  fetchOrdersFromFirestore,
  fetchCustomersFromFirestore,
  loadCachedSites,
  loadCachedOrders,
  loadCachedCustomers
} from './services/storeService';
import {
  loadCachedUsers,
  loadCachedSubscriptions,
  loadCurrentSession,
  saveCurrentSession,
  saveUserToFirestore,
  deleteUserFromFirestore,
  fetchUsersFromFirestore,
  subscribeAppUsers,
  saveSubscriptionToFirestore,
  fetchSubscriptionsFromFirestore,
  subscribeSubscriptions,
  calculateDaysRemaining,
  DEFAULT_ADMIN_USER
} from './services/authService';
import { NicheQuickTemplate } from './data/stylePresets';
import { Navbar } from './components/Navbar';
import { Step1CompanyInfo } from './components/Step1CompanyInfo';
import { Step2DesignStyle } from './components/Step2DesignStyle';
import { Step3AIGenerator } from './components/Step3AIGenerator';
import { Step4Publish } from './components/Step4Publish';
import { SalesDashboard } from './components/SalesDashboard';
import { CustomerMapExplorer } from './components/CustomerMapExplorer';
import { WebsiteLivePreview } from './components/WebsiteLivePreview';
import { SitesListModal } from './components/SitesListModal';
import { SalesScriptsModal } from './components/SalesScriptsModal';
import { LoginView } from './components/LoginView';
import { AdminPanelView } from './components/AdminPanelView';
import { PricingPlansView } from './components/PricingPlansView';
import { ExpiredSubscriptionNotice } from './components/ExpiredSubscriptionNotice';
import { CheckCircle2, Bell, X, ShieldAlert } from 'lucide-react';

// Helper to detect if a client opened a shared demonstrative link (?demo=siteId or ?site=siteId)
const getInitialDemoParam = (): string | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('demo') || params.get('site') || params.get('preview') || null;
  } catch {
    return null;
  }
};

export default function App() {
  // Public Demo Link state for clients
  const [publicDemoSiteId, setPublicDemoSiteId] = useState<string | null>(getInitialDemoParam);
  const [publicDemoSite, setPublicDemoSite] = useState<WebsiteData | null>(null);
  const [isLoadingPublicDemo, setIsLoadingPublicDemo] = useState<boolean>(!!getInitialDemoParam());

  // Sites & CRM State
  const [sites, setSites] = useState<WebsiteData[]>(() => loadCachedSites());
  const [activeSiteId, setActiveSiteId] = useState<string>(() => {
    const loaded = loadCachedSites();
    return loaded[0]?.id || 'site_default_1';
  });
  const [orders, setOrders] = useState<SaleOrder[]>(() => loadCachedOrders());
  const [customers, setCustomers] = useState<CustomerLead[]>(() => loadCachedCustomers());
  
  // Auth & Permissions State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => loadCurrentSession());
  const [users, setUsers] = useState<AppUser[]>(() => loadCachedUsers());
  const [subscriptions, setSubscriptions] = useState<SubscriptionPurchase[]>(() => loadCachedSubscriptions());
  const [newPurchasesCount, setNewPurchasesCount] = useState<number>(0);

  // Navigation & Modals State
  const [currentView, setCurrentView] = useState<'builder' | 'sales' | 'maps' | 'sites_list' | 'live_preview' | 'admin' | 'pricing' | 'login'>('builder');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSalesScriptsOpen, setIsSalesScriptsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: 'info' | 'sale' } | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [mapInitialQuery, setMapInitialQuery] = useState<string>('');

  // Active site object
  const activeSite = sites.find(s => s.id === activeSiteId) || sites[0] || createDefaultSite();

  // Check days remaining & expiration status
  const userDaysStatus = currentUser ? calculateDaysRemaining(currentUser) : { days: 0, isExpired: false };
  const isAccountExpired = currentUser && userDaysStatus.isExpired && !currentUser.isLifetime && currentUser.role !== 'admin';

  // Firestore Live Subscriptions
  useEffect(() => {
    const unsubscribeSites = subscribeSites((updatedSites) => {
      if (updatedSites && updatedSites.length > 0) {
        setSites(updatedSites);
      }
    });

    const unsubscribeOrders = subscribeOrders((updatedOrders) => {
      if (updatedOrders) {
        setOrders(updatedOrders);
      }
    });

    const unsubscribeCustomers = subscribeCustomers((updatedCust) => {
      if (updatedCust) {
        setCustomers(updatedCust);
      }
    });

    const unsubscribeUsers = subscribeAppUsers((cloudUsers) => {
      if (cloudUsers && cloudUsers.length > 0) {
        setUsers(cloudUsers);
      }
    });

    const unsubscribeSubs = subscribeSubscriptions((cloudSubs) => {
      if (cloudSubs && cloudSubs.length > 0) {
        setSubscriptions(cloudSubs);
      }
    });

    // Check initial cloud data
    fetchSitesFromFirestore().then(cloudSites => {
      if (cloudSites && cloudSites.length > 0) setSites(cloudSites);
    });
    fetchOrdersFromFirestore().then(cloudOrders => {
      if (cloudOrders && cloudOrders.length > 0) setOrders(cloudOrders);
    });
    fetchCustomersFromFirestore().then(cloudCust => {
      if (cloudCust && cloudCust.length > 0) setCustomers(cloudCust);
    });
    fetchUsersFromFirestore().then(cloudUsers => {
      if (cloudUsers && cloudUsers.length > 0) setUsers(cloudUsers);
    });
    fetchSubscriptionsFromFirestore().then(cloudSubs => {
      if (cloudSubs && cloudSubs.length > 0) setSubscriptions(cloudSubs);
    });

    // Detect Google Maps quota error
    const handleError = (e: ErrorEvent) => {
      if (
        e.message?.includes('OverQuotaMapError') ||
        e.message?.includes('QuotaExceededError') ||
        (e.error && String(e.error).includes('OverQuotaMapError'))
      ) {
        setQuotaExceeded(true);
      }
    };
    window.addEventListener('error', handleError);

    return () => {
      unsubscribeSites();
      unsubscribeOrders();
      unsubscribeCustomers();
      unsubscribeUsers();
      unsubscribeSubs();
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Fetch single site for public demonstrative preview if loaded via URL (?demo=siteId)
  useEffect(() => {
    if (!publicDemoSiteId) return;

    // Check cached sites first for instantaneous display
    const cached = loadCachedSites();
    const found = cached.find(s => s.id === publicDemoSiteId || s.domainSlug === publicDemoSiteId);
    if (found) {
      setPublicDemoSite(found);
      setActiveSiteId(found.id);
    }

    // Always fetch fresh document directly from Firestore
    fetchSingleSiteFromFirestore(publicDemoSiteId)
      .then((cloudSite) => {
        if (cloudSite) {
          setPublicDemoSite(cloudSite);
          setActiveSiteId(cloudSite.id);
        }
      })
      .catch((err) => {
        console.warn('Error loading public demo site:', err);
      })
      .finally(() => {
        setIsLoadingPublicDemo(false);
      });
  }, [publicDemoSiteId]);

  // Update site state & persist to Firestore
  const handleUpdateSite = async (updated: WebsiteData) => {
    const newSites = sites.map(s => (s.id === updated.id ? updated : s));
    setSites(newSites);
    await saveSiteToDatabase(updated);
  };

  // Record a sale order (from live store checkout or project closing)
  const handleRecordSale = async (orderData: Omit<SaleOrder, 'id' | 'createdAt'>) => {
    const newOrder: SaleOrder = {
      ...orderData,
      id: 'PED-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString()
    };

    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);

    await saveOrderToDatabase(newOrder);

    setToastMessage({
      title: 'Venda Registrada com Sucesso!',
      desc: `Recebido R$ ${newOrder.totalAmount.toFixed(2)} de ${newOrder.customerName}`,
      type: 'sale'
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Record direct site project sale to the contractor
  const handleRecordSiteSale = async (siteToRecord: WebsiteData) => {
    const price = siteToRecord.commercial?.siteSalePrice || 1500;
    const clientName = siteToRecord.commercial?.clientBuyerName || siteToRecord.companyInfo.name || 'Cliente Contratante';

    await handleRecordSale({
      siteId: siteToRecord.id,
      siteName: siteToRecord.companyInfo.name || 'Projeto de Site',
      customerName: clientName,
      customerPhone: siteToRecord.companyInfo.whatsapp || '(11) 98888-7766',
      items: [
        {
          productId: `site_${siteToRecord.id}`,
          productName: `Criação do Site: ${siteToRecord.companyInfo.name}`,
          price: price,
          quantity: 1
        }
      ],
      totalAmount: price,
      paymentMethod: 'pix',
      status: 'pago'
    });

    // Update site status to sold
    handleUpdateSite({
      ...siteToRecord,
      commercial: {
        ...(siteToRecord.commercial || {
          siteSalePrice: 1500,
          maintenanceMonthlyPrice: 99,
          paymentTerms: '50% entrada + 50% na entrega'
        }),
        proposalStatus: 'vendido',
        saleRecorded: true
      }
    });
  };

  // Create new site
  const handleCreateNewSite = async () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const defaultSite = createDefaultSite();
    const newSite: WebsiteData = {
      ...defaultSite,
      id: `site_${Date.now()}`,
      createdAt: new Date().toISOString(),
      domainSlug: `empresa-${randomSuffix}`,
      companyInfo: {
        ...defaultSite.companyInfo,
        name: `Novo Negócio ${randomSuffix}`,
        email: `contato@empresa${randomSuffix}.com.br`
      },
      commercial: {
        siteSalePrice: 1500,
        maintenanceMonthlyPrice: 99,
        paymentTerms: '50% entrada + 50% na entrega',
        proposalStatus: 'orcamento',
        saleRecorded: false,
        notes: 'Criação de site responsivo profissional com catálogo e Google Maps.'
      },
      published: false
    };

    const updatedSites = [newSite, ...sites];
    setSites(updatedSites);
    setActiveSiteId(newSite.id);
    setCurrentStep(1);
    setCurrentView('builder');
    await saveSiteToDatabase(newSite);
  };

  // Delete site from database
  const handleDeleteSite = async (siteId: string) => {
    if (sites.length <= 1) return;
    const remaining = sites.filter(s => s.id !== siteId);
    setSites(remaining);
    if (activeSiteId === siteId) {
      setActiveSiteId(remaining[0].id);
    }
    await deleteSiteFromDatabase(siteId);
  };

  // Quick Template Autofill in Step 1
  const handleApplyTemplate = (tpl: NicheQuickTemplate) => {
    const updated: WebsiteData = {
      ...activeSite,
      companyInfo: {
        ...activeSite.companyInfo,
        name: tpl.companyName,
        niche: tpl.name,
        description: tpl.description,
        targetAudience: tpl.targetAudience,
        servicesSummary: tpl.servicesSummary,
        tone: tpl.tone
      },
      style: {
        ...activeSite.style,
        themeId: tpl.themeId
      }
    };

    if (tpl.googleMapsQuery) {
      setMapInitialQuery(tpl.googleMapsQuery);
    }

    handleUpdateSite(updated);
  };

  // Redirection to Google Maps with specified query
  const handleNavigateToMaps = (query?: string) => {
    setMapInitialQuery(query || activeSite.companyInfo.niche || '');
    setCurrentView('maps');
  };

  // Authentication Handlers
  const handleLoginSuccess = (user: AppUser) => {
    setCurrentUser(user);
    saveCurrentSession(user);
    setCurrentView('builder');
    setToastMessage({
      title: `Bem-vindo, ${user.name}!`,
      desc: user.isLifetime ? 'Acesso Vitalício Ativo' : `Você tem ${calculateDaysRemaining(user).days} dias de acesso`
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentSession(null);
    setCurrentView('login');
  };

  // User Management Handlers (Admin Panel)
  const handleAddUser = async (user: AppUser) => {
    const updated = [user, ...users.filter(u => u.id !== user.id)];
    setUsers(updated);
    await saveUserToFirestore(user);
  };

  const handleUpdateUser = async (user: AppUser) => {
    const updated = users.map(u => (u.id === user.id ? user : u));
    setUsers(updated);
    if (currentUser?.id === user.id) {
      setCurrentUser(user);
      saveCurrentSession(user);
    }
    await saveUserToFirestore(user);
  };

  const handleDeleteUser = async (userId: string) => {
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    await deleteUserFromFirestore(userId);
  };

  // Tool Subscription Purchase Handler
  const handleRecordSubscription = async (
    subData: Omit<SubscriptionPurchase, 'id' | 'createdAt'>
  ): Promise<{ purchase: SubscriptionPurchase; user: AppUser }> => {
    const purchaseId = 'SUB-' + Math.floor(1000 + Math.random() * 9000);
    const newPurchase: SubscriptionPurchase = {
      ...subData,
      id: purchaseId,
      createdAt: new Date().toISOString()
    };

    // Save purchase
    const updatedSubs = [newPurchase, ...subscriptions];
    setSubscriptions(updatedSubs);
    await saveSubscriptionToFirestore(newPurchase);

    // Auto-create or extend user account
    const generatedPassword = 'vip' + Math.floor(100 + Math.random() * 900);
    const expiryDate = subData.isLifetime
      ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 15).toISOString()
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * subData.daysDuration).toISOString();

    const existingUser = users.find(u => u.email.toLowerCase() === subData.userEmail.toLowerCase());
    
    let targetUser: AppUser;
    if (existingUser) {
      targetUser = {
        ...existingUser,
        plan: subData.planId,
        planName: subData.planName,
        planPrice: subData.amount,
        daysTotal: subData.daysDuration,
        isLifetime: subData.isLifetime,
        status: 'active',
        expiresAt: expiryDate
      };
      await handleUpdateUser(targetUser);
    } else {
      targetUser = {
        id: 'usr_' + Date.now(),
        name: subData.userName,
        email: subData.userEmail,
        password: generatedPassword,
        role: 'member',
        plan: subData.planId,
        planName: subData.planName,
        planPrice: subData.amount,
        daysTotal: subData.daysDuration,
        isLifetime: subData.isLifetime,
        status: 'active',
        createdAt: new Date().toISOString(),
        expiresAt: expiryDate
      };
      await handleAddUser(targetUser);
    }

    // Trigger Admin Notification
    setNewPurchasesCount(prev => prev + 1);
    setToastMessage({
      title: '🔔 Nova Compra da Ferramenta Recebida!',
      desc: `${subData.userName} assinou ${subData.planName} (R$ ${subData.amount.toFixed(2)})!`,
      type: 'sale'
    });

    return { purchase: newPurchase, user: targetUser };
  };

  // 1. PUBLIC DEMONSTRATIVE LINK MODE (For clients opening ?demo=siteId or ?site=siteId)
  if (publicDemoSiteId) {
    if (isLoadingPublicDemo && !publicDemoSite) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-bold tracking-tight text-white">Carregando Demonstração do Site...</h2>
          <p className="text-xs text-slate-400 mt-2">Buscando dados em tempo real no Firebase</p>
        </div>
      );
    }

    const demoSiteToDisplay = publicDemoSite || sites.find(s => s.id === publicDemoSiteId || s.domainSlug === publicDemoSiteId) || activeSite;

    return (
      <WebsiteLivePreview
        site={demoSiteToDisplay}
        isPublicDemo={true}
        onBackToBuilder={() => {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('demo');
            url.searchParams.delete('site');
            url.searchParams.delete('preview');
            window.history.pushState({}, '', url.pathname);
          } catch {}
          setPublicDemoSiteId(null);
          setCurrentView(currentUser ? 'builder' : 'login');
        }}
        onGoToSales={currentUser ? () => {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('demo');
            url.searchParams.delete('site');
            url.searchParams.delete('preview');
            window.history.pushState({}, '', url.pathname);
          } catch {}
          setPublicDemoSiteId(null);
          setCurrentView('sales');
        } : undefined}
        onCompleteSale={handleRecordSale}
      />
    );
  }

  // 2. FULL-SCREEN CREATOR LIVE PREVIEW (Without outer navbar)
  if (currentView === 'live_preview') {
    return (
      <WebsiteLivePreview
        site={activeSite}
        isPublicDemo={false}
        onBackToBuilder={() => setCurrentView('builder')}
        onGoToSales={() => setCurrentView('sales')}
        onCompleteSale={handleRecordSale}
      />
    );
  }

  // If user navigated to pricing
  if (currentView === 'pricing') {
    return (
      <PricingPlansView
        onBackToApp={currentUser ? () => setCurrentView('builder') : undefined}
        onGoToLogin={() => setCurrentView('login')}
        onRecordSubscription={handleRecordSubscription}
      />
    );
  }

  // If user is not logged in or is explicitly on login view
  if (!currentUser || currentView === 'login') {
    return (
      <LoginView
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onGoToPricing={() => setCurrentView('pricing')}
      />
    );
  }

  // If user's subscription expired and they are not admin/lifetime: block access until renewal!
  if (isAccountExpired) {
    return (
      <ExpiredSubscriptionNotice
        user={currentUser}
        onRenewPlan={() => setCurrentView('pricing')}
        onLogout={handleLogout}
      />
    );
  }

  // If admin panel view is active
  if (currentView === 'admin') {
    return (
      <AdminPanelView
        currentUser={currentUser}
        users={users}
        subscriptions={subscriptions}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        onBackToApp={() => setCurrentView('builder')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Google Maps Quota Notice (if free demo key exhausts) */}
      {quotaExceeded && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 text-amber-200 px-4 py-2 text-xs text-center flex items-center justify-center gap-2">
          <span>
            This API project has exceeded its quota for the Maps JavaScript API. See the{' '}
            <a
              href="https://developers.google.com/maps/documentation/javascript/error-messages#over-quota-map-error"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-amber-100"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Universal Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        activeSite={activeSite}
        orders={orders}
        currentUser={currentUser}
        onOpenSalesScripts={() => setIsSalesScriptsOpen(true)}
        onOpenAdminPanel={() => setCurrentView('admin')}
        onOpenPricing={() => setCurrentView('pricing')}
        onLogout={handleLogout}
        newPurchasesCount={newPurchasesCount}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {currentView === 'builder' && (
          <>
            {currentStep === 1 && (
              <Step1CompanyInfo
                companyInfo={activeSite.companyInfo}
                onChange={(info) => handleUpdateSite({ ...activeSite, companyInfo: info })}
                commercial={activeSite.commercial}
                onChangeCommercial={(commercial) => handleUpdateSite({ ...activeSite, commercial })}
                onNext={() => setCurrentStep(2)}
                onApplyTemplate={handleApplyTemplate}
                onRedirectToMaps={handleNavigateToMaps}
              />
            )}

            {currentStep === 2 && (
              <Step2DesignStyle
                style={activeSite.style}
                onChange={(style) => handleUpdateSite({ ...activeSite, style })}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <Step3AIGenerator
                site={activeSite}
                onUpdateSite={handleUpdateSite}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
                onOpenLiveModal={() => setCurrentView('live_preview')}
              />
            )}

            {currentStep === 4 && (
              <Step4Publish
                site={activeSite}
                onUpdateSite={handleUpdateSite}
                onBack={() => setCurrentStep(3)}
                onViewLive={() => setCurrentView('live_preview')}
                onGoToSales={() => setCurrentView('sales')}
                onRecordSiteSale={handleRecordSiteSale}
                onGoToMaps={handleNavigateToMaps}
                onOpenSalesScripts={() => setIsSalesScriptsOpen(true)}
              />
            )}
          </>
        )}

        {currentView === 'sales' && (
          <SalesDashboard
            orders={orders}
            activeSite={activeSite}
            onViewLiveSite={() => setCurrentView('live_preview')}
            onGoToMaps={() => handleNavigateToMaps(activeSite.companyInfo.niche || 'empresas')}
          />
        )}

        {currentView === 'maps' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CustomerMapExplorer
              customers={customers}
              activeSite={activeSite}
              initialSearchTerm={mapInitialQuery || activeSite.companyInfo.niche || ''}
              onBackToBuilder={() => setCurrentView('builder')}
              onRefreshCustomers={async () => {
                const refreshed = await fetchCustomersFromFirestore();
                setCustomers(refreshed);
              }}
            />
          </div>
        )}

        {currentView === 'sites_list' && (
          <SitesListModal
            sites={sites}
            activeSiteId={activeSiteId}
            onSelectSite={(s) => {
              setActiveSiteId(s.id);
              setCurrentView('builder');
            }}
            onCreateNewSite={handleCreateNewSite}
            onDeleteSite={handleDeleteSite}
            onClose={() => setCurrentView('builder')}
            onOpenLive={() => setCurrentView('live_preview')}
          />
        )}
      </main>

      {/* Ready-to-Copy Sales Scripts Modal */}
      {isSalesScriptsOpen && (
        <SalesScriptsModal
          site={activeSite}
          onClose={() => setIsSalesScriptsOpen(false)}
          onOpenLivePreview={() => {
            setIsSalesScriptsOpen(false);
            setCurrentView('live_preview');
          }}
        />
      )}

      {/* Real-Time Toast Notification */}
      {toastMessage && (
        <aside aria-label="Notificações" className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className={`text-white px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 ${
            toastMessage.type === 'sale'
              ? 'bg-slate-900 border-emerald-500 shadow-emerald-500/20'
              : 'bg-black border-blue-500/40 shadow-blue-500/10'
          }`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              toastMessage.type === 'sale' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {toastMessage.type === 'sale' ? <Bell className="w-4 h-4 animate-bounce" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-xs text-white">{toastMessage.title}</div>
              <div className="text-[11px] text-emerald-300">{toastMessage.desc}</div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

    </div>
  );
}
