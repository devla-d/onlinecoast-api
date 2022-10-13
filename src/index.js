"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_config_1 = require("./config/db.config");
db_config_1.AppDataSource.initialize()
  .then(() => {
    // console.log("Here you can setup and run express / fastify / any other framework.");
    app_1.default.listen(3030, () => {
      console.log("Listening to port 3030");
    });
  })
  .catch((error) => console.log(error));
//# sourceMappingURL=index.js.map
