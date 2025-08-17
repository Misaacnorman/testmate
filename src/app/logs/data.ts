
'use server';

import { collection, getDocs, doc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Receipt } from '@/lib/types';

const receiptsCollection = collection(db, 'receipts');

export async function getReceipts(): Promise<Receipt[]> {
  // Simulate network delay for a better UX
  await new Promise(resolve => setTimeout(resolve, 500));
  const snapshot = await getDocs(receiptsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Receipt));
}

export async function deleteReceipt(receiptId: string): Promise<void> {
    const batch = writeBatch(db);

    // 1. Delete the receipt itself
    const receiptRef = doc(db, 'receipts', receiptId);
    batch.delete(receiptRef);

    // 2. Find and delete all associated samples from various registers
    // We assume registers are named like 'material-name-register'
    // This part is complex as we need to query all possible registers.
    // A more robust system might store sample references differently.
    
    // For this implementation, we can fetch all collections and look for samples.
    // This is NOT efficient for production but works for this scope.
    // A better approach would be to store sample references within the receipt
    // or use a known list of registers.
    
    // Let's assume we have a predefined list of possible register names based on material categories.
    // This is a simplification.
    const possibleRegisters = [
        'concrete-cubes-register',
        'bricks-register',
        'blocks-register',
        'pavers-register',
        'cylinder-register',
        'asphalt-register',
        'soil-register',
        'aggregates-fine-register',
        'aggregates-coarse-register',
        // Add other register names here as they are created
    ];

    for (const registerName of possibleRegisters) {
        try {
            const registerCollection = collection(db, registerName);
            const q = query(registerCollection, where('receiptId', '==', receiptId));
            const samplesSnapshot = await getDocs(q);
            if (!samplesSnapshot.empty) {
                samplesSnapshot.forEach(sampleDoc => {
                    batch.delete(sampleDoc.ref);
                });
            }
        } catch (e) {
            // It's possible a register collection doesn't exist yet, so we catch and ignore the error.
            if (e instanceof Error && (e.message.includes("NOT_FOUND") || e.message.includes("no such collection"))) {
                // console.log(`Register collection not found: ${registerName}`);
            } else {
                console.error(`Error querying register ${registerName}:`, e);
                throw e; // Re-throw other errors
            }
        }
    }


    await batch.commit();
}
