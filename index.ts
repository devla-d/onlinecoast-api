import App from "./src/app";
import { AppDataSource } from "./src/config/db.config";

AppDataSource.initialize()
  .then(() => {
    App.listen();
  })
  .catch((error) => console.log(error));
