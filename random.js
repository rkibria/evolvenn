
function gaussianRand() {
	let rand = 0;
	for(let i = 0; i < 6; i += 1) {
		rand += Math.random();
	}
	return rand / 6;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min, max) {
	return min + Math.random() * (max - min);
}
