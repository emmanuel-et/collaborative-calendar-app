# Collaborative Calendar for Group Scheduling

## Team Members
* Etukudoh, Emmanuel (eetukudoh3@gatech.edu)
* Lazor, Lydia (llazor@gatech.edu)
* Mukoro, Oruaroghene (omukoro3@gaetch.edu)
* Song, Jerry (jsong424@gatech.edu) 

## Overview
This project is a cloud-based, real-time collaborative calendar platform designed for efficient group scheduling. Users can create calendars, invite members, manage events, detect conflicts, and receive real-time notifications.

---

## Data Preparation and Setup

### Database Systems
- **Primary Database**: MongoDB
- **Authentication**: Firebase Authentication

> [MongoDB Installation Guide](https://www.mongodb.com/docs/manual/installation/)
> 
> [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)

### Sample Data
We generate our own data off actual users interacting with the app, below our screenshots of sample data from our databases:
- *TODO*

---

## Application and Code Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB instance (local or Atlas cloud database)
- Firebase project credentials

### Installation Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/emmanuel-et/collaborative-calendar.git
   cd collaborative-calendar
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file. You can create your own instances and fill in the gaps:
   ```
   MONGODB_URI=<your-mongo-uri-or-dynamo-configuration>
   NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-firebase-project-id>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
   NEXT_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>
   ```

4. **Run the Application**:
   ```bash
   npm run dev
   ```
   - Frontend and backend are integrated in Next.js.
   - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API. 

### Running the GUI
- Navigate to `http://localhost:3000/`
- You will see the login page powered by Firebase Authentication.
- After logging in, you can create and manage calendars and events, view notifications via the web dashboard.
  
---

## Code Documentation and References

### External Code and Inspirations
- Firebase Authentication examples were adapted from [Firebase Official Docs](https://firebase.google.com/docs/auth/web/start).
- NoSQL schema inspirations were based on best practices outlined in [MongoDB Data Modeling](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/).

### Changes Made
- Firebase Auth was customized to work seamlessly with our event scheduling backend.
- Optimized MongoDB queries to minimize overhead in conflict detection using batch fetching strategies.

---

## Sample Screenshots
- *TODO*

---

## Final Notes
- This project is designed to scale easily with cloud deployments (MongoDB Atlas, Firebase Hosting).
- Please ensure your `.env` file is properly configured before running the application.
- For any issues, feel free to contact any member of the project team.
