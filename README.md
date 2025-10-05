# TestMate LIMS

**TestMate** is a modern, web-based Laboratory Information Management System (LIMS) designed to streamline and automate the daily operations of materials testing laboratories. Built with a powerful and scalable tech stack, it provides a comprehensive suite of tools to manage everything from sample reception to final certificate generation.

![TestMate Dashboard](https://picsum.photos/seed/dashboard/1200/600)
*A preview of the TestMate dashboard, showcasing key metrics and tasks.*

---

## ✨ Key Features

TestMate is packed with features designed to enhance productivity, ensure data integrity, and provide powerful insights into your laboratory's operations.

-   **👤 Personnel Management**: A complete portal to manage all laboratory staff, their roles, profiles, and contact information.
-   **📦 Asset Management**: Track and manage all laboratory equipment, including maintenance schedules, calibration logs, and asset status.
-   **💰 Finance Module**:
    -   Generate and manage client **Quotations**.
    -   Convert quotes into **Invoices** with a single click.
    -   Track **Expenses** to get a clear view of your lab's financial health.
-   **🧪 Sample & Test Management**:
    -   A step-by-step wizard to receive new samples and automatically generate receipts.
    -   Detailed digital **Registers** for various test types (Concrete Cubes, Pavers, Bricks, Water Absorption, etc.).
    -   Log test results directly into the system.
-   **📜 Certificate & Approval Workflow**:
    -   Automatically generate professional test certificates from register data.
    -   Multi-level approval workflow (Initial & Final) to ensure quality control.
-   **🔐 Role-Based Access Control (RBAC)**: A granular permissions system to control user access to different modules and actions, ensuring data security and integrity.
-   **🤖 AI-Powered Features**: Leverages Google's Genkit for advanced capabilities and future AI-driven enhancements.
-   **🎨 Customizable Theme**: Easily change the look and feel of the dashboard to match your company's branding.

---

## 🛠️ Tech Stack

This project is built on a modern, robust, and scalable technology stack:

-   **Framework**: [Next.js](https://nextjs.org/) (React)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Database**: [Google Firestore](https://firebase.google.com/docs/firestore)
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
-   **Generative AI**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
-   **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

---

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

You will need to have the following installed on your machine:
-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Misaacnorman/testmate.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd testmate
    ```

3.  **Install dependencies:**
    This command will install all the necessary packages for the project.
    ```bash
    npm install
    ```

4.  **Set up environment variables:**
    This project uses Firebase for its backend. You will need to create a Firebase project and get your configuration credentials.
    - Create a file named `.env.local` in the root of the project.
    - Add your Firebase configuration details to this file (copied from your Firebase project settings).

    *Note: The `.env.local` file is listed in `.gitignore` and should not be committed to the repository.*

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Misaacnorman/testmate/issues).

## 📄 License

This project is your own to use. Feel free to add a license file if you wish to make it open source.
