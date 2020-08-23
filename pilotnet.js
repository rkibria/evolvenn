/*
	Neural network for autopiloting
*/

/*
@param innerLayers Array of neuron counts for each hidden layer (without the output layer)
*/
function PilotNet( innerLayers ) {
	this.inputs = new Array( 4 ).fill( 0 );

	const allLayers = innerLayers.slice();
	allLayers.push( 2 );
	this.nnet = new NeuralNet( 4, allLayers );
}

PilotNet.prototype.copy = function(other) {
	console.assert(this.inputs.length == other.inputs.length);
	this.nnet.copy(other.nnet);
}

PilotNet.prototype.randomize = function() {
	this.nnet.randomize();
}

PilotNet.prototype.mutate = function(spread) {
	this.nnet.mutate(spread);
}

PilotNet.prototype.toText = function() {
	return this.nnet.toText();
}

PilotNet.prototype.fromText = function(text) {
	this.nnet.fromText(text);
}

/*
@param outAccel
@param model
*/
PilotNet.prototype.run = function( outAccel, model ) {
	this.inputs[ 0 ] = model.particle.pos.x;
	this.inputs[ 1 ] = model.particle.pos.y;
	this.inputs[ 2 ] = model.particle.vel.x;
	this.inputs[ 3 ] = model.particle.vel.y;

	const outputs = this.nnet.run( this.inputs );

	const MAX_ACCEL = 0.1;
	// length/angle interpretation
	// const accelLen = Math.min( outputs[ 0 ], MAX_ACCEL );
	// const accelAngle = outputs[ 1 ] * 2 * Math.PI;
	// outAccel.setLengthAngle( 1, accelAngle ).multiplyScalar( accelLen );

	// direction interpretation: map each value to an axis
	// let dx = outputs[ 0 ] - 1;
	// dx = Math.min( dx, 1 ) * MAX_ACCEL / Math.sqrt(2);
	// let dy = outputs[ 1 ] - 1;
	// dy = Math.min( dy, 1 ) * MAX_ACCEL / Math.sqrt(2);
	// outAccel.set( dx, dy );

	// "axial" interpretation
	let upValue = outputs[ 0 ];
	let downValue = outputs[ 1 ];
	upValue = Math.sqrt(upValue)
	downValue = Math.sqrt(downValue)
	const totalPosYValue = upValue - downValue;
	let dx = 0;
	let dy = totalPosYValue;
	dy = Math.min( dy * 1, 1 ) * MAX_ACCEL / Math.sqrt(2);
	outAccel.set( dx, dy );

};
