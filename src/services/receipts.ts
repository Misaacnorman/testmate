

'use server';

import { db } from '@/lib/firebase';
import { Receipt } from '@/types/receipt';
import { collection, getDocs, doc, getDoc, deleteDoc, Timestamp, addDoc, query, orderBy, DocumentData } from 'firebase/firestore';
import { format, isValid, parseISO } from 'date-fns';
import { addConcreteCube } from './concrete-cubes';
import { addBlockAndBrick } from './blocks-and-bricks';
import { addPaver } from './pavers';
import { addCylinder } from './cylinders';
import { addWaterAbsorption } from './water-absorptions';
import { addProject } from './projects';

const receiptsCollection = collection(db, 'receipts');

const fromFirestore = <T extends { id: string }>(doc: DocumentData): T => {
    const data = doc.data();
    
    const convertTimestamps = (obj: any): any => {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof Timestamp) {
            return format(obj.toDate(), 'yyyy-MM-dd');
        }
        
        if (typeof obj === 'object' && obj.seconds !== undefined && obj.nanoseconds !== undefined) {
             try {
                return format(new Timestamp(obj.seconds, obj.nanoseconds).toDate(), 'yyyy-MM-dd');
             } catch (e) {
                return obj; 
             }
        }

        if (Array.isArray(obj)) {
            return obj.map(convertTimestamps);
        }

        const newObj: { [key: string]: any } = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = convertTimestamps(obj[key]);
            }
        }
        return newObj;
    };

    const convertedData = convertTimestamps(data);
    convertedData.id = doc.id;
    
    return convertedData as T;
};


export async function getReceipts(): Promise<Receipt[]> {
    const q = query(receiptsCollection, orderBy("receiptDate", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => fromFirestore<Receipt>(doc));
}

export async function getReceiptById(id: string): Promise<Receipt | null> {
    const docRef = doc(db, 'receipts', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return fromFirestore<Receipt>(docSnap);
    } else {
        return null;
    }
}

export async function addReceipt(receipt: Omit<Receipt, 'id'>): Promise<Receipt> {
    const dataToSave: any = { ...receipt };
    
    const convertDatesToTimestamps = (obj: any) => {
        for (const key in obj) {
            if (obj[key] instanceof Date) {
                obj[key] = Timestamp.fromDate(obj[key]);
            } else if (typeof obj[key] === 'string') {
                const parsedDate = parseISO(obj[key]);
                if(isValid(parsedDate)) {
                    const isJustDate = /^\d{4}-\d{2}-\d{2}$/.test(obj[key]);
                    if (!isJustDate) {
                         obj[key] = Timestamp.fromDate(parsedDate);
                    }
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                convertDatesToTimestamps(obj[key]);
            }
        }
    };

    convertDatesToTimestamps(dataToSave);
    
    const docRef = await addDoc(receiptsCollection, dataToSave);
    return { id: docRef.id, ...receipt };
}

export async function deleteReceipt(receiptId: string): Promise<void> {
    const receiptDoc = doc(db, 'receipts', receiptId);
    await deleteDoc(receiptDoc);
}


export async function processAndSaveReceipt(receiptData: Omit<Receipt, 'id'>): Promise<Receipt> {
    let validatedReceiptDate: Date;

    if (!receiptData.receiptDate) {
        throw new Error("Invalid receipt data: receiptDate is required.");
    }

    if (receiptData.receiptDate instanceof Date) {
        if (isNaN(receiptData.receiptDate.getTime())) {
             throw new Error("Invalid receipt data: receiptDate is not a valid Date.");
        }
        validatedReceiptDate = receiptData.receiptDate;
    } else if (typeof receiptData.receiptDate === 'string') {
        const parsedDate = parseISO(receiptData.receiptDate);
        if (!isValid(parsedDate)) {
            throw new Error("Invalid receipt data: receiptDate string is not valid.");
        }
        validatedReceiptDate = parsedDate;
    } else {
        throw new Error("Invalid receipt data: receiptDate must be a valid Date object or a parseable date string.");
    }
    
    const newReceipt = await addReceipt(receiptData);
    const { id: receiptId, formData, categories, specialData } = newReceipt;
    const formattedReceiptDate = format(validatedReceiptDate, "yyyy-MM-dd");

    const baseData = {
        dateReceived: formattedReceiptDate,
        client: formData.clientName,
        project: formData.projectTitle,
        sampleReceiptNo: receiptId,
        technician: formData.receivedBy,
        contact: formData.clientContact,
        takenBy: formData.deliveredBy,
    };
    
    for (const [category, categoryData] of Object.entries(categories)) {
        
        const isSpecialCategory = Object.keys(specialData).includes(category);
        
        if (isSpecialCategory) {
            for (const [testId, testDetails] of Object.entries(specialData[category])) {
                for (const [setIndex, set] of testDetails.sets.entries()) {
                     let formattedCastingDate = '';
                     let formattedTestingDate = '';

                     if (set.castingDate && isValid(new Date(set.castingDate))) {
                        try {
                            formattedCastingDate = format(new Date(set.castingDate), "yyyy-MM-dd");
                        } catch (e) {
                            console.error(`Invalid castingDate at set index ${setIndex}:`, set.castingDate);
                        }
                     }
                     if (set.testingDate && isValid(new Date(set.testingDate))) {
                        try {
                           formattedTestingDate = format(new Date(set.testingDate), "yyyy-MM-dd");
                        } catch (e) {
                            console.error(`Invalid testingDate at set index ${setIndex}:`, set.testingDate);
                        }
                     }

                    for (const sampleId of set.serials) {
                        const commonSetData = {
                            ...baseData,
                            castingDate: formattedCastingDate,
                            testingDate: formattedTestingDate,
                            ageDays: set.age || 0,
                            areaOfUse: set.areaOfUse || '',
                            sampleId,
                        };

                        if (category.toLowerCase() === 'concrete cubes') {
                            await addConcreteCube({
                                ...commonSetData,
                                class: set.class || '',
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
                                paverType: '',
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
                                class: set.class || '',
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
                if (testDetails.materialTest.toLowerCase().includes('water absorption')) {
                    for (const set of testDetails.sets) {
                        for (const sampleId of set.serials) {
                             await addWaterAbsorption({
                                ...baseData,
                                castingDate: set.castingDate ? format(new Date(set.castingDate), "yyyy-MM-dd") : '',
                                testingDate: set.testingDate ? format(new Date(set.testingDate), "yyyy-MM-dd") : '',
                                ageDays: set.age || 0,
                                areaOfUse: set.areaOfUse || '',
                                sampleId,
                                sampleType: category,
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
            const testsList = Object.values(categoryData.tests)
                .map(t => `- ${t.materialTest} (Qty: ${t.quantity})`)
                .join('\n');
            
            const labTestDetails = `**${category}**\n${testsList}`;
            
            await addProject({
                date: formattedReceiptDate,
                projectId: { big: '', small: `S-${receiptId}` },
                client: formData.clientName,
                project: formData.projectTitle,
                engineerInCharge: '',
                fieldWork: {
                    details: 'N/A', technician: '', startDate: '', endDate: '', remarks: ''
                },
                labWork: {
                    details: labTestDetails,
                    technician: formData.receivedBy,
                    startDate: formattedReceiptDate,
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
