"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const _1 = __importDefault(require("."));
const User_entity_1 = require("./User.entity");
let Authtoken = class Authtoken extends _1.default {
    user;
    refreshToken;
};
__decorate([
    (0, typeorm_1.OneToOne)(() => User_entity_1.User),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_entity_1.User)
], Authtoken.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Authtoken.prototype, "refreshToken", void 0);
Authtoken = __decorate([
    (0, typeorm_1.Entity)("authtoken")
], Authtoken);
exports.default = Authtoken;
//# sourceMappingURL=Authtoken.entity.js.map