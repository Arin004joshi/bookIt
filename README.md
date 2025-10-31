# 🚀 bookIt - Experience Booking Platform

`bookIt` is a full-stack web application built with the MERN stack (Mongoose, Express, React, Node.js) and TypeScript. It allows users to browse, select, and book various experiences.

## ✨ Features

* **Browse Experiences:** View a list of all available experiences with details like price, duration, and description.
* **Select Date & Time:** Choose a specific date from an interactive calendar and select an available time slot.
* **Booking Form:** Enter personal details (name, email) and the number of participants to make a booking.
* **Booking Confirmation:** Receive a confirmation of the booking details after successful submission.
* **RESTful API:** A robust backend API to manage experiences and bookings.

## 📸 Screenshots

*(Note: You will need to replace the paths below with the actual paths to your images in the repository.)*

### 1. Main Page / Search Results
Users can see all available experiences.

![Main Page](https://i.postimg.cc/wBkf3cBL/Screenshot-2025-10-31-224129.png)

### 2. Select Date
After choosing an experience, users can select a date.

![Select Date Page](https://i.postimg.cc/qRMmKhtw/Screenshot-2025-10-31-224146.png)

### 3. Select Time
After selecting a date, users can pick an available time slot.

![Select Time Page](https://i.postimg.cc/85PyvJFX/Screenshot-2025-10-31-224313.png)

### 4. Checkout and checkout/details 
Users fill in their details to finalize the booking.

![Checkout Page](https://i.postimg.cc/Qtx679BQ/Screenshot-2025-10-31-224347.png)
![checkout/details Page](https://i.postimg.cc/0Q2tSM6Z/Screenshot-2025-10-31-224415.png)

### 5. Confirmation
A summary page confirming the successful booking.

![Confirmation Page](https://i.postimg.cc/3JdxBt5K/Screenshot-2025-10-31-224600.png)

## 💻 Tech Stack

### Backend
* **Framework:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Language:** TypeScript
* **API Testing:** Postman (or similar)

### Frontend
* **Library:** React
* **Build Tool:** Vite
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM
* **API Client:** Axios

## ⚡️ Getting Started

### Prerequisites
* Node.js (v18 or later)
* npm
* MongoDB (local instance or a cloud URI from MongoDB Atlas)

---

### 1. Backend Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/bookit.git](https://github.com/your-username/bookit.git)
    cd bookit/backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the `backend` directory and add your environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=5000
    ```

4.  **Seed the database** (optional, to populate with initial experience data):
    ```sh
    npm run seed
    ```

5.  **Run the backend server:**
    ```sh
    npm run dev
    ```
    The server will be running on `http://localhost:5000`.

---

### 2. Frontend Setup

1.  Open a new terminal and navigate to the `frontend` directory:
    ```sh
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the frontend development server:**
    ```sh
    npm run dev
    ```
    The application will be running on `http://localhost:5173`. The Vite server is pre-configured to proxy API requests to the backend.
