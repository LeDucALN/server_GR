/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
const UserSchema = require("../models/user");


const AuthController = {
	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const user = await UserSchema.findByEmail(email);
			if (!user) {
				setTimeout(() => {
					return res.status(400).json({ message: "User not found" });
				}, 3000);
				return;
			}
			const validPassword = await bcrypt.compare(password, user.password);
			if (!validPassword) {
				setTimeout(() => {
					return res
						.status(400)
						.json({ message: "Invalid password" });
				}, 3000);
				return;
			}
			if (user && validPassword) {
				const accessToken = AuthController.accessToken(user);
				const { password, ...rest } = user.toObject();
				const message = "login success";
				setTimeout(() => {
					return res.status(200).json({ rest, accessToken, message });
				}, 3000);
			}
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	},

	async signup(req: Request, res: Response) {
		try {
			const { username, email, password } = req.body;
			// const user = await UserSchema.findByEmail(email);
			const user = await UserSchema.findByEmail(email);
			if (user) {
				setTimeout(() => {
					return res
						.status(409)
						.json({ message: "Email already exists" });
				}, 3000);
				return;
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const newUser = await UserSchema.create({
				username: username,
				email: email,
				password: hashedPassword,
			});
			//get all users except yourself
			// const users = await UserSchema.find({
			// 	_id: { $ne: newUser._id },
			// });
			// await FollowModel.create({
			// 	owner: newUser._id,
			// 	following: [],
			// 	unfollowing: users.map((user) => user._id),
			// });
			const { password: string, ...rest } = newUser.toObject();
			const message = "register success";
			setTimeout(() => {
				return res.status(200).json({ rest, message });
			}, 3000);
		} catch (err) {
			console.log(err);
			res.status(500).json({ message: err });
		}
	},

	accessToken(user: Document) {
		return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
			expiresIn: "1d",
		});
	},

};

export default AuthController;
