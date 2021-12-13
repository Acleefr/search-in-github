import express from "express";
import routes from "./routes";

export function launch(port) {
  const application = express();

  application.use("/", routes);

  application.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  });
}
