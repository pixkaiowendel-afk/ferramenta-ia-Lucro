export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  plan: 'padrao_60' | 'padrao_99' | 'mensal_180' | 'vitalicio_230' | 'custom';
  planName: string;
  planPrice: number;
  daysTotal: number;
  isLifetime: boolean;
  status: 'active' | 'expired' | 'blocked';
  createdAt: string;
  expiresAt: string; // ISO date string or 'infinite'
}

export interface SubscriptionPurchase {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  planId: 'padrao_60' | 'padrao_99' | 'mensal_180' | 'vitalicio_230';
  planName: string;
  amount: number;
  paymentMethod: 'pix' | 'credit_card';
  status: 'pago' | 'pendente';
  daysDuration: number;
  isLifetime: boolean;
  createdAt: string;
}

export interface ToolPricingPlan {
  id: 'padrao_60' | 'padrao_99' | 'mensal_180' | 'vitalicio_230';
  name: string;
  badge?: string;
  price: number;
  priceDisplay: string;
  periodLabel: string;
  daysDuration: number;
  isLifetime: boolean;
  description: string;
  features: string[];
  popular?: boolean;
}

export const TOOL_PRICING_PLANS: ToolPricingPlan[] = [
  {
    id: 'padrao_60',
    name: 'Plano Padrão Econômico',
    badge: 'Acesso 30 Dias',
    price: 60.99,
    priceDisplay: 'R$ 60,99',
    periodLabel: 'por 30 dias de acesso',
    daysDuration: 30,
    isLifetime: false,
    description: 'Ideal para quem está começando a criar e vender sites para comércios locais.',
    features: [
      '30 dias de acesso completo à ferramenta',
      'Criador de sites com Inteligência Artificial',
      'Catálogo online com pedidos pelo WhatsApp',
      'Radar de prospecção com Google Maps',
      'Scripts de mensagens prontas para fechar vendas',
      'Exportação de código e links de demonstração'
    ]
  },
  {
    id: 'padrao_99',
    name: 'Plano Padrão Pro',
    badge: 'Mais Recomendado',
    price: 99.99,
    priceDisplay: 'R$ 99,99',
    periodLabel: 'por 30 dias de acesso com suporte',
    daysDuration: 30,
    isLifetime: false,
    popular: false,
    description: 'Para quem busca suporte prioritário e recursos avançados de fechamento comercial.',
    features: [
      '30 dias de acesso irrestrito à ferramenta',
      'Todas as funções do plano de 60,99',
      'Prioridade na geração com Inteligência Artificial',
      'Biblioteca completa de modelos por categoria',
      'Scripts avançados de vendas e quebra de objeções',
      'Suporte VIP para dúvidas de prospecção'
    ]
  },
  {
    id: 'mensal_180',
    name: 'Plano Mensal Avançado',
    badge: 'Trimestral (90 Dias)',
    price: 180.99,
    priceDisplay: 'R$ 180,99',
    periodLabel: 'por 90 dias de acesso contínuo',
    daysDuration: 90,
    isLifetime: false,
    popular: false,
    description: 'Três meses de uso contínuo com economia de 40% em relação à renovação mensal.',
    features: [
      '90 dias corridos de acesso total garantido',
      'Criação de sites e landing pages ilimitadas',
      'Radar ampliado de prospecção e mapa de clientes',
      'Scripts persuasivos com gatilhos de fechamento rápido',
      'Atualizações automáticas da ferramenta inclusas',
      'Economia equivalente a R$ 60,33/mês'
    ]
  },
  {
    id: 'vitalicio_230',
    name: 'Plano Vitalício Completo',
    badge: 'Melhor Custo-Benefício ♾️',
    price: 230.99,
    priceDisplay: 'R$ 230,99',
    periodLabel: 'pagamento único / sem mensalidades',
    daysDuration: 99999,
    isLifetime: true,
    popular: true,
    description: 'Acesso PERMANENTE para sempre. Você paga apenas uma vez e nunca mais se preocupa com renovação!',
    features: [
      '♾️ Acesso VITALÍCIO permanente (nunca expira)',
      'Sem mensalidades, anuidades ou cobranças futuras',
      'Todos os novos recursos e nichos futuros inclusos',
      'Criador com IA e radar do Google Maps sem limites',
      'Todas as cópias e mensagens de vendas com 1 clique',
      'Selo de Membro Fundador Vitalício'
    ]
  }
];
