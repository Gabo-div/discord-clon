"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
(0, mongoose_1.connect)(process.env.MONGODB_URI)
    .then(() => {
    console.log("Connected to database");
})
    .catch((error) => {
    console.log("Database connection error: ", error);
});
