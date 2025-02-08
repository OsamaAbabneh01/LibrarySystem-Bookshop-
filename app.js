const express = require("express");
const app = express();
app.use(express.json());
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Oa03njsr#",
    database:"library"
})

connection.connect((err) => {
    if (err)
        console.log("error when server connection", err.message);
})

app.post("/books", (req, res) => {
    const {id, name, title} = req.body;
    if (!id || typeof id !=="number")
        return res.status(400).json({ error: "Invalid or missing book ID" });
    if (!name || typeof name !=="string")
        return res.status(400).json({ error: "Invalid or missing book name" });
    if (!title || typeof title !=="string")
        return res.status(400).json({ error: "Invalid or missing book title" });
    
    const query = "insert into books (id, name, title) values (?,?,?)";
    connection.query(query, [id, name, title] ,(err, result) => {
        if (err)
            return res.status(500).json({error:"Error when adding new book", details:err.message});
     
        return res.status(201).json({message:"Book has been added successfully"});
    })

});

app.get("/books", (req, res) => {
    const query = "select * from books";
    connection.query(query, (err, result) => {
        if (err)
            return res.status(500).json({error:"Error when retrieving all books", details:err.message});
        if (result.length === 0) 
            return res.status(404).json({ message: "No books found" });
        return res.json({message:"All books has been retrieved successfully", result});
    });
});

app.get("/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) 
        return res.status(400).json({ error: "Invalid book ID" });

    const query = "select * from books where id = ?";
    connection.query(query, [bookId], (err, result) => {
        if (err)
            return res.status(500).json({error:"Error when retrieving book", details:err.message});
        if (result.length === 0)
            return res.status(404).json({error:"Book not found"});
        return res.json({message:"Book has been retrieved successfully", book:result[0]});
    });
});

app.put("/books/:id", (req, res) => {
    const {name, title} = req.body;

    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) 
        return res.status(400).json({ error: "Invalid book ID" });

    if (!name || typeof name !== "string") 
        return res.status(400).json({ error: "Invalid or missing book name" });

    if (!title || typeof title !== "string") 
        return res.status(400).json({ error: "Invalid or missing book title" });

    const query = "update books set name = ?, title = ? where id = ?;";
    connection.query(query, [name, title, bookId],(err, result) => {
        if (err)
            return res.status(500).json({error:"Error when updating book", details:err.message});
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Book not found or no changes made" });
        return res.json({message:"Book has been updated successfully"});
    });
});

app.delete("/books/:id", (req, res) => {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) 
        return res.status(400).json({ error: "Invalid book ID" });

    const query = "delete from books where id = ?";
    connection.query(query, [bookId], (err, result) => {
        if (err)
            return res.status(500).json({error:"Error when deleting book", details:err.message});
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Book not found" });
        return res.json({message:"Book has been deleted successfully"});
    });
});

app.patch("/books/:id/translation", (req, res) => {
    const bookId = parseInt(req.params.id);
    if (isNaN(bookId)) 
        return res.status(400).json({ error: "Invalid book ID" });
    
    const {language} = req.body;
    if (!language || typeof language !== "string" || language.trim() === "")
        return res.status(400).json({ error: "Invalid or missing language" });

    const checkQuery = "SELECT * FROM books WHERE id = ?";
    connection.query(checkQuery, [bookId], (err, results) => {
        if (err) 
            return res.status(500).json({ error: "Database error", details: err.message });

        if (results.length === 0) 
            return res.status(404).json({ error: "Book not found" });
    });


    const querystr = "update books set title = concat(title, ?) where id = ?";
    connection.query(querystr, [` - (${language})`, bookId], (err, result) => {
        if (err)
            return res.status(500).json({error:"Error when translating book", details:err.message});

        if (result.affectedRows === 0) 
            return res.status(404).json({ error: "Book not found" });
        
        return res.json({message:"Book has been translated successfully"});
    });
});

app.listen(3000, "127.0.0.1", () => {
    console.log(`Server has been started on http://localhost:3000`);
});

