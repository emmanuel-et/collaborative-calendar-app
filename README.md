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
We generate our own data off actual users interacting with the app, below are screenshots of sample data from our databases:
<img width="1512" alt="EventsDB" src="https://github.com/user-attachments/assets/2d39f16a-d665-46fa-9828-ac8b11bef5c0" />
Events Data

<img width="1512" alt="UsersDB" src="https://github.com/user-attachments/assets/977da094-5bff-4c6f-87b4-b6c95dc7ff41" />
User Profiles Data

<img width="1512" alt="CalendarDB" src="https://github.com/user-attachments/assets/e1c7670c-9641-4c05-957a-04cd4adf88fc" />
Calendar Data

<img width="1512" alt="NotifsDB" src="https://github.com/user-attachments/assets/a7bc14eb-919e-4377-853a-02496c849c38" />
Notifications Data

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

<img width="1500" alt="CreateAccount" src="https://github.com/user-attachments/assets/82a46b5c-4857-476f-a170-22e341bfcae3" />

Sign Up Page

![CreateEvent](https://github.com/user-attachments/assets/051e718b-6516-4e96-b2b5-7bfc73fb42ab)
Create an event

<img width="1505" alt="Dashboard" src="https://github.com/user-attachments/assets/efb78581-44f7-4e1d-a424-6b030f2658ec" />

Your Dashboard

<img width="1512" alt="CalendarsPage" src="https://github.com/user-attachments/assets/a784b917-c28c-496f-95ae-e621c8246d08" />

View your calendars


<img width="1512" alt="Notifs" src="https://github.com/user-attachments/assets/781fab51-4676-4d95-b3e2-72aa46e4fb4c" />

View your notifications


<img width="1512" alt="Conflict" src="https://github.com/user-attachments/assets/b75a1e11-ece5-4927-906d-47977528aaaf" />

Warning of conflicting events

---

## Final Notes
- This project is designed to scale easily with cloud deployments (MongoDB Atlas, Firebase Hosting).
- Please ensure your `.env` file is properly configured before running the application.
- For any issues, feel free to contact any member of the project team.
