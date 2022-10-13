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
exports.STATUS = void 0;
const typeorm_1 = require("typeorm");
const _1 = __importDefault(require("."));
const User_entity_1 = require("./User.entity");
var STATUS;
(function (STATUS) {
    STATUS["PENDING"] = "PENDING";
    STATUS["SUCCESS"] = "SUCCESS";
    STATUS["DECLINED"] = "DECLINED";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
let Transaction = class Transaction extends _1.default {
    user;
    mode;
    reciever_id;
    invoiceRef;
    amount;
    benneficiary_name;
    benneficiary_accnumber;
    bic_code;
    bank_name;
    purpose;
    firstname;
    lastname;
    phone;
    email;
    city;
    country;
    status;
};
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.transactions),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_entity_1.User)
], Transaction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "mode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "reciever_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "invoiceRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "numeric" }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "benneficiary_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "benneficiary_accnumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "bic_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "bank_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "firstname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "lastname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: STATUS, default: STATUS.PENDING }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
Transaction = __decorate([
    (0, typeorm_1.Entity)("transaction")
], Transaction);
exports.default = Transaction;
//# sourceMappingURL=Transaction.entity.js.map