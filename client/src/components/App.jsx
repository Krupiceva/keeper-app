import React, {useState, useEffect} from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Note from "./Note.jsx";
import CreateArea from "./CreateArea.jsx";
import axios from "axios";
//import notes from "../notes.js";

function App(){

  const [notes, setNotes] = useState([]);

  useEffect(() => {
   axios.get("/api/notes")
     .then((res) => {
       setNotes(res.data);
     })
     .catch((err) => {
       console.error(err);
     });
   }, []);

  function addNote(newNote){
    axios.post("/api/notes", newNote)
      .then((res) => {
        setNotes([...notes, res.data])
      })
      .catch((err) => {
        console.log(err)
      });
  }

  function deleteNote(id){
    const route = "/api/notes/" + id ;
    axios.delete(route);
    setNotes((prevNotes) => {
      return prevNotes.filter((note, index) => {
        return note._id !== id;
      });
    });
  }

  return(
    <div>
      <Header />
      <CreateArea
        onAdd={addNote}
      />
      {notes.map((note, index) => {
        return <Note
          //key={note.key}
          title={note.title}
          content={note.content}
          onDelete={deleteNote}
          key={index}
          id={note._id}
         />
      })}

      <Footer />
    </div>
  );
}

export default App;
