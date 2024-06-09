/** @format */

import { Server } from "socket.io";
import { socketAuth } from "../middleware/socketAuth";
import { calculate } from "../utils";
import DriverSchema from "../models/driver";
import GuestSchema from "../models/user";
import TripSchema from "../models/trip";

const io = new Server({
	cors: {
		origin: "*",
	},
});

io.use(socketAuth);

interface Driver {
	id: string;
	driverId: string;
	isReady: boolean;
	isTrip: boolean;
	latitude: number;
	longitude: number;
}

let driversConnected = [] as any;

const findDriverById = async (id: string) => {
	const driver = await DriverSchema.findById(id);
	return driver;
};

const findGuestById = async (id: string) => {
	const guest = await GuestSchema.findById(id);
	return guest;
};

io.on("connection", (socket) => {
	console.log("driver conneccted", driversConnected);

	//socket with role driver
	if (socket.data.user.role === "driver") {
		driversConnected.push({
			id: socket.id,
			driverId: socket.data.user.id,
			isReady: false,
		});
	}

	socket.on("sendCurrentLocation", (location: any) => {
		driversConnected.forEach((driver: any) => {
			if (driver.id === socket.id) {
				driver.latitude = location.latitude;
				driver.longitude = location.longitude;

				if (driver.currentTripRoom) {
					socket
						.to(driver.currentTripRoom)
						.emit("driverCurrentLocation", location); //gui vi tri hien tai cua tai xe toi khach hang
				}
			}
		});
	});

	socket.on("isReady", () => {
		console.log(`Driver ${socket.data.user.id} is ready`);
		driversConnected.forEach((driver: any) => {
			if (driver.id === socket.id) {
				driver.isReady = true;
			}
		});
	});

	socket.on("isNotReady", () => {
		console.log(`Driver ${socket.data.user.id} is not ready`);
		driversConnected.forEach((driver: any) => {
			if (driver.id === socket.id) {
				driver.isReady = false;
			}
		});
	});

	//socket with role user
	socket.on("sendRQ", (pickup, destination, PU, DS) => {
		console.log("pickUpLocation:", pickup);
		console.log("destinationLocation:", destination);

		// Tìm tài xế gần nhất trong 10 giây
		let closestDriver = null as any;
		let minDistance = Infinity;

		const searchDriver = async () => {
			driversConnected.forEach((driver: Driver) => {
				if (driver.isReady) {
					const distance = calculate(pickup, {
						latitude: driver.latitude,
						longitude: driver.longitude,
					});
					if (distance < minDistance) {
						minDistance = distance;
						closestDriver = driver;
					}
				}
			});

			if (closestDriver !== null) {
				const tripRoom = `trip_${socket.data.user.id}_${closestDriver.driverId}`;
				closestDriver.currentTripRoom = tripRoom;
				closestDriver.isTrip = true;
				socket.join(tripRoom);
				io.to(closestDriver.id).emit("newTripRequest", {
					guest: await findGuestById(socket.data.user.id),
					pickup: pickup,
					destination: destination,
					tripRoom: tripRoom,
					PU: PU,
					DS: DS,
				});
				io.to(socket.id).emit(
					"tripRequestSuccess",
					await findDriverById(closestDriver.driverId),
                    {
                        latitude: closestDriver.latitude,
                        longitude: closestDriver.longitude,
                    }

				);
				clearInterval(searchInterval);
				clearTimeout(searchTimeout);
			}
		};

		const searchInterval = setInterval(searchDriver, 1000);

		const searchTimeout = setTimeout(() => {
			clearInterval(searchInterval);
			if (closestDriver === null) {
				io.to(socket.id).emit("noDriversAvailable", {
					message:
						"Xin lỗi, tất cả các tài xế đều bận. Vui lòng thử lại sau.",
				});
			}
		}, 10000);
	});


    socket.on("startTrip", (tripRoom, driverLocation) => {
        socket.to(tripRoom).emit("driverArrived", {
            message: "Tài xế đã đến nơi",
            driverLocation: driverLocation,
        })
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
