import { WebsiteData, SaleOrder, CustomerLead } from '../types/site';
import { CATEGORY_COMPANIES_CATALOG } from '../data/categoryCompaniesCatalog';
import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

const STORAGE_SITES_KEY = 'webempresa_sites_v1';
const STORAGE_ORDERS_KEY = 'webempresa_orders_v1';
const STORAGE_CUSTOMERS_KEY = 'webempresa_customers_v1';

// Initial default demo site
export function createDefaultSite(): WebsiteData {
  return {
    id: 'site_default_1',
    createdAt: new Date().toISOString(),
    companyInfo: {
      name: 'Café & Bistrô Aromas',
      niche: 'Cafeteria & Bistrô Artesanal',
      description: 'Cafés especiais selecionados, confeitaria francesa e brunch diário com ingredientes da fazenda.',
      targetAudience: 'Amantes de café especial, profissionais em busca de espaço acolhedor e encontros gastronômicos',
      servicesSummary: 'Espressos especiais, Cappuccino italiano, Croissants artesanais e Brunches executivos',
      whatsapp: '(11) 98765-4321',
      email: 'contato@cafearomas.com.br',
      city: 'São Paulo, SP',
      tone: 'moderno'
    },
    style: {
      themeId: 'amber-luxury',
      primaryHex: '#d97706',
      secondaryHex: '#b45309',
      accentHex: '#fbbf24',
      fontStyle: 'sans',
      roundness: 'rounded-xl',
      enabledSections: {
        hero: true,
        about: true,
        products: true,
        features: true,
        testimonials: true,
        faq: true,
        contact: true,
        footer: true
      }
    },
    commercial: {
      siteSalePrice: 1850,
      maintenanceMonthlyPrice: 120,
      paymentTerms: '50% entrada + 50% na entrega',
      clientBuyerName: 'Renata Albuquerque (Gerente)',
      clientBuyerPhone: '(11) 98765-4321',
      proposalStatus: 'vendido',
      saleRecorded: true,
      notes: 'Desenvolvimento do site institucional com catálogo online e Google Maps.'
    },
    hero: {
      headline: 'O Verdadeiro Sabor do Café Artesanal e Brunch em São Paulo',
      subheadline: 'Grãos premiados com torra fresca semanal, confeitaria artesanal e ambiente feito para você desacelerar e saborear cada instante.',
      ctaPrimary: 'Pedir Online & Ver Cardápio',
      ctaSecondary: 'Chamar no WhatsApp',
      badgeText: '★ Eleito o Melhor Café do Bairro | Grãos 100% Arábica',
      heroImageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80'
    },
    about: {
      title: 'Tradição familiar com paixão pelo café de verdade',
      story: 'Nascemos do sonho de unir o café da fazenda à alta confeitaria. Cada xícara é extraída com precisão por baristas certificados e nossos pães e doces são assados todas as manhãs no próprio bistrô.',
      mission: 'Proporcionar pausas memoráveis e ricas em afeto através dos aromas e sabores mais autênticos do Brasil.',
      stats: [
        { label: 'Xícaras Servidas', value: '+45.000' },
        { label: 'Avaliações Positivas', value: '4.9 ★' },
        { label: 'Origens Selecionadas', value: '12 Estados' }
      ],
      aboutImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80'
    },
    products: [
      {
        id: 'prod_1',
        name: 'Combo Brunch Supremo',
        description: 'Croissant artesanal amanteigado, ovos mexidos cremosos, avocado, geleia e café filtrado especial.',
        price: 49.90,
        category: 'Brunch',
        badge: 'Mais Vendido',
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'prod_2',
        name: 'Café Especial em Grãos (250g)',
        description: 'Notas florais e caramelo, 86 pontos SCA, cultivo em altitude sustentável.',
        price: 38.00,
        category: 'Cafés',
        badge: 'Premiado',
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'prod_3',
        name: 'Cappuccino Italiano Cremoso',
        description: 'Espresso duplo, leite vaporizado aveludado e toque de cacau em pó 70%.',
        price: 18.50,
        category: 'Bebidas',
        imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'prod_4',
        name: 'Cheesecake de Frutas Vermelhas',
        description: 'Massa crocante com amêndoas, recheio sedoso de cream cheese e calda artesanal de amora e morango.',
        price: 24.90,
        category: 'Confeitaria',
        badge: 'Favorito',
        imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80'
      }
    ],
    features: [
      { id: 'f1', title: 'Grãos Selecionados', description: 'Cafés especiais acima de 84 pontos torrados semanalmente.', icon: 'Coffee' },
      { id: 'f2', title: 'Produção Artesanal Diária', description: 'Fornadas frescas de pães e croissants todas as manhãs.', icon: 'Sparkles' },
      { id: 'f3', title: 'Espaço Pet Friendly & Wi-Fi', description: 'Ambiente climatizado e perfeito para encontros e trabalho.', icon: 'Wifi' },
      { id: 'f4', title: 'Entrega Rápida & Segura', description: 'Embalagens térmicas especiais para manter tudo fresquinho.', icon: 'Truck' }
    ],
    testimonials: [
      {
        id: 't1',
        name: 'Beatriz Vasconcelos',
        role: 'Crítica Gastronômica Local',
        comment: 'O melhor brunch de São Paulo! O café tem doçura natural impressionante e o atendimento é impecável.',
        rating: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 't2',
        name: 'Marcelo Pires',
        role: 'Designer & Cliente Diário',
        comment: 'Virou meu refúgio para reuniões e trabalho remoto. Peço o combo brunch toda semana sem erro.',
        rating: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 't3',
        name: 'Fernanda Lima',
        role: 'Turista e Apaixonada por Café',
        comment: 'Ambiente aconchegante, cheirinho acolhedor e o cheesecake é dos deuses. Já quero voltar!',
        rating: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      }
    ],
    faq: [
      { id: 'fq1', question: 'Como posso fazer pedidos para viagem ou entrega?', answer: 'Você pode pedir diretamente aqui pelo site com pagamento facilitado no PIX ou mandar mensagem em nosso WhatsApp.' },
      { id: 'fq2', question: 'Vocês realizam reservas para eventos ou grupos?', answer: 'Sim! Aceitamos reservas para reuniões corporativas e aniversários com cardápio exclusivo. Fale conosco no WhatsApp.' },
      { id: 'fq3', question: 'Possuem opções vegetarianas e veganas?', answer: 'Com certeza! Temos leites vegetais de aveia e amêndoas, toasts veganas e opções sem glúten.' }
    ],
    contact: {
      whatsapp: '(11) 98765-4321',
      email: 'contato@cafearomas.com.br',
      phone: '(11) 3210-9876',
      address: 'Rua Oscar Freire, 920 - Cerqueira César, São Paulo - SP',
      openingHours: 'Seg a Sáb: 08h às 20h | Dom: 09h às 18h',
      ctaText: 'Venha nos visitar ou faça seu pedido online com comodidade!'
    },
    published: true,
    domainSlug: 'cafe-aromas'
  };
}

