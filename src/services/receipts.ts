
'use server';

import {
  collection,
  writeBatch,
  doc,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// A simple function to generate a unique ID for the receipt.
function generateReceiptId() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${year}${month}${day}-${randomPart}`;
}

// A simple function to generate a unique ID for a sample.
function generateSampleId(material: string, project: string) {
    const materialCode = material.substring(0, 3).toUpperCase();
    const projectCode = project.substring(0, 3).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${materialCode}-${projectCode}-${randomPart}`;
}

const specialCategoriesForRegisters = ['Concrete Cubes', 'Bricks', 'Blocks', 'Pavers', 'Cylinder'];

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

  const { formData, categories, specialData } = receiptData;
  
  const fieldWorkInstructionPayload: any = {
      date: new Date().toISOString().split('T')[0],
      projectIdSmall: `SAMPLES-${receiptId}`,
      client: formData.clientName,
      project: formData.projectTitle,
      engineerInCharge: formData.receivedBy,
      sampleReceiptNumber: receiptId,
      labTestsDescription: [],
  };

  Object.entries(categories).forEach(([category, catData]: [string, any]) => {
     Object.entries(catData.tests).forEach(([testId, testData]: [string, any]) => {

        const isSpecialCategory = specialCategoriesForRegisters.some(sc => sc.toLowerCase() === category.toLowerCase());
        
        let registerName;

        if (testData.materialTest.toLowerCase().trim() === 'water absorption') {
            registerName = 'water-absorption-register';
        } else if (isSpecialCategory) {
            const lowerCaseCategory = category.toLowerCase();
            if (lowerCaseCategory === 'bricks' || lowerCaseCategory === 'blocks') {
                registerName = 'blocks-bricks-register';
            } else {
                 registerName = lowerCaseCategory.replace(/\s/g, '-') + '-register';
            }
        } else {
            // Non-special categories are added to the field work instructions
            fieldWorkInstructionPayload.labTestsDescription.push(`${testData.materialTest} (Qty: ${testData.quantity})`);
            return; // Skip register creation for this test
        }
        
        const isSpecialDataAvailable = Object.keys(specialData).includes(category) && specialData[category][testId];

        if (isSpecialDataAvailable) {
            const specialTestData = specialData[category][testId];
            specialTestData.sets.forEach((set: any, setIndex: number) => {
                set.serials.forEach((serialId: string) => {
                    const sampleDocId = generateSampleId(category, formData.projectTitle);
                    const sampleRef = doc(db, registerName, sampleDocId);
                    
                    const sampleRecord = {
                        sampleId: sampleDocId,
                        receiptId: receiptId,
                        clientName: formData.clientName,
                        projectTitle: formData.projectTitle,
                        material: category,
                        test: testData.materialTest,
                        testId: testId,
                        sampleSerialNumber: serialId,
                        status: 'Pending',
                        receivedAt: receiptData.receiptDate,
                        castingDate: set.castingDate || null,
                        testingDate: set.testingDate || null,
                        age: set.age || null,
                        areaOfUse: set.areaOfUse || null,
                        class: set.class || null,
                        paverType: set.paverType || null,
                        sampleType: set.sampleType || null,
                        setNumber: setIndex + 1,
                    };
                    batch.set(sampleRef, sampleRecord);
                });
            });
        } else {
             for (let i = 0; i < testData.quantity; i++) {
                const sampleDocId = generateSampleId(category, formData.projectTitle);
                const sampleRef = doc(db, registerName, sampleDocId);
                 const sampleRecord = {
                    sampleId: sampleDocId,
                    receiptId: receiptId,
                    clientName: formData.clientName,
                    projectTitle: formData.projectTitle,
                    material: category,
                    test: testData.materialTest,
                    testId: testId,
                    status: 'Pending',
                    receivedAt: receiptData.receiptDate,
                    notes: catData.notes || null,
                };
                batch.set(sampleRef, sampleRecord);
             }
        }
     });
  });

  // If there were any non-special tests, create a field work instruction
  if (fieldWorkInstructionPayload.labTestsDescription.length > 0) {
      fieldWorkInstructionPayload.labTestsDescription = fieldWorkInstructionPayload.labTestsDescription.join(', ');
      const fieldWorkRef = collection(db, 'fieldWorkInstructions');
      // We don't use the batch here because we want to add it as a separate document
      await addDoc(fieldWorkRef, fieldWorkInstructionPayload);
  }

  await batch.commit();

  return { id: receiptId };
}
