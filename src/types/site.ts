export interface CompanyInfo {
  name: string;
  niche: string;
  description: string;
  targetAudience: string;
  servicesSummary: string;
  whatsapp: string;
  email: string;
  city: string;
  tone: 'profissional' | 'moderno' | 'luxo' | 'descontraido' | 'persuasivo';
}

export interface SiteStyle {
  themeId: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  fontStyle: 'sans' | 'serif' | 'display';
  roundness: 'rounded-md' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
  enabledSections: {
    hero: boolean;
    about: boolean;
    products: boolean;
    features: boolean;
    testimonials: boolean;
    faq: boolean;
    contact: boolean;
    footer: boolean;
  };
}

export interface ProductOrService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  badge?: string;
  imageUrl: string;
  isService?: boolean;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  comment: string;
  rating: number;
  avatarUrl: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface WebsiteCommercialPlan {
  siteSalePrice: number; // Preço de venda do site (ex: 1500)
  maintenanceMonthlyPrice?: number; // Mensalidade de manutenção/hospedagem (ex: 99)
  paymentTerms?: string; // Ex: '50% entrada + 50% na entrega'
  clientBuyerName?: string; // Nome do cliente final comprador
  clientBuyerPhone?: string; // WhatsApp do cliente
  proposalStatus?: 'orcamento' | 'proposta_enviada' | 'vendido';
  saleRecorded?: boolean; // Se a venda já foi registrada no painel de saldo
  notes?: string;
}

export interface WebsiteData {
  id: string;
  createdAt: string;
  companyInfo: CompanyInfo;
  style: SiteStyle;
  commercial?: WebsiteCommercialPlan;
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badgeText: string;
    heroImageUrl: string;
  };
  about: {
    title: string;
    story: string;
    mission: string;
    stats: { label: string; value: string }[];
    aboutImageUrl: string;
  };
  products: ProductOrService[];
  features: FeatureItem[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  contact: {
    whatsapp: string;
    email: string;
    phone: string;
    address: string;
    openingHours: string;
    ctaText: string;
  };
  published: boolean;
  domainSlug: string;
  publishedAt?: string;
}

export interface SaleOrder {
  id: string;
  siteId: string;
  siteName: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerLocation?: {
    lat: number;
    lng: number;
  };
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  status: 'pago' | 'pendente' | 'cancelado';
  createdAt: string;
}

export interface CustomerLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  location: {
    lat: number;
    lng: number;
  };
  niche: string;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  hasWebsite?: boolean;
  commercialOpportunity?: string;
  notes?: string;
  totalSpent: number;
  ordersCount: number;
  type: 'cliente' | 'lead';
  siteId?: string;
  createdAt: string;
  updatedAt?: string;
}

