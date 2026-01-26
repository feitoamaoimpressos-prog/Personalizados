
import React, { useState, useEffect } from 'react';
import { Printer, Download, ArrowLeft, Loader2 } from 'lucide-react';
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
  const [docType, setDocType] = useState<DocType>('PEDIDO');
  const [isGenerating, setIsGenerating] = useState(false);

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
        html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
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
  const totalItemsQuantity = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const isIndividualInstallment = order.productionStatus === 'Apenas Financeiro';
  const isOS = docType === 'ORDEM DE SERVIÇO';
  const realRemaining = order.remaining;

  const renderPedidoLayout = () => (
    <div id="printable-document" className="pdf-container">
      <style>{`
        .pdf-container {
          width: 210mm;
          min-height: 297mm;
          background: white;
          padding: 10mm;
          color: #000 !important;
          font-family: 'Inter', sans-serif;
          margin: 0 auto;
          box-sizing: border-box;
        }
        /* Forçar todos os textos para preto */
        .pdf-container *, .pdf-container p, .pdf-container span, .pdf-container h1, .pdf-container h2, .pdf-container td, .pdf-container th {
          color: #000 !important;
        }

        .header-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
        .company-info h1 { font-size: 18px; font-weight: 900; margin-bottom: 2px; text-transform: uppercase; }
        .company-info p { font-size: 9px; margin-bottom: 1px; font-weight: 500; }
        .doc-title-box { text-align: right; }
        .doc-title-box h2 { font-size: 28px; font-weight: 900; margin: 0; }
        .order-number { 
          background: #000; 
          color: #fff !important; 
          padding: 4px 15px; 
          border-radius: 6px; 
          font-weight: 900; 
          display: inline-block; 
          margin-top: 4px;
          font-size: 12px;
        }
        .date-info { font-size: 8px; font-weight: 800; margin-top: 8px; text-transform: uppercase; }
        
        .gray-bar { 
          background: #f1f5f9; 
          border: 1px solid #e2e8f0; 
          padding: 5px 10px; 
          font-size: 10px; 
          font-weight: 900; 
          margin-bottom: 12px; 
          text-transform: uppercase;
        }
        
        .section-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; border: 1px solid #e2e8f0; }
        .section-header { 
          background: #f1f5f9; 
          border: 1px solid #e2e8f0; 
          padding: 4px 10px; 
          font-size: 10px; 
          font-weight: 900; 
          text-transform: uppercase;
          text-align: left;
        }
        .field-label { font-size: 9px; font-weight: 800; padding: 5px; border: 1px solid #e2e8f0; background: #f8fafc; text-align: left; }
        .field-value { font-size: 9px; font-weight: 600; padding: 5px; border: 1px solid #e2e8f0; background: white; text-align: left; }

        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 4px; border: 1px solid #e2e8f0; }
        .items-table th { 
          border: 1px solid #e2e8f0; 
          padding: 6px; 
          font-size: 9px; 
          font-weight: 900; 
          background: #f1f5f9; 
          text-transform: uppercase;
          text-align: center;
        }
        .items-table td { border: 1px solid #e2e8f0; padding: 5px 8px; font-size: 9px; }
        .items-table tr.total-row td { background: #f1f5f9; font-weight: 900; border-top: 2px solid #e2e8f0; }

        .summary-block { display: flex; flex-direction: column; align-items: flex-end; width: 100%; margin-bottom: 15px; }
        .summary-row { 
          display: flex; 
          justify-content: space-between; 
          width: 220px; 
          padding: 4px 8px; 
          font-size: 10px; 
          font-weight: 900;
          text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
        }
        .summary-row.total { background: #f1f5f9; border: 1px solid #e2e8f0; margin-top: 2px; font-size: 11px; border-bottom: none; }

        .payment-box { border: 1px solid #e2e8f0; padding: 10px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px; background: white; }
        .payment-field { display: flex; flex-direction: column; gap: 2px; }
        .payment-label { font-size: 8px; font-weight: 900; text-transform: uppercase; }
        .payment-value { font-size: 11px; font-weight: 900; }

        .signature-box { 
          border: 1px solid #e2e8f0; 
          padding: 30px 20px 10px 20px; 
          text-align: center; 
          margin-top: 30px;
          background: white;
        }
        .signature-line { border-top: 1px solid #000; width: 60%; margin: 0 auto 5px auto; }
        .signature-text { font-size: 9px; font-weight: 900; text-transform: uppercase; }

        @media print {
          @page {
            margin: 0 !important;
            size: auto;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #root, #root > div, main, .max-w-[1800px], .mx-auto, .px-4, .py-8 {
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            width: 100% !important;
            min-height: auto !important;
            background: transparent !important;
          }
          .print-hidden {
            display: none !important;
          }
          .pdf-container {
            margin: 0 !important;
            padding: 10mm !important;
            width: 210mm !important;
            height: 297mm !important;
            border: none !important;
            box-shadow: none !important;
          }
          /* Garantia final de texto preto na impressão */
          .pdf-container * {
            color: #000 !important;
          }
          .order-number {
             background: #000 !important;
             color: #fff !important;
          }
        }
      `}</style>

      <div className="header-section">
        <div className="company-info">
          <h1>{company.name}</h1>
          <p>{company.address}</p>
          <p>{company.city}</p>
          <p>Telefone: {company.phone}</p>
          <p>E-mail: {company.email}</p>
        </div>
        <div className="doc-title-box">
          <h2>{docType}</h2>
          <div className="order-number">Nº PED{order.id}</div>
          <div className="date-info">
            <p>Emitido {todayFormatted} às {nowTime}</p>
            <p>Referência: {formatDateToDisplay(order.date) || todayFormatted}</p>
          </div>
        </div>
      </div>

      <div className="gray-bar">
        PRAZO DE ENTREGA: {formatDateToDisplay(order.date) || todayFormatted}
      </div>

      <div className="section-header">Dados do Cliente</div>
      <table className="section-table">
        <tbody>
          <tr>
            <td className="field-label" style={{width: '60px'}}>CLIENTE:</td>
            <td className="field-value" style={{width: '320px'}}>{order.customer}</td>
            <td className="field-label" style={{width: '100px'}}>CNPJ/CPF:</td>
            <td className="field-value">{order.customerTaxId || '---'}</td>
          </tr>
          <tr>
            <td className="field-label">ENDEREÇO:</td>
            <td className="field-value">{order.customerAddress || '---'}</td>
            <td className="field-label">CEP:</td>
            <td className="field-value">{order.customerZip || '---'}</td>
          </tr>
          <tr>
            <td className="field-label">CIDADE:</td>
            <td className="field-value">{order.customerCity || '---'}</td>
            <td className="field-label">ESTADO:</td>
            <td className="field-value">{order.customerState || '---'}</td>
          </tr>
          <tr>
            <td className="field-label">TELEFONE:</td>
            <td className="field-value">{order.customerPhone || '---'}</td>
            <td className="field-label">E-MAIL:</td>
            <td className="field-value">{order.customerEmail || '---'}</td>
          </tr>
        </tbody>
      </table>

      <div className="section-header">Produtos / Serviços</div>
      <table className="items-table">
        <thead>
          <tr>
            <th style={{width: '40px'}}>ITEM</th>
            <th>NOME</th>
            <th style={{width: '60px'}}>UND.</th>
            <th style={{width: '60px'}}>QTD.</th>
            {!isOS && <th style={{width: '100px'}}>VR. UNIT.</th>}
            {!isOS && <th style={{width: '100px'}}>SUBTOTAL</th>}
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, idx) => (
            <tr key={idx}>
              <td style={{textAlign: 'center'}}>{idx + 1}</td>
              <td style={{fontWeight: 600}}>{item.description}</td>
              <td style={{textAlign: 'center'}}>Matriz</td>
              <td style={{textAlign: 'center', fontWeight: 800}}>{item.quantity}</td>
              {!isOS && <td style={{textAlign: 'right'}}>{item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>}
              {!isOS && <td style={{textAlign: 'right', fontWeight: 800}}>{(item.quantity * item.unitPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>}
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan={3}>TOTAL DE ITENS</td>
            <td style={{textAlign: 'center'}}>{totalItemsQuantity}</td>
            {!isOS && <td></td>}
            {!isOS && <td style={{textAlign: 'right'}}>{itemsSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>}
          </tr>
        </tbody>
      </table>

      {!isOS && (
        <div className="summary-block">
          <div className="summary-row">
            <span>PRODUTOS:</span>
            <span>{itemsSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          {!isIndividualInstallment && (
            <>
              <div className="summary-row">
                <span>FRETE:</span>
                <span>{order.shipping?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</span>
              </div>
              <div className="summary-row">
                <span>DESCONTO:</span>
                <span>- {order.discount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</span>
              </div>
            </>
          )}
          <div className="summary-row total">
            <span>{isIndividualInstallment ? 'VALOR DA PARCELA:' : 'TOTAL GERAL:'}</span>
            <span>R$ {order.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}

      {!isOS && <div className="section-header" style={{marginBottom: 0}}>Condições de Pagamento</div>}
      {!isOS && (
        <div className="payment-box">
          <div className="payment-field">
            <span className="payment-label">FORMA DE PAGAMENTO:</span>
            <span className="payment-value">{order.paymentMethod || 'NÃO INFORMADO'}</span>
          </div>
          <div className="payment-field">
            <span className="payment-label">DETALHE:</span>
            <span className="payment-value">
              {isIndividualInstallment 
                ? `PARCELA INDIVIDUAL` 
                : (order.installments && order.installments > 1 
                  ? `${order.installments}x de R$ ${(order.remaining / order.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                  : 'À VISTA')}
            </span>
          </div>
          {!isIndividualInstallment && (
            <div className="payment-field">
              <span className="payment-label">SINAL / ENTRADA:</span>
              <span className="payment-value">R$ {order.paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="payment-field">
            <span className="payment-label">VENCIMENTO:</span>
            <span className="payment-value">
              {isIndividualInstallment 
                ? formatDateToDisplay(order.date)
                : ((order as any).firstPaymentDate ? formatDateToDisplay((order as any).firstPaymentDate) : formatDateToDisplay(order.date))}
            </span>
          </div>
          <div className="payment-field" style={{gridColumn: 'span 2'}}>
            <span className="payment-label">PENDENTE NESTE DOCUMENTO:</span>
            <span className="payment-value" style={{fontSize: '14px'}}>R$ {realRemaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}

      <div className="section-header" style={{marginBottom: 0}}>Observações / Transporte</div>
      <div className="gray-bar" style={{background: 'white', fontWeight: 600, fontSize: '10px', height: 'auto', minHeight: '14px', marginBottom: '30px', border: '1px solid #e2e8f0'}}>
        {order.carrier ? `TRANSPORTADORA: ${order.carrier}` : 'NENHUMA OBSERVAÇÃO ADICIONAL'}
      </div>

      {!isOS && (
        <div className="signature-box">
          <div className="signature-line"></div>
          <p className="signature-text">Assinatura do cliente</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      <div className="w-full max-w-[210mm] mt-8 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4 print-hidden">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {(['PEDIDO', 'ORÇAMENTO', 'ORDEM DE SERVIÇO'] as DocType[]).map((t) => (
              <button
                key={t}
                onClick={() => setDocType(t)}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${docType === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDownload} 
            disabled={isGenerating} 
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            PDF
          </button>
          <button 
            onClick={handlePrint} 
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      <div className="w-full overflow-auto pb-20 flex justify-center">
        {renderPedidoLayout()}
      </div>
    </div>
  );
};
