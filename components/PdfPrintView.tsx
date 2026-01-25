
import React, { useState, useEffect } from 'react';
import { Printer, Download, ArrowLeft, Loader2, Edit3, CheckCircle } from 'lucide-react';
import { Order, CompanySettings } from '../types';

const loadHtml2Pdf = async () => {
  const html2pdf = (await import('https://esm.sh/html2pdf.js')).default;
  return html2pdf;
};

type DocType = 'PEDIDO' | 'ORÇAMENTO' | 'ORDEM DE SERVIÇO';

interface PdfPrintViewProps {
  order: Order;
  company: CompanySettings;
  onBack?: () => void;
  onEdit?: () => void;
  onSettle?: () => void;
}

export const PdfPrintView: React.FC<PdfPrintViewProps> = ({ order, company, onBack, onEdit, onSettle }) => {
  const [docType, setDocType] = useState<DocType>('ORÇAMENTO');
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDateToDisplay = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isGenerating) {
        window.print();
      }
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('printable-document');
      if (!element) return;
      const html2pdf = await loadHtml2Pdf();
      const opt = {
        margin: 0,
        filename: `${docType}_${order.id}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      alert('Erro ao gerar PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const todayRaw = new Date();
  const todayFormatted = `${String(todayRaw.getDate()).padStart(2, '0')}-${String(todayRaw.getMonth() + 1).padStart(2, '0')}-${todayRaw.getFullYear()}`;
  const now = todayRaw.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          html, body {
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            visibility: hidden;
          }
          #printable-document, #printable-document * {
            visibility: visible !important;
          }
          #printable-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 15mm !important;
            box-sizing: border-box !important;
            background: #fff !important;
            display: flex !important;
            flex-direction: column !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .bg-black-print { background-color: #0f172a !important; color: white !important; }
          .bg-gray-print { background-color: #f8fafc !important; }
          .border-dashed-print { border-style: dashed !important; border-width: 1px !important; border-color: #e2e8f0 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      {/* Toolbar superior - Oculta na impressão */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            {(['PEDIDO', 'ORÇAMENTO', 'ORDEM DE SERVIÇO'] as DocType[]).map((t) => (
              <button
                key={t}
                onClick={() => setDocType(t)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${docType === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownload} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            PDF
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all shadow-lg shadow-slate-200">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      <div className="flex justify-center bg-slate-200/30 p-4 md:p-12 rounded-3xl print:bg-white print:p-0">
        <div 
          id="printable-document"
          className="w-[210mm] bg-white shadow-2xl p-[15mm] min-h-[297mm] flex flex-col relative text-slate-900 print:shadow-none print:m-0"
        >
          {/* Header conforme imagem */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-6 items-start">
              {company.logo ? (
                <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center shadow-sm">
                  <img src={company.logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-[#0f172a] rounded-2xl flex items-center justify-center text-white text-3xl font-black italic shadow-lg">
                  G
                </div>
              )}
              <div className="max-w-md">
                <h1 className="text-xl font-black text-slate-900 mb-1 leading-tight uppercase tracking-tight">{company.name}</h1>
                <div className="text-[10px] leading-relaxed text-slate-600 font-bold space-y-0.5">
                  <p>{company.address}</p>
                  <p>{company.city}</p>
                  <p>Telefone: {company.phone}</p>
                  <p>E-mail: {company.email}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-black text-[#0f172a] tracking-tighter uppercase leading-none mb-1">{docType}</h2>
              <div className="bg-[#0f172a] text-white px-4 py-1.5 inline-block rounded-md text-[11px] font-black mb-4">
                Nº PED{order.id}
              </div>
              <div className="text-[10px] text-slate-500 font-bold space-y-0.5">
                <p>Emitido: {todayFormatted} às {now}</p>
                <p>Referência: {formatDateToDisplay(order.date) || todayFormatted}</p>
              </div>
            </div>
          </div>

          <div className="h-0.5 bg-slate-900 mb-8 opacity-90"></div>

          {/* Dados do Cliente - Box Estilo Imagem */}
          <div className="bg-[#f8fafc] rounded-2xl p-6 mb-6 border border-slate-100 grid grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Cliente</p>
              <p className="text-sm font-black text-slate-900 uppercase">{order.customer}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Telefone / Contato</p>
              <p className="text-sm font-black text-slate-900">{order.customerPhone || 'Não informado'}</p>
            </div>
          </div>

          {/* Grid de Informações Rápidas */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Data de Entrega</p>
              <p className="text-sm font-black text-slate-900">{formatDateToDisplay(order.date) || todayFormatted}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Status</p>
              <p className="text-sm font-black text-slate-900 uppercase">{order.status || 'Pendente'}</p>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Pagamento</p>
              <p className="text-sm font-black text-slate-900 uppercase">{order.paymentMethod || 'Dinheiro'}</p>
            </div>
          </div>

          {/* Tabela de Itens estilo Imagem */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#0f172a] rounded-sm"></div>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Discriminação dos Itens</h3>
            </div>
            <div className="border border-[#0f172a] rounded-xl overflow-hidden mb-8 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-[#0f172a] text-white">
                  <tr className="text-[10px] font-black uppercase tracking-widest">
                    <th className="py-4 px-5">Descrição do Produto / Serviço</th>
                    <th className="py-4 px-5 text-center w-24 border-l border-slate-700/50">Qtd</th>
                    <th className="py-4 px-5 text-right w-32 border-l border-slate-700/50">Unitário</th>
                    <th className="py-4 px-5 text-right w-40 border-l border-slate-700/50">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <tr key={idx} className="text-xs font-bold text-slate-800">
                        <td className="py-4 px-5">{item.description}</td>
                        <td className="py-4 px-5 text-center border-l border-slate-100">{item.quantity}</td>
                        <td className="py-4 px-5 text-right border-l border-slate-100">R$ {item.unitPrice.toFixed(2)}</td>
                        <td className="py-4 px-5 text-right border-l border-slate-100">R$ {(item.quantity * item.unitPrice).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-xs font-bold text-slate-800">
                      <td className="py-4 px-5">Serviço Gráfico Geral</td>
                      <td className="py-4 px-5 text-center border-l border-slate-100">1</td>
                      <td className="py-4 px-5 text-right border-l border-slate-100">R$ {order.value.toFixed(2)}</td>
                      <td className="py-4 px-5 text-right border-l border-slate-100">R$ {order.value.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-[#0f172a] text-white font-black">
                    <td colSpan={3} className="py-4 px-5 text-right text-[11px] uppercase tracking-[0.2em]">Valor Total do Pedido:</td>
                    <td className="py-4 px-5 text-right text-lg font-mono">R$ {order.value.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Rodapé - Box PIX conforme imagem */}
          <div className="mt-auto pt-10">
            <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 p-8 rounded-[2rem] text-center mb-12">
              <p className="text-[11px] font-black text-slate-900 mb-4 italic tracking-wide">Obrigado pela preferência e confiança em nosso trabalho!</p>
              {company.pixKey && (
                <div className="inline-block bg-white px-8 py-3 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Chave PIX para Pagamento</p>
                  <p className="text-sm font-black text-slate-900 font-mono tracking-tighter">{company.pixKey}</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center pb-8">
              <div className="w-80 border-t border-slate-300 mb-2"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{order.customer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
