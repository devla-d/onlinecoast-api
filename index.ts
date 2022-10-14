import App from "./src/app";
import { AppDataSource } from "./src/config/db.config";

AppDataSource.initialize()
  .then(() => {
    App.listen(3007, () => {
      // logger.debug("listening to port 3007");
    });
  })
  .catch((error) => console.log(error));
