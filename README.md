# Financial Architect - Modern Dashboard

A high-performance, aesthetically pleasing financial dashboard built with **React 19**, **TypeScript**, and **Vite**. This application provides a comprehensive overview of financial health, transaction history, and spending insights with a premium dark-mode interface.

Financial Dashboard Preview:- https://financial-dashboard-delta-pearl.vercel.app/

## 🚀 Key Features

- **Interactive Dashboard**: Real-time data visualization using `Recharts`, featuring Area Charts for cash flow and Pie Charts for expense distribution.
- **Transaction Management**: A powerful transaction engine with advanced filtering (by category, type) and sorting (by date, amount).
- **Role-Based Access Control (RBAC)**: 
  - **Viewer**: View-only access to data and insights.
  - **Admin**: Full CRUD capabilities—Add, Edit, and Delete transactions.
- **Intelligent Insights**: Deep-dive analysis of spending habits, identifying top categories and monthly trends.
- **Premium UI/UX**: Built with a "Tailwind CSS" logic, featuring glassmorphism effects and a responsive layout for all devices.
- **Data Persistence**: Your financial data and role preferences are automatically saved in `localStorage`, so nothing is lost on refresh.

## 🛠️ Built With

- **React 19** - Component-based UI library.
- **TypeScript** - Static typing for robust code.
- **Vite** - Lightning-fast frontend build tool.
- **Tailwind CSS** - Modern styling framework.
- **Recharts** - Composable charting library.
- **Lucide React** - Beautifully simple icon set.
- **React Router 7** - Seamless client-side navigation.

## 📋 Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/wasim2402/Financial-Dashboard.git
cd financial-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to see the results.

## 💡 How it Works

### Role Switching & Data Control
By default, the application starts in **Viewer Role**. To perform administrative actions:
1. Navigate to the **Header** (top right corner).
2. Use the dropdown next to the profile image to switch to **Admin Role**.
3. Once in Admin mode, you will see "Add" buttons and "Edit/Delete" actions appear on the Transactions page.

### Mock Data
The project initializes with a set of dummy transactions to demonstrate the visualization capabilities. 
- **Adding Data**: Click the "Add" button on the Transactions page (Admin only).
- **Removing Data**: Use the delete icon on any transaction row (Admin only).
- **Persistence**: All changes made are saved locally in your browser.

## 🎨 Design Philosophy
The application follows the **Financial Architect** design system, emphasizing clarity, hierarchy, and a professional aesthetic. The color palette uses deep charcoal (#0A0A0A) for backgrounds and vibrant primary accents to draw attention to key metrics.
