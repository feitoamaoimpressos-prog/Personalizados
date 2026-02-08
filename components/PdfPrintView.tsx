import React, { useState } from 'react';
import { Printer, Download, ArrowLeft, Loader2, Wrench } from 'lucide-react';
import { Order, CompanySettings } from '../types';

const loadHtml2Pdf = async () => {
  const html2pdf = (await import('https://esm.sh/html2pdf.js')).default;
  return html2pdf;
};

type DocType = 'PEDIDO' | 'ORÇAMENTO' | 'ORDEM DE SERVIÇO' | 'RECIBO';

interface PdfPrintViewProps {
  order: Order;
  company: CompanySettings;
  onBack?: () => void;
  onEdit?: () => void;
  onSettle?: () => void;
}

export const PdfPrintView: React.FC<PdfPrintViewProps> = ({ order, company, onBack }) => {
  const [docType, setDocType] = useState<DocType>('PEDIDO');
  const [isGenerating, setIsGenerating] = useState(false);

  const isOS = docType === 'ORDEM DE SERVIÇO';

  const formatDateToDisplay = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('printable-document');
      if (!element) return;
      const html2pdf = await loadHtml2Pdf();
      const opt = {
        margin: [5, 5, 5, 5],
        filename: `${docType}_${order.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const todayRaw = new Date();
  const todayFormatted = `${String(todayRaw.getDate()).padStart(2, '0')}/${String(todayRaw.getMonth() + 1).padStart(2, '0')}/${todayRaw.getFullYear()}`;
  const nowTime = todayRaw.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const itemsSubtotal = order.items?.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) || 0;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10">
      <div className="w-full max-w-[210mm] mb-6 bg-white p-4 rounded-3xl shadow-lg border border-slate-200 flex items-center justify-between print-hidden">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-50 hover:bg-slate-200 rounded-xl transition-all text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {(['PEDIDO', 'ORÇAMENTO', 'ORDEM DE SERVIÇO', 'RECIBO'] as DocType[]).map((t) => (
              <button
                key={t}
                onClick={() => setDocType(t)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${docType === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleDownload} disabled={isGenerating} className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Exportar PDF
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-8 py-2 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all">
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      <div id="printable-document" className="pdf-page">
        <style>{`
          .pdf-page {
            width: 210mm;
            min-height: 297mm;
            background: white;
            padding: 12mm;
            color: #334155 !important;
            font-family: 'Inter', sans-serif;
            margin: 0 auto;
            box-sizing: border-box;
            border: 1px solid #e2e8f0;
          }
          
          .header { 
            display: flex; 
            justify-content: space-between; 
            border-bottom: 2px solid #cbd5e1; 
            padding-bottom: 5mm; 
            margin-bottom: 6mm; 
          }
          
          .company-name { font-size: 13pt; font-weight: 900; text-transform: uppercase; margin: 0; color: #1e293b !important; }
          .company-info { font-size: 8pt; line-height: 1.4; margin-top: 2mm; color: #64748b !important; font-weight: 500; }
          
          .doc-type-container { text-align: right; }
          .doc-type-label { font-size: 16pt; font-weight: 900; margin: 0; color: #475569 !important; text-transform: uppercase; }
          .doc-id-box { 
            background: #475569; 
            color: #fff !important; 
            padding: 2mm 6mm; 
            font-size: 12pt; 
            font-weight: 900; 
            border-radius: 3mm; 
            margin-top: 2mm; 
            display: inline-block; 
          }
          .emission-date { font-size: 7pt; font-weight: 700; margin-top: 3mm; text-transform: uppercase; color: #94a3b8 !important; }

          .top-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-bottom: 6mm; }
          .meta-box { border: 1.2pt solid #cbd5e1; padding: 3mm; border-radius: 4mm; background: #f8fafc; }
          .meta-label { font-size: 7pt; font-weight: 900; text-transform: uppercase; display: block; color: #94a3b8 !important; margin-bottom: 1mm; }
          .meta-value { font-size: 11pt; font-weight: 900; color: #334155 !important; }

          .section-header { 
            background: #64748b; 
            color: #fff !important; 
            font-size: 8pt; 
            font-weight: 900; 
            text-transform: uppercase; 
            padding: 1.5mm 4mm; 
            display: inline-block; 
            border-radius: 2mm 2mm 0 0; 
            margin-left: 2mm;
          }
          .section-content { 
            border: 1.2pt solid #cbd5e1; 
            padding: 5mm; 
            margin-bottom: 6mm; 
            border-radius: 4mm; 
            background: white;
          }

          .field-label { font-size: 7.5pt; font-weight: 800; text-transform: uppercase; display: block; color: #94a3b8 !important; margin-bottom: 0.5mm; }
          .field-value { font-size: 9.5pt; font-weight: 700; color: #334155 !important; display: block; min-height: 4mm; margin-bottom: 2mm; }

          .items-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 6mm; border: 1.2pt solid #cbd5e1; border-radius: 4mm; overflow: hidden; }
          .items-table th { background: #475569; color: #fff !important; font-size: 8pt; font-weight: 900; text-transform: uppercase; padding: 2.5mm; text-align: left; }
          .items-table td { padding: 2.5mm; font-size: 9pt; border-bottom: 1pt solid #f1f5f9; color: #475569 !important; font-weight: 600; }
          .items-table tr:last-child td { border-bottom: none; }
          
          .production-field {
            border: 1.5pt dashed #cbd5e1;
            border-radius: 4mm;
            padding: 6mm;
            min-height: 40mm;
            background: #f8fafc;
            margin-bottom: 6mm;
          }

          .text-right { text-align: right; }
          .text-center { text-align: center; }

          .totals-container { display: flex; justify-content: flex-end; margin-bottom: 6mm; }
          .totals-table { width: 80mm; border: 1.2pt solid #cbd5e1; border-radius: 4mm; overflow: hidden; background: #f8fafc; }
          .total-row { display: flex; justify-content: space-between; border-bottom: 1pt solid #e2e8f0; padding: 2mm 4mm; }
          .total-row:last-child { 
            border-bottom: none; 
            background: #475569; 
            color: #fff !important; 
            padding: 3mm 4mm;
          }
          .total-row:last-child * { color: #fff !important; }

          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 15mm; margin-top: 15mm; margin-bottom: 8mm; }
          .sig-line { border-top: 1.2pt solid #cbd5e1; text-align: center; padding-top: 2mm; font-size: 8pt; font-weight: 900; text-transform: uppercase; color: #94a3b8 !important; }

          @media print {
            body { background: white !important; }
            .print-hidden { display: none !important; }
            .pdf-page { border: none !important; padding: 5mm !important; margin: 0 !important; width: 100% !important; }
            .doc-id-box, .section-header, .items-table th, .total-row:last-child { -webkit-print-color-adjust: exact; }
          }
        `}</style>

        <div className="header">
          <div>
            <h1 className="company-name">{company.name}</h1>
            <div className="company-info">
              <p>{company.address}, {company.city}</p>
              <p>CNPJ: {company.taxId} | IE: {company.stateRegistration}</p>
              <p>Email: {company.email} | Tel: {company.phone}</p>
              <p>{company.website} | {company.instagram}</p>
            </div>
          </div>
          <div className="doc-type-container">
            <h2 className="doc-type-label">{docType}</h2>
            <div className="doc-id-box">Nº {order.id}</div>
            <div className="emission-date">EMISSÃO: {todayFormatted} ÀS {nowTime}</div>
          </div>
        </div>

        <div className="top-meta">
          <div className="meta-box">
            <span className="meta-label">Data de Referência</span>
            <span className="meta-value">{formatDateToDisplay(order.date) || todayFormatted}</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">Status Atual</span>
            <span className="meta-value" style={{textTransform: 'uppercase'}}>{order.productionStatus || 'Em processamento'}</span>
          </div>
        </div>

        <div className="section-header">Dados do Cliente</div>
        <div className="section-content">
          <div className="grid grid-cols-2 gap-x-8">
            <div className="col-span-2">
              <span className="field-label">Cliente / Razão Social:</span>
              <span className="field-value">{order.customer}</span>
            </div>
            {order.customerTaxId && (
              <div>
                <span className="field-label">Documento (CPF/CNPJ):</span>
                <span className="field-value">{order.customerTaxId}</span>
              </div>
            )}
            {order.customerPhone && (
              <div>
                <span className="field-label">Telefone de Contato:</span>
                <span className="field-value">{order.customerPhone}</span>
              </div>
            )}
            {order.customerEmail && (
              <div className="col-span-2">
                <span className="field-label">E-mail:</span>
                <span className="field-value">{order.customerEmail}</span>
              </div>
            )}
            {order.customerAddress && (
              <div className="col-span-2">
                <span className="field-label">Endereço:</span>
                <span className="field-value">{order.customerAddress}</span>
              </div>
            )}
            {order.customerCity && (
              <div>
                <span className="field-label">Cidade / UF:</span>
                <span className="field-value">{order.customerCity}</span>
              </div>
            )}
            {order.customerZip && (
              <div>
                <span className="field-label">CEP:</span>
                <span className="field-value">{order.customerZip}</span>
              </div>
            )}
          </div>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th style={{width: '10mm'}} className="text-center">#</th>
              <th>DESCRIÇÃO DOS PRODUTOS / SERVIÇOS</th>
              <th style={{width: '20mm'}} className="text-center">QTD</th>
              {!isOS && <th style={{width: '30mm'}} className="text-right">VALOR UNIT.</th>}
              {!isOS && <th style={{width: '35mm'}} className="text-right">SUBTOTAL</th>}
            </tr>
          </thead>
          <tbody>
            {(order.items && order.items.length > 0 ? order.items : [{ description: 'Serviço Gráfico', quantity: 1, unitPrice: order.value }]).map((item, idx) => (
              <tr key={idx}>
                <td className="text-center text-slate-400">{(idx + 1).toString().padStart(2, '0')}</td>
                <td style={{fontWeight: '800'}}>{item.description}</td>
                <td className="text-center">{item.quantity}</td>
                {!isOS && <td className="text-right">R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>}
                {!isOS && <td className="text-right" style={{fontWeight: 900, color: '#1e293b !important'}}>R$ {(item.quantity * item.unitPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        {isOS && (
          <>
            <div className="section-header">
              <div className="flex items-center gap-2">
                <Wrench className="w-3 h-3" />
                Especificações Técnicas / Produção
              </div>
            </div>
            <div className="production-field">
              <p className="text-[8px] font-bold text-slate-300 uppercase mb-4 tracking-widest">Anotações operacionais e acabamentos</p>
              <div className="border-b border-slate-100 h-8"></div>
              <div className="border-b border-slate-100 h-8"></div>
              <div className="border-b border-slate-100 h-8"></div>
            </div>
          </>
        )}

        {!isOS && (
          <div className="totals-container">
            <div className="totals-table">
              <div className="total-row">
                <span className="total-label text-slate-400 font-black uppercase text-[7pt]">Subtotal:</span>
                <span className="total-value font-bold">R$ {itemsSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              {order.shipping > 0 && (
                <div className="total-row">
                  <span className="total-label text-slate-400 font-black uppercase text-[7pt]">Frete:</span>
                  <span className="total-value font-bold">R$ {order.shipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="total-row">
                  <span className="total-label text-rose-400 font-black uppercase text-[7pt]">Descontos:</span>
                  <span className="total-value text-rose-500 font-bold">R$ {order.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="total-row">
                <span className="total-label font-black uppercase text-[7.5pt]">Total Geral:</span>
                <span className="total-value font-black text-[11pt]">R$ {order.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        )}

        <div className="signatures">
          <div className="sig-line">{isOS ? "Responsável Produção" : "Assinatura do Cliente"}</div>
          <div className="sig-line">{isOS ? "Conferência Final" : "Responsável Venda"}</div>
        </div>

        <div className="text-[7.5pt] text-slate-400 text-center mt-10 border-t border-slate-50 pt-4">
          <p><strong>Atenção:</strong> Este documento não é nota fiscal. Variações de cores podem ocorrer devido ao processo de impressão.</p>
        </div>
      </div>
    </div>
  );
};