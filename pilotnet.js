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

	this.rotScale = 0.01;
	this.accelScale = 0.01;

	// this.tMinus = {
		// pos: new Vec2(),
		// vel: new Vec2(),
		// dir: new Vec2(),
		// avl: 0
	// };
}

PilotNet.prototype.copy = function(other) {
	console.assert(this.inputs.length == other.inputs.length);
	this.nnet.copy(other.nnet);
	this.rotScale = other.rotScale;
	this.accelScale = other.accelScale;
}

PilotNet.prototype.randomize = function() {
	this.nnet.randomize();
}

PilotNet.prototype.mutate = function(spread) {
	this.nnet.mutate(spread);

	const scaleFactor = 0.001;
	this.rotScale += scaleFactor * spread * (gaussianRand() - 0.5);
	this.rotScale = Math.max(0.001, this.rotScale);

	this.accelScale += scaleFactor * spread * (gaussianRand() - 0.5);
	this.accelScale = Math.max(0.001, this.accelScale);
}

PilotNet.prototype.toText = function() {
	const serialObj = {
		rotScale: this.rotScale,
		accelScale: this.accelScale,
		nnet: this.nnet.toText()
	};
	return JSON.stringify(serialObj);
}

PilotNet.prototype.fromText = function(text) {
	const rawObject = JSON.parse(text);
	this.nnet.fromText(rawObject.nnet);
	this.rotScale = rawObject.rotScale;
	this.accelScale = rawObject.accelScale;
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

	// T minus 1
	// this.inputs[ 7 ] = inputScale(this.tMinus.pos.x);
	// this.inputs[ 8 ] = inputScale(this.tMinus.pos.y);

	// this.inputs[ 9 ] = this.tMinus.vel.x;
	// this.inputs[ 10 ] = this.tMinus.vel.y;

	// this.inputs[ 11 ] = this.tMinus.dir.x;
	// this.inputs[ 12 ] = this.tMinus.dir.y;

	// this.inputs[ 13 ] = this.tMinus.avl;


	const nnOutputs = this.nnet.run( this.inputs );

	const MAX_ACCEL = 0.1;
	const MAX_ROT = 0.05;

	function outputScale(i) {
		return Math.log(Math.max(0, i) + 1);
	}

	function getRotOutput(upValue, downValue, rotScale) {
		// upValue = outputScale(upValue);
		// downValue = outputScale(downValue);
		// const totalPosValue = upValue - downValue;

		// let rawRot = totalPosValue * rotScale;
		// return Math.sign(rawRot) * Math.min( Math.abs(rawRot), MAX_ROT );

		// Bigger value determines polarity and strength of rotation, smaller value is ignored
		let rot = 0;
		let sign = 1;
		if(upValue > downValue) {
			rot = upValue;
		}
		else {
			rot = downValue;
			sign = -1;
		}
		rot = outputScale(rot) * sign * rotScale;
		return rot;
	}

	const accel = Math.min(MAX_ACCEL, outputScale(nnOutputs[0]) * this.accelScale );

	let rot = getRotOutput(nnOutputs[1], nnOutputs[2], this.rotScale);
	if(rot > 0 && model.particle.avl >= model.particle.MAX_AVL) {
		rot = 0;
	}
	else if(rot < 0 && model.particle.avl <= -model.particle.MAX_AVL) {
		rot = 0;
	}

	outputs[0] = accel;
	outputs[1] = rot;

	// this.tMinus.pos.copy(model.particle.pos);
	// this.tMinus.vel.copy(model.particle.vel);
	// this.tMinus.dir.copy(model.particle.dir);
	// this.tMinus.avl = model.particle.avl;
}

function makePilotNet()
{
	return new PilotNet( [ 7, 7, 7 ] );
}
