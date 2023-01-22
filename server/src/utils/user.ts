import { IDBUser } from "@models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createDiscriminator = (index: number): string | null => {
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

export const cryptPassword = async (password: string): Promise<string> => {
	const salts = parseInt(process.env.SALTS as string);

	const generatedSalt = await bcrypt.genSalt(salts);
	const passwordHash = await bcrypt.hash(password, generatedSalt);

	return passwordHash;
};

export const createToken = (user: IDBUser) => {
	return jwt.sign(
		{
			username: user.username,
			discriminator: user.username,
			_id: user._id,
		},
		process.env.TOKEN_SECRET as string
	);
};

export const verifyToken = async (token: string) => {
	return jwt.verify(token, process.env.TOKEN_SECRET as string);
};
