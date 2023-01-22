// Database scheme and helper functions
import { Schema, model } from "mongoose";
import { IDBUser } from "@models/User";
import uniqueValidator from "mongoose-unique-validator";
import isEmail from "validator/lib/isEmail";
import { createDiscriminator, cryptPassword, verifyToken } from "@utils/user";
import { InternalServerError, UserInputError } from "@utils/errors";

const UserSchema = new Schema<IDBUser>({
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		minlength: 2,
		maxlength: 32,
		required: true,
	},
	discriminator: {
		type: String,
		length: 4,
		required: true,
	},
	email: {
		type: String,
		lowercase: true,
		required: true,
		unique: true,
		validate: [isEmail, "Email address is invalid"],
	},
	avatar: {
		type: String,
		required: false,
	},
	verified: {
		type: Boolean,
		default: false,
	},
});

UserSchema.plugin(uniqueValidator);

export const UserModel = model<IDBUser>("User", UserSchema);

export const getUserById = async (id: string) => {
	return await UserModel.findOne({ _id: id });
};

export const getUserByEmail = async (email: string) => {
	return await UserModel.findOne({ email });
};

export const getUserByToken = async (
	token: string
): Promise<IDBUser | null> => {
	try {
		const dToken = await verifyToken(token);

		if (typeof dToken === "string" || !dToken?._id) return null;

		const user = await getUserById(dToken._id);

		if (!user) return null;

		return user;
	} catch (error) {
		return null;
	}
};

export const addUser = async (
	username: string,
	email: string,
	password: string
) => {
	const hashedPassword = await cryptPassword(password).catch((error) => {
		throw new InternalServerError(
			"An error has ocurred with your password"
		);
	});

	const usersWithSameUsername = await UserModel.find({ username });

	const discriminator = createDiscriminator(usersWithSameUsername.length);

	if (!discriminator) {
		throw new UserInputError("Too many users with this username");
	}

	const newUser = new UserModel({
		username,
		email,
		password: hashedPassword,
		discriminator,
	});

	return await newUser.save().catch((error) => {
		throw new UserInputError(error.message);
	});
};
