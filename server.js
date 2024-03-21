const express = require("express");
const connectDB = require("./config/dbConnection");
const errorhandler = require("./middleware/errorhandler");
const dotenv = require("dotenv").config();

connectDB();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorhandler);

app.listen(PORT, () => {
    console.log("Server running on PORT", PORT);
});