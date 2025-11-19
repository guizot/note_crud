# Notes CRUD - Full-Stack Application

A modern full-stack notes application with a bold **Memecoin/Neo-Brutalist** design aesthetic. Built with FastAPI (backend) and React (frontend).

![Notes App](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)

## ✨ Features

- **CRUD Operations**: Create, Read, Update, and Delete notes
- **Category Tags**: Organize notes with categories (General, Workout, Personal, Work)
- **Search**: Real-time search across titles, content, and categories
- **Sorting**: Sort by date (latest/oldest) or title (A-Z/Z-A)
- **Timestamps**: Displays when notes were created (e.g., "2 Hours 15 Mins Ago")
- **Custom Dialogs**: Material-inspired delete and sort dialogs
- **Responsive Design**: Mobile-friendly layout
- **Neo-Brutalist UI**: Bold borders, hard shadows, and vibrant colors

## 🎨 Design Theme

The app features a **Memecoin/Neo-Brutalist** aesthetic:
- Dark green background (#123524)
- Cream surfaces (#fffef2)
- Yellow accents (#ffde00)
- Thick 3px black borders
- Hard drop shadows
- Bold uppercase typography (Anton & Public Sans)

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database
- **Uvicorn**: ASGI server

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **Vanilla CSS**: Custom styling
- **Fetch API**: HTTP requests

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🚀 Usage

1. **Create a Note**: Fill in the form on the left (title, category, content) and click "SAVE NOTE"
2. **Search Notes**: Use the search bar in the header to filter notes
3. **Sort Notes**: Click the "SORT" button to choose sorting order
4. **Edit Note**: Click "EDIT" on any note card
5. **Delete Note**: Click "DELETE" and confirm in the dialog

## 📁 Project Structure

```
notes_fullstack/
├── backend/
│   ├── main.py           # FastAPI application & routes
│   ├── models.py         # SQLAlchemy models & Pydantic schemas
│   ├── database.py       # Database configuration
│   ├── notes.db          # SQLite database
│   └── requirements.txt  # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── NoteForm.jsx      # Note creation/edit form
    │   │   ├── NoteList.jsx      # Notes display grid
    │   │   ├── DeleteDialog.jsx  # Confirmation dialog
    │   │   └── SortDialog.jsx    # Sort options dialog
    │   ├── App.jsx               # Main application
    │   ├── api.js                # API client functions
    │   └── index.css             # Global styles
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

- `GET /notes` - Fetch all notes
- `POST /notes` - Create a new note
- `PUT /notes/{id}` - Update a note
- `DELETE /notes/{id}` - Delete a note

## 🎯 Future Enhancements

- [ ] User authentication
- [ ] Rich text editor
- [ ] Note sharing
- [ ] Export to PDF/Markdown
- [ ] Dark/Light mode toggle
- [ ] Tags system
- [ ] Archive functionality

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 👤 Author

**guizot**
- GitHub: [@guizot](https://github.com/guizot)

---

Made with ❤️ using FastAPI & React
