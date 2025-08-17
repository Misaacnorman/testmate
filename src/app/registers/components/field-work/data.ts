
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
        fieldTechnician: 'Jane Smith',
        fieldStartDate: '2024-07-27',
        fieldEndDate: '2024-07-28',
        fieldRemarks: 'Client requires results by EOD on the 29th.',
        labTestsDescription: 'Compressive strength of 15 concrete cubes',
        labTechnician: 'Alice Wonderland',
        labStartDate: '2024-07-29',
        labAgreedDeliveryDate: '2024-08-05',
        labAgreedDeliverySignature: 'J. Doe',
        labActualDeliveryDate: '2024-08-04',
        labActualDeliverySignature: 'A. Wonderland',
        labRemarks: 'One cube showed minor cracking before test.',
        acknowledgement: 'Received by Site Engineer Mark.',
        reportIssuedBy: 'Dr. Emily Carter',
        reportPickedBy: 'Client representative',
        reportContact: '+971 50 123 4567',
        reportDateTime: '2024-08-05T14:30:00Z',
        sampleReceiptNumber: 'SRN-2024-07-123',
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
        fieldTechnician: 'Mike Williams',
        fieldStartDate: '2024-08-01',
        fieldEndDate: '2024-08-03',
        fieldRemarks: 'Night work required. Special access permit attached.',
        labTestsDescription: 'Tensile strength of 5 steel rebar samples',
        labTechnician: 'Bob Vance',
        labStartDate: '2024-08-04',
        labAgreedDeliveryDate: '2024-08-10',
        labAgreedDeliverySignature: 'P. Jones',
        labActualDeliveryDate: '2024-08-09',
        labActualDeliverySignature: 'B. Vance',
        labRemarks: 'All samples met specifications.',
        acknowledgement: 'Digital confirmation received.',
        reportIssuedBy: 'Dr. Emily Carter',
        reportPickedBy: 'Courier Service',
        reportContact: 'N/A',
        reportDateTime: '2024-08-10T10:00:00Z',
        sampleReceiptNumber: 'SRN-2024-07-124',
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
