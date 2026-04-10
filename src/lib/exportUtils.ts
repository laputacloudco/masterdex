import jsPDF from 'jspdf';
import type { PokemonCard } from './types';

export async function exportChecklistToPDF(
  cards: PokemonCard[],
  setName: string,
  checkedCards: string[]
) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const lineHeight = 7;
  let y = margin;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('Pokemon Master Set Checklist', margin, y);
  y += 10;

  pdf.setFontSize(12);
  pdf.text(setName, margin, y);
  y += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const checkedCount = checkedCards.length;
  pdf.text(`Progress: ${checkedCount} / ${cards.length} (${Math.round((checkedCount / cards.length) * 100)}%)`, margin, y);
  y += 12;

  pdf.setFontSize(9);
  
  for (const card of cards) {
    if (y > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }

    const checked = checkedCards.includes(card.id);
    
    pdf.setFont('helvetica', checked ? 'normal' : 'bold');
    
    const checkbox = checked ? '☑' : '☐';
    pdf.text(checkbox, margin, y);
    
    const cardText = `${card.setNumber} - ${card.name}`;
    pdf.text(cardText, margin + 8, y);
    
    const variantText = card.variant !== 'normal' ? ` (${card.variant})` : '';
    const holoText = card.isHolo && card.variant === 'normal' ? ' (Holo)' : '';
    const detailText = `${card.setCode}${variantText}${holoText}`;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(detailText, margin + 8, y + 3.5);
    
    if (card.marketPrice) {
      const priceText = `$${card.marketPrice.toFixed(2)}`;
      const priceWidth = pdf.getTextWidth(priceText);
      pdf.text(priceText, pageWidth - margin - priceWidth, y);
    }
    
    pdf.setFontSize(9);
    y += lineHeight;
  }

  pdf.save(`${setName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_checklist.pdf`);
}

export async function exportProxiesPDF(
  cards: PokemonCard[],
  setName: string,
  checkedCards: string[]
) {
  const uncheckedCards = cards.filter(card => !checkedCards.includes(card.id));
  
  if (uncheckedCards.length === 0) {
    throw new Error('No unchecked cards to generate proxies for!');
  }

  const pdf = new jsPDF('portrait', 'mm', 'a4');
  const cardWidth = 63;
  const cardHeight = 88;
  const cardsPerRow = 3;
  const cardsPerCol = 3;
  const cardsPerPage = cardsPerRow * cardsPerCol;
  const marginX = (pdf.internal.pageSize.getWidth() - (cardsPerRow * cardWidth)) / 2;
  const marginY = 10;
  
  for (let i = 0; i < uncheckedCards.length; i++) {
    const card = uncheckedCards[i];
    const pageIndex = Math.floor(i / cardsPerPage);
    const cardIndexOnPage = i % cardsPerPage;
    const row = Math.floor(cardIndexOnPage / cardsPerRow);
    const col = cardIndexOnPage % cardsPerRow;
    
    if (i > 0 && cardIndexOnPage === 0) {
      pdf.addPage();
    }
    
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
    pdf.text('PROXY', x + cardWidth / 2, y + cardHeight / 2, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
  }

  pdf.save(`${setName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_proxies.pdf`);
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
  printWindow.focus();
  
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
