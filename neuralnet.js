/*
	Neural network for controlling the particle
*/

function NeuralNet() {
}

// Returns acceleration for the particle
NeuralNet.prototype.run = function(model, accel) {
	accel.set(Math.random() - 0.5, Math.random() - 0.5);
};
