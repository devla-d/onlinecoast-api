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
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const error_handler_middleware_1 = __importDefault(require("./middlewares/error-handler.middleware"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const App = http.createServer(app);
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:3000"],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use((0, morgan_1.default)("tiny"));
app.use((0, express_fileupload_1.default)());
const APPKEY = process.env.APPKEY;
app.use(function (req, res, next) {
    const appkey = req.headers["x-app-key"];
    const origin = req.headers["origin"];
    if ((appkey && appkey === APPKEY) || origin === "http://localhost:5173") {
        return next();
    }
    return res.sendStatus(403);
});
// Router
app.use(auth_routes_1.default);
app.use(user_routes_1.default);
app.use("/admin", admin_routes_1.default);
app.use(function (req, res, next) {
    res.status(404).json({ url: req.originalUrl + " not found" });
    next();
});
app.use(error_handler_middleware_1.default);
exports.default = App;
//# sourceMappingURL=app.js.map