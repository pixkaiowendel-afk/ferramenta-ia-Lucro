import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper image generator based on niche
function getNicheImages(niche: string) {
  const n = niche.toLowerCase();
  if (n.includes('restaurante') || n.includes('gastronomia') || n.includes('hamburguer') || n.includes('pizza') || n.includes('comida') || n.includes('café')) {
    return {
      hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
      about: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      products: [
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80'
      ]
    };
  }
  if (n.includes('barbearia') || n.includes('salao') || n.includes('estetica') || n.includes('beleza')) {
    return {
      hero: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&auto=format&fit=crop&q=80',
      about: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
      products: [
        'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512290900672-1f023330f452?w=600&auto=format&fit=crop&q=80'
      ]
    };
  }
  if (n.includes('advocacia') || n.includes('direito') || n.includes('juridico') || n.includes('contabil') || n.includes('consultoria')) {
    return {
      hero: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      about: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      products: [
        'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
      ]
    };
  }
  if (n.includes('saude') || n.includes('odonto') || n.includes('clinica') || n.includes('medico') || n.includes('psicologia')) {
    return {
      hero: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&auto=format&fit=crop&q=80',
      about: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
      products: [
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
      ]
    };
  }
  if (n.includes('academia') || n.includes('fitness') || n.includes('treino') || n.includes('crossfit')) {
    return {
      hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
      about: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      products: [
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80'
      ]
    };
  }
  // Default modern tech / commercial
  return {
    hero: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    about: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    products: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
    ]
  };
}