export function getInitialOrders(): SaleOrder[] {
  return [
    {
      id: 'PED-9821',
      siteId: 'site_default_1',
      siteName: 'Café & Bistrô Aromas',
      customerName: 'Renata Albuquerque',
      customerEmail: 'renata.alb@gmail.com',
      customerPhone: '(11) 99123-4567',
      customerAddress: 'Alameda Santos, 1400 - Cerqueira César, São Paulo - SP',
      customerLocation: { lat: -23.5658, lng: -46.6534 },
      items: [
        { productId: 'prod_1', productName: 'Combo Brunch Supremo', price: 49.90, quantity: 2 },
        { productId: 'prod_3', productName: 'Cappuccino Italiano Cremoso', price: 18.50, quantity: 2 }
      ],
      totalAmount: 136.80,
      paymentMethod: 'pix',
      status: 'pago',
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
    },
    {
      id: 'PED-9820',
      siteId: 'site_default_1',
      siteName: 'Café & Bistrô Aromas',
      customerName: 'Thiago Martins',
      customerEmail: 'thiago.m@outlook.com',
      customerPhone: '(11) 98234-9812',
      customerAddress: 'Rua Bela Cintra, 1800 - Consolação, São Paulo - SP',
      customerLocation: { lat: -23.5582, lng: -46.6621 },
      items: [
        { productId: 'prod_2', productName: 'Café Especial em Grãos (250g)', price: 38.00, quantity: 3 }
      ],
      totalAmount: 114.00,
      paymentMethod: 'credit_card',
      status: 'pago',
      createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString()
    },
    {
      id: 'PED-9819',
      siteId: 'site_default_1',
      siteName: 'Café & Bistrô Aromas',
      customerName: 'Camila Guimarães',
      customerEmail: 'camilag@empresa.com.br',
      customerPhone: '(11) 97711-2233',
      customerAddress: 'Av. Brigadeiro Faria Lima, 2200 - Pinheiros, São Paulo - SP',
      customerLocation: { lat: -23.5785, lng: -46.6914 },
      items: [
        { productId: 'prod_4', productName: 'Cheesecake de Frutas Vermelhas', price: 24.90, quantity: 4 },
        { productId: 'prod_1', productName: 'Combo Brunch Supremo', price: 49.90, quantity: 1 }
      ],
      totalAmount: 149.50,
      paymentMethod: 'pix',
      status: 'pago',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString()
    },
    {
      id: 'PED-9818',
      siteId: 'site_default_1',
      siteName: 'Café & Bistrô Aromas',
      customerName: 'Lucas Eduardo Prado',
      customerEmail: 'lucas.prado@yahoo.com',
      customerPhone: '(11) 96543-2198',
      customerAddress: 'Rua Augusta, 2100 - Cerqueira César, São Paulo - SP',
      customerLocation: { lat: -23.5601, lng: -46.6589 },
      items: [
        { productId: 'prod_2', productName: 'Café Especial em Grãos (250g)', price: 38.00, quantity: 1 },
        { productId: 'prod_3', productName: 'Cappuccino Italiano Cremoso', price: 18.50, quantity: 1 }
      ],
      totalAmount: 56.50,
      paymentMethod: 'pix',
      status: 'pago',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString()
    }
  ];
}

