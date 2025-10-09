import { collection, query, where, QueryConstraint } from 'firebase/firestore';

/**
 * Utility functions for ensuring data isolation between laboratories
 */

/**
 * Creates a query that automatically filters by laboratory ID
 * @param collectionRef - Firestore collection reference
 * @param laboratoryId - The laboratory ID to filter by
 * @param additionalConstraints - Additional query constraints
 * @returns A query with laboratory filtering applied
 */
export function createLaboratoryQuery(
  collectionRef: any,
  laboratoryId: string,
  ...additionalConstraints: QueryConstraint[]
) {
  if (!laboratoryId) {
    throw new Error('Laboratory ID is required for data isolation');
  }
  
  return query(
    collectionRef,
    where('laboratoryId', '==', laboratoryId),
    ...additionalConstraints
  );
}

/**
 * Validates that a document belongs to the specified laboratory
 * @param documentData - The document data to validate
 * @param laboratoryId - The laboratory ID to check against
 * @returns True if the document belongs to the laboratory
 */
export function validateLaboratoryAccess(
  documentData: any,
  laboratoryId: string
): boolean {
  if (!documentData || !laboratoryId) {
    return false;
  }
  
  return documentData.laboratoryId === laboratoryId;
}

/**
 * Ensures all document operations include laboratory ID
 * @param data - The document data
 * @param laboratoryId - The laboratory ID to add
 * @returns The data with laboratory ID included
 */
export function ensureLaboratoryContext(data: any, laboratoryId: string): any {
  if (!laboratoryId) {
    throw new Error('Laboratory ID is required for data isolation');
  }
  
  return {
    ...data,
    laboratoryId,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Creates a safe query that will fail if laboratory ID is missing
 * @param collectionRef - Firestore collection reference
 * @param laboratoryId - The laboratory ID to filter by
 * @param additionalConstraints - Additional query constraints
 * @returns A query with laboratory filtering applied
 */
export function createSafeLaboratoryQuery(
  collectionRef: any,
  laboratoryId: string | null | undefined,
  ...additionalConstraints: QueryConstraint[]
) {
  if (!laboratoryId) {
    // Return a query that will return no results instead of throwing
    return query(collectionRef, where('laboratoryId', '==', 'INVALID_LAB_ID'));
  }
  
  return createLaboratoryQuery(collectionRef, laboratoryId, ...additionalConstraints);
}
