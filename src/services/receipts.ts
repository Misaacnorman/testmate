
'use server';

import { db } from '@/lib/firebase';
import { Receipt } from '@/types/receipt';
import { collection, getDocs, doc, getDoc, setDoc, query, orderBy, deleteDoc, Timestamp } from 'firebase/firestore';

const receiptsCollection = collection(db, 'receipts');

const convertDocToReceipt = (doc: any): Receipt => {
    const data = doc.data();
    const receipt: any = { id: doc.id };

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (value instanceof Timestamp) {
                receipt[key] = value.toDate();
            } else {
                receipt[key] = value;
            }
        }
    }
    return receipt as Receipt;
};


export async function getReceipts(): Promise<Receipt[]> {
    const q = query(receiptsCollection, orderBy("receiptDate", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(convertDocToReceipt);
}

export async function getReceiptById(id: string): Promise<Receipt | null> {
    const docRef = doc(db, 'receipts', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // We can reuse the same converter, but need to pass the doc snapshot
        return convertDocToReceipt(docSnap);
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
