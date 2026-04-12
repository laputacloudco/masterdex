import jsPDF from 'jspdf';
import type { PokemonCard } from './types';

export async function exportChecklistToPDF(
  cards: PokemonCard[],
  setName: string
) {
  const pdf = new jsPDF();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const lineHeight = 7;
  let y = margin;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Pokemon Master Set Checklist', margin, y);
  y += 10;

  pdf.setFontSize(12);
  pdf.text(setName, margin, y);
  y += 10;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Total Cards: ${cards.length}`, margin, y);
  y += 10;

  pdf.setFontSize(9);
  for (const card of cards) {
    if (y > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }

    const variantText = card.variant !== 'normal' ? ` [${card.variant}]` : '';
    const detailText = `${card.name}${variantText} - ${card.setCode} ${card.setNumber}`;
    
    pdf.setFontSize(8);
    pdf.text('☐', margin, y);
    pdf.text(detailText, margin + 8, y);
    
    y += lineHeight;
  }

  pdf.save(`${setName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_checklist.pdf`);
}

export async function exportPlaceholdersToPDF(
  cards: PokemonCard[],
  setName: string
) {
  const uncheckedCards = cards;
  
  if (uncheckedCards.length === 0) {
    throw new Error('No cards to generate placeholders for');
  }

  const pdf = new jsPDF();
  const cardWidth = 63;
  const cardHeight = 88;
  const marginX = 10;
  const marginY = 10;
  const cardsPerRow = 3;
  const cardsPerCol = 3;
  const cardsPerPage = cardsPerRow * cardsPerCol;

  // Pre-load images as grayscale data URLs
  const imageCache = new Map<string, string>();
  for (const card of uncheckedCards) {
    if (card.imageUrl && !imageCache.has(card.imageUrl)) {
      try {
        const dataUrl = await loadImageAsGrayscale(card.imageUrl);
        if (dataUrl) imageCache.set(card.imageUrl, dataUrl);
      } catch {
        // Skip failed images — will render text-only placeholder
      }
    }
  }

  uncheckedCards.forEach((card, i) => {
    const cardIndexOnPage = i % cardsPerPage;
    const row = Math.floor(cardIndexOnPage / cardsPerRow);
    const col = cardIndexOnPage % cardsPerRow;

    if (i > 0 && cardIndexOnPage === 0) {
      pdf.addPage();
    }

    const x = marginX + (col * cardWidth);
    const y = marginY + (row * cardHeight);
    
    // Draw card border
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3);

    // Try to add the grayscale card image
    const imgData = card.imageUrl ? imageCache.get(card.imageUrl) : undefined;
    if (imgData) {
      try {
        // Image fills the card area with small padding
        pdf.addImage(imgData, 'PNG', x + 1, y + 1, cardWidth - 2, cardHeight - 2);
      } catch {
        renderTextPlaceholder(pdf, card, x, y, cardWidth, cardHeight);
      }
    } else {
      renderTextPlaceholder(pdf, card, x, y, cardWidth, cardHeight);
    }
  });

  pdf.save(`${setName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_placeholders.pdf`);
}

function renderTextPlaceholder(
  pdf: jsPDF, card: PokemonCard,
  x: number, y: number, cardWidth: number, cardHeight: number
) {
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

/**
 * Load an image URL and convert to a grayscale data URL for PDF embedding.
 */
async function loadImageAsGrayscale(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Convert to grayscale
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    // Timeout after 5 seconds
    setTimeout(() => resolve(null), 5000);
    img.src = url;
  });
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
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportChecklistToCSV(
  cards: PokemonCard[],
  checkedCardIds: string[],
  setName: string
) {
  const checkedSet = new Set(checkedCardIds);
  const header = ['Card Name', 'Pokemon', 'Set', 'Set Number', 'Variant', 'Rarity', 'Owned', 'Market Price', 'TCGPlayer URL'];
  const rows = cards.map(card => [
    csvEscape(card.name),
    csvEscape(card.pokemonName),
    csvEscape(card.setName),
    card.setNumber,
    card.variant,
    card.rarity,
    checkedSet.has(card.id) ? 'yes' : 'no',
    card.marketPrice != null ? card.marketPrice.toFixed(2) : '',
    card.tcgPlayerUrl || '',
  ].join(','));

  const csv = [header.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${setName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_checklist.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
