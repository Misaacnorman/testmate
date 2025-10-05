# **App Name**: LIMS Dashboard

## Core Features:

- Theme Customization: Allow users to customize the color scheme of the dashboard (sidebar, content, top bar) and save preferences.
- Collapsible Sidebar: Implement a sidebar that can be collapsed to provide more screen space. The app persists the user's preference in local storage.
- Navigation: Provide clear navigation through a top bar breadcrumb and a fixed sidebar with intuitive menu items. Add tooltip labels when the sidebar is collapsed.
- Table Generation: Generates tables with sample data for demonstration purposes and for users to view test result data.
- AI Insights: Analyze dashboard data to highlight key trends and anomalies via generative AI. The LLM is a tool for deciding what to include in this summary based on a user specified model.

## Style Guidelines:

- Primary color: A calm, professional blue (#3B82F6), which represents trust and stability, crucial for a dashboard displaying important data.
- Background color: A very light, desaturated blue (#F0F9FF) to ensure readability and a clean, uncluttered interface. This also aligns with the app's purpose of organizing complex information.
- Accent color: A vibrant analogous blue (#60A5FA), used to highlight interactive elements and important data points.
- Body and headline font: 'Inter', a grotesque sans-serif, for a modern, machined, objective, neutral look.
- Simple, geometric icons for navigation and data representation. The style matches the cleanliness and data driven intent.
- A clean and structured layout with a fixed sidebar, top bar, and scrollable content area.
- Subtle transitions and animations for sidebar collapse and settings drawer opening.