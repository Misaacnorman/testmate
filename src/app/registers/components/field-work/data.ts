
'use server';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { FieldWorkInstruction } from '@/lib/types';
import { fromFirestore } from '@/lib/utils';

// This is a placeholder. In a real app, you'd fetch from Firestore.
const MOCK_DATA: FieldWorkInstruction[] = [
    {
        id: '1',
        date: '2024-07-26',
        projectIdBig: 'PROJ-001',
        projectIdSmall: 'SAMP-001A',
        client: 'Nakheel Properties',
        project: 'Palm Jumeirah Villa',
        engineerInCharge: 'John Doe',
        fieldTests: 'Soil compaction tests (5 locations), Concrete slump test (3 samples)',
        technicianInCharge: 'Jane Smith',
        startDate: '2024-07-27',
        endDate: '2024-07-28',
        remarks: 'Client requires results by EOD on the 29th.',
    },
    {
        id: '2',
        date: '2024-07-25',
        projectIdBig: 'PROJ-002',
        projectIdSmall: 'SAMP-002B',
        client: 'Emaar',
        project: 'Burj Khalifa Maintenance',
        engineerInCharge: 'Peter Jones',
        fieldTests: 'Steel hardness testing (10 locations)',
        technicianInCharge: 'Mike Williams',
        startDate: '2024-08-01',
        endDate: '2024-08-03',
        remarks: 'Night work required. Special access permit attached.',
    },
];


const registerCollection = collection(db, 'fieldWorkInstructions');

export async function getFieldWorkInstructions(): Promise<FieldWorkInstruction[]> {
  // Using mock data for now.
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_DATA;

  // In a real implementation, you would use this:
  /*
  try {
    const q = query(registerCollection, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => fromFirestore<FieldWorkInstruction>({ id: doc.id, ...doc.data() }));
  } catch(e) {
    console.error("Error fetching from fieldWorkInstructions: ", e);
    return [];
  }
  */
}