export function getInitialCustomers(): CustomerLead[] {
  const vipClients: CustomerLead[] = [
    {
      id: 'cust_1',
      name: 'Renata Albuquerque',
      email: 'renata.alb@gmail.com',
      phone: '(11) 99123-4567',
      address: 'Alameda Santos, 1400 - Cerqueira César, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
      location: { lat: -23.5658, lng: -46.6534 },
      niche: 'Consumidora VIP - Gastronomia',
      category: 'gastronomia',
      notes: 'Cliente frequente. Adora café especial torra média e brunch aos finais de semana.',
      totalSpent: 420.50,
      ordersCount: 4,
      type: 'cliente',
      siteId: 'site_default_1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString()
    },
    {
      id: 'cust_2',
      name: 'Thiago Martins',
      email: 'thiago.m@outlook.com',
      phone: '(11) 98234-9812',
      address: 'Rua Bela Cintra, 1800 - Consolação, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
      location: { lat: -23.5582, lng: -46.6621 },
      niche: 'Consumidor Frequente',
      category: 'servicos',
      notes: 'Compra grãos em pacote para escritório de advocacia.',
      totalSpent: 342.00,
      ordersCount: 3,
      type: 'cliente',
      siteId: 'site_default_1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
    },
    {
      id: 'cust_3',
      name: 'Camila Guimarães',
      email: 'camilag@empresa.com.br',
      phone: '(11) 97711-2233',
      address: 'Av. Brigadeiro Faria Lima, 2200 - Pinheiros, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
      location: { lat: -23.5785, lng: -46.6914 },
      niche: 'Corporativo & Eventos',
      category: 'servicos',
      notes: 'Responsável pelas compras de coffee break da fintech.',
      totalSpent: 890.00,
      ordersCount: 5,
      type: 'cliente',
      siteId: 'site_default_1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString()
    },
    {
      id: 'cust_4',
      name: 'Lucas Eduardo Prado',
      email: 'lucas.prado@yahoo.com',
      phone: '(11) 96543-2198',
      address: 'Rua Augusta, 2100 - Cerqueira César, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
      location: { lat: -23.5601, lng: -46.6589 },
      niche: 'Consumidor Local',
      category: 'gastronomia',
      notes: 'Trabalha nas redondezas. Sempre pede cappuccino para viagem.',
      totalSpent: 168.00,
      ordersCount: 3,
      type: 'cliente',
      siteId: 'site_default_1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
    }
  ];

  return [...vipClients, ...CATEGORY_COMPANIES_CATALOG];
}

