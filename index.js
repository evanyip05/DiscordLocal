const process = require("process");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path")
const app = express();

const {google} = require("googleapis");

const PORT = 2147;

// sheet id
const spreadsheetId = "15f3IR2T0ItInwfv9xe1JJmtzTq5W2YVlHSgZKbIq24Q";

async function appendValue(spreadsheetId, value, col) {

    const api = getSheetsAPI();
    const auth = getAuth();

	await api.spreadsheets.values.append({
        auth, spreadsheetId, range: "Sheet1!"+col+":"+col,
        valueInputOption: "RAW",
        resource: {
        	values: [
        	    [value,],
        	],
        }	
    });
}

async function getClient() {
	// Create client instance for auth
    return await getAuth().getClient();
}

function getSheetsAPI() {
    // Instance of Google Sheets API
    return google.sheets({ version: "v4", auth: getClient()});
}

function getAuth() {
    return new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
}

app.use(express.static("public"));
app.use(express.json({limit: "1mb"}));

app.get("/", (req, res) => {
    res.sendFile(path.resolve("public", "display.html")+ "");	
});

app.post("/addToSheet", (req, res) => {
    console.log(req.body.inputInfo);
    appendValue(spreadsheetId, req.body.inputInfo, "A");
});


app.listen(PORT, () => console.log("running on " + PORT));

/*
// send vals to spreadsheet
        await appendValues(googleSheets, auth, spreadsheetId, message, "A",);
async function init() {
     // auth from args
    const auth = new google.auth.GoogleAuth({
        keyFile: args[2],
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });
}

app.get("/GOTO/:route", (req, res) => {
    console.log(req.params.route);
	res.redirect("/");
});

app.get("/OPEN/:html", (req, res) => {
	res.sendFile(path.resolve("public", req.params.html));
});

app.get("/SEND/:message", (req, res) => {
    console.log("sent");
    res.sendFile(path.resolve("public", "sent.html")+ "");	
});

// note: {valueName: "value", v2: "val2"} = json obj
app.get("/GET/:range", (req, res) => {
	res.status(200).json({info: "serverSideStuff"});
});

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

*/
