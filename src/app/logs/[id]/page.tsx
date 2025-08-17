
'use client';

import { useEffect, useState, use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { notFound } from 'next/navigation';
import { SampleReceipt } from './components/sample-receipt';
import { fromFirestore } from '@/lib/utils';
import type { Receipt } from '@/lib/types';


export default function LogPage({ params: paramsPromise }: { params: { id: string } }) {
  const [receiptData, setReceiptData] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  
  // The 'use' hook is not available in the version of React being used.
  // We will access params directly and manage the id in the useEffect hook.
  const { id } = paramsPromise;

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'receipts', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = fromFirestore<Receipt>({ id: docSnap.id, ...docSnap.data() });
          setReceiptData(data);
        } else {
          setReceiptData(null);
        }
      } catch (error) {
        console.error("Error fetching receipt:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReceipt();
    }
  }, [id]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading receipt...</div>;
  }

  if (!receiptData) {
    return notFound();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-background">
       <SampleReceipt data={receiptData} />
    </div>
  );
}
