export interface DesignTheme {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgLight: string;
  bgDark: string;
  textPrimary: string;
  fontHeading: string;
  fontBody: string;
  hex: string;
}

export type ThemePreset = DesignTheme;

export const THEME_PRESETS: DesignTheme[] = [
  {
    id: 'blue-tech',
    name: 'Azul Executivo',
    tagline: 'Ideal para B2B, tecnologia, finanças e consultorias',
    primaryColor: 'from-blue-600 to-indigo-700',
    secondaryColor: 'bg-blue-50',
    accentColor: 'text-blue-600',
    bgLight: 'bg-slate-50',
    bgDark: 'bg-slate-900',
    textPrimary: 'text-slate-900',
    fontHeading: 'font-sans font-black tracking-tight',
    fontBody: 'font-sans',
    hex: '#2563eb'
  },
  {
    id: 'emerald-growth',
    name: 'Esmeralda Vital',
    tagline: 'Perfeito para saúde, nutrição, sustentabilidade e bem-estar',
    primaryColor: 'from-emerald-600 to-teal-700',
    secondaryColor: 'bg-emerald-50',
    accentColor: 'text-emerald-600',
    bgLight: 'bg-stone-50',
    bgDark: 'bg-stone-900',
    textPrimary: 'text-stone-900',
    fontHeading: 'font-sans font-bold',
    fontBody: 'font-sans',
    hex: '#059669'
  },
  {
    id: 'amber-luxury',
    name: 'Dourado & Bistrô',
    tagline: 'Alta gastronomia, cafeterias, barbearias vintage e joias',
    primaryColor: 'from-amber-500 to-orange-600',
    secondaryColor: 'bg-amber-50',
    accentColor: 'text-amber-600',
    bgLight: 'bg-amber-50/40',
    bgDark: 'bg-neutral-900',
    textPrimary: 'text-neutral-900',
    fontHeading: 'font-serif font-bold',
    fontBody: 'font-sans',
    hex: '#d97706'
  },
  {
    id: 'crimson-impact',
    name: 'Rubi Energético',
    tagline: 'Automotivo, academias, crossfit, esportes e ofertas rápidas',
    primaryColor: 'from-rose-600 to-red-700',
    secondaryColor: 'bg-rose-50',
    accentColor: 'text-rose-600',
    bgLight: 'bg-zinc-50',
    bgDark: 'bg-zinc-900',
    textPrimary: 'text-zinc-900',
    fontHeading: 'font-sans font-black uppercase tracking-wider',
    fontBody: 'font-sans',
    hex: '#e11d48'
  },
  {
    id: 'indigo-modern',
    name: 'Índigo Criativo',
    tagline: 'Agências, infoprodutos, marketing digital e design',
    primaryColor: 'from-indigo-600 to-purple-700',
    secondaryColor: 'bg-indigo-50',
    accentColor: 'text-indigo-600',
    bgLight: 'bg-slate-50',
    bgDark: 'bg-slate-900',
    textPrimary: 'text-slate-900',
    fontHeading: 'font-sans font-extrabold',
    fontBody: 'font-sans',
    hex: '#4f46e5'
  },
  {
    id: 'rose-charm',
    name: 'Rose & Estética',
    tagline: 'Salões de beleza, clínicas estéticas, moda feminina e spas',
    primaryColor: 'from-pink-500 to-rose-600',
    secondaryColor: 'bg-pink-50',
    accentColor: 'text-pink-600',
    bgLight: 'bg-pink-50/30',
    bgDark: 'bg-gray-900',
    textPrimary: 'text-gray-900',
    fontHeading: 'font-sans font-semibold tracking-wide',
    fontBody: 'font-sans',
    hex: '#ec4899'
  },
  {
    id: 'cyan-future',
    name: 'Ciano & Odonto',
    tagline: 'Clínicas odontológicas, engenharia, inovação e médicos',
    primaryColor: 'from-cyan-500 to-blue-600',
    secondaryColor: 'bg-cyan-50',
    accentColor: 'text-cyan-600',
    bgLight: 'bg-slate-50',
    bgDark: 'bg-slate-950',
    textPrimary: 'text-slate-900',
    fontHeading: 'font-sans font-bold',
    fontBody: 'font-sans',
    hex: '#0891b2'
  },
  {
    id: 'slate-corporate',
    name: 'Grafite Nobre',
    tagline: 'Advocacia corporativa, contabilidade, imóveis de luxo e indústria',
    primaryColor: 'from-slate-700 to-slate-900',
    secondaryColor: 'bg-slate-100',
    accentColor: 'text-slate-800',
    bgLight: 'bg-gray-50',
    bgDark: 'bg-black',
    textPrimary: 'text-gray-900',
    fontHeading: 'font-sans font-bold tracking-tight',
    fontBody: 'font-sans',
    hex: '#334155'
  }
];

