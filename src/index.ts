import App from "./app";
import { AppDataSource } from "./config/db.config";

AppDataSource.initialize()
  .then(() => {
    console.log(
      "Here you can setup and run express / fastify / any other framework."
    );
    App.listen(3030, () => {
      console.log("Listening to port 3030");
    });
  })
  .catch((error) => console.log(error));
