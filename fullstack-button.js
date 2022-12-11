// fullstack-button
// "a fullstack app in <40 LOC"

import mongoose from "mongoose";
import express from "express";

// CONNECT TO DB
mongoose.connect("mongodb://localhost:27017");
mongoose.connection.on("error", (err) => {
  console.log(err);
});
mongoose.connection.on("connected", (data) => {
  console.log("connected to mongo");
});

// DEFINE MODEL
// schema - describes what table / ("collection" in mongo) looks like
const lightswitchSchema = new mongoose.Schema({
  powered: Boolean,
});
// model - magic object that helps you do stuff that database collection
const LightSwitch = mongoose.model("lightswitch", lightswitchSchema);

// API that sends a UI , and receives lightswitch signal
const app = express();
app.get("/", async (req, res) => {
  const doc = await LightSwitch.findById("63960c8779943f690afb6c72");
  res.send(`
    <html>
        light is ${doc.powered}
        <form action="/switch" method="post">
            <button type="submit">turn ${doc.powered ? "off" : "on"}</button>
        </form>
    </html>
    `);
});

app.post("/switch", async (req, res) => {
  await LightSwitch.updateOne({ _id: "63960c8779943f690afb6c72" }, [
    { $set: { powered: { $eq: [false, "$powered"] } } },
  ]);
  res.status(200).redirect("/");
});

app.listen("9090", () =>
  console.log("lightswitch-home-manager running on 9090")
);