// ----------------- LOCAL CACHING HELPERS -----------------
export function loadCachedSites(): WebsiteData[] {
  try {
    const raw = localStorage.getItem(STORAGE_SITES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error reading cached sites', err);
  }
  return [createDefaultSite()];
}

export function cacheSitesLocally(sites: WebsiteData[]) {
  try {
    localStorage.setItem(STORAGE_SITES_KEY, JSON.stringify(sites));
  } catch (e) {
    console.error('Error saving sites to localStorage', e);
  }
}

export function loadCachedOrders(): SaleOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading cached orders', err);
  }
  return getInitialOrders();
}

export function cacheOrdersLocally(orders: SaleOrder[]) {
  try {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage', e);
  }
}

export function loadCachedCustomers(): CustomerLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOMERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((c: any) => c.id));
        const missingCatalogItems = CATEGORY_COMPANIES_CATALOG.filter(c => !existingIds.has(c.id));
        if (missingCatalogItems.length > 0) {
          const merged = [...parsed, ...missingCatalogItems];
          cacheCustomersLocally(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading cached customers', err);
  }
  return getInitialCustomers();
}

export function cacheCustomersLocally(customers: CustomerLead[]) {
  try {
    localStorage.setItem(STORAGE_CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (e) {
    console.error('Error saving customers to localStorage', e);
  }
}

// ----------------- FIRESTORE DATABASE SYNCHRONIZATION -----------------

// SITES
export async function fetchSitesFromFirestore(): Promise<WebsiteData[]> {
  try {
    const colRef = collection(db, 'sites');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      // Seed initial default site to Firestore
      const defaultSite = createDefaultSite();
      await setDoc(doc(db, 'sites', defaultSite.id), defaultSite);
      cacheSitesLocally([defaultSite]);
      return [defaultSite];
    }
    const sites = snapshot.docs.map(d => d.data() as WebsiteData);
    cacheSitesLocally(sites);
    return sites;
  } catch (error) {
    console.warn('Firestore fetch sites fallback to cache:', error);
    return loadCachedSites();
  }
}

export async function fetchSingleSiteFromFirestore(siteId: string): Promise<WebsiteData | null> {
  // First check if it matches in local storage cache
  const cached = loadCachedSites();
  const cachedMatch = cached.find(s => s.id === siteId || s.domainSlug === siteId);

  // Fetch freshest from Firestore
  try {
    const docRef = doc(db, 'sites', siteId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const site = docSnap.data() as WebsiteData;
      // Update local storage
      const existsIndex = cached.findIndex(s => s.id === site.id);
      const updated = existsIndex >= 0 ? [...cached.slice(0, existsIndex), site, ...cached.slice(existsIndex + 1)] : [site, ...cached];
      cacheSitesLocally(updated);
      return site;
    }
  } catch (err) {
    console.warn('Firestore fetch single site error, using cache:', err);
  }

  return cachedMatch || null;
}

export async function saveSiteToDatabase(site: WebsiteData): Promise<void> {
  // Update local cache immediately
  const cached = loadCachedSites();
  const index = cached.findIndex(s => s.id === site.id);
  const updated = index >= 0 ? [...cached.slice(0, index), site, ...cached.slice(index + 1)] : [site, ...cached];
  cacheSitesLocally(updated);

  // Sync with Firestore
  try {
    await setDoc(doc(db, 'sites', site.id), site);
  } catch (error) {
    console.error('Error persisting site to Firestore:', error);
  }
}

export async function deleteSiteFromDatabase(siteId: string): Promise<void> {
  const cached = loadCachedSites().filter(s => s.id !== siteId);
  cacheSitesLocally(cached);
  try {
    await deleteDoc(doc(db, 'sites', siteId));
  } catch (error) {
    console.error('Error deleting site from Firestore:', error);
  }
}

export function subscribeSites(callback: (sites: WebsiteData[]) => void): () => void {
  try {
    const colRef = collection(db, 'sites');
    return onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const sites = snapshot.docs.map(d => d.data() as WebsiteData);
        cacheSitesLocally(sites);
        callback(sites);
      } else {
        callback(loadCachedSites());
      }
    }, (error) => {
      console.warn('Firestore sites subscription note:', error);
      callback(loadCachedSites());
    });
  } catch (e) {
    console.warn('Could not setup sites snapshot listener:', e);
    callback(loadCachedSites());
    return () => {};
  }
}

