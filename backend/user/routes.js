import { Router } from "express";
import multer from "multer";
import User from "./UserModel.js";
import { authenticateToken, generateAccessToken } from "./authToken.js";

export const userRouter = Router();

const multerMiddleware = multer();

const hoursInMillisec = (hours) => {
  return 1000 * 60 * 60 * hours;
};

userRouter.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

userRouter.post("/signup", multerMiddleware.none(), async (req, res) => {
  // Neuen User erstellen
  const { name, email, lastname } = req.body;
  const newUser = new User({ name, lastname, email });
  // user.setPassword (hash und salt setzen)
  newUser.setPassword(req.body.password);
  // user speichern
  try {
    await newUser.save();
    return res.send({
      data: {
        message: "New user created",
        user: { name, lastname, email },
      },
    });
  } catch (e) {
    console.log(e);
    if (e.name === "ValidationError") {
      return res.status(400).send({ error: e });
    }

    // Duplication Error email existiert bereits als user
    if (e.name === "MongoServerError" && e.code === 11000) {
      console.log("Account exists already");
      return res.status(400).send({
        error: { message: "Username and Password combination not valid" },
      });
    }

    return res.status(500).send({ error: { message: "Unknown Server error" } });
  }
});

userRouter.post("/login", multerMiddleware.none(), async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  const user = await User.findOne({ email }).select("+hash").select("+salt");
  // dieses password würde den gleichen hash produzieren
  // (wie der in der Datenbank)
  const passwordIsValid = user.verifyPassword(password);
  if (passwordIsValid) {
    const token = generateAccessToken({ email });
    console.log(token);

    res.cookie("auth", token, { httpOnly: true, maxAge: hoursInMillisec(4) });

    res.send({ message: "Success", data: user });
  } else {
    res.status(404).send({
      message: "Failed to login",
      error: {
        message: "Password and E-Mail combination is wrong.",
      },
    });
  }
});

userRouter.get("/logout", (req, res) => {
  res.clearCookie("auth");
  res.send("OK");
});

userRouter.get("/secure", authenticateToken, async (req, res) => {
  console.log(req.userEmail);
  res.send({ email: req.userEmail });
});

userRouter.put("/addexercise", authenticateToken, async (req, res) => {
  console.log(req.body);
  try {
    const { _id } = req.body;
    const { exercise_id } = req.body;
    const user = await User.findOne({ _id });
    if (user.videos.includes(exercise_id)) {
      return res.send("Video ist bereits vorhanden");
    }
    user.videos.push(exercise_id);
    await user.save();
    res.send("Video hinzugefügt");
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("There was an error.");
  }
});

userRouter.put("/deleteexercise", authenticateToken, async (req, res) => {
  console.log(req.body);
  try {
    const { _id } = req.body;
    const { exercise_id } = req.body;
    const user = await User.findOne({ _id });
    if (user.videos.some((item) => item.equals(exercise_id))) {
      user.videos = user.videos.filter((item) => !item.equals(exercise_id));
      await user.save();
      return res.send("Video ist aus der Favoritenliste gelöscht");
    } else {
      res.send("Video ist nicht in der Favoritenliste");
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("There was an error.");
  }
});

userRouter.put("/updatereminder", authenticateToken, async (req, res) => {
  console.log(req.body);
  try {
    const { _id, reminderdays, remindertime } = req.body;
    const user = await User.findByIdAndUpdate(
      _id,
      { reminderdays, remindertime },
      { new: true }
    );
    if (user) {
      return res.send("Reminderinformationen erfolgreich upgedated");
    } else {
      res.status(404).send("User nicht gefunden");
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("There was an error.");
  }
});
