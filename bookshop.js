// get book shop by id  => done
// get cities           => done
// get bookshop by name => done
// get by email id      => done
// update name          => done
// update email         => done
// add only oneshop     => done
// delete one shop      => done
// Get All Bookshops    => done (added from me)

const express = require("express");
const app = express();
app.use(express.json());
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Oa03njsr#",
    database:"library"
});


connection.connect((err) => {
    if (err)
        console.log("error when server connection", err.message);
});


app.post("/bookshop", (req, res) => {
    const {id, name, city, contactNumber, email, address} = req.body;
    let bookshopID = parseInt(id);
    if (!bookshopID || typeof bookshopID !=="number")
        return res.status(400).json({ error: "Invalid or missing bookshop ID" });

    if (!name || typeof name !=="string")
        return res.status(400).json({ error: "Invalid or missing bookshop name" });
    
    if (!city || typeof city !=="string")
        return res.status(400).json({ error: "Invalid or missing bookshop city" });
    
    if (!contactNumber || typeof contactNumber !=="string")
        return res.status(400).json({ error: "Invalid or missing bookshop contactNumber" });
    
    if (!email || typeof email !=="string")
        return res.status(400).json({ error: "Invalid or missing bookshop email" });
    
    if (!address || typeof address !=="string")
        return res.status(400).json({ error: "Invalid or missing bookshop address" });
    
    const query = "insert into bookshop (shop_id, name, city, contactNumber, email, address) values (?,?,?,?,?,?)";
    connection.query(query, [bookshopID, name, city, contactNumber, email, address] ,(err, result) => {
        if (err)
            return res.status(500).json({error:"Error when adding new bookshop", details:err.message});
     
        return res.status(201).json({message:"Bookshop has been added successfully"});
    });

});



// added from me
app.get("/bookshops", (req, res) => {
    const query = "select * from bookshop";
    connection.query(query, (err, result) => {
        if (err)
            return res.status(500).json({error:"Error when retrieving all bookshops", details:err.message});
        if (result.length === 0) 
            return res.status(404).json({ message: "No bookshops found" });
        return res.json({message:"All bookshops has been retrieved successfully", result});
    });
});


app.get("/bookshops/:id", (req, res) => {
    const bookshopId = parseInt(req.params.id);
    if (isNaN(bookshopId)) 
        return res.status(400).json({ error: "Invalid bookshop ID" });

    const query = "select * from bookshop where shop_id = ?";
    connection.query(query, [bookshopId], (err, result) => {
        if (err)
            return res.status(500).json({error:"Error when retrieving bookshop", details:err.message});
        if (result.length === 0)
            return res.status(404).json({error:"Bookshop not found"});
        return res.json({message:"Bookshop has been retrieved successfully", bookshop:result[0]});
    });
});


app.get("/bookshop/byname", (req, res) => {
    const {name} = req.body;
    if (typeof name !== "string") 
        return res.status(400).json({ error: "Invalid or missing bookshop Name" });

    const query = "select * from bookshop where name = ?";
    connection.query(query, [name], (err, result) => {
        if (err)
            return res.status(500).json({error:"Error when retrieving bookshop by name", details:err.message});
        if (result.length === 0)
            return res.status(404).json({error:"Bookshop not found"});
        return res.json({message:"Bookshop has been retrieved successfully", bookshop:result});
    });
});


app.get("/bookshop/byemail", (req, res) => {
    const {email} = req.body;
    if (typeof email !== "string") 
        return res.status(400).json({ error: "Invalid or missing bookshop email" });

    const query = "select * from bookshop where Email = ?";
    connection.query(query, [email], (err, result) => {
        if (err)
            return res.status(500).json({error:"Error when retrieving bookshop by email", details:err.message});
        if (result.length === 0)
            return res.status(404).json({error:"Bookshop not found"});
        return res.json({message:"Bookshop has been retrieved successfully", bookshop:result});
    });
});


app.get("/bookshop/cities", (req, res) => {
    const query = "select city from bookshop";
    connection.query(query, (err, result) => {
        if (err)
            return res.status(500).json({error:"Error when retrieving all bookshop cities", details:err.message});
        if (result.length === 0) 
            return res.status(404).json({ message: "No bookshop cities found" });
        return res.json({message:"All bookshop cities has been retrieved successfully", result});
    });
});


app.delete("/bookshops/:id", (req, res) => {
    const bookshopId = parseInt(req.params.id);
    if (isNaN(bookshopId)) 
        return res.status(400).json({ error: "Invalid bookshop ID" });

    const query = "delete from bookshop where shop_id = ?";
    connection.query(query, [bookshopId], (err, result) => {
        if (err)
            return res.status(500).json({error:"Error when deleting bookshop", details:err.message});
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Bookshop not found" });
        return res.json({message:"Bookshop has been deleted successfully"});
    });
});


app.patch("/bookhop/name/:id", (req, res) => {
    const {name} = req.body;

    const bookshopId = parseInt(req.params.id);
    if (isNaN(bookshopId)) 
        return res.status(400).json({ error: "Invalid bookshop ID" });

    if (!name || typeof name !== "string") 
        return res.status(400).json({ error: "Invalid or missing bookshop name" });

    const query = "update bookshop set name = ? where shop_id = ?;";
    connection.query(query, [name, bookshopId],(err, result) => {
        if (err)
            return res.status(500).json({error:"Error when updating bookshop", details:err.message});
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Bookshop not found or no changes made" });
        return res.json({message:"Bookshop has been updated successfully"});
    });
});


app.patch("/bookhop/email/:id", (req, res) => {
    const {email} = req.body;

    const bookshopId = parseInt(req.params.id);
    if (isNaN(bookshopId)) 
        return res.status(400).json({ error: "Invalid bookshop ID" });

    if (!email || typeof email !== "string") 
        return res.status(400).json({ error: "Invalid or missing bookshop email" });

    const query = "update bookshop set email = ? where shop_id = ?;";
    connection.query(query, [email, bookshopId],(err, result) => {
        if (err)
            return res.status(500).json({error:"Error when updating bookshop", details:err.message});
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Bookshop not found or no changes made" });
        return res.json({message:"Bookshop has been updated successfully"});
    });
});


app.listen(3000, "127.0.0.1", () => {
    console.log(`Server has been started on http://localhost:3000`);
});
