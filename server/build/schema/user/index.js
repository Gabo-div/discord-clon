"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolvers = exports.UserMutation = exports.UserQuery = exports.UserTypes = exports.UserModel = void 0;
// Combine al the query, mutations, resolvers and type
var db_1 = require("./db");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return db_1.UserModel; } });
var types_1 = require("./types");
Object.defineProperty(exports, "UserTypes", { enumerable: true, get: function () { return types_1.UserTypes; } });
var query_1 = require("./query");
Object.defineProperty(exports, "UserQuery", { enumerable: true, get: function () { return query_1.UserQuery; } });
var mutation_1 = require("./mutation");
Object.defineProperty(exports, "UserMutation", { enumerable: true, get: function () { return mutation_1.UserMutation; } });
var resolvers_1 = require("./resolvers");
Object.defineProperty(exports, "UserResolvers", { enumerable: true, get: function () { return resolvers_1.UserResolvers; } });