// ORDERS
export async function fetchOrdersFromFirestore(): Promise<SaleOrder[]> {
  try {
    const colRef = collection(db, 'orders');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      const initial = getInitialOrders();
      for (const ord of initial) {
        await setDoc(doc(db, 'orders', ord.id), ord);
      }
      cacheOrdersLocally(initial);
      return initial;
    }
    const orders = snapshot.docs.map(d => d.data() as SaleOrder);
    cacheOrdersLocally(orders);
    return orders;
  } catch (error) {
    console.warn('Firestore fetch orders fallback to cache:', error);
    return loadCachedOrders();
  }
}

export async function saveOrderToDatabase(orderData: Omit<SaleOrder, 'id' | 'createdAt'>): Promise<SaleOrder> {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newOrder: SaleOrder = {
    ...orderData,
    id: `PED-${randomNum}`,
    createdAt: new Date().toISOString()
  };

  const cached = loadCachedOrders();
  const updatedOrders = [newOrder, ...cached];
  cacheOrdersLocally(updatedOrders);

  // Sync order to Firestore
  try {
    await setDoc(doc(db, 'orders', newOrder.id), newOrder);
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
  }

  // Also upsert or register customer lead on the database so they appear in Google Maps!
  try {
    await upsertCustomerFromOrder(newOrder);
  } catch (err) {
    console.warn('Customer upsert note:', err);
  }

  return newOrder;
}

export function subscribeOrders(callback: (orders: SaleOrder[]) => void): () => void {
  try {
    const colRef = collection(db, 'orders');
    return onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const orders = snapshot.docs.map(d => d.data() as SaleOrder);
        // Sort descending by date
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        cacheOrdersLocally(orders);
        callback(orders);
      } else {
        callback(loadCachedOrders());
      }
    }, (error) => {
      console.warn('Firestore orders subscription note:', error);
      callback(loadCachedOrders());
    });
  } catch (e) {
    console.warn('Could not setup orders snapshot listener:', e);
    callback(loadCachedOrders());
    return () => {};
  }
}

// CUSTOMERS & LEADS (FOR GOOGLE MAPS SEARCH)
export async function fetchCustomersFromFirestore(): Promise<CustomerLead[]> {
  try {
    const colRef = collection(db, 'customers');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      const initial = getInitialCustomers();
      for (const cust of initial) {
        await setDoc(doc(db, 'customers', cust.id), cust);
      }
      cacheCustomersLocally(initial);
      return initial;
    }
    const customers = snapshot.docs.map(d => d.data() as CustomerLead);
    cacheCustomersLocally(customers);
    return customers;
  } catch (error) {
    console.warn('Firestore fetch customers fallback to cache:', error);
    return loadCachedCustomers();
  }
}

export async function saveCustomerToDatabase(customer: CustomerLead): Promise<void> {
  const cached = loadCachedCustomers();
  const index = cached.findIndex(c => c.id === customer.id);
  const updated = index >= 0
    ? [...cached.slice(0, index), customer, ...cached.slice(index + 1)]
    : [customer, ...cached];
  cacheCustomersLocally(updated);

  try {
    await setDoc(doc(db, 'customers', customer.id), customer);
  } catch (error) {
    console.error('Error saving customer to Firestore:', error);
  }
}

