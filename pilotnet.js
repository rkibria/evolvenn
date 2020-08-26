/*
	Neural network for autopiloting
*/

/*
@param innerLayers Array of neuron counts for each hidden layer (without the output layer)
*/
function PilotNet( innerLayers ) {
	this.inputs = new Array( 4 ).fill( 0 );

	const allLayers = innerLayers.slice();
	allLayers.push( 4 );
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
	function inputScale(i) {
		return Math.sign(i) * Math.log(Math.abs(i) + 1);
	}

	this.inputs[ 0 ] = inputScale(model.particle.pos.x);
	this.inputs[ 1 ] = inputScale(model.particle.pos.y);
	this.inputs[ 2 ] = inputScale(model.particle.vel.x);
	this.inputs[ 3 ] = inputScale(model.particle.vel.y);

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
	function getAxisOutputValue(upValue, downValue) {
		function outputScale(i) {
			return Math.log(Math.max(0, i) + 1);
		}

		upValue = outputScale(upValue);
		downValue = outputScale(downValue);
		const totalPosValue = upValue - downValue;

		let dd = totalPosValue;
		dd = Math.sign(dd) * Math.min( Math.abs(dd * 1), 1 ) * MAX_ACCEL / Math.sqrt(2);
		return dd;
	}

	outAccel.set( getAxisOutputValue(outputs[ 0 ], outputs[ 1 ]), getAxisOutputValue(outputs[ 2 ], outputs[ 3 ]) );
}

function makePilotNet()
{
	return new PilotNet( [ 4, 4] );
}
