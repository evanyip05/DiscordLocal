// imports
const process = require("process");
const express = require("express");
const bodyParser = require("body-parser");
const localtunnel = require("localtunnel");
const Discord = require("discord.js");
const {google} = require("googleapis");
const path = require("path");
const fs = require("fs");

// discord client object and express object
const client = new Discord.Client({intents: 380104861760});
const app = express();

// finals
const SHEETID = "15f3IR2T0ItInwfv9xe1JJmtzTq5W2YVlHSgZKbIq24Q";
const DTOKEN = JSON.parse(fs.readFileSync("token.json")).token();
const PORT = 2147;

// add public to server
app.use(express.static("public"));
app.use(express.json({limit: "1mb"}));

client.login(DTOKEN);
client.on("ready", () => {console.log("bot ready")});

// write values to gsheet via id, takes value and column
async function appendValue(spreadsheetId, value, col) {
    const api = getSheetsAPI(); const auth = getAuth();

	await api.spreadsheets.values.append({
        auth, spreadsheetId, range: "Sheet1!"+col+":"+col,
        valueInputOption: "RAW", resource: {values: [[value,],],}	
    });
}

// Create client instance for auth
async function getClient() {return await getAuth().getClient();}

// Instance of Google Sheets API
function getSheetsAPI() {return google.sheets({ version: "v4", auth: getClient()});}

// auth
function getAuth() {
    return new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
}

// root homepage
app.get("/", (req, res) => {res.sendFile(path.resolve("public", "display.html"))});

// get file from public
app.get("/getFile/:file", (req, res) => {
    console.log(path.resolve("public", req.params.file));
    res.sendFile(path.resolve("public", req.params.file));
});

// send discord message via url get req
app.get("/msgDiscord/:channelID/:message", (req, res) => {
	client.channels.get(req.params.channel).send(req.params.message);
	res.redirect("/");
});

// append value to gsheet via url get req
app.get("/addToSheet/:string/:col", (req, res) => {
    appendValue(SHEETID, req.params.string, req.params.col);
    res.redirect("/");	
});

// setup localtunnel
(async () => {
	const url = await localtunnel({port: PORT}).url;

	await appendValue(SHEETID, url, "A");

	tunnel.on("close", () => {console.log("tunnelClosed")});

	app.listen(PORT, () => console.log("running on " + PORT + "\nwith url:   " + url));
})();

// discord bot listen
client.on("message", async message => {
    await appendValue(SHEETID, message.channel.name + " ch: ", "A");
    await appendValue(SHEETID, message.author.tag + ":   " + message.content, "A");
    await appendValue(SHEETID, "----------------------------------------------------", "A");
});


/*

*/
