/** @format */

const jwt = require("jsonwebtoken");

const socketAuth = (socket: any, next: any) => {
	const token = socket.handshake.headers.authorization;
	if (token) {
		jwt.verify(
			token,
			process.env.ACCESS_TOKEN_SECRET,
			(err: any, decoded: any) => {
				if (err) return next(new Error("Authentication error"));
				socket.data.user = decoded;
				next();
			}
		);
	} else {
		next(new Error("Authentication error"));
	}
};

export { socketAuth };
