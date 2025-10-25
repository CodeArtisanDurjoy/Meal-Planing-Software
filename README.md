# Meal Planning Software

A comprehensive meal planning application that helps users track nutrition, carbon footprint, set dietary goals, and monitor biometric data.

## Features

-   **Recipe Management**: Add, edit, and view recipes with detailed nutrition and carbon footprint information
-   **Goal Setting**: Set up/down goals for various nutrients (protein, fiber, calories, etc.)
-   **Calendar Integration**: Plan meals and track daily nutrition intake
-   **Biometric Tracking**: Monitor weight, blood pressure, and health trends
-   **Smart Suggestions**: AI-powered recipe suggestions based on your goals
-   **Carbon Footprint Tracking**: Environmental impact of your meals
-   **User Authentication**: Secure login and registration system

## Tech Stack

-   **Backend**: Laravel 12 (PHP)
-   **Frontend**: React.js
-   **Database**: SQLite
-   **Authentication**: Laravel Sanctum
-   **UI Framework**: Material-UI (MUI)

## Prerequisites

-   PHP 8.2 or higher
-   Composer
-   Node.js 18+ and npm
-   SQLite3

## Installation Steps

### Backend Setup (Laravel API)

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd Meal-Planing-Software
    ```
2.  **Install PHP dependencies**
    ```bash
    composer install
    ```
3.  **Create environment file**
    ```bash
    cp .env.example .env
    ```
4.  **Generate application key**
    ```bash
    php artisan key:generate
    ```
5.  **Install Laravel Sanctum & migrate database**
    ```bash
    composer require laravel/sanctum
    php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
    php artisan migrate
    ```
6.  **Start the Laravel development server**
    ```bash
    php artisan serve
    ```

### Frontend Setup (React App)

1.  **Navigate to the frontend directory**
    ```bash
    cd meal-planning-frontend
    ```
2.  **Install npm dependencies**
    ```bash
    npm install
    ```
3.  **Start the React app**
    ```bash
    npm start
    ```

## Project Structure
Meal-Planing-Software/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   ├── Models/
│   └── Providers/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
├── meal-planning-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── hooks/
│   └── public/
└── .env


## Support

If you encounter any issues, please create an issue in the GitHub repository or contact the maintainers.

---

**Built with ❤️ using Laravel and React.js**
