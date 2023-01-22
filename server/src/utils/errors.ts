import { GraphQLError, GraphQLErrorExtensions } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";

enum ErrorCode {
	"UNAUTHENTICATED",
	"FORBIDDEN",
	"NOT_FOUND",
}

export class SyntaxError extends GraphQLError {
	extensions: GraphQLErrorExtensions;
	constructor(
		message: string,
		extensions?: GraphQLErrorExtensions | undefined
	) {
		super(message);

		this.extensions = {
			...extensions,
			code: ApolloServerErrorCode.GRAPHQL_PARSE_FAILED,
		};
	}
}

export class ValidationError extends GraphQLError {
	extensions: GraphQLErrorExtensions;
	constructor(
		message: string,
		extensions?: GraphQLErrorExtensions | undefined
	) {
		super(message);
		this.extensions = {
			...extensions,
			code: ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED,
		};
	}
}

export class UserInputError extends GraphQLError {
	extensions: GraphQLErrorExtensions;
	constructor(
		message: string,
		extensions?: GraphQLErrorExtensions | undefined
	) {
		super(message);
		this.extensions = {
			...extensions,
			code: ApolloServerErrorCode.BAD_USER_INPUT,
		};
	}
}

export class BadRequestError extends GraphQLError {
	extensions: GraphQLErrorExtensions;
	constructor(
		message: string,
		extensions?: GraphQLErrorExtensions | undefined
	) {
		super(message);
		this.extensions = {
			...extensions,
			code: ApolloServerErrorCode.BAD_REQUEST,
		};
	}
}

export class AuthenticationError extends GraphQLError {
	extensions: GraphQLErrorExtensions;
	constructor(
		message: string,
		extensions?: GraphQLErrorExtensions | undefined
	) {
		super(message);
		this.extensions = {
			...extensions,
			code: ErrorCode.UNAUTHENTICATED,
		};
	}
}

export class ForbiddenError extends GraphQLError {
	extensions: GraphQLErrorExtensions;
	constructor(
		message: string,
		extensions?: GraphQLErrorExtensions | undefined
	) {
		super(message);
		this.extensions = {
			...extensions,
			code: ErrorCode.FORBIDDEN,
		};
	}
}

export class NotFoundError extends GraphQLError {
	extensions: GraphQLErrorExtensions;
	constructor(
		message: string,
		extensions?: GraphQLErrorExtensions | undefined
	) {
		super(message);
		this.extensions = {
			...extensions,
			code: ErrorCode.NOT_FOUND,
		};
	}
}

export class PersistedQueryNotFoundError extends GraphQLError {
	extensions: GraphQLErrorExtensions;
	constructor(
		message: string,
		extensions?: GraphQLErrorExtensions | undefined
	) {
		super(message);
		this.extensions = {
			...extensions,
			code: ApolloServerErrorCode.PERSISTED_QUERY_NOT_FOUND,
		};
	}
}

export class PersistedQueryNotSupportedErrorr extends GraphQLError {
	extensions: GraphQLErrorExtensions;
	constructor(
		message: string,
		extensions?: GraphQLErrorExtensions | undefined
	) {
		super(message);
		this.extensions = {
			...extensions,
			code: ApolloServerErrorCode.PERSISTED_QUERY_NOT_SUPPORTED,
		};
	}
}

export class InternalServerError extends GraphQLError {
	extensions: GraphQLErrorExtensions;
	constructor(
		message: string,
		extensions?: GraphQLErrorExtensions | undefined
	) {
		super(message);

		this.extensions = {
			...extensions,
			code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
		};
	}
}
