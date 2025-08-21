# TestMate: AI-Powered Laboratory Information Management System

TestMate is a modern, AI-powered Laboratory Information Management System (LIMS) designed to streamline laboratory workflows, from sample registration to final reporting. It combines a user-friendly interface with powerful backend services to ensure data integrity, improve efficiency, and leverage artificial intelligence for smarter data processing.

## Core Features

- **Dashboard**: An intuitive overview of key lab metrics, including sample processing status, equipment health, and recent activities.
- **Sample Registration**: A guided, multi-step process for registering new samples, capturing comprehensive client, project, and test-specific details.
- **Test Catalog Management**: A central repository for all laboratory tests. Users can create, edit, delete, and manage test details, including pricing and turnaround times.
- **File Import/Export**: Seamlessly import test catalogs from spreadsheet files (`.xlsx`, `.csv`) and export existing data for external use. Features AI-powered data mapping to intelligently process imported files.
- **Comprehensive Sample Registers**: Dedicated, permanent registers for different material types (e.g., Concrete Cubes, Pavers, Blocks & Bricks), providing detailed, auditable records of all tests performed.
- **Project Management**: A register for tracking field work and lab testing instructions from start to finish, ensuring clear communication and scope management.
- **User Authentication**: Secure user login and registration system powered by Firebase Authentication.

## Tech Stack

TestMate is built on a modern, robust, and scalable technology stack:

- **Frontend**:
    - **Next.js**: Using the App Router for optimized, server-centric rendering.
    - **React**: For building a dynamic and responsive user interface.
    - **TypeScript**: For type safety and improved code quality.
- **Styling**:
    - **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
    - **ShadCN UI**: A collection of beautifully designed, reusable components.
- **Backend & Database**:
    - **Firebase**: Provides the backend infrastructure, including:
        - **Firestore**: A NoSQL database for storing all application data.
        - **Firebase Authentication**: For managing user accounts and sessions.
- **Artificial Intelligence**:
    - **Genkit**: Google's open-source framework for building production-ready AI applications, used for processing imported files.

## Getting Started

Follow these instructions to get a local copy of TestMate up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A [Firebase](https://firebase.google.com/) account with a new project created.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

### Configuration

1.  **Create an environment file:**
    Create a new file named `.env` in the root of your project.

2.  **Set up Firebase:**
    - Go to your Firebase project's settings.
    - Under the "General" tab, find the "Your apps" section.
    - If you haven't already, register a new Web app.
    - Firebase will provide you with a `firebaseConfig` object. Copy these credentials.
    - A Genkit API key is required to make GenAI features work, you can get one from Google AI Studio. 

3.  **Populate your `.env` file:**
    Copy the contents of `src/lib/firebase/config.ts` into your `.env` file and format it as environment variables. It should look like this:

    ```env
    # Firebase SDK Config
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"

    # Genkit/Gemini API Key
    GEMINI_API_KEY="your-google-ai-studio-api-key"
    ```

    > **Note**: The application is currently configured to read these variables directly from `src/lib/firebase/config.ts`. For a production setup, it is highly recommended to switch to using environment variables by updating the `config.ts` file to read from `process.env`.

### Running the Application

1.  **Run the development server:**
    ```bash
    npm run dev
    ```

2.  **Open your browser:**
    Navigate to [http://localhost:9002](http://localhost:9002) to see the application in action. You can now sign up for a new account and start exploring the features.
