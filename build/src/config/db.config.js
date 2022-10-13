"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const typeorm_1 = require("typeorm");
const User_entity_1 = require("../entity/User.entity");
const Authtoken_entity_1 = __importDefault(require("../entity/Authtoken.entity"));
const Transaction_entity_1 = __importDefault(require("../entity/Transaction.entity"));
const Cards_entity_1 = __importDefault(require("../entity/Cards.entity"));
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: DB_HOST,
    port: 3306,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User_entity_1.User, Authtoken_entity_1.default, Transaction_entity_1.default, Cards_entity_1.default],
});
//# sourceMappingURL=db.config.js.map