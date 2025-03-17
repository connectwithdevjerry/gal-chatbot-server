const express = require("express");
const cors = require("cors");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  console.log("Server is running");
  res.send("Gal Chatbot (ErnAi)!");
});

app.post("/save-to-google-sheets", async (req, res) => {
  try {
    // Create a new JWT client
    const jwtClient = new JWT({
      email: process.env.CLIENT_EMAIL,
      key: process.env.PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwtClient);

    // Load the spreadsheet
    // "client_email": "gal-930@erni-ai.iam.gserviceaccount.com",
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0]; // Access first sheet

    // Append new row
    await sheet.addRow(req.body);

    console.log("Data saved successfully!");
  } catch (err) {
    console.error(err.message);
    return;
  }
  console.log(req.body);
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("server error", err);
  } else {
    console.log(`check running server on url http://localhost:${PORT}`);
  }
});
