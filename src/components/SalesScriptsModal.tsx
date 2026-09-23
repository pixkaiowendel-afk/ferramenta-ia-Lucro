import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  Share2, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Send,
  ExternalLink,
  Target
} from 'lucide-react';
import { WebsiteData } from '../types/site';

interface SalesScriptsModalProps {
  site: WebsiteData;
  onClose: () => void;
  onOpenLivePreview?: () => void;
}

export const SalesScriptsModal: React.FC<SalesScriptsModalProps> = ({
  site,
  onClose,
  onOpenLivePreview
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedScriptId, setSelectedScriptId] = useState<string>('apresentacao');
  
  // Customization fields for the active client
  const [clientContactName, setClientContactName] = useState(
    site.commercial?.clientBuyerName || 'Proprietário'
  );
  const [clientPhone, setClientPhone] = useState(
    site.commercial?.clientBuyerPhone || site.companyInfo.whatsapp || ''
  );
  const [salePrice, setSalePrice] = useState(
    site.commercial?.siteSalePrice || 1500
  );

  const companyName = site.companyInfo.name || 'Sua Empresa';
  const niche = site.companyInfo.niche || 'Seu Ramo';
  const city = site.companyInfo.city || 'sua região';
  const previewUrl = window.location.origin + window.location.pathname + `?demo=${site.id}`;

  const scripts = [
    {
      id: 'apresentacao',
      badge: 'Campeão de Vendas ⭐',
      title: 'Apresentação do Site Pronto & Demonstração',
      description: 'Envie quando você já montou o site demonstrativo na ferramenta. Converte até 7x mais porque o cliente já vê o site funcionando.',
      content: `Olá, ${clientContactName}! Tudo bem? 👋

Estava pesquisando os melhores negócios de ${niche} em ${city} e encontrei o perfil da *${companyName}*. Parabéns pelo excelente trabalho de vocês!

Reparei que vocês ainda não tinham um site próprio moderno e otimizado no Google com catálogo interativo. Por isso, tomei a liberdade de criar uma versão demonstrativa completa e exclusiva para vocês darem uma olhada:

👉 *Veja o site pronto da ${companyName} aqui:*
${previewUrl}

No site eu já organizei:
✅ Catálogo com pedidos rápidos direto no WhatsApp (sem comissão do iFood/taxas)
✅ Integração com localização e rotas no Google Maps
✅ Design profissional para celular e computador
✅ Botão de atendimento imediato

O que achou da estrutura? Se gostar, consigo colocar no seu domínio oficial (.com.br) hoje mesmo com uma condição super especial de lançamento!`
    },
    {
      id: 'prospeccao_fria',
      badge: 'Abordagem Inicial 🚀',
      title: 'Prospecção Fria no WhatsApp / Instagram',
      description: 'Ideal para o primeiro contato rápido quando você encontrou o contato no Google Maps.',
      content: `Olá, equipe da *${companyName}*! Tudo bem? Me chamo especialista em presença digital local.

Estava no Google Maps buscando referências de ${niche} e notei que quem pesquisa no bairro muitas vezes não encontra um site oficial de vocês para ver cardápio, produtos e chamar direto no WhatsApp.

Hoje em dia mais de 82% das pessoas pesquisam no Google antes de comprar. 

Eu preparei uma demonstração de como ficaria o site oficial da *${companyName}* com catálogo digital e botão de pedidos automáticos no WhatsApp.

Posso te mandar o link aqui para você ver em 1 minuto sem compromisso nenhum?`
    },
    {
      id: 'quebra_objecao',
      badge: 'Quebra de Objeção 🛡️',
      title: '"Já tenho Instagram, por que preciso de site?"',
      description: 'Use quando o cliente disser que não precisa de site porque já vende pelo Instagram.',
      content: `Entendo perfeitamente, ${clientContactName}! O Instagram de vocês é muito bom, mas veja a diferença prática:

📱 *No Instagram:* O cliente entra, se distrai com outras notificações, concorrentes e vídeos, e muitas vezes desiste antes de pedir. Além disso, o algoritmo do Instagram só entrega seus posts para menos de 6% dos seus seguidores.

🌐 *No seu Site Oficial no Google:*
1. Quando alguém no bairro digita "${niche} perto de mim" no Google, quem tem site aparece em 1º lugar com nota máxima.
2. O cliente vê seus produtos organizados, preços e fotos sem distrações e clica em pedir no WhatsApp em 2 segundos.
3. Passa 10x mais credibilidade e autoridade do que apenas uma página de rede social.

Ter o site não substitui seu Instagram, ele multiplica suas vendas transformando seguidores em clientes pagantes todos os dias! Vamos colocar o seu no ar?`
    },
    {
      id: 'proposta_fechamento',
      badge: 'Fechamento & Proposta 💰',
      title: 'Proposta Irrecusável com Fechamento Rápido',
      description: 'Envie a proposta comercial completa com preço, forma de pagamento e urgência.',
      content: `Oi, ${clientContactName}! Conforme conversamos, montei uma proposta exclusiva para entregarmos o site oficial da *${companyName}* 100% finalizado:

🚀 *O QUE ESTÁ INCLUSO:*
• Site profissional completo, responsivo para celulares e computadores
• Catálogo online de produtos/serviços com fotos em alta definição
• Botão flutuante de pedidos diretos para o WhatsApp da loja
• Painel de vendas para você acompanhar faturamento em tempo real
• Otimização para o Google e localização no Google Maps
• Hospedagem segura de alta velocidade com certificado SSL grátis

💎 *CONDIÇÃO ESPECIAL DESTA SEMANA:*
De ~R$ 2.400,00~ por apenas:
👉 *R$ ${salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}* à vista no PIX
(Ou em até 12x no cartão com condições facilitadas)
*Condição de entrada:* 50% para iniciarmos a configuração oficial e 50% somente na entrega após sua aprovação total!

Podemos fechar e iniciar a liberação do seu site hoje mesmo?`
    },
    {
      id: 'follow_up',
      badge: 'Follow-up Rápido ⏰',
      title: 'Follow-Up com Escassez de Vagas',
      description: 'Envie 24h a 48h após a proposta caso o cliente ainda não tenha respondido.',
      content: `Olá, ${clientContactName}! Tudo bem por aí?

Passando só para te dar um toque rápido: estou finalizando o cronograma de entregas de sites desta semana e guardei a condição com desconto especial da *${companyName}* que te passei.

Como temos limite de projetos por mês para garantir suporte dedicado, gostaria de saber se você vai querer aproveitar essa condição especial de R$ ${salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para colocarmos seu site no ar hoje?

Se tiver qualquer dúvida sobre pagamento ou prazos, me avisa por aqui!`
    },
    {
      id: 'pix_fechamento',
      badge: 'Envio de PIX 🎯',
      title: 'Mensagem para Envio do PIX e Confirmação',
      description: 'Envie no momento em que o cliente confirmou que quer fechar o site.',
      content: `Show de bola, ${clientContactName}! Fico muito feliz com a nossa parceria! Tenho certeza que o novo site da *${companyName}* vai atrair muitos clientes novos.

Para darmos início imediato na configuração do seu domínio e publicação oficial:

💰 *Valor da Entrada (50%):* R$ ${(salePrice / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
🔑 *Chave PIX:* ${site.companyInfo.email || 'contato@seupix.com.br'}
*Beneficiário:* Agência Web / Ferramenta IA Lucro

Assim que fizer o PIX, me manda o comprovante por aqui para eu já emitir a sua confirmação e começarmos a subida dos seus produtos! Combinado? 🚀`
    }
  ];

  const currentScript = scripts.find(s => s.id === selectedScriptId) || scripts[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleSendWhatsApp = (text: string) => {
    const rawNumber = clientPhone.replace(/\D/g, '');
    const phone = rawNumber ? (rawNumber.startsWith('55') ? rawNumber : '55' + rawNumber) : '';
    const encoded = encodeURIComponent(text);
    const url = phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Mensagens Prontas para Fechar Venda
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Alta Conversão
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Copie com 1 clique ou envie direto pelo WhatsApp para fechar contratos com a empresa <strong className="text-emerald-300">{companyName}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Variables Bar */}
        <div className="p-3 sm:p-4 bg-slate-950/70 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Nome do Cliente / Dono:
            </label>
            <input
              type="text"
              value={clientContactName}
              onChange={(e) => setClientContactName(e.target.value)}
              placeholder="Ex: Carlos, Renata"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              WhatsApp do Cliente:
            </label>
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Valor da Venda do Site (R$):
            </label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Content Body: Sidebar + Main Copy Box */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Script Selection Sidebar */}
          <div className="w-full md:w-72 bg-slate-950/50 border-r border-slate-800 p-2 sm:p-3 space-y-1.5 overflow-y-auto max-h-48 md:max-h-none">
            <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">
              Escolha o Momento da Venda:
            </div>
            {scripts.map((s) => {
              const isSelected = selectedScriptId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedScriptId(s.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-600/20 text-white border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400">
                      {s.badge}
                    </span>
                  </div>
                  <div className="font-bold text-xs line-clamp-1">{s.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Script Preview & Action Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <span className="text-xs font-bold text-emerald-400 mr-2">
                    {currentScript.badge}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white inline">
                    {currentScript.title}
                  </h3>
                </div>
                {onOpenLivePreview && (
                  <button
                    onClick={onOpenLivePreview}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
                  >
                    <span>Abrir Demo do Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-3">
                {currentScript.description}
              </p>

              {/* Message Box */}
              <div className="relative rounded-2xl bg-black/70 border border-slate-700/80 p-4 text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-emerald-600 shadow-inner">
                {currentScript.content}
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Textos revisados com gatilhos de urgência e autoridade local.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(currentScript.content, currentScript.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md ${
                    copiedId === currentScript.id
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {copiedId === currentScript.id ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Mensagem Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Mensagem</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSendWhatsApp(currentScript.content)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar no WhatsApp</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