export interface NicheCategory {
  id: string;
  label: string;
  icon: string;
}

export const NICHE_CATEGORIES: NicheCategory[] = [
  { id: 'all', label: 'Todas as Categorias', icon: 'Sparkles' },
  { id: 'beleza', label: 'Beleza & Barbearia', icon: 'Scissors' },
  { id: 'gastronomia', label: 'Alimentação & Gastronomia', icon: 'UtensilsCrossed' },
  { id: 'saude', label: 'Saúde & Pet', icon: 'HeartPulse' },
  { id: 'servicos', label: 'Serviços & B2B', icon: 'Scale' },
  { id: 'varejo', label: 'Comércio & Moda', icon: 'ShoppingBag' },
  { id: 'automotivo', label: 'Automotivo & Mecânica', icon: 'Car' },
  { id: 'imoveis', label: 'Imóveis & Construção', icon: 'Building2' }
];

export interface NicheQuickTemplate {
  category: string;
  categoryLabel: string;
  name: string;
  icon: string;
  companyName: string;
  description: string;
  servicesSummary: string;
  targetAudience: string;
  tone: 'profissional' | 'moderno' | 'luxo' | 'descontraido' | 'persuasivo';
  themeId: string;
  googleMapsQuery: string;
}

export const QUICK_NICHE_EXAMPLES: NicheQuickTemplate[] = [
  // 1. Barbearia
  {
    category: 'beleza',
    categoryLabel: 'Beleza & Barbearia',
    name: 'Barbearia',
    icon: 'Scissors',
    companyName: 'Navalha de Ouro Barber Club',
    description: 'Cortes masculinos de precisão, barboterapia tradicional com toalha quente e acabamento premium.',
    servicesSummary: 'Corte degradê navalhado, barba completa com toalha quente, pigmentação e dia do noivo',
    targetAudience: 'Homens que valorizam estilo, alinhamento visual e atendimento de excelência',
    tone: 'luxo',
    themeId: 'amber-luxury',
    googleMapsQuery: 'Barbearias'
  },
  // 2. Pet Shop & Veterinária
  {
    category: 'saude',
    categoryLabel: 'Saúde & Pet',
    name: 'Pet Shop & Veterinária',
    icon: 'HeartPulse',
    companyName: 'PetCare Clínica Veterinária & Boutique',
    description: 'Cuidado completo para cães e gatos com consultas, vacinas importadas, banho, tosa e farmácia pet.',
    servicesSummary: 'Consultas veterinárias, banho e tosa carinhoso, vacinas, rações premium e estética pet',
    targetAudience: 'Tutores amorosos que tratam seus pets como verdadeiros membros da família',
    tone: 'moderno',
    themeId: 'emerald-growth',
    googleMapsQuery: 'Pet shops e veterinárias'
  },
  // 3. Hamburgueria
  {
    category: 'gastronomia',
    categoryLabel: 'Alimentação & Gastronomia',
    name: 'Hamburgueria',
    icon: 'UtensilsCrossed',
    companyName: 'Bistrô & Burger Artesanal',
    description: 'Burgers gourmet artesanais grelhados no fogo com carnes nobres, queijo derretido e batatas rústicas.',
    servicesSummary: 'Burgers smash e artesanais, combos executivos, batatas rústicas e milkshakes cremosos',
    targetAudience: 'Amantes da boa gastronomia rápida, famílias e jovens que valorizam sabor autêntico',
    tone: 'descontraido',
    themeId: 'amber-luxury',
    googleMapsQuery: 'Hamburguerias artesanais'
  },
  // 4. Pizzaria
  {
    category: 'gastronomia',
    categoryLabel: 'Alimentação & Gastronomia',
    name: 'Pizzaria',
    icon: 'UtensilsCrossed',
    companyName: 'Bella Forneria Napolitana',
    description: 'Pizzas artesanais de longa fermentação assadas em forno a lenha com ingredientes selecionados.',
    servicesSummary: 'Pizzas clássicas e gourmet, calzones recheados, antepastos e delivery rápido',
    targetAudience: 'Famílias, casais e apaixonados por autêntica pizza italiana de forno a lenha',
    tone: 'luxo',
    themeId: 'amber-luxury',
    googleMapsQuery: 'Pizzarias forno a lenha'
  },
  // 5. Cafeteria & Bistrô
  {
    category: 'gastronomia',
    categoryLabel: 'Alimentação & Gastronomia',
    name: 'Cafeteria & Bistrô',
    icon: 'UtensilsCrossed',
    companyName: 'Café Grão Real & Confeitaria',
    description: 'Cafés especiais torra artesanal, doces finos, croissants folhados e brunch completo diário.',
    servicesSummary: 'Espressos especiais, cappuccinos italianos, brunch executivo e pães de fermentação natural',
    targetAudience: 'Apreciadores de café gourmet, encontros de negócios e pausas saborosas',
    tone: 'moderno',
    themeId: 'emerald-growth',
    googleMapsQuery: 'Cafeterias e bistrôs'
  },
  // 6. Salão de Beleza
  {
    category: 'beleza',
    categoryLabel: 'Beleza & Barbearia',
    name: 'Salão de Beleza',
    icon: 'Scissors',
    companyName: 'Bella Donna Studio & Spa',
    description: 'Espaço completo para transformação capilar, mechas, coloração, tratamentos e cronograma.',
    servicesSummary: 'Cortes modernos, mechas iluminadas, escova progressiva e hidratação profunda',
    targetAudience: 'Mulheres que buscam valorizar sua beleza com profissionais renomados',
    tone: 'luxo',
    themeId: 'rose-charm',
    googleMapsQuery: 'Salões de beleza'
  },
  // 7. Clínica de Estética
  {
    category: 'beleza',
    categoryLabel: 'Beleza & Barbearia',
    name: 'Clínica de Estética',
    icon: 'Sparkles',
    companyName: 'Harmonie Estética Avançada',
    description: 'Procedimentos estéticos faciais e corporais com tecnologia de ponta para rejuvenescimento.',
    servicesSummary: 'Limpeza de pele ultrassônica, botox, preenchimento, drenagem linfática e bioestimuladores',
    targetAudience: 'Pessoas focadas em rejuvenescimento, cuidados corporais e autoestima elevada',
    tone: 'profissional',
    themeId: 'rose-charm',
    googleMapsQuery: 'Clínicas de estética facial e corporal'
  },
  // 8. Esmalteria & Cílios
  {
    category: 'beleza',
    categoryLabel: 'Beleza & Barbearia',
    name: 'Esmalteria & Cílios',
    icon: 'Scissors',
    companyName: 'Glam Nails & Lash Design',
    description: 'Alongamento de unhas em gel e fibra de vidro, esmaltação em gel e extensão de cílios fio a fio.',
    servicesSummary: 'Unhas em fibra de vidro, manicure russa, lash lifting e design de sobrancelhas',
    targetAudience: 'Mulheres que amam unhas e olhar impecáveis para o dia a dia e eventos',
    tone: 'luxo',
    themeId: 'rose-charm',
    googleMapsQuery: 'Esmalterias e extensão de cílios'
  },
  // 9. Academia & Fitness
  {
    category: 'saude',
    categoryLabel: 'Saúde & Pet',
    name: 'Academia & Fitness',
    icon: 'HeartPulse',
    companyName: 'Titan Force Fitness Club',
    description: 'Musculação moderna, treinos personalizados, aulas coletivas e ambiente climatizado.',
    servicesSummary: 'Musculação com instrutores dedicados, spinning, funcional e avaliação física completa',
    targetAudience: 'Pessoas focadas em hipertrofia, emagrecimento, saúde integral e bem-estar',
    tone: 'persuasivo',
    themeId: 'crimson-impact',
    googleMapsQuery: 'Academias e musculação'
  },
  // 10. Clínica Odontológica
  {
    category: 'saude',
    categoryLabel: 'Saúde & Pet',
    name: 'Clínica Odontológica',
    icon: 'HeartPulse',
    companyName: 'Sorriso Radiante Odontologia',
    description: 'Tratamentos dentários completos com lentes de contato, implantes, clareamento a laser e alinhadores.',
    servicesSummary: 'Implantes dentários, alinhadores invisíveis, clareamento dental e harmonização',
    targetAudience: 'Pacientes que desejam recuperar a confiança do sorriso com procedimentos indolores',
    tone: 'profissional',
    themeId: 'cyan-future',
    googleMapsQuery: 'Clínicas odontológicas e dentistas'
  },
  // 11. Studio de Pilates
  {
    category: 'saude',
    categoryLabel: 'Saúde & Pet',
    name: 'Studio de Pilates',
    icon: 'HeartPulse',
    companyName: 'Equilíbrio Studio de Pilates',
    description: 'Pilates clássico em aparelhos para fortalecimento muscular, postura e alívio de dores na coluna.',
    servicesSummary: 'Pilates com aparelhos completos, reabilitação física e aulas personalizadas',
    targetAudience: 'Pessoas com dores posturais, idosos, gestantes e praticantes em busca de flexibilidade',
    tone: 'profissional',
    themeId: 'emerald-growth',
    googleMapsQuery: 'Estúdios de pilates e fisioterapia'
  },
  // 12. Advocacia & Jurídico
  {
    category: 'servicos',
    categoryLabel: 'Serviços & B2B',
    name: 'Advocacia & Jurídico',
    icon: 'Scale',
    companyName: 'Albuquerque & Associados Advogados',
    description: 'Assessoria jurídica empresarial, cível, trabalhista e tributária com foco em soluções eficientes.',
    servicesSummary: 'Defesas judiciais, contratos empresariais, assessoria societária e consultoria preventiva',
    targetAudience: 'Empresários e pessoas físicas que necessitam de segurança e representação legal sólida',
    tone: 'profissional',
    themeId: 'slate-corporate',
    googleMapsQuery: 'Escritórios de advocacia'
  },
  // 13. Contabilidade
  {
    category: 'servicos',
    categoryLabel: 'Serviços & B2B',
    name: 'Contabilidade',
    icon: 'Scale',
    companyName: 'Nexus Gestão Contábil',
    description: 'Assessoria fiscal, abertura de empresas, planejamento tributário e gestão de folha de pagamento.',
    servicesSummary: 'Abertura rápida de empresas, redução legal de impostos e consultoria financeira',
    targetAudience: 'Micro e pequenas empresas, prestadores de serviços e profissionais liberais',
    tone: 'profissional',
    themeId: 'blue-tech',
    googleMapsQuery: 'Escritórios de contabilidade'
  },
  // 14. Marketing Digital
  {
    category: 'servicos',
    categoryLabel: 'Serviços & B2B',
    name: 'Marketing Digital',
    icon: 'Scale',
    companyName: 'Vektor Digital Growth',
    description: 'Gestão de tráfego pago, anúncios no Google e Meta, funis de vendas e páginas de alta conversão.',
    servicesSummary: 'Campanhas de tráfego pago, SEO local, criação de landing pages e branding visual',
    targetAudience: 'Negócios locais e empresas que precisam atrair novos clientes todos os dias',
    tone: 'persuasivo',
    themeId: 'indigo-modern',
    googleMapsQuery: 'Agências de marketing digital'
  },
  // 15. Loja de Roupas & Moda
  {
    category: 'varejo',
    categoryLabel: 'Comércio & Moda',
    name: 'Loja de Roupas & Moda',
    icon: 'ShoppingBag',
    companyName: 'Aura Chic Boutique',
    description: 'Roupas femininas contemporâneas com tecidos nobres, caimento perfeito e coleções exclusivas.',
    servicesSummary: 'Looks casuais e sociais, vestidos elegantes, blazers de alfaiataria e entrega expressa',
    targetAudience: 'Mulheres modernas que prezam por estilo, elegância e autenticidade no vestuário',
    tone: 'luxo',
    themeId: 'rose-charm',
    googleMapsQuery: 'Lojas de roupas femininas'
  },
  // 16. Ótica
  {
    category: 'varejo',
    categoryLabel: 'Comércio & Moda',
    name: 'Ótica',
    icon: 'ShoppingBag',
    companyName: 'Visão Prime Ótica & Lentes',
    description: 'Armações de marcas consagradas, lentes digitais de alta precisão e exame de vista computadorizado.',
    servicesSummary: 'Óculos de grau com lentes multifocais, óculos de sol polarizados e lentes de contato',
    targetAudience: 'Pessoas que buscam nitidez visual, conforto ocular e modelos estilosos de armações',
    tone: 'moderno',
    themeId: 'blue-tech',
    googleMapsQuery: 'Óticas'
  },
  // 17. Oficina Mecânica
  {
    category: 'automotivo',
    categoryLabel: 'Automotivo & Mecânica',
    name: 'Oficina Mecânica',
    icon: 'Car',
    companyName: 'Torque Precision Auto Center',
    description: 'Manutenção preventiva e corretiva com scanner computadorizado, suspensão, freios e motor.',
    servicesSummary: 'Troca de óleo rápida, alinhamento 3D, balanceamento, freios e revisão para viagem',
    targetAudience: 'Motoristas exigentes que não abrem mão da segurança mecânica do veículo',
    tone: 'profissional',
    themeId: 'slate-corporate',
    googleMapsQuery: 'Oficinas mecânicas'
  },
  // 18. Estética Automotiva
  {
    category: 'automotivo',
    categoryLabel: 'Automotivo & Mecânica',
    name: 'Estética Automotiva',
    icon: 'Car',
    companyName: 'Crystal Shield Car Detailing',
    description: 'Polimento técnico espelhado, vitrificação de pintura cerâmica 9H e higienização interna profunda.',
    servicesSummary: 'Vitrificação cerâmica, polimento técnico, higienização a vapor e proteção de couro',
    targetAudience: 'Apaixonados por carros que desejam brilho impecável de concessionária',
    tone: 'luxo',
    themeId: 'crimson-impact',
    googleMapsQuery: 'Estética automotiva e detailing'
  },
  // 19. Imobiliária
  {
    category: 'imoveis',
    categoryLabel: 'Imóveis & Construção',
    name: 'Imobiliária',
    icon: 'Building2',
    companyName: 'Horizonte Imóveis Nobres',
    description: 'Venda e locação de imóveis residenciais e comerciais de médio e alto padrão com assessoria total.',
    servicesSummary: 'Casas em condomínio, apartamentos prontos e na planta, assessoria jurídica e crédito',
    targetAudience: 'Famílias e investidores em busca do imóvel perfeito com segurança documental',
    tone: 'profissional',
    themeId: 'blue-tech',
    googleMapsQuery: 'Imobiliárias e corretores'
  },
  // 20. Arquitetura & Interiores
  {
    category: 'imoveis',
    categoryLabel: 'Imóveis & Construção',
    name: 'Arquitetura & Interiores',
    icon: 'Building2',
    companyName: 'Traço Urbano Arquitetura & Interiores',
    description: 'Projetos de arquitetura e design de interiores residenciais e comerciais com maquetes 3D realistas.',
    servicesSummary: 'Projetos de arquitetura, consultoria de interiores, acompanhamento de obra e detalhamento',
    targetAudience: 'Famílias e empresas que vão reformar ou construir e buscam espaços funcionais e elegantes',
    tone: 'luxo',
    themeId: 'indigo-modern',
    googleMapsQuery: 'Escritórios de arquitetura'
  },
  // 21. Confeitaria & Doces
  {
    category: 'gastronomia',
    categoryLabel: 'Alimentação & Gastronomia',
    name: 'Confeitaria & Doces',
    icon: 'UtensilsCrossed',
    companyName: 'Doce Encanto Bolos Artesanais',
    description: 'Bolos decorados para festas, doces finos, tortas trufadas e sobremesas gourmets para comemorações.',
    servicesSummary: 'Bolos de aniversário confeitados, brigadeiros gourmet, doces finos para casamento e kits festa',
    targetAudience: 'Pessoas comemorando datas especiais, eventos corporativos e amantes de doces artesanais',
    tone: 'moderno',
    themeId: 'amber-luxury',
    googleMapsQuery: 'Confeitarias e docerias'
  },
  // 22. Açaí & Sorveteria
  {
    category: 'gastronomia',
    categoryLabel: 'Alimentação & Gastronomia',
    name: 'Açaí & Sorveteria',
    icon: 'UtensilsCrossed',
    companyName: 'Puro Açaí & Gelatos',
    description: 'Açaí cremoso na tigela com dezenas de adicionais, sorvetes artesanais e taças especiais.',
    servicesSummary: 'Tigelas de açaí montadas na hora, gelatos artesanais, milkshakes e taças doces',
    targetAudience: 'Jovens, famílias e amantes de sobremesas geladas saudáveis e refrescantes',
    tone: 'descontraido',
    themeId: 'amber-luxury',
    googleMapsQuery: 'Açaí e sorveterias'
  },
  // 23. Suplementos & Nutrição
  {
    category: 'varejo',
    categoryLabel: 'Comércio & Moda',
    name: 'Suplementos & Nutrição',
    icon: 'ShoppingBag',
    companyName: 'MegaForce Suplementos Esportivos',
    description: 'Whey protein importado e nacional, creatina pura, pré-treinos e vitaminas para ganho muscular.',
    servicesSummary: 'Suplementação esportiva de alta performance, vitaminas, shakes proteicos e acessórios de treino',
    targetAudience: 'Praticantes de musculação, atletas e praticantes de atividades físicas',
    tone: 'persuasivo',
    themeId: 'crimson-impact',
    googleMapsQuery: 'Lojas de suplementos'
  },
  // 24. Assistência Técnica & Celulares
  {
    category: 'servicos',
    categoryLabel: 'Serviços & B2B',
    name: 'Assistência Técnica & Celulares',
    icon: 'Scale',
    companyName: 'TechFix Reparos Rápidos',
    description: 'Conserto de smartphones, troca de telas quebradas na hora, baterias originais e acessórios.',
    servicesSummary: 'Troca de tela express em 30 min, troca de bateria, reparos em placas e películas de vidro',
    targetAudience: 'Usuários de smartphones e tablets que necessitam de conserto rápido e com garantia',
    tone: 'profissional',
    themeId: 'blue-tech',
    googleMapsQuery: 'Assistência técnica de celulares'
  },
  // 25. Construtora & Reformas
  {
    category: 'imoveis',
    categoryLabel: 'Imóveis & Construção',
    name: 'Construtora & Reformas',
    icon: 'Building2',
    companyName: 'Aliança Engenharia & Reformas',
    description: 'Construção civil do alicerce ao acabamento, reformas residenciais completas e laudos técnicos.',
    servicesSummary: 'Reformas residenciais completas, pintura profissional, instalações elétricas e hidráulicas',
    targetAudience: 'Proprietários de imóveis que desejam construir ou reformar sem dor de cabeça com prazos',
    tone: 'profissional',
    themeId: 'slate-corporate',
    googleMapsQuery: 'Empreiteiras e empresas de reformas'
  }
];
