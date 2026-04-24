// express

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
let notes = [];

// connecting Database

mongoose.connect('mongodb://db:27017/scribble')
.then(() => {
    console.log('Database Connected');
})
.catch((err) => {
    console.log(err)
})

// creating scheme to allign the data properly

const noteSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    details: String
})

// model creation

const noteModel = mongoose.model('note', noteSchema);

app.post('/home', async(req, res) => {
    const { title, details } = req.body;
    try {
        const newNote = new noteModel({title, details});
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
});

app.put('/home/:id', async (req, res) => {
    try {
        const { title, details } = req.body;
        const id = req.params.id;
        const updatedNote = await noteModel.findByIdAndUpdate(
            id,
            { title, details },
            { new: true }
        )
    
        if(!updatedNote){
            return res.status(404).json({message: "note not Found"});
        }
    
        res.json(updatedNote);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

app.get('/home', async (req, res) => {
    try {
        const notes = await noteModel.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

app.delete('/home/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedNote = await noteModel.findByIdAndDelete(id);
        
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});



const PORT = 2029;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});