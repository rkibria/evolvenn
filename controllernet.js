/*
	Autopilot neural network, uses NeuralNet
*/

function ControllerNet( nInputs, layersList ) {
	this.MAX_ACCEL = 0.1;

	this.inputs = new Array(4).fill(0);
}

// Returns acceleration for the particle
ControllerNet.prototype.run = function( outAccel, model ) {
	this.inputs[ 0 ] = model.particle.pos.x;
	this.inputs[ 1 ] = model.particle.pos.y;
	this.inputs[ 2 ] = model.particle.vel.x;
	this.inputs[ 3 ] = model.particle.vel.y;


	// Translate raw outputs to length/angle
	const out_0 = this.outputs[ outputIndex ];
	const out_1 = this.outputs[ outputIndex + 1 ];

	const accelLen = out_0 * this.MAX_ACCEL;
	const accelAngle = out_1 * 2 * Math.PI;

	accel.setLengthAngle( 1, accelAngle ).multiplyScalar( accelLen );
};