// AI Site Generation Endpoint
app.post('/api/ai/generate-site', async (req: Request, res: Response): Promise<void> => {
  const { companyInfo, stylePreferences } = req.body;
  const name = companyInfo?.name || 'Sua Empresa';
  const niche = companyInfo?.niche || 'Negócios e Serviços';
  const description = companyInfo?.description || 'Oferecemos soluções de excelência para nossos clientes.';
  const audience = companyInfo?.targetAudience || 'Clientes em busca de qualidade';
  const servicesSummary = companyInfo?.servicesSummary || 'Serviços especializados com atendimento personalizado';
  const tone = companyInfo?.tone || 'profissional';
  const city = companyInfo?.city || 'Brasil';

  const defaultImages = getNicheImages(niche);

  const systemInstruction = `Você é um especialista sênior em criação de sites corporativos, copywriting persuasivo de alta conversão e estruturação de e-commerce e negócios locais brasileiros.
Sua missão é gerar TODOS os textos, produtos, ofertas, depoimentos realistas e FAQ para criar o site completo da empresa.
Responda ESTRITAMENTE em formato JSON com a seguinte estrutura:
{
  "slogan": "Frase de impacto curta da empresa",
  "hero": {
    "headline": "Título chamativo e persuasivo para a página principal",
    "subheadline": "Subtítulo explicando a proposta de valor irresistível em 1 a 2 frases",
    "ctaPrimary": "Texto do botão principal (ex: Fazer Pedido Agora, Contratar Serviço, Agendar Agora)",
    "ctaSecondary": "Texto do botão secundário (ex: Conhecer Produtos, Falar no WhatsApp)",
    "badgeText": "Frase curta de destaque no topo (ex: ★ #1 em Qualidade | Atendimento Rápido)"
  },
  "about": {
    "title": "Título da seção Sobre Nós",
    "story": "Parágrafo envolvente contando a história e compromisso da empresa com os clientes",
    "mission": "Missão clara e valores da empresa",
    "stats": [
      { "label": "Clientes Atendidos", "value": "+1.500" },
      { "label": "Satisfação Garantida", "value": "99%" },
      { "label": "Anos de Experiência", "value": "5+" }
    ]
  },
  "products": [
    {
      "name": "Nome do Produto ou Serviço 1",
      "description": "Descrição focada em benefícios e diferenciais",
      "price": 149.90,
      "category": "Categoria do Item",
      "badge": "Mais Vendido"
    },
    {
      "name": "Nome do Produto ou Serviço 2",
      "description": "Descrição com foco na solução do cliente",
      "price": 289.00,
      "category": "Categoria do Item",
      "badge": "Destaque"
    },
    {
      "name": "Nome do Produto ou Serviço 3",
      "description": "Descrição detalhada do item",
      "price": 99.00,
      "category": "Categoria do Item",
      "badge": "Econômico"
    },
    {
      "name": "Nome do Produto ou Serviço 4",
      "description": "Descrição do pacote premium ou produto completo",
      "price": 490.00,
      "category": "Categoria do Item",
      "badge": "Premium"
    }
  ],
  "features": [
    { "title": "Diferencial 1", "description": "Explicação do benefício direto", "icon": "ShieldCheck" },
    { "title": "Diferencial 2", "description": "Explicação do benefício direto", "icon": "Zap" },
    { "title": "Diferencial 3", "description": "Explicação do benefício direto", "icon": "Award" },
    { "title": "Diferencial 4", "description": "Explicação do benefício direto", "icon": "Headphones" }
  ],
  "testimonials": [
    {
      "name": "Mariana Silva",
      "role": "Cliente Verificada",
      "company": "${city}",
      "comment": "Excelente atendimento e produto de altíssima qualidade! Superou todas as expectativas.",
      "rating": 5
    },
    {
      "name": "Rodrigo Costa",
      "role": "Empresário",
      "company": "${city}",
      "comment": "Profissionalismo impecável. O processo foi rápido e com resultado impecável. Recomendo fortemente.",
      "rating": 5
    },
    {
      "name": "Camila Oliveira",
      "role": "Cliente Fiel",
      "company": "${city}",
      "comment": "Melhor custo-benefício que já encontrei. Virei cliente assídua!",
      "rating": 5
    }
  ],
  "faq": [
    { "question": "Como faço para comprar ou contratar?", "answer": "Basta escolher o item desejado em nosso site, clicar no botão de compra ou entrar em contato direto pelo WhatsApp para atendimento imediato." },
    { "question": "Quais são as formas de pagamento aceitas?", "answer": "Aceitamos PIX com aprovação instantânea, cartões de crédito em até 12x e boleto bancário." },
    { "question": "Qual é o prazo de entrega ou atendimento?", "answer": "Para produtos físicos, despachamos com envio expresso com código de rastreio. Para serviços, o agendamento é imediato após confirmação." },
    { "question": "Tenho garantia?", "answer": "Sim! Oferecemos garantia total de satisfação e suporte dedicado para qualquer dúvida ou solicitação." }
  ],
  "contact": {
    "ctaText": "Fale com nossa equipe especializada agora mesmo e tire todas as suas dúvidas."
  }
}`;

  const prompt = `Crie todo o conteúdo completo do site oficial para a seguinte empresa:
Nome da Empresa: ${name}
Ramo / Nicho: ${niche}
Descrição do Negócio: ${description}
Público-Alvo: ${audience}
Produtos / Serviços Principais: ${servicesSummary}
Tom de Voz: ${tone}
Localização: ${city}

Lembre-se de criar produtos/serviços com preços realistas em reais (BRL número float), títulos atrativos e textos altamente profissionais que gerem muitas vendas.`;

  try {
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);

      // Inject high-res curated imagery and ids
      const avatars = [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      ];

      const enrichedProducts = (parsed.products || []).map((prod: any, idx: number) => ({
        id: 'prod_' + Math.random().toString(36).substring(2, 9),
        name: prod.name || `Produto / Serviço ${idx + 1}`,
        description: prod.description || 'Descrição detalhada do item com alto padrão de qualidade.',
        price: Number(prod.price) || (99.90 + idx * 50),
        category: prod.category || 'Geral',
        badge: prod.badge || (idx === 0 ? 'Mais Vendido' : undefined),
        imageUrl: defaultImages.products[idx % defaultImages.products.length],
      }));

      const enrichedTestimonials = (parsed.testimonials || []).map((test: any, idx: number) => ({
        id: 'test_' + Math.random().toString(36).substring(2, 9),
        name: test.name || 'Cliente',
        role: test.role || 'Cliente',
        company: test.company || city,
        comment: test.comment || 'Experiência fantástica, recomendo!',
        rating: test.rating || 5,
        avatarUrl: avatars[idx % avatars.length]
      }));

      const enrichedFeatures = (parsed.features || []).map((feat: any, idx: number) => ({
        id: 'feat_' + Math.random().toString(36).substring(2, 9),
        title: feat.title || `Vantagem ${idx + 1}`,
        description: feat.description || 'Qualidade excepcional comprovada pelos clientes.',
        icon: feat.icon || 'CheckCircle'
      }));

      const enrichedFaq = (parsed.faq || []).map((item: any) => ({
        id: 'faq_' + Math.random().toString(36).substring(2, 9),
        question: item.question || 'Dúvida comum',
        answer: item.answer || 'Resposta explicativa com suporte imediato.'
      }));

      res.json({
        success: true,
        data: {
          slogan: parsed.slogan || `Excelência em ${niche}`,
          hero: {
            headline: parsed.hero?.headline || `${name} - A Melhor Escolha para Você`,
            subheadline: parsed.hero?.subheadline || description,
            ctaPrimary: parsed.hero?.ctaPrimary || 'Ver Produtos & Serviços',
            ctaSecondary: parsed.hero?.ctaSecondary || 'Falar no WhatsApp',
            badgeText: parsed.hero?.badgeText || '★ Atendimento Oficial & Qualidade Comprovada',
            heroImageUrl: defaultImages.hero
          },
          about: {
            title: parsed.about?.title || `Sobre a ${name}`,
            story: parsed.about?.story || `${name} nasceu com o objetivo de entregar os melhores produtos e serviços de ${niche}.`,
            mission: parsed.about?.mission || 'Nossa missão é transformar vidas e elevar os resultados dos nossos clientes.',
            stats: parsed.about?.stats || [
              { label: 'Clientes Satisfeitos', value: '+1.200' },
              { label: 'Nota Média', value: '4.9/5' },
              { label: 'Entrega Ágil', value: '100%' }
            ],
            aboutImageUrl: defaultImages.about
          },
          products: enrichedProducts,
          features: enrichedFeatures,
          testimonials: enrichedTestimonials,
          faq: enrichedFaq,
          contact: {
            ctaText: parsed.contact?.ctaText || 'Estamos prontos para atender você com exclusividade.'
          }
        }
      });
      return;
    }
  } catch (error: any) {
    console.warn('Gemini API call notice, using smart generator fallback:', error?.message);
  }

  // Resilient smart generator fallback
  const enrichedProducts = [
    {
      id: 'prod_1',
      name: `${niche} - Pacote Essencial`,
      description: `Opção ideal com excelente custo-benefício desenvolvida para clientes exigentes da ${name}.`,
      price: 129.90,
      category: 'Destaques',
      badge: 'Mais Vendido',
      imageUrl: defaultImages.products[0],
    },
    {
      id: 'prod_2',
      name: `${niche} - Solução Premium`,
      description: `Completo e com suporte prioritário para máxima eficiência e resultados comprovados.`,
      price: 299.00,
      category: 'Premium',
      badge: 'Recomendado',
      imageUrl: defaultImages.products[1],
    },
    {
      id: 'prod_3',
      name: `Consultoria & Atendimento Personalizado`,
      description: `Sessão exclusiva com nossos especialistas para planejar a melhor estratégia para sua necessidade.`,
      price: 199.90,
      category: 'Serviços',
      badge: 'Exclusivo',
      imageUrl: defaultImages.products[2],
    },
    {
      id: 'prod_4',
      name: `Plano Especial sob Demanda`,
      description: `Sob medida para seus objetivos, garantindo agilidade e total satisfação.`,
      price: 450.00,
      category: 'Especial',
      badge: 'Completo',
      imageUrl: defaultImages.products[3],
    }
  ];

  res.json({
    success: true,
    data: {
      slogan: `Excelência e confiança em ${niche}`,
      hero: {
        headline: `${name}: Excelência e Soluções em ${niche}`,
        subheadline: `${description}. Conecte-se conosco e descubra uma experiência transformadora com quem entende do assunto em ${city}.`,
        ctaPrimary: 'Comprar Agora & Pedir Orçamento',
        ctaSecondary: 'Conversar no WhatsApp',
        badgeText: '★ Atendimento Oficial | 100% Satisfação Garantida',
        heroImageUrl: defaultImages.hero
      },
      about: {
        title: `Conheça a história e propósito da ${name}`,
        story: `Fundada em ${city}, a ${name} se destaca pela busca incansável por excelência e pelo cuidado em cada detalhe. Nosso compromisso é entregar soluções de ${niche} que realmente façam a diferença.`,
        mission: `Superar as expectativas dos nossos clientes através de ética, qualidade superior e inovação constante.`,
        stats: [
          { label: 'Clientes Atendidos', value: '+1.500' },
          { label: 'Avaliação Média', value: '4.9 ★' },
          { label: 'Compromisso', value: '100%' }
        ],
        aboutImageUrl: defaultImages.about
      },
      products: enrichedProducts,
      features: [
        { id: 'feat_1', title: 'Atendimento Rápido e Humano', description: 'Nossa equipe está sempre pronta para tirar dúvidas e agilizar seu pedido.', icon: 'Zap' },
        { id: 'feat_2', title: 'Qualidade Incomparável', description: 'Utilizamos os melhores padrões de qualidade do mercado para garantir o seu sucesso.', icon: 'ShieldCheck' },
        { id: 'feat_3', title: 'Garantia e Segurança', description: 'Transações seguras com PIX e cartões, com suporte garantido antes e após a compra.', icon: 'Award' },
        { id: 'feat_4', title: 'Suporte Dedicado', description: 'Canais abertos para acompanhar seu pedido do início ao fim sem complicações.', icon: 'Headphones' }
      ],
      testimonials: [
        {
          id: 'test_1',
          name: 'Juliana Mendes',
          role: 'Cliente Verificada',
          company: city,
          comment: `Contratar a ${name} foi a melhor decisão. O atendimento foi impecável e a entrega foi rápida demais!`,
          rating: 5,
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        },
        {
          id: 'test_2',
          name: 'Lucas Ferreira',
          role: 'Empreendedor',
          company: city,
          comment: `Produtos de excelente qualidade e suporte nota 10. Recomendo a todos que procuram segurança e agilidade.`,
          rating: 5,
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        {
          id: 'test_3',
          name: 'Patrícia Rocha',
          role: 'Cliente Assídua',
          company: city,
          comment: `Preço justo, facilidade na compra e qualidade impecável. Já é minha terceira compra com eles!`,
          rating: 5,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        }
      ],
      faq: [
        { id: 'faq_1', question: 'Como funciona a compra pelo site?', answer: 'É simples e seguro: selecione o item desejado, finalize seu pedido e receba o comprovante imediatamente com confirmação em nosso sistema.' },
        { id: 'faq_2', question: 'Quais métodos de pagamento são aceitos?', answer: 'Aceitamos PIX com desconto especial, cartões de crédito e débito.' },
        { id: 'faq_3', question: 'Como posso tirar dúvidas antes de comprar?', answer: `Você pode clicar no botão de WhatsApp a qualquer momento para falar diretamente com um atendente da ${name}.` },
        { id: 'faq_4', question: 'Existe política de garantia?', answer: 'Sim, oferecemos suporte integral e garantia de conformidade para todos os nossos produtos e serviços.' }
      ],
      contact: {
        ctaText: 'Entre em contato com a gente agora e receba um atendimento personalizado!'
      }
    }
  });
});

// AI Text Improver Endpoint
app.post('/api/ai/enhance-text', async (req: Request, res: Response): Promise<void> => {
  const { currentText, instruction, fieldType } = req.body;
  if (!currentText && !instruction) {
    res.status(400).json({ error: 'Text or instruction is required' });
    return;
  }

  try {
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Você é um redator publicitário de alta conversão. Melhore e reescreva o texto a seguir para o campo "${fieldType || 'texto'}":
Texto Atual: "${currentText || ''}"
Instrução adicional: "${instruction || 'Deixe mais persuasivo, moderno e profissional, focado em vendas no Brasil'}"
Retorne APENAS o texto reescrito em português, sem aspas e sem explicações.`,
      });
      res.json({ success: true, text: (response.text || '').trim() });
      return;
    }
  } catch (err: any) {
    console.warn('Gemini text improve notice:', err?.message);
  }

  // Fallback improvement
  res.json({
    success: true,
    text: `${currentText} - Qualidade garantida e atendimento especializado para transformar seus resultados.`
  });
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
