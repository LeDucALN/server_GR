/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import GuestSchema from "../models/guest";
import DriverSchema from "../models/driver";


const AuthController = {
	async guestSignin(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const guest = await GuestSchema.findByEmail(email);
			if (!guest) {
				return res.status(400).json({ message: "User not found" });
			}
			else {
				const validPassword = await bcrypt.compare(password, guest.password);
				if (!validPassword) {
					return res
						.status(400)
						.json({ message: "Invalid password" });
				}
				else {
					const accessToken = AuthController.accessToken(guest, "guest");
					const { password, ...rest } = guest.toObject();
					const message = "login success";
					return res.status(200).json({ ...rest, accessToken, message });
				}
			}
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	},

	async guestSignup(req: Request, res: Response) {
		try {
			const { username, email, password } = req.body;
			const user = await GuestSchema.findByEmail(email);
			if (user) {
				return res
					.status(409)
					.json({ message: "Email already exists" });
				return;
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const newGuest = await GuestSchema.create({
				username: username,
				email: email,
				password: hashedPassword,
			});
			const { password: string, ...rest } = newGuest.toObject();
			const message = "Signup success";
			return res.status(200).json({ rest, message });
		} catch (err) {
			res.status(500).json({ message: err });
		}
	},

	async driverSignin(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const driver = await DriverSchema.findByEmail(email);
			if (!driver) {
				return res.status(400).json({ message: "User not found" });
			}
			const validPassword = await bcrypt.compare(password, driver.password);
			if (!validPassword) {
				return res
					.status(400)
					.json({ message: "Invalid password" });
			}
			if (driver && validPassword) {
				const accessToken = AuthController.accessToken(driver, "driver");
				const { password, ...rest } = driver.toObject();
				const message = "login success";
				return res.status(200).json({ rest, accessToken, message });
			}
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	},

	async driverSignup(req: Request, res: Response) {
		try {
			const { username, email, password } = req.body;
			const driver = await DriverSchema.findByEmail(email);
			if (driver) {
				return res
					.status(409)
					.json({ message: "Email already exists" });
				return;
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const newDriver = await DriverSchema.create({
				username: username,
				email: email,
				password: hashedPassword,
			});
			const { password: string, ...rest } = newDriver.toObject();
			const message = "Signup success";
			return res.status(200).json({ rest, message });
		} catch (err) {
			res.status(500).json({ message: err });
		}
	},

	accessToken(user: Document, role: string) {
		return jwt.sign({ id: user._id, role: role}, process.env.ACCESS_TOKEN_SECRET!, {
			expiresIn: "1d",
		});
	},
};

export default AuthController;
