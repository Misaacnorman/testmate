
'use server';

import { db } from '@/lib/firebase';
import { Receipt } from '@/types/receipt';
import { collection, getDocs, doc, getDoc, setDoc, query, orderBy, deleteDoc } from 'firebase/firestore';

const receiptsCollection = collection(db, 'receipts');

export async function getReceipts(): Promise<Receipt[]> {
    const q = query(receiptsCollection, orderBy("receiptDate", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Receipt));
}

export async function getReceiptById(id: string): Promise<Receipt | null> {
    const docRef = doc(db, 'receipts', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Receipt;
    } else {
        return null;
    }
}

export async function addReceipt(receipt: Omit<Receipt, 'id'>): Promise<Receipt> {
    const id = Date.now().toString(); // simple unique ID
    const newReceipt = { ...receipt, id };
    const docRef = doc(db, 'receipts', id);
    await setDoc(docRef, receipt);
    return newReceipt;
}

export async function deleteReceipt(receiptId: string): Promise<void> {
    const receiptDoc = doc(db, 'receipts', receiptId);
    await deleteDoc(receiptDoc);
}
