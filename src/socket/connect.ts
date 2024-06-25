/** @format */

import { Server } from "socket.io";
import { socketAuth } from "../middleware/socketAuth";
import { calculate } from "../utils";
import DriverSchema from "../models/driver";
import UserSchema from "../models/user";
import TripSchema from "../models/trip";
import { clear } from "console";

const io = new Server({
	cors: {
		origin: "*",
	},
});

io.use(socketAuth);

interface Driver {
	socketId: string;
	driverId: string;
	isReady: boolean;
	isTrip: boolean;
	latitude: number;
	longitude: number;
	currentTripRoom: string;
}

interface ILocation {
	latitude: number;
	longitude: number;
}

interface SendRQ {
	pickup: ILocation;
	destination: ILocation;
	PU: string;
	DS: string;
}

let driversConnected = [] as any;

const findDriverById = async (id: string) => {
	const driver = await DriverSchema.findById(id);
	return driver;
};

const findUSerById = async (id: string) => {
	const user = await UserSchema.findById(id);
	return user;
};

io.on("connection", (socket) => {
	console.log("driver conneccted", driversConnected);

	let driver = driversConnected.find(
		(driver: Driver) => driver.driverId === socket.data.user.id
	);
	if (driver) {
		driver.socketId = socket.id;
	} else {
		if (socket.data.user.role === "driver") {
			driversConnected.push({
				socketId: socket.id,
				driverId: socket.data.user.id,
				isReady: false,
				latitude: null,
				longitude: null,
			});
		}
		driver = driversConnected.find(
			(driver: Driver) => driver.driverId === socket.data.user.id
		);
	}

	//socket with role driver

	//1. Driver send current location
	socket.on("sendCurrentLocation", (location: ILocation) => {
		//Update current location of driver when driver move
		driver.latitude = location.latitude;
		driver.longitude = location.longitude;

		//Send driver's current location to user when driver is on trip
		if (driver.currentTripRoom) {
			socket
				.to(driver.currentTripRoom) //send to trip room of user and driver
				.emit("updateDriverPosition", location); // emit driver's current location
		}
	});

	//2. Driver is ready to take trip
	socket.on("isReadyForFindTrip", () => {
		console.log(`Driver ${socket.data.user.id} is ready to find trip`);
		driver.isReady = true;
	});

	//3. Driver is not ready to take trip
	socket.on("isNotReadyForFindTrip", () => {
		console.log(`Driver ${socket.data.user.id} is not ready to find trip`);
		driver.isReady = false;
	});

	//socket with role user

	//1. User send request trip
	socket.on("sendRequestTrip", (pickup, destination, PU, DS) => {
		// Tìm tài xế gần nhất trong 10 giây
		let driverConnect: Driver;
		let minDistance = Infinity;

		//Find driver with min distance
		const searchDriver = async () => {
			driversConnected.forEach((driver: Driver) => {
				//Check driver is ready
				if (driver.isReady) {
					const distance = calculate(pickup, {
						latitude: driver.latitude,
						longitude: driver.longitude,
					});
					//Update min distance and driver connect
					if (distance < minDistance) {
						minDistance = distance;
						driverConnect = driver;
					}
				}
			});

			if (driverConnect) {
				//if driver connect is found
				const tripRoom = `trip_${socket.data.user.id}_${driverConnect.driverId}`; //create trip room
				driverConnect.currentTripRoom = tripRoom; //update current trip room of driver
				driverConnect.isTrip = true; //update driver is on trip
				socket.join(tripRoom);
				io.sockets.sockets.get(driverConnect.socketId)?.join(tripRoom);
				io.to(driverConnect.socketId).emit("newTripRequest", {
					information: {
						username: await findUSerById(socket.data.user.id),
						pickupAddress: PU,
						destinationAddress: DS,
					},
					PULocation: pickup,
					DSLocation: destination,
					tripRoom: tripRoom,
				});
				io.to(socket.id).emit(
					"requestSuccess",
					await findDriverById(driverConnect.driverId),
					{
						latitude: driverConnect.latitude,
						longitude: driverConnect.longitude,
					},
					tripRoom
				);
				clearInterval(searchInterval);
				clearTimeout(searchTimeout);
			}
		};

		const searchInterval = setInterval(searchDriver, 1000);
		const searchTimeout = setTimeout(() => {
			clearInterval(searchInterval);
			if (!driverConnect) {
				io.to(socket.id).emit("requestFail", {
					message:
						"Xin lỗi, tất cả các tài xế đều bận. Vui lòng thử lại sau.",
				});
			}
		}, 5000);
	});

	socket.on("startTrip", (tripRoom, driverLocation) => {
		socket.to(tripRoom).emit("driverArrived", {
			message: "Tài xế đã đến nơi",
			driverLocation: driverLocation,
		});
	});

	socket.on("sendMessageUser", (tripRoom) => {
		console.log(tripRoom);
		socket.to(tripRoom).emit("receiveMessage", {
			message: "Sr tài xế đang bận, vui lòng chờ",
		});
	});

	socket.on("disconnect", () => {
		console.log("disconnect to driver socket");
		if (socket.data.user.role === "driver") {
			driversConnected = driversConnected.filter(
				(driver: any) => driver.id !== socket.id
			);
		}
	});
});

export default io;

//socket.to (send to room ngoai tru socket hien tai)
