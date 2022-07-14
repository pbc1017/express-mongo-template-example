import mongoose from "mongoose"
import { userSchema } from "./methods"
import { logger } from "../utils/logger"
import fs from "fs"
import path from "path"

const certificatePath = path.join("../", process.env.CERTIFICATE_FILENAME)
const certificateCA = process.env.CERTIFICATE_FILENAME && [fs.readFileSync(certificatePath)]

const sslOptions = certificateCA
	? {
			ssl: true,
			tlsAllowInvalidHostnames: true,
			sslCA: certificateCA,
			user: process.env.MONGODB_USER,
			pass: process.env.MONGODB_PASSWORD,
	  }
	: {}

const otherOptions = {
	useNewUrlParser: true,
	autoIndex: process.env.NODE_ENV !== "production",
	useFindAndModify: false,
	useCreateIndex: true,
}

const options = {
	...sslOptions,
	...otherOptions,
}

mongoose.connect(process.env.MONGODB_CONNECTION_URL, options)

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
	const boldBlue = (text) => `\u001b[1m\u001b[34m${text}\u001b[39m\u001b[22m`
	logger.info(`${boldBlue(`Mongo db successfully connected!!`)}`)
})

export const User = mongoose.model("User", userSchema)
