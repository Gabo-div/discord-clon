import { connect } from "mongoose";

connect(process.env.MONGODB_URI as string)
	.then(() => {
		console.log("Connected to database");
	})
	.catch((error) => {
		console.log("Database connection error: ", error);
	});
