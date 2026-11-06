
const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
app.get("/api/check", (req, res) => {
    res.send("API route is working!");
});
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve website files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Test MySQL connection

app.get("/api/db-test", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS connected");

        res.json({
            message: "MySQL connected successfully!",
            result: rows
        });
    } catch (error) {
        console.error("MySQL error:", error.message);

        res.status(500).json({
            message: "MySQL connection failed",
            error: error.message
        });
    }
});
   
// Get all plants
app.get("/api/plants", async (req, res) => {
    try {
        const [plants] = await db.query(
            "SELECT * FROM plants ORDER BY id DESC"
        );

        res.json(plants);
    } catch (error) {
        console.error("Get plants error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Add a plant
app.post("/api/plants", async (req, res) => {
    try {
        const { name, type, water, sunlight } = req.body;

        if (!name || !type || !water || !sunlight) {
            return res.status(400).json({
                error: "Please enter all plant details."
            });
        }

        const [result] = await db.query(
            `INSERT INTO plants
            (name, type, water_requirement, sunlight_requirement)
            VALUES (?, ?, ?, ?)`,
            [name, type, water, sunlight]
        );

        res.status(201).json({
            message: "Plant added successfully!",
            id: result.insertId
        });
    } catch (error) {
        console.error("Add plant error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Delete a plant
app.delete("/api/plants/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM plants WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Plant not found."
            });
        }

        res.json({
            message: "Plant removed successfully!"
        });
    } catch (error) {
        console.error("Delete plant error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Check database when server starts
async function startServer() {
    try {
        await db.query("SELECT 1");

        console.log("MySQL connected successfully!");

        app.listen(PORT, () => {
            console.log(
                `Urban Farming System running at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
        console.log("Please check your db.js settings and MySQL Server.");
    }
}
app.get("/api/check", (req, res) => {
    res.send("Latest server.js is working!");
});
startServer();