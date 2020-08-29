/*
	Neural network for autopiloting
*/

/*
@param innerLayers Array of neuron counts for each hidden layer (without the output layer)
*/
function PilotNet( innerLayers ) {
	const nInputs = 7;
	const nOutputs = 3;

	this.inputs = new Array( nInputs ).fill( 0 );

	const allLayers = innerLayers.slice();
	allLayers.push( nOutputs );
	this.nnet = new NeuralNet( nInputs, allLayers );
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
@param outputs 2-element vector [accel, rot]
@param model
*/
PilotNet.prototype.run = function( outputs, model ) {
	function inputScale(i) {
		// logarithmic scaling to avoid huge values
		return Math.sign(i) * Math.log(Math.abs(i) + 1);
	}

	this.inputs[ 0 ] = inputScale(model.particle.pos.x);
	this.inputs[ 1 ] = inputScale(model.particle.pos.y);

	this.inputs[ 2 ] = model.particle.vel.x;
	this.inputs[ 3 ] = model.particle.vel.y;

	this.inputs[ 4 ] = model.particle.dir.x;
	this.inputs[ 5 ] = model.particle.dir.y;

	this.inputs[ 6 ] = model.particle.avl;

	const nnOutputs = this.nnet.run( this.inputs );

	const MAX_ACCEL = 0.1;
	const MAX_ROT = 0.05;

	function outputScale(i) {
		return Math.log(Math.max(0, i) + 1);
	}

	function getRotOutput(upValue, downValue) {
		upValue = outputScale(upValue);
		downValue = outputScale(downValue);
		const totalPosValue = upValue - downValue;

		let rawRot = totalPosValue * 0.01;
		return Math.sign(rawRot) * Math.min( Math.abs(rawRot), MAX_ROT );
	}

	const accel = Math.min(MAX_ACCEL, outputScale(nnOutputs[0]) * 0.01 );
	const rot = getRotOutput(nnOutputs[1], nnOutputs[2]);

	outputs[0] = accel;
	outputs[1] = rot;
}

function makePilotNet()
{
	return new PilotNet( [ 7, 7, 7 ] );
}
