import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";

const PORT = 8080;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "very_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get("/", (req, res) => {
  if (req.session?.isLoggedIn) {
    res.sendFile(__dirname + "/views/logged_in.html");
  } else {
    res.sendFile(__dirname + "/views/login.html");
  }
});

app.get("/error", (_req, res) => {
  res.sendFile(__dirname + "/views/error.html");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // The password is password
  const isPswCorrect = await bcrypt.compare(
    password,
    "$2b$04$bz2pGNyZ6dKxev4E5eUwU.SQyUBL1sdBqrM/Fen3RV2OjE76wYb5i"
  );
  if (username === "mutti" && isPswCorrect) {
    req.session.isLoggedIn = true;
    res.redirect("/");
  } else {
    res.redirect("/error");
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(`Error while destroying session: ${err}`);
      return res.status(500).send("Internal Server Error");
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
