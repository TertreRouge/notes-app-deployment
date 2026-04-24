import { useEffect, useState } from 'react';
import Slide from './Slide';  // Import the Slide component
import PopUp from './PopUp';
import Notes from './Notes';
import './App.css'

function App() {
    const [notes, setNotes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showSlide, setShowSlide] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const apiUrl = "/api"; // Your API base URL

    // Fetch notes when the component mounts
    useEffect(() => {
        fetchNotes();
    }, []);

    // Function to fetch notes from the backend
    const fetchNotes = () => {
        fetch(apiUrl + "/home")
            .then((res) => res.json())
            .then((data) => {
                setNotes(data);
            })
            .catch((error) => {
                console.error("Error fetching notes:", error);
            });
    };

    const togglePopup = () => setShowPopup(!showPopup);
    const toggleSlide = (note = null) => {
        setShowSlide(!showSlide);
        setSelectedNote(note);
    };

    const updateNote = (updatedNote) => {
        const updatedNotes = notes.map((note) =>
            note._id === updatedNote._id ? updatedNote : note
        );
        setNotes(updatedNotes);
    };

    const deleteNote = (noteId) => {
        const filteredNotes = notes.filter((note) => note._id !== noteId);
        setNotes(filteredNotes);
    };

    const addNote = (newNote) => {
        setNotes([...notes, newNote]);
    };

    return (
        <>
            <div className="container">
                <header className="head">
                    <h1 className="scribble">Scribble</h1>
                    <button className="addItem" onClick={togglePopup}>
                        create
                    </button>
                    {showPopup && <PopUp togglePopup={togglePopup} addNote={addNote} />} {/* Pass addNote to PopUp */}
                </header>
                {showSlide && (
                    <Slide
                        toggleSlide={toggleSlide}
                        note={selectedNote}
                        updateNote={updateNote}
                        deleteNote={deleteNote}
                    />
                )}
            </div>
            <Notes notes={notes} toggleSlide={toggleSlide} />
        </>
    );
}

export default App;
