import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
(async () => {
  mongoose.connect(process.env.MONGO_URL);
  const lightswitchSchema = new mongoose.Schema({
    powered: { type: Boolean, default: false },
  });
  const LightSwitch = mongoose.model("lightswitch", lightswitchSchema);
  let lightSwitchID = null;
  let lightSwitch = await LightSwitch.findOne({});
  if (!lightSwitch) {
    const newLightSwitch = await LightSwitch.create({});
    lightSwitchID = newLightSwitch._id;
  } else {
    lightSwitchID = lightSwitch._id;
  }
  const app = express();
  app.get("/", async (req, res) => {
    const doc = await LightSwitch.findById(lightSwitchID);
    res.send(`<body style="margin:0; padding: 0;">
        <div style="display:flex; flex-direction:column;justify-content:center; align-items:center; height:100vh; font-size:2em;background:${
          doc.powered ? "white" : "black"
        } ">light is ${doc.powered ? "on" : "off"}
        <form action="/switch" method="post">
            <button type="submit">turn ${doc.powered ? "off" : "on"}</button>
            </form>
            <p>This is a fullstack app in under 40 LoC <a href="https://predavladc.github.io/portfolio/">Portfolio</a> <a href="https://github.com/predavladc/fullstack-button">Source Code</a></p></div></body>`);
  });
  app.post("/switch", async (req, res) => {
    await LightSwitch.updateOne({ _id: lightSwitchID }, [
      { $set: { powered: { $eq: [false, "$powered"] } } },
    ]);
    res.status(200).redirect("/");
  });
  app.listen(process.env.PORT, () =>
    console.log("lightswitch-home-manager running on 9090")
  );
})(); // IIFE
