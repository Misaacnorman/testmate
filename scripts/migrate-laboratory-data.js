/**
 * Migration script to add laboratoryId to existing documents
 * This ensures data isolation between laboratories
 * 
 * Run this script once to migrate existing data
 */

const admin = require('firebase-admin');
const serviceAccount = require('../path-to-your-service-account-key.json'); // Update this path

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateData() {
  console.log('Starting laboratory data migration...');
  
  try {
    // Get all users with their laboratory IDs
    const usersSnapshot = await db.collection('users').get();
    const userLabMap = new Map();
    
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.laboratoryId) {
        userLabMap.set(doc.id, userData.laboratoryId);
      }
    });
    
    console.log(`Found ${userLabMap.size} users with laboratory assignments`);
    
    // Collections that need laboratoryId added
    const collectionsToMigrate = [
      'concrete_cubes_register',
      'cylinders_register', 
      'bricks_blocks_register',
      'pavers_register',
      'water_absorption_register',
      'projects',
      'test_certificates',
      'invoices',
      'quotations',
      'expenses',
      'samples',
      'assets',
      'receipts'
    ];
    
    for (const collectionName of collectionsToMigrate) {
      console.log(`\nMigrating ${collectionName}...`);
      
      const snapshot = await db.collection(collectionName).get();
      let migratedCount = 0;
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        
        // Skip if already has laboratoryId
        if (data.laboratoryId) {
          continue;
        }
        
        // Try to determine laboratoryId from various fields
        let laboratoryId = null;
        
        // Check for technicianId -> user -> laboratoryId
        if (data.technicianId && userLabMap.has(data.technicianId)) {
          laboratoryId = userLabMap.get(data.technicianId);
        }
        // Check for engineer field -> user -> laboratoryId  
        else if (data.engineer && userLabMap.has(data.engineer)) {
          laboratoryId = userLabMap.get(data.engineer);
        }
        // Check for createdBy field -> user -> laboratoryId
        else if (data.createdBy && userLabMap.has(data.createdBy)) {
          laboratoryId = userLabMap.get(data.createdBy);
        }
        // Check for userId field -> user -> laboratoryId
        else if (data.userId && userLabMap.has(data.userId)) {
          laboratoryId = userLabMap.get(data.userId);
        }
        
        if (laboratoryId) {
          await doc.ref.update({
            laboratoryId: laboratoryId,
            migratedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          migratedCount++;
        } else {
          console.warn(`Could not determine laboratoryId for ${collectionName}/${doc.id}`);
        }
      }
      
      console.log(`Migrated ${migratedCount} documents in ${collectionName}`);
    }
    
    console.log('\nMigration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateData().then(() => {
  console.log('Migration script finished');
  process.exit(0);
}).catch(error => {
  console.error('Migration script failed:', error);
  process.exit(1);
});
