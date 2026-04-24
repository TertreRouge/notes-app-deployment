
import { useEffect, useState } from 'react';
import './PopUp.css';

export let notes = [];

function PopUp({ togglePopup }) {
    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const apiUrl = "/api";

    const saveNote = () => {
        if (title.trim() !== '' && details.trim() !== '') {
            fetch(apiUrl + "/home", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, details })
            }).then((res) => res.json())
              .then((data) => {
                  if (data._id) {  // Check if the note is successfully saved by checking if it has an id
                      notes.push(data);
                      setTitle("");
                      setDetails("");
                      alert("Note Saved!"); // Alert after successful response
                      togglePopup();
                  } else {
                      alert("Note not Saved!");
                  }
              })
              .catch((error) => {
                  alert("Note not Saved!");
              });
        } else {
            alert("Title and details cannot be empty!");
        }
    };
    

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        fetch(apiUrl + "/home")
            .then((res) => res.json())
            .then((res) => {
                notes = res;                             
            });
        }

    return (
        <main className='popup-slide'>
            <header className='popup-head'>
                <h6 className='back' onClick={togglePopup}>back</h6>
                <h6 className='save' onClick={saveNote}>save</h6>
            </header>
            <input type='text' placeholder='Title' onChange={(e) => setTitle(e.target.value)} className='input-head' value={title} />
            <textarea type='text' placeholder='Notes goes to here...' onChange={(e) => setDetails(e.target.value)} className='input-box' value={details}></textarea>
        </main>
    )
}

export default PopUp;
