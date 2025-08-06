# Project Picker 🎲

A fun React + Vite web app for randomly assigning projects to teams, with a Node.js/Express backend. Upload a CSV of project titles, enter the number of teams, and let each team pick a card to reveal their project!

## Directory Structure

```
project-picker/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── README.md
├── .gitignore
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   └── pages/
│       ├── AdminSetup.jsx
│       ├── Card.jsx
│       ├── Card.css
│       ├── GamePlay.jsx
│       └── Summary.jsx
└── server/
    ├── server.js
    ├── package.json
    └── uploads/
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## 1. Running the Backend (Express Server)

1. Open a terminal and navigate to the `server` directory:

   ```sh
   cd server
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the backend server:

   ```sh
   node server.js
   ```

   The backend will run on [http://localhost:5000](http://localhost:5000).

---

## 2. Running the Frontend (React + Vite)

1. Open a new terminal and navigate to the project root (if not already there):

   ```sh
   cd ..
   ```

2. Install frontend dependencies:

   ```sh
   npm install
   ```

3. Start the frontend development server:

   ```sh
   npm run dev
   ```

   The frontend will run on [http://localhost:5173](http://localhost:5173) (or another port if 5173 is taken).

---

## 3. Usage

1. In your browser, go to [http://localhost:5173](http://localhost:5173).
2. On the setup page, upload a CSV file with a `Title` column listing project names.
3. Enter the number of teams and start the game.
4. Each team enters their number and picks a card to reveal their assigned project.
5. After all teams have picked, view the summary page for the final allocation.

---

## Notes

- The backend expects a CSV file with a `Title` column for project names.
- Both servers must be running for the app to function.
- If you change backend port, update API URLs in the frontend accordingly.

---

## License
