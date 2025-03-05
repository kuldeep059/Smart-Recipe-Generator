# Smart Recipe Generator

## Description

This application generates recipe suggestions based on user-provided ingredients, either through text input or image uploads. It also allows users to filter recipes based on dietary preferences and other criteria.

## Features

-   Ingredient input (text and image)
-   Recipe generation with detailed instructions and nutritional information
-   Dietary preference filtering
-   Recipe rating and saving
-   Mobile-responsive design

## Technologies Used

-   **Frontend:** React.js, Tailwind CSS, JavaScript
-   **Backend:** Firebase (Firestore, Functions, Storage) or similar
-   **Image Recognition:** Cloud Vision API (or similar)
-   **Deployment:** Netlify/Vercel (frontend), Firebase Functions (backend)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone [repository URL]
    ```
2.  **Install dependencies (frontend):**
    ```bash
    cd client
    npm install
    ```
3.  **Install dependencies (backend):**
    ```bash
    cd functions
    npm install
    ```
4.  **Configure Firebase:**
    -   Create a Firebase project.
    -   Enable Firestore, Functions, and Storage.
    -   Download the Firebase configuration file (`firebase-config.js`) and place it in the appropriate directory.
5.  **Set environment variables:**
    -   Add environment variables for API keys and Firebase configuration.
6.  **Run the application (frontend):**
    ```bash
    cd client
    npm start
    ```
7.  **Deploy Firebase Functions:**
    ```bash
    cd functions
    firebase deploy --only functions
    ```
8.  **Deploy the Frontend to Netlify/Vercel**
    -   Connect your github repo to netlify or vercel, and configure the build settings.

## How to Use

1.  Open the application in your browser.
2.  Enter ingredients in the text input or upload an image.
3.  Select dietary preferences and other filters.
4.  Click "Generate Recipes."
5.  Browse the suggested recipes.
6.  Rate and save your favorite recipes.

## Approach (Brief Write-up)

This application utilizes a React.js frontend for a dynamic user interface and Firebase for a serverless backend. Image recognition is handled by cloud vision api's. Recipe matching involves comparing user-provided ingredient lists with a database of recipes stored in Firestore. The application is designed to be mobile-responsive and provide a seamless user experience.

## Future Improvements

-   Advanced recipe matching algorithms.
-   More detailed nutritional information.
-   Enhanced image recognition accuracy.
-   User accounts and personalized recipe suggestions.
-   Shopping list generation.
