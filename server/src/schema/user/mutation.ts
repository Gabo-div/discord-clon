// Mutation resolvers
import { UserInputError } from "@utils/errors";
import { createToken } from "@utils/user";
import bcrypt from "bcrypt";
import { addUser, getUserByEmail } from "./db";

export const UserMutation = {
	registerUser: async (
		_root: any,
		args: { username: string; email: string; password: string }
	) => {
		const { username, email, password } = args;

		if (password.length < 8 || password.length > 20) {
			throw new UserInputError(
				"Password must be between 8 and 20 characters"
			);
		}

		const user = await addUser(username, email, password);

		return user;
	},

	loginUser: async (
		_root: any,
		args: { email: string; password: string }
	) => {
		const { email, password } = args;

		const user = await getUserByEmail(email).catch(() => {
			throw new UserInputError("Wrong credentials");
		});

		if (!user) {
			throw new UserInputError("Wrong credentials");
		}

		if (!bcrypt.compareSync(password, user.password)) {
			throw new UserInputError("Wrong credentials");
		}

		return {
			tokenValue: createToken(user),
		};
	},
};