export async function deleteCustomerFromDatabase(customerId: string): Promise<void> {
  const cached = loadCachedCustomers().filter(c => c.id !== customerId);
  cacheCustomersLocally(cached);
  try {
    await deleteDoc(doc(db, 'customers', customerId));
  } catch (error) {
    console.error('Error deleting customer from Firestore:', error);
  }
}

export function subscribeCustomers(callback: (customers: CustomerLead[]) => void): () => void {
  try {
    const colRef = collection(db, 'customers');
    return onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const customers = snapshot.docs.map(d => d.data() as CustomerLead);
        cacheCustomersLocally(customers);
        callback(customers);
      } else {
        callback(loadCachedCustomers());
      }
    }, (error) => {
      console.warn('Firestore customers subscription note:', error);
      callback(loadCachedCustomers());
    });
  } catch (e) {
    console.warn('Could not setup customers snapshot listener:', e);
    callback(loadCachedCustomers());
    return () => {};
  }
}

async function upsertCustomerFromOrder(order: SaleOrder) {
  const customers = loadCachedCustomers();
  const existingIndex = customers.findIndex(
    c => (order.customerEmail && c.email.toLowerCase() === order.customerEmail.toLowerCase()) ||
         c.name.toLowerCase() === order.customerName.toLowerCase()
  );

  const defaultLocations = [
    { lat: -23.5630, lng: -46.6540 },
    { lat: -23.5700, lng: -46.6450 },
    { lat: -23.5510, lng: -46.6340 },
    { lat: -23.5850, lng: -46.6810 }
  ];
  const assignedLocation = order.customerLocation || defaultLocations[Math.floor(Math.random() * defaultLocations.length)];

  if (existingIndex >= 0) {
    const existing = customers[existingIndex];
    const updatedCustomer: CustomerLead = {
      ...existing,
      totalSpent: existing.totalSpent + order.totalAmount,
      ordersCount: existing.ordersCount + 1,
      phone: order.customerPhone || existing.phone,
      address: order.customerAddress || existing.address,
      location: order.customerLocation || existing.location,
      updatedAt: new Date().toISOString()
    };
    await saveCustomerToDatabase(updatedCustomer);
  } else {
    const newCustomer: CustomerLead = {
      id: `cust_${Date.now()}`,
      name: order.customerName,
      email: order.customerEmail || `cliente.${Date.now()}@exemplo.com`,
      phone: order.customerPhone || '(11) 99000-0000',
      address: order.customerAddress || 'São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
      location: assignedLocation,
      niche: 'Cliente da Loja Online',
      notes: `Primeiro pedido: ${order.id} no valor de R$ ${order.totalAmount.toFixed(2)} (${order.paymentMethod.toUpperCase()})`,
      totalSpent: order.totalAmount,
      ordersCount: 1,
      type: 'cliente',
      siteId: order.siteId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await saveCustomerToDatabase(newCustomer);
  }
}

// Backward compatibility helper
export function loadSavedSites(): WebsiteData[] {
  return loadCachedSites();
}
export function saveSites(sites: WebsiteData[]) {
  cacheSitesLocally(sites);
  sites.forEach(s => saveSiteToDatabase(s));
}
export function loadSavedOrders(): SaleOrder[] {
  return loadCachedOrders();
}
export function saveOrders(orders: SaleOrder[]) {
  cacheOrdersLocally(orders);
  orders.forEach(o => {
    setDoc(doc(db, 'orders', o.id), o).catch(console.error);
  });
}
export function recordNewSale(orderData: Omit<SaleOrder, 'id' | 'createdAt'>): SaleOrder {
  const cached = loadCachedOrders();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newOrder: SaleOrder = {
    ...orderData,
    id: `PED-${randomNum}`,
    createdAt: new Date().toISOString()
  };
  const updated = [newOrder, ...cached];
  cacheOrdersLocally(updated);
  setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(console.error);
  upsertCustomerFromOrder(newOrder).catch(console.error);
  return newOrder;
}
