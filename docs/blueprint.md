# **App Name**: TestCentral

## Core Features:

- Action Control Bar: Implement a control bar with a search input field and 'Filters', 'Import', 'Export', and 'Create Test' buttons for primary user actions.
- Data Table Display: Create a data table to display tests with columns for 'Material Category', 'Test Code', 'Material Test', 'Test Method(s)', 'Accreditation', 'Unit', 'Amount (UGX)', 'Amount (USD)', 'Lead Time (Days)', and row-specific 'Actions'.
- State and Action Handling: Add functionality for loading indicators, 'No tests found' message, and dropdown menus in the Actions column with 'Edit' and 'Delete' options.
- Firestore Integration: Implement data fetching from Firestore, aligning with all-caps, space-separated field names, and match the expected data schema.
- Import Functionality: Enable the import functionality using the xlsx library to parse uploaded files based on header matching database field names.
- AI Test Code Suggestion: AI-powered tool to suggest potential test codes based on the material category and test method, accelerating test creation.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust and professionalism.
- Background color: Very light gray (#F5F5F5) for a clean and modern look.
- Accent color: Orange (#FF9800) for interactive elements to draw attention without being jarring.
- Body and headline font: 'Inter', sans-serif, for clear readability and a modern feel.
- Use sharp, clear, and minimalist icons for actions and categories, aligning with the modern design aesthetic.
- Maintain a clean, card-based layout to keep the data table and action bar well-organized and visually appealing.
- Subtle transition animations to signal loading states, confirmation messages and smooth modal transitions