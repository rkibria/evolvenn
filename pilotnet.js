/*
	Neural network for autopiloting
*/

/*
*/
function PilotNet() {
	this._inputs = new Array( 4 ).fill( 0 );
	this._nnet = new NeuralNet( 4, [ 4, 4, 2 ] );
	this._nnet.randomize();
}

/*
@param model
*/
PilotNet.prototype.run = function( outAccel, model ) {
	this._inputs[ 0 ] = model.particle.pos.x;
	this._inputs[ 1 ] = model.particle.pos.y;
	this._inputs[ 2 ] = model.particle.vel.x;
	this._inputs[ 3 ] = model.particle.vel.y;

	const outputs = this._nnet.run( this._inputs );

	const MAX_ACCEL = 0.1;
	const accelLen = outputs[ 0 ] * MAX_ACCEL;
	const accelAngle = outputs[ 1 ] * 2 * Math.PI;
	outAccel.setLengthAngle( 1, accelAngle ).multiplyScalar( accelLen );
};
