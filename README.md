# Taskflow - Premium Task Manager

A full-stack, beginner-friendly Task Manager application built with a modern Node.js/Express backend and a beautiful, vanilla HTML/CSS/JS frontend.

## Features
- **REST API Validation**: Secure and validated backend endpoints using Express.
- **In-Memory Store**: Fast data manipulation on the server side without a database required.
- **Premium UI**: Responsive, dynamic design with dark mode, glassmorphism, and smooth micro-animations.
- **Vanilla JavaScript Frontend**: Optimistic UI updates, toast notifications, loading states, and error handling without heavy framework overhead.

## Tech Stack
- **Backend:** Node.js, Express
- **Frontend:** HTML5, CSS3, Vanilla JS
- **Fonts & Icons:** Google Fonts (Outfit), FontAwesome

## Requirements
- Node.js (v14 or higher recommended)

## Installation & Setup

1. **Clone or Download the Repository:**
   ```bash
   git clone <repository_url>
   cd task-manager
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Server:**
   ```bash
   npm start
   ```
   *For development with auto-restart, you can run `npm run dev`.*

4. **Open the App:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

The API handles the following operations:
- `GET /tasks` - Retrieve all tasks, sorted intelligently.
- `POST /tasks` - Create a new task. Requires a JSON body: `{ "title": "Your task" }`.
- `PATCH /tasks/:id` - Update the 'completed' status of a task. Requires a JSON body: `{ "completed": true }`.
- `DELETE /tasks/:id` - Remove a task from the list.

## Project Structure
```
task-manager/
├── package.json       # Project dependencies and scripts
├── server.js          # Main Express application backend
├── README.md          # Documentation
└── public/            # Static assets served to client
    ├── index.html     # Main markup
    ├── style.css      # Premium UI styling 
    └── app.js         # Frontend application logic
```
