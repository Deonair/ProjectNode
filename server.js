const express = require("express");
const app = express();

require("dotenv").config();
const categorieRouter = require("./routes/categorie");
const countriesRouter = require("./routes/countries");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
// Root path
app.get("/", (req, res) => {
    res.json({ message: "Yo" });
});


// Start server 
app.listen(process.env.HTTP_PORT, () => {

    console.log(`Server running on port ${process.env.HTTP_PORT}`);

})

app.use(express.json());
app.use("/api/countries", countriesRouter);
app.use("/api/categorie", categorieRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);