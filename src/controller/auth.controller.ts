/** @format */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import UserSchema from "../models/user";
import DriverSchema from "../models/driver";


const AuthController = {
	async userSignin(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const user = await UserSchema.findByEmail(email);
			if (!user) {
				return res.status(400).json({ message: "Không tìm thấy tài khoản, vui lòng kiểm tra lại" });
			}
			else {
				const validPassword = await bcrypt.compare(password, user.password);
				if (!validPassword) {
					return res
						.status(400)
						.json({ message: "Mật khẩu của bạn không đúng, xin thử lại" });
				}
				else {
					const accessToken = AuthController.accessToken(user, "user");
					const { password, ...rest } = user.toObject();
					const message = "login success";
					return res.status(200).json({ ...rest, accessToken, message });
				}
			}
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	},

	async UserSignup(req: Request, res: Response) {
		try {
			const { username, email, password, gender, image, phoneNumber } = req.body;
			const user = await UserSchema.findByEmail(email);
			if (user) {
				return res
					.status(409)
					.json({ message: "Email đã tồn tại, vui lòng thử lại Email khác" });
				return;
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const newUser = await UserSchema.create({
				username,
				email,
				password: hashedPassword,
				phoneNumber,
				gender,
				image
			});
			const { password: string, ...rest } = newUser.toObject();
			const message = "Đăng ký tài khoản thành công";
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
				return res.status(400).json({ message: "Không tìm thấy tài khoản, vui lòng kiểm tra lại!" });
			}
			const validPassword = await bcrypt.compare(password, driver.password);
			if (!validPassword) {
				return res
					.status(400)
					.json({ message: "Mật khẩu của bạn không đúng, xin thử lại!" });
			}
			if (validPassword) {
				if(driver.status === 'pending'){
					return res.status(400).json({message: "Tài khoản của bạn đang chờ admin phê duyệt, vui lòng chờ thêm nhé!"})
				}
				if(driver.status === 'block'){
					return res.status(400).json({message: "Tài khoản của bạn đã bị khóa, vui lòng liên hệ admin để biết thêm chi tiết!"})
				}
				const accessToken = AuthController.accessToken(driver, "driver");
				const { password, ...rest } = driver.toObject();
				const message = "login success";
				return res.status(200).json({ ...rest, accessToken, message });
			}
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	},

	async driverSignup(req: Request, res: Response) {
		try {
			const { username, email, password, telephone, gender, vehicle, brand, seat, typeofVehicle, license, image } = req.body;
			const driver = await DriverSchema.findByEmail(email);
			if (driver) {
				return res
					.status(400)
					.json({ message: "Email đã tồn tại, vui lòng thử lại Email khác" });
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			const convertVehicle = vehicle === "Ô tô" ? "Car" : "Bike";
			const newDriver = await DriverSchema.create({
				username,
				email,
				password: hashedPassword,
				telephone,
				gender,
				vehicle: convertVehicle,
				brand,
				seat,
				typeofVehicle,
				license,
				image
			});
			const message = "Đã gửi yêu cầu đăng ký tài khoản, bạn vui lòng chờ admin phê duyệt nhé";
			return res.status(200).json({ message });
		} catch (err) {
			res.status(500).json({ message: err });
		}
	},

	async adminSignin(req: Request, res: Response) {
		try {
			const { account, password } = req.body;
			if (account === "admin" && password ===  "123456"){
				const accessToken = jwt.sign({ id: "admin", role: "admin" }, process.env.ACCESS_TOKEN_SECRET!, {
					expiresIn: "1d",
				});
				return res.status(200).json({ accessToken });
			}
		} catch (err) {
			return res.status(500).json({ message: err });
		}
	},

	async isLoginAdmin(req: Request, res: Response) {
		return res.status(200).json({ message: "Admin is login", isLogin: true});
	},

	accessToken(user: Document, role: string) {
		return jwt.sign({ id: user._id, role: role}, process.env.ACCESS_TOKEN_SECRET!, {
			expiresIn: "1d",
		});
	},
};

export default AuthController;
