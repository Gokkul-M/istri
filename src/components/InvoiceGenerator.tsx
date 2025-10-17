import jsPDF from 'jspdf';
import { Order } from '@/store/useStore';

export interface InvoiceData {
  order: Order;
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  logoUrl?: string;
  tax?: number;
}

export const generateInvoicePDF = (data: InvoiceData) => {
  const {
    order,
    businessName = 'ShineCycle Laundry Services',
    businessAddress = 'Mumbai, Maharashtra, India',
    businessPhone = '+91 98765 43210',
    businessEmail = 'support@shinecycle.com',
    tax = 0.1, // 10% tax
  } = data;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Colors
  const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo
  const grayColor: [number, number, number] = [107, 114, 128];
  const lightGrayColor: [number, number, number] = [229, 231, 235];

  // Header - Business Info
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(businessName, 15, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(businessAddress, 15, 28);
  doc.text(`Phone: ${businessPhone}`, 15, 34);
  doc.text(`Email: ${businessEmail}`, 15, 40);

  // Invoice Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth - 15, 25, { align: 'right' });
  
  yPos = 55;

  // Invoice Details Box
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(...lightGrayColor);
  doc.roundedRect(15, yPos, pageWidth - 30, 35, 3, 3, 'F');
  
  // Left side - Customer Info
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, yPos + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(order.customerName || 'Customer', 20, yPos + 16);
  doc.text(order.customerPhone || '', 20, yPos + 22);
  
  // Split address into multiple lines if too long
  const maxWidth = 80;
  const addressLines = doc.splitTextToSize(order.customerAddress || '', maxWidth);
  addressLines.forEach((line: string, index: number) => {
    doc.text(line, 20, yPos + 28 + (index * 5));
  });

  // Right side - Invoice Info
  const invoiceInfoX = pageWidth - 80;
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice #:', invoiceInfoX, yPos + 10);
  doc.text('Date:', invoiceInfoX, yPos + 16);
  doc.text('Status:', invoiceInfoX, yPos + 22);

  doc.setFont('helvetica', 'normal');
  doc.text(order.id, invoiceInfoX + 25, yPos + 10);
  doc.text(new Date(order.createdAt).toLocaleDateString('en-IN'), invoiceInfoX + 25, yPos + 16);
  doc.text(order.status.toUpperCase(), invoiceInfoX + 25, yPos + 22);

  yPos = 100;

  // Items Table Header
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, pageWidth - 30, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Service', 20, yPos + 7);
  doc.text('Qty', pageWidth - 85, yPos + 7);
  doc.text('Price', pageWidth - 60, yPos + 7);
  doc.text('Amount', pageWidth - 30, yPos + 7, { align: 'right' });

  yPos += 10;

  // Items
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  order.items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(15, yPos, pageWidth - 30, 10, 'F');
    }

    const itemTotal = item.quantity * item.price;
    
    doc.text(item.serviceName, 20, yPos + 7);
    doc.text(item.quantity.toString(), pageWidth - 85, yPos + 7);
    doc.text(`₹${item.price}`, pageWidth - 60, yPos + 7);
    doc.text(`₹${itemTotal}`, pageWidth - 30, yPos + 7, { align: 'right' });
    
    yPos += 10;
  });

  // Totals Section
  yPos += 5;
  const totalsX = pageWidth - 80;
  
  doc.setDrawColor(...grayColor);
  doc.line(totalsX - 5, yPos, pageWidth - 15, yPos);
  yPos += 10;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsX, yPos);
  doc.text(`₹${order.totalAmount}`, pageWidth - 20, yPos, { align: 'right' });
  yPos += 8;

  // Discount if applicable
  if (order.discount && order.discount > 0) {
    doc.setTextColor(...primaryColor);
    doc.text(`Discount${order.couponCode ? ` (${order.couponCode})` : ''}:`, totalsX, yPos);
    doc.text(`-₹${order.discount}`, pageWidth - 20, yPos, { align: 'right' });
    doc.setTextColor(0, 0, 0);
    yPos += 8;
  }

  // Tax
  const taxAmount = Math.round(((order.finalAmount || order.totalAmount) / (1 + tax)) * tax);
  doc.text('Tax (10%):', totalsX, yPos);
  doc.text(`₹${taxAmount}`, pageWidth - 20, yPos, { align: 'right' });
  yPos += 10;

  // Total
  doc.setDrawColor(...grayColor);
  doc.line(totalsX - 5, yPos - 2, pageWidth - 15, yPos - 2);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', totalsX, yPos + 5);
  doc.setTextColor(...primaryColor);
  doc.text(`₹${order.finalAmount || order.totalAmount}`, pageWidth - 20, yPos + 5, { align: 'right' });

  // Footer
  doc.setTextColor(...grayColor);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const footerY = pageHeight - 20;
  doc.text('Thank you for choosing ShineCycle!', pageWidth / 2, footerY, { align: 'center' });
  doc.text('For support, contact us at support@shinecycle.com', pageWidth / 2, footerY + 5, { align: 'center' });

  // Generate filename
  const date = new Date(order.createdAt).toISOString().split('T')[0];
  const filename = `Invoice_${order.id}_${date}.pdf`;

  // Save the PDF
  doc.save(filename);

  return filename;
};

// Component for programmatic use
export const InvoiceGenerator = {
  generate: generateInvoicePDF,
};
