/*
	Neural network for autopiloting
*/

/*
@param innerLayers Array of neuron counts for each hidden layer (without the output layer)
*/
function PilotNet( innerLayers ) {
	this._inputs = new Array( 4 ).fill( 0 );

	const allLayers = innerLayers.slice();
	allLayers.push( 2 );
	this._nnet = new NeuralNet( 4, allLayers );
}

PilotNet.prototype.randomize = function() {
	this._nnet.randomize();
}

/*
@param outAccel
@param model
*/
PilotNet.prototype.run = function( outAccel, model ) {
	this._inputs[ 0 ] = model.particle.pos.x;
	this._inputs[ 1 ] = model.particle.pos.y;
	this._inputs[ 2 ] = model.particle.vel.x;
	this._inputs[ 3 ] = model.particle.vel.y;

	const outputs = this._nnet.run( this._inputs );

	const MAX_ACCEL = 0.1;
	// length/angle interpretation
	// const accelLen = Math.min( outputs[ 0 ], MAX_ACCEL );
	// const accelAngle = outputs[ 1 ] * 2 * Math.PI;
	// outAccel.setLengthAngle( 1, accelAngle ).multiplyScalar( accelLen );

	// direction interpretation: map each value to an axis
	let dx = outputs[ 0 ] - 1;
	dx = Math.min( dx, 1 ) * MAX_ACCEL / Math.sqrt(2);
	let dy = outputs[ 1 ] - 1;
	dy = Math.min( dy, 1 ) * MAX_ACCEL / Math.sqrt(2);
	outAccel.set( dx, dy );

};
