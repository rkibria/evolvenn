/*
	Neural network for autopiloting
*/

/*
@param innerLayers Array of neuron counts for each hidden layer (without the output layer)
*/
function PilotNet( innerLayers ) {
	// 6: field of vision: 180 degrees, divided in 6 sections of 30 degrees each
	// 1: avl from model
	const nInputs = 7;
	const nOutputs = 3;

	this.inputs = new Array( nInputs ).fill( 0 );

	const allLayers = innerLayers.slice();
	allLayers.push( nOutputs );
	this.nnet = new NeuralNet( nInputs, allLayers );

	this.rotScale = 0.01;
	this.accelScale = 0.01;

	this.MAX_ACCEL = 0.1;

	this._v1 = new Vec2();
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
	for(i = 0; i < 6; ++i) {
		this.inputs[ i ] = 0;
	}

	// Closer pods lead to higher values (inverse of distance), choose the highest for each section (i.e. closest)
	for(i = 0; i < model.pods.length; ++i) {
		const podPos = model.pods[ i ];
		const dist = getVec2Distance(podPos, model.rocket.pos);
		const r2p = this._v1;
		r2p.copy(podPos).sub(model.rocket.pos);
		const angle = Math.trunc( getVec2Angle(model.rocket.dir, r2p) / Math.PI * 180 );
		if( angle >= -90 && angle < 90) {
			const section = Math.trunc( ( angle + 90 ) / 30 ); // (0...<180 / 30) = 0...5
			const invDist = 1 / ( dist + 1 );
			if( this.inputs[ section ] < invDist ) {
				this.inputs[ section ] = invDist;
			}
		}
	}

	this.inputs[ 6 ] = model.rocket.avl;

	const nnOutputs = this.nnet.run( this.inputs );

	function outputScale(i) {
		return Math.log10(Math.max(0, i) + 1);
	}

	function getRotOutput(upValue, downValue, rotScale) {
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

	const accel = Math.min(this.MAX_ACCEL, outputScale(nnOutputs[0]) * this.accelScale );

	let rot = getRotOutput(nnOutputs[1], nnOutputs[2], this.rotScale);
	if(rot > 0 && model.rocket.avl >= model.rocket.MAX_AVL) {
		rot = 0;
	}
	else if(rot < 0 && model.rocket.avl <= -model.rocket.MAX_AVL) {
		rot = 0;
	}

	outputs[0] = accel;
	outputs[1] = rot;
}

function makePilotNet()
{
	return new PilotNet( [ 7, 7, 7 ] );
}
