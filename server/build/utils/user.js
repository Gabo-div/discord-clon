"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = exports.cryptPassword = exports.createDiscriminator = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createDiscriminator = (index) => {
    const discriminatorLenght = 4;
    const maxIndex = 9999;
    const indexString = index.toString();
    if (indexString.length > discriminatorLenght || index > maxIndex) {
        return null;
    }
    const missingDigits = discriminatorLenght - indexString.length;
    if (missingDigits === 0) {
        return indexString;
    }
    let discriminator = "";
    for (let i = 0; i < missingDigits; i++) {
        discriminator += "0";
    }
    return discriminator + indexString;
};
exports.createDiscriminator = createDiscriminator;
const cryptPassword = async (password) => {
    const salts = parseInt(process.env.SALTS);
    const generatedSalt = await bcrypt_1.default.genSalt(salts);
    const passwordHash = await bcrypt_1.default.hash(password, generatedSalt);
    return passwordHash;
};
exports.cryptPassword = cryptPassword;
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({
        username: user.username,
        discriminator: user.username,
        _id: user._id,
    }, process.env.TOKEN_SECRET);
};
exports.createToken = createToken;
const verifyToken = async (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
};
exports.verifyToken = verifyToken;
