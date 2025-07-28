
'use server';

import { db } from '@/lib/firebase';
import { Receipt } from '@/types/receipt';
import { collection, getDocs, doc, getDoc, setDoc, query, orderBy, deleteDoc, Timestamp, addDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { addConcreteCube } from './concrete-cubes';
import { addBlockAndBrick } from './blocks-and-bricks';
import { addPaver } from './pavers';
import { addCylinder } from './cylinders';
import { addWaterAbsorption } from './water-absorptions';
import { addProject } from './projects';

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
        return convertDocToReceipt(docSnap);
    } else {
        return null;
    }
}

export async function addReceipt(receipt: Omit<Receipt, 'id'>): Promise<Receipt> {
    const docRef = await addDoc(receiptsCollection, receipt);
    return { id: docRef.id, ...receipt };
}

export async function deleteReceipt(receiptId: string): Promise<void> {
    const receiptDoc = doc(db, 'receipts', receiptId);
    await deleteDoc(receiptDoc);
}


// This is the new central function to handle the entire process
export async function processAndSaveReceipt(receiptData: Omit<Receipt, 'id'>): Promise<Receipt> {
    // 1. Save the main receipt
    const newReceipt = await addReceipt(receiptData);
    const { id: receiptId, formData, categories, specialData, receiptDate } = newReceipt;

    const baseData = {
        dateReceived: format(receiptDate, "yyyy-MM-dd"),
        client: formData.clientName,
        project: formData.projectTitle,
        sampleReceiptNo: receiptId,
        technician: formData.receivedBy,
        contact: formData.clientContact,
        takenBy: formData.deliveredBy,
    };
    
    // 2. Iterate through categories and tests to populate other registers
    for (const [category, categoryData] of Object.entries(categories)) {
        
        const isSpecialCategory = Object.keys(specialData).includes(category);
        
        if (isSpecialCategory) {
            // Handle special categories (Cubes, Bricks, etc.)
            for (const [testId, testDetails] of Object.entries(specialData[category])) {
                for (const [setIndex, set] of testDetails.sets.entries()) {
                    for (const sampleId of set.serials) {
                        const commonSetData = {
                            ...baseData,
                            castingDate: set.castingDate ? format(set.castingDate, "yyyy-MM-dd") : '',
                            testingDate: set.testingDate ? format(set.testingDate, "yyyy-MM-dd") : '',
                            ageDays: set.age || 0,
                            areaOfUse: set.areaOfUse || '',
                            sampleId,
                        };

                        if (category.toLowerCase() === 'concrete cubes') {
                            await addConcreteCube({
                                ...commonSetData,
                                class: set.class || '',
                                // Fields to be filled later
                                dimensions: { length: 0, width: 0, height: 0 },
                                weightKg: 0,
                                machineUsed: '',
                                loadKN: 0,
                                modeOfFailure: '',
                                recordedTemperature: '',
                                certificateNumber: '',
                                comment: '',
                                dateOfIssue: '',
                                issueIdSerialNo: '',
                                date: '',
                                sampleReceiptNumber: receiptId
                            });
                        } else if (category.toLowerCase() === 'bricks' || category.toLowerCase() === 'blocks') {
                             await addBlockAndBrick({
                                 ...commonSetData,
                                 sampleType: category,
                                 // Fields to be filled later
                                 dimensions: { length: 0, width: 0, height: 0 },
                                 dimensionsOfHoles: { holeA: { no: 0, l: 0, w: 0 }, holeB: { no: 0, l: 0, w: 0 }, notch: { no: 0, l: 0, w: 0 } },
                                 weightKg: 0,
                                 machineUsed: '',
                                 loadKN: 0,
                                 modeOfFailure: '',
                                 recordedTemperature: '',
                                 certificateNumber: '',
                                 comment: '',
                                 dateOfIssue: '',
                                 issueIdSerialNo: '',
                                 date: '',
                             });
                        } else if (category.toLowerCase() === 'pavers') {
                             await addPaver({
                                ...commonSetData,
                                paverType: '', // This might need to be collected
                                // Fields to be filled later
                                dimensions: { length: 0, width: 0, height: 0 },
                                paversPerSqMetre: 0,
                                calculatedArea: 0,
                                weightKg: 0,
                                machineUsed: '',
                                loadKN: 0,
                                modeOfFailure: '',
                                recordedTemperature: '',
                                certificateNumber: '',
                                comment: '',
                                dateOfIssue: '',
                                issueIdSerialNo: '',
                                date: '',
                             });
                        } else if (category.toLowerCase() === 'cylinder') {
                            await addCylinder({
                                ...commonSetData,
                                class: set.class || '', // Cylinders might have class
                                // Fields to be filled later
                                dimensions: { diameter: 0, height: 0 },
                                weightKg: 0,
                                machineUsed: '',
                                loadKN: 0,
                                modeOfFailure: '',
                                recordedTemperature: '',
                                certificateNumber: '',
                                comment: '',
                                dateOfIssue: '',
                                issueIdSerialNo: '',
                                date: '',
                            });
                        }
                    }
                }
                 // Check for Water Absorption test within the special category
                if (testDetails.materialTest.toLowerCase().includes('water absorption')) {
                    for (const set of testDetails.sets) {
                        for (const sampleId of set.serials) {
                             await addWaterAbsorption({
                                ...baseData,
                                castingDate: set.castingDate ? format(set.castingDate, "yyyy-MM-dd") : '',
                                testingDate: set.testingDate ? format(set.testingDate, "yyyy-MM-dd") : '',
                                ageDays: set.age || 0,
                                areaOfUse: set.areaOfUse || '',
                                sampleId,
                                sampleType: category,
                                // Fields to be filled later
                                dimensions: { length: 0, width: 0, height: 0 },
                                ovenDriedWeightBeforeSoaking: 0,
                                weightAfterSoaking: 0,
                                weightOfWater: 0,
                                calculatedWaterAbsorption: 0,
                                certificateNumber: '',
                                comment: '',
                                dateOfIssue: '',
                                issueIdSerialNo: '',
                                date: '',
                            });
                        }
                    }
                }
            }
        } else {
            // Handle non-special categories by adding them to the Projects table
            const labTestDetails = Object.values(categoryData.tests).map(t => `${t.materialTest} (Qty: ${t.quantity})`).join(', ');
            
            await addProject({
                date: format(receiptDate, "yyyy-MM-dd"),
                projectId: { big: '', small: `S-${receiptId}` },
                client: formData.clientName,
                project: formData.projectTitle,
                engineerInCharge: '', // To be filled later
                fieldWork: {
                    details: 'N/A', technician: '', startDate: '', endDate: '', remarks: ''
                },
                labWork: {
                    details: labTestDetails,
                    technician: formData.receivedBy,
                    startDate: format(receiptDate, "yyyy-MM-dd"),
                    agreedDeliveryDate: '',
                    signatureAgreed: '',
                    actualDeliveryDate: '',
                    signatureActual: '',
                    remarks: categoryData.notes || '',
                },
                dispatch: {
                    acknowledgement: '', issuedBy: '', deliveredTo: '', contact: '', dateTime: ''
                }
            });
        }
    }

    return newReceipt;
}

    