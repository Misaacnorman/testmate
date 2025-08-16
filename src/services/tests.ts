
'use server';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Test } from '@/lib/types';

const testsCollection = collection(db, 'tests');

export async function getTests(): Promise<Test[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const snapshot = await getDocs(testsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Test));
}
