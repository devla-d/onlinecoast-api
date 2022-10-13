import App from "./src/app";
import { AppDataSource } from "./src/config/db.config";

AppDataSource.initialize()
  .then(() => {
    // console.log(
    //   "Here you can setup and run express / fastify / any other framework."
    // );
    App.listen();
  })
  .catch((error) => console.log(error));
