<h1 style="text-align: center;">Daily Dots</h1>

## About

This project is a Google Calendar management application that allows users to authenticate via Google login and manage their calendar events seamlessly. Users can add, update, fetch, and delete events from their Google Calendar using an intuitive interface. Built with modern web technologies, the project is designed to be fast, reliable, and user-friendly.

---

## Technical Decisions
### **Frontend: React**
- Chosen for its component-based architecture, ease of state management, and efficient rendering with the virtual DOM.

### **Styling: Material-UI (MUI)**
- Used for its pre-styled components, customizability, and responsiveness.

### **Backend: Node.js with Express**
- Selected for its seamless JavaScript integration, lightweight framework, and ability to handle asynchronous operations efficiently.
---

## Workflow and Functionality

### **1. Google Login**
- The app uses OAuth 2.0 to authenticate users securely.
- Users log in via Google, and the app retrieves user information like name, email, and profile picture.
- Access and refresh tokens are managed to ensure secure API calls to Google Calendar.

### **2. Add Events**
- Users can add new events to their Google Calendar with details such as title, description, start time, end time, and location.
- Validation ensures all required fields are provided before submission.

### **3. Fetch Events**
- The app fetches a user's calendar events using the Google Calendar API.
- Events are displayed in a list format, showing essential details such as title, time, and location.

### **4. Update Events**
- Users can edit the details of existing events.
- The app sends updated data to the Google Calendar API, which reflects changes in real-time.

### **5. Delete Events**
- Users can delete events directly from the app.
- Confirmation prompts ensure users don't accidentally delete important events.

---

## Getting Started

Follow the steps below to set up and run the project locally.

### Prerequisites
1. **Node.js**: Install Node.js (v20.x) and npm (v10.x) on your system.  
2. **Google Calendar API**: Ensure the Google Calendar API is enabled in your Google Cloud Console.  
3. **OAuth Configuration**: Set up an OAuth 2.0 client on Google Cloud, specifying `http://localhost:5173/oauth2callback` as the redirect URI.  

### Repository URL
Clone the project repository:
```
git clone https://github.com/piyush960/events-app.git
```

### Installation
1. Navigate to the **client** and **server** directories:
   ```bash
   cd client
   npm install

   cd ../server
   npm install
   ```

### Environment Variables
Create a `.env` file in both `client` and `server` directories with the following configuration:

#### Client `.env`:
```
VITE_BACKEND_URL=http://localhost:8000
```

#### Server `.env`:
```
CLIENT_ID=YOUR_CLIENT_ID
CLIENT_SECRET=YOUR_CLIENT_SECRET
REDIRECT_URI=http://localhost:5173/oauth2callback
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Running the Application
1. Start the **client**:
   ```bash
   cd client
   npm run dev
   ```

2. Start the **server**:
   ```bash
   cd server
   npm run dev
   ```

The application will now be running on the following:
- Frontend: [http://localhost:5173](http://localhost:5173)  
- Backend: [http://localhost:8000](http://localhost:8000)  
---

## API Endpoints

### **Authentication**
- **`GET /auth/process-auth`**: Generates and returns the Google OAuth 2.0 authorization URL.
- **`GET /auth/oauth2callback`**: Exchanges the OAuth authorization code for access and refresh tokens.
- **`GET /auth/logout`**: Logs the user out and revokes their session.

### **Google Calendar Events**
- **`GET /api/events`**: Fetches all events from the user's Google Calendar.
- **`POST /api/events`**: Adds a new event to the user's Google Calendar.
- **`PUT /api/events`**: Updates an existing event in the user's Google Calendar.
- **`DELETE /api/events`**: Deletes a specified event from the user's Google Calendar.

## Deployment URLs

- **Frontend**: [Daily Dots - Vercel](https://dailydots.vercel.app)  
- **Backend**: [Daily Dots - Render](https://dailydots.onrender.com)