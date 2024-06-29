/** @format */

import { Server } from "socket.io";
import { socketAuth } from "../middleware/socketAuth";
import { calculate } from "../utils";
import DriverSchema from "../models/driver";
import UserSchema from "../models/user";
import TripSchema from "../models/trip";


const io = new Server({
	cors: {
		origin: "*",
	},
});

function convertCurrencyToNumber(currencyStr:string) {
	// Loại bỏ ký tự "đ" và các dấu phẩy
	const numberStr = currencyStr.replace(/[đ,]/g, '');
  
	// Chuyển đổi chuỗi còn lại thành số
	const number = parseInt(numberStr, 10);
  
	return number;
}

io.use(socketAuth);

interface Driver {
	socketId: string;
	driverId: string;
	isFindTrip: boolean;
	vehicle: string;
	seat: number;
	isTrip: boolean;
	location: ILocation;
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

const findUserById = async (id: string) => {
	const user = await UserSchema.findById(id);
	return user;
};

io.on("connection", async (socket) => {
	console.log("driver connected", driversConnected);

	

	let driver: any;
	if (socket.data.user.role === "driver") {
		const driverDB = await DriverSchema.findById(socket.data.user.id);
		//Neu driverDB dang khong co chuyen di nao
		if (!driverDB.isTrip) {
			driver = {
				socketId: socket.id,
				driverId: socket.data.user.id,
				location: driverDB.location,		//vi tri cua driver se la vi tri truoc do cua driver
				isTrip: false,
				isFindTrip: false,
				vehicle: driverDB.vehicle,
				seat: driverDB.seat,
			};
		}

		//Neu driver dang trong chuyen di
		if (driverDB.isTrip) {
			const tripStatus = await TripSchema.findOne({
				driverId: driverDB._id,
				status: "pending",
			});
			driver = {
				socketId: socket.id,
				driverId: socket.data.user.id,
				isTrip: true,
				isFindTrip: false,
				location: tripStatus.driverPosition, //vi tri cua driver se la vi tri cuoi cung duoc cap nhat trong chuyen di
				vehicle: driverDB.vehicle,
				seat: driverDB.seat,
			};
		}
		driversConnected.push(driver);
	}

	if (socket.data.user.role === "user") {
		const user = await UserSchema.findById(socket.data.user.id);
		const trip = await TripSchema.findOne({
			userId: user._id,
			status: "pending",
		});
		if (trip) {
			socket.join(trip.tripRoom);
		}
	}

	//socket with role driver

	//1. Driver send current location
	socket.on("sendCurrentLocation", async (location: ILocation) => {
		driver.location = location;
		await DriverSchema.findByIdAndUpdate(driver.driverId, {
			location: location,
		});
		//Send driver's current location to user when driver is on trip
		if (driver.isTrip) {
			const trip = await TripSchema.findOne({
				driverId: socket.data.user.id,
				status: "pending",
			});
			trip.driverPosition = location;			//cap nhat vi tri cua driver trong chuyen di
			await trip.save();
			socket
				.to(trip.tripRoom) //send to trip room of user and driver
				.emit("updateDriverPosition", location); // emit driver's current location
		}
	});

	//2. Driver is ready to take trip
	socket.on("isFindingTrip", async () => {
		driver.isFindTrip = true;
		await DriverSchema.findByIdAndUpdate(driver.driverId, {
			isFindTrip: true,
		});
	});

	//3. Driver is not ready to take trip
	socket.on("isNotFindingTrip", async () => {
		driver.isFindTrip = false;
		DriverSchema.findByIdAndUpdate(driver.driverId, { isFindTrip: false });
	});

	//socket with role user
	let currentRequest: {
		searchInterval: NodeJS.Timeout | undefined;
		searchTimeout: NodeJS.Timeout | undefined;
		isCancelled: boolean;
	} = {
		searchInterval: undefined,
		searchTimeout: undefined,
		isCancelled: false,
	};

	//1. User send request trip
	socket.on(
		"sendRequest",
		(
			pickup,
			destination,
			PULocation,
			DSLocation,
			pulocation,
			dslocation,
			paymentMethod,
			traffic
		) => {
			// Tìm tài xế gần nhất trong 10 giây
			let driverConnect: Driver;
			let minDistance = Infinity;
			currentRequest.isCancelled = false; // Reset cancellation status

			//Find driver with min distance
			const searchDriver = async () => {
				if (currentRequest.isCancelled) return;

				driversConnected.forEach((driver: Driver) => {
					//Check driver is ready
					if (driver.isFindTrip && driver.vehicle === traffic.name && driver.seat === traffic.quantity) {
						const distance = calculate(pickup, driver.location);
						//Update min distance and driver connect
						if (distance < minDistance) {
							minDistance = distance;
							driverConnect = driver;
						}
					}
				});

				if (driverConnect && !currentRequest.isCancelled) {
					//if driver connect is found
					const tripRoom = `trip_${socket.data.user.id}_${driverConnect.driverId}`; //create trip room
					// driverConnect.currentTripRoom = tripRoom;
					driverConnect.isTrip = true;
					driverConnect.isFindTrip = false;
					await DriverSchema.findByIdAndUpdate(
						driverConnect.driverId,
						{
							isTrip: true,
							isFindTrip: false,
						}
					);
					socket.join(tripRoom);
					io.sockets.sockets
						.get(driverConnect.socketId)
						?.join(tripRoom);
					io.to(driverConnect.socketId).emit("newTripRequest", {
						guest: (await findUserById(socket.data.user.id)).toJSON(),
						DSLocation,
						PULocation,
						PU: pickup,
						DS: destination,
						tripRoom: tripRoom,
					});
					
					const newTrip = await TripSchema.create({
						userId: socket.data.user.id,
						driverId: driverConnect.driverId,
						driverPosition: driverConnect.location,
						PU: pickup,
						DS: destination,
						PULocation,
						DSLocation,
						pulocation: pulocation,
						dslocation: dslocation,
						paymentMethod: paymentMethod,
						status: "pending",
						isArrived: false,
						tripRoom: tripRoom,
					});

					io.to(socket.id).emit(
						"requestSuccess",
						await findDriverById(driverConnect.driverId),
						driverConnect.location,
						tripRoom,
						newTrip._id	
					);
					const user = await UserSchema.findByIdAndUpdate(
						socket.data.user.id,
						{ $push: { trips: newTrip._id } },
						{ new: true }
					);

					if (currentRequest.searchInterval) {
						clearInterval(currentRequest.searchInterval);
					}
					if (currentRequest.searchTimeout) {
						clearTimeout(currentRequest.searchTimeout);
					}
					currentRequest = {
						searchInterval: undefined,
						searchTimeout: undefined,
						isCancelled: false,
					}; // Reset current request
				}
			};

			currentRequest.searchInterval = setInterval(searchDriver, 1000);
			currentRequest.searchTimeout = setTimeout(() => {
				if (currentRequest.isCancelled) return;

				if (currentRequest.searchInterval) {
					clearInterval(currentRequest.searchInterval);
				}
				if (!driverConnect) {
					io.to(socket.id).emit("requestFail", {
						message:
							"Xin lỗi, tất cả các tài xế đều bận. Vui lòng thử lại sau.",
					});
				}
				currentRequest = {
					searchInterval: undefined,
					searchTimeout: undefined,
					isCancelled: false,
				}; // Reset current request
			}, 10000);
		}
	);

	// User cancel request trip
	socket.on("cancelRequest", () => {
		if (currentRequest.searchInterval) {
			clearInterval(currentRequest.searchInterval);
		}
		if (currentRequest.searchTimeout) {
			clearTimeout(currentRequest.searchTimeout);
		}
		currentRequest.isCancelled = true;
		currentRequest = {
			searchInterval: undefined,
			searchTimeout: undefined,
			isCancelled: true,
		}; // Reset current request
	});

	socket.on("startTrip", async (tripRoom, driverLocation) => {
		const trip = await TripSchema.findOne({ tripRoom, status: "pending" });
		trip.isArrived = true;
		await trip.save();
		socket.to(tripRoom).emit("driverArrived", {
			driverLocation: driverLocation,
		});
	});

	socket.on("completeTrip", async (tripRoom, currentLocation) => {
		const trip = await TripSchema.findOne({ tripRoom, status: "pending" });
		trip.status = "completed";
		await trip.save();

		driver.isTrip = false;
		const driverSchema = await DriverSchema.findById(trip.driverId);
		driverSchema.isTrip = false;
		await driverSchema.save();
		socket.to(tripRoom).emit("tripCompleted", {
			currentLocation: currentLocation,
		});
	});

	socket.on("sendMessageFromUser", (tripRoom) => {
		socket.to(tripRoom).emit("receiveMessage", {
			message: "Sr tài xế đang bận, vui lòng chờ",
		});
	});

	socket.on("disconnect", () => {
		console.log("disconnect to driver socket");
		if (socket.data.user.role === "driver") {
			driversConnected = driversConnected.filter(
				(driver: any) => driver.socketId !== socket.id
			);
			if (driver.isFindTrip) {
				driver.isFindTrip = false;
				DriverSchema.findByIdAndUpdate(driver.driverId, {
					isFindTrip: false,
				});
			}
		}
		if (socket.data.user.role === "user") {
			if (currentRequest.searchInterval) {
				clearInterval(currentRequest.searchInterval);
			}
			if (currentRequest.searchTimeout) {
				clearTimeout(currentRequest.searchTimeout);
			}
			currentRequest.isCancelled = true;
			currentRequest = {
				searchInterval: undefined,
				searchTimeout: undefined,
				isCancelled: true,
			};
		}
	});
});

export default io;
