
'use server';

import {
  collection,
  writeBatch,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// A simple function to generate a unique ID for the receipt.
// In a real app, you might want a more robust solution.
function generateReceiptId() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${year}${month}${day}-${randomPart}`;
}

export async function processAndSaveReceipt(receiptData: any): Promise<{ id: string }> {
  const batch = writeBatch(db);
  const receiptId = generateReceiptId();
  const receiptRef = doc(db, 'receipts', receiptId);

  const newReceipt = {
    id: receiptId,
    ...receiptData.formData,
    receiptDate: receiptData.receiptDate,
    categories: receiptData.categories,
    specialData: receiptData.specialData,
    createdAt: serverTimestamp(),
  };

  batch.set(receiptRef, newReceipt);

  // Here you could add more logic to update other collections,
  // for example, a "samples" collection or an "audit-log".
  // For now, we just save the receipt.

  await batch.commit();

  return { id: receiptId };
}
