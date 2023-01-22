"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.PersistedQueryNotSupportedErrorr = exports.PersistedQueryNotFoundError = exports.NotFoundError = exports.ForbiddenError = exports.AuthenticationError = exports.BadRequestError = exports.UserInputError = exports.ValidationError = exports.SyntaxError = void 0;
const graphql_1 = require("graphql");
const errors_1 = require("@apollo/server/errors");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["UNAUTHENTICATED"] = 0] = "UNAUTHENTICATED";
    ErrorCode[ErrorCode["FORBIDDEN"] = 1] = "FORBIDDEN";
    ErrorCode[ErrorCode["NOT_FOUND"] = 2] = "NOT_FOUND";
})(ErrorCode || (ErrorCode = {}));
class SyntaxError extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message);
        this.extensions = Object.assign(Object.assign({}, extensions), { code: errors_1.ApolloServerErrorCode.GRAPHQL_PARSE_FAILED });
    }
}
exports.SyntaxError = SyntaxError;
class ValidationError extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message);
        this.extensions = Object.assign(Object.assign({}, extensions), { code: errors_1.ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED });
    }
}
exports.ValidationError = ValidationError;
class UserInputError extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message);
        this.extensions = Object.assign(Object.assign({}, extensions), { code: errors_1.ApolloServerErrorCode.BAD_USER_INPUT });
    }
}
exports.UserInputError = UserInputError;
class BadRequestError extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message);
        this.extensions = Object.assign(Object.assign({}, extensions), { code: errors_1.ApolloServerErrorCode.BAD_REQUEST });
    }
}
exports.BadRequestError = BadRequestError;
class AuthenticationError extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message);
        this.extensions = Object.assign(Object.assign({}, extensions), { code: ErrorCode.UNAUTHENTICATED });
    }
}
exports.AuthenticationError = AuthenticationError;
class ForbiddenError extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message);
        this.extensions = Object.assign(Object.assign({}, extensions), { code: ErrorCode.FORBIDDEN });
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message);
        this.extensions = Object.assign(Object.assign({}, extensions), { code: ErrorCode.NOT_FOUND });
    }
}
exports.NotFoundError = NotFoundError;
class PersistedQueryNotFoundError extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message);
        this.extensions = Object.assign(Object.assign({}, extensions), { code: errors_1.ApolloServerErrorCode.PERSISTED_QUERY_NOT_FOUND });
    }
}
exports.PersistedQueryNotFoundError = PersistedQueryNotFoundError;
class PersistedQueryNotSupportedErrorr extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message);
        this.extensions = Object.assign(Object.assign({}, extensions), { code: errors_1.ApolloServerErrorCode.PERSISTED_QUERY_NOT_SUPPORTED });
    }
}
exports.PersistedQueryNotSupportedErrorr = PersistedQueryNotSupportedErrorr;
class InternalServerError extends graphql_1.GraphQLError {
    constructor(message, extensions) {
        super(message);
        this.extensions = Object.assign(Object.assign({}, extensions), { code: errors_1.ApolloServerErrorCode.INTERNAL_SERVER_ERROR });
    }
}
exports.InternalServerError = InternalServerError;
