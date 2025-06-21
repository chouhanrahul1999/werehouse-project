# Werehouse Project

This repository contains both the backend (Node.js/TypeScript) and frontend (React/Vite) for the Werehouse project.

## Folder Structure

```
werehouse-project/
├── backend/              # Node.js + TypeScript backend API
└── werehouse-frontend/   # React + Vite frontend
```

---

## Backend Setup (Node.js/TypeScript)

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update values as needed.
4. **Run the backend server:**
   ```bash
   npm run dev
   ```
   The backend will start on the port specified in your `.env` file (commonly 3000).

---

## Frontend Setup (React/Vite)

1. **Navigate to the frontend folder:**
   ```bash
   cd werehouse-frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   The frontend will start on [http://localhost:5173](http://localhost:5173) by default.

---

## Full Project Installation (from root)

```bash
# Install backend dependencies
cd backend && npm install

# In a new terminal, install frontend dependencies
cd ../werehouse-frontend && npm install
```

## Running Both Projects
- Start the backend and frontend servers in separate terminals as described above.

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
