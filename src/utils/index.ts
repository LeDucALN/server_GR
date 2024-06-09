/** @format */

const EARTH_R = 6371e3;

const toRad = (value: number) => {
	return (value * Math.PI) / 180;
};

const deltaRad = (value1: number, value2: number) => {
	return toRad(value2 - value1);
};

const calculate = (origin: any, destination: any) => {
	const lat1 = toRad(origin.latitude); // φ, λ in radians
	const lat2 = toRad(destination.latitude);
	/* Độ chênh lệch giữa vĩ độ, kinh độ của điểm đầu và điểm cuối, chuyển đổi sang radian */
	const deltaLat = deltaRad(origin.latitude, destination.latitude);
	const deltaLng = deltaRad(origin.longitude, destination.longitude);
	const a =
		Math.pow(Math.sin(deltaLat / 2), 2) +
		Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLng / 2), 2);
	// Góc giữa 2 điểm
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return EARTH_R * c; // in metres
};

export { calculate };
