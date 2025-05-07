import express, { RequestHandler } from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

const homeHandler: RequestHandler = (req, res) => {
  res.send("API running");
};
app.get("/", homeHandler);
const port = 8080;
app.listen(port, () => console.log(`Server on http://localhost:${port}`));
