import jsPDF from 'jspdf';
import type { PokemonCard } from './types';

export async function exportChecklistToPDF(
  cards: PokemonCard[],
  setName: string,
  const lineHeight = 7;
) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  pdf.setFont('helvetic
  let y = margin;

  pdf.setFont('helvetica', 'bold');
  for (const card of c
  pdf.text('Pokemon Master Set Checklist', margin, y);
    }

    pdf.setFont('helve
  pdf.text(setName, margin, y);
    

    const variantText = card.variant 
    const detailText =
    pdf.setFontSize(8);
    
      cons

    
  

}
export async functio
  setName: string
) {

    throw new Error('No unchecked cards to generate
    
  const cardWidth = 63;
    
  const cardsPerPage = cardsPerRow * card
  const marginY = 10;
    
    const pageIndex = Math.floor(i / cardsPerPage);
    const row = Math.floor(cardIndexOn
    
      pdf.addPage();
    
    const y = marginY + (row * cardHeight);
    pdf.setDrawColor(200, 200, 200);
    pdf.roundedRect(x, 
    pdf.setFontSize(8);
    
    
    pdf.setFontSize(7);
    
      pdf.text(`${card.variant}`, x + 3, y + 17);
    
    
    pdf.setTextColor(0,

}

  if (!printContent) return;
}

    <!DOCTYPE html>
      <head>
        <style>
            body { margi
   
          body { font-family: Arial, sans-serif; }
  
          .card-item { 
            align-items: center; 
   

            width: 16px; 
  const cardWidth = 63;
            flex-shrink:
          .checkbox.chec
            position: re
          .checkbox.checked::after {
            color: white;
  const marginY = 10;
  
          .card-name { 
            font-weight: bold;
    const pageIndex = Math.floor(i / cardsPerPage);
            font-size: 10px; 
            margin-left: 28px;
          .card-price {
    
          }
      pdf.addPage();
     
    
    const x = marginX + (col * cardWidth);
    const y = marginY + (row * cardHeight);
    
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3);
    
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    const nameLines = pdf.splitTextToSize(card.name, cardWidth - 6);
    pdf.text(nameLines, x + 3, y + 5);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text(`${card.setCode} ${card.setNumber}`, x + 3, y + 12);
    
    if (card.variant !== 'normal') {
      pdf.text(`${card.variant}`, x + 3, y + 17);
    }
    
    pdf.setFontSize(6);
    pdf.setTextColor(150, 150, 150);
    pdf.text('PLACEHOLDER', x + cardWidth / 2, y + cardHeight / 2, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
  }

  pdf.save(`${setName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_placeholders.pdf`);
}

export function printChecklist() {
  const printContent = document.getElementById('checklist-print-content');
  if (!printContent) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Checklist</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .no-print { display: none; }
            @page { margin: 1cm; }
          }
          body { font-family: Arial, sans-serif; }
          h1 { font-size: 24px; margin-bottom: 8px; }
          h2 { font-size: 16px; margin-bottom: 16px; color: #666; }
          .progress { margin-bottom: 20px; font-size: 14px; }
          .card-item { 
            display: flex; 
            align-items: center; 
            padding: 8px 0; 
            border-bottom: 1px solid #eee;
            page-break-inside: avoid;
          }
          .checkbox { 
            width: 16px; 
            height: 16px; 
            border: 2px solid #333; 
            margin-right: 12px;
            flex-shrink: 0;
          }
          .checkbox.checked {
            background: #333;
            position: relative;
          }
          .checkbox.checked::after {
            content: '✓';
            color: white;
            position: absolute;
            top: -2px;
            left: 2px;
            font-size: 14px;
          }
          .card-name { 
            flex: 1; 
            font-weight: bold;
            font-size: 12px;
          }
          .card-details { 
            font-size: 10px; 
            color: #666; 
            margin-left: 28px;
          }
          .card-price {
            font-weight: bold;
            margin-left: 12px;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  
  setTimeout(() => {
    printWindow.print();

  }, 250);

