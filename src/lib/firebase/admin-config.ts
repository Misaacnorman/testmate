
import * as admin from 'firebase-admin';

let adminApp: admin.app | null = null;

function initializeAdminApp() {
    if (admin.apps.length > 0) {
        adminApp = admin.app();
        return;
    }

    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccount) {
        console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Admin features will be disabled.");
        return;
    }

    try {
        const serviceAccountKey = JSON.parse(
          Buffer.from(serviceAccount, 'base64').toString('utf-8')
        );
        
        adminApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccountKey),
        });
    } catch (error) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY or initialize admin app:", error);
        adminApp = null;
    }
}

function getAdminApp() {
    if (!adminApp) {
        initializeAdminApp();
    }
    if (!adminApp) {
        throw new Error("Firebase Admin SDK is not initialized. Please set the FIREBASE_SERVICE_ACCOUNT_KEY environment variable.");
    }
    return adminApp;
}

export { getAdminApp };
