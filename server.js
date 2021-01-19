require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
require("./config/db");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Set the template engine
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");

// Our Routes
app.use("/api/files",require("./routes/uploadFile"));
app.use("/files",require("./routes/show"));
app.use("/files/download",require("./routes/download"));
// console.log(locals.error);
// Start the server
app.listen(PORT , ()=>{
    console.log(`Server is starting at ${PORT} number`);
});
