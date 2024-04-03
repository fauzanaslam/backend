import express, { Request, Response } from "express";
import "dotenv/config";
import router from "./routes/Routes";
import cors from "cors";
import FileUpload from "express-fileupload";

const app = express();
app.use(cors());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(router);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send({ response: "flashsoft indonesia" });
});

app.listen(process.env.APP_PORT, () => {
  console.log(
    `${process.env.APP_NAME} running at port ${process.env.APP_PORT}`
  );
});
