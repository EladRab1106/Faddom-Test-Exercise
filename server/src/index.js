const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
