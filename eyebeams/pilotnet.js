/*
	Neural network for autopiloting
*/

/*
@param innerLayers Array of neuron counts for each hidden layer (without the output layer)
*/
function PilotNet( innerLayers ) {
	this.nFeedbacks = 5; // feeback connections from outputs to inputs of NN
	this.feedbackVals = new Array( this.nFeedbacks ).fill( 0 );

	this.nEyeBeams = 5;
	// 2: velocity
	// 2: direction
	// 1: avl from model
	// 1: fuel from model
	this.nSensorInputs = 6;
	this.nInputs = this.nEyeBeams + this.nSensorInputs + this.nFeedbacks;
	// 2: accelBit0 & accelBit1 of accel
	// 3: polarity, accelBit0 & accelBit1 of rot
	this.nControlOutputs = 5;
	const nOutputs = this.nControlOutputs + this.nFeedbacks;

	this.inputs = new Array( this.nInputs ).fill( 0 );

	const allLayers = innerLayers.slice();
	allLayers.push( nOutputs );
	this.nnet = new NeuralNet( this.nInputs, allLayers );

	this.MAX_ACCEL = 0.1;

	this._v1 = new Vec2();

	this.beams = [];
	for(i = 0; i < this.nEyeBeams; ++i) {
		this.beams.push( { dir: new Vec2(), t: 0 } );
	}

	this.evoParams = [];
}

function makePilotNet() {
	return new PilotNet( [ 16, 16, 16 ] );
}

PilotNet.prototype.copy = function(other) {
	console.assert(this.inputs.length == other.inputs.length);
	this.nnet.copy(other.nnet);

	for(let i = 0; i < this.evoParams.length; ++i) {
		this.evoParams[i] = other.evoParams[i];
	}
}

PilotNet.prototype.randomize = function() {
	this.nnet.randomize();
}

PilotNet.prototype.mutate = function(spread) {
	this.nnet.mutate(spread);

	for(let i = 0; i < this.evoParams.length; ++i) {
		this.evoParams[i] += 1 * spread * (gaussianRand() - 0.5);
	}
}

PilotNet.prototype.toText = function() {
	const serialObj = {
		nnet: this.nnet.toText(),
		evoParams: this.evoParams
	};
	return JSON.stringify(serialObj);
}

PilotNet.prototype.fromText = function(text) {
	const rawObject = JSON.parse(text);
	this.nnet.fromText(rawObject.nnet);
	this.evoParams = rawObject.evoParams;
}

/*
@param outputs 2-element vector [accel, rot]
@param model
*/
PilotNet.prototype.run = function( outputs, model ) {
	for(i = 0; i < this.nEyeBeams; ++i) {
		this.inputs[ i ] = 0;
	}

	const fov = 10;
	const startAngle = -fov / 2;
	const incAngle = fov / (this.nEyeBeams - 1);

	for( j = 0; j < model.pods.length; ++j ) {
		const podPos = model.pods[ j ];

		for( let i = 0; i < this.nEyeBeams; ++i ) {
			const beam = this.beams[ i ];
			beam.dir.copy(model.rocket.dir).rotate( Math.PI/180 * (startAngle + incAngle * i) );
			beam.t = nearestCircleLineIntersect(model.rocket.pos, beam.dir, podPos, model.POD_SIZE);
			if(beam.t >= 0 && beam.t <= 2000) {
				const invDist = 5 + 5 * (1 - beam.t / 2000);
				this.inputs[ i ] += invDist;
			}
		}
	}

	this.inputs[ this.nEyeBeams ] = model.rocket.vel.x;
	this.inputs[ this.nEyeBeams + 1 ] = model.rocket.vel.y;

	this.inputs[ this.nEyeBeams + 2 ] = model.rocket.dir.x;
	this.inputs[ this.nEyeBeams + 3 ] = model.rocket.dir.y;

	this.inputs[ this.nEyeBeams + 4 ] = model.rocket.avl;

	this.inputs[ this.nEyeBeams + 5 ] = model.rocket.fuel / 100;

	for( let i = 0; i < this.nFeedbacks; ++i ) {
		this.inputs[ this.nEyeBeams + this.nSensorInputs + i ] = this.feedbackVals[ i ];
	}

	// RUN NN
	const nnOutputs = this.nnet.run( this.inputs );

	function outputScale(i) {
		return Math.log10(Math.max(0, i) + 1);
	}

	const bitThreshold = 1;

	const accelBit0 = (outputScale(nnOutputs[0]) > bitThreshold);
	const accelBit1 = (outputScale(nnOutputs[1]) > bitThreshold);
	// bit1 bit0 thrust
	// 0    0    0
	// 0    1    1
	// 1    0    1
	// 1    1    2
	const accelMulti = (accelBit0 ? 1 : 0) + (accelBit1 ? 1 : 0); // 0-2
	const accel = (this.MAX_ACCEL / 2) * accelMulti;

	const rotPolarityBit = (outputScale(nnOutputs[2]) > bitThreshold);
	const rotBit0 = (outputScale(nnOutputs[3]) > bitThreshold);
	const rotBit1 = (outputScale(nnOutputs[4]) > bitThreshold);
	const rotMulti = (rotBit0 ? 1 : 0) + (rotBit1 ? 1 : 0); // 0-2
	let rot = (rotPolarityBit ? 1 : -1) * (0.1 / 2) * rotMulti;
	if(rot > 0 && model.rocket.avl >= model.rocket.MAX_AVL) {
		rot = 0;
	}
	else if(rot < 0 && model.rocket.avl <= -model.rocket.MAX_AVL) {
		rot = 0;
	}

	outputs[0] = accel;
	outputs[1] = rot;

	// FEEDBACKS
	function feedbackScale(prevValue, newValue) {
		return Math.min(1, Math.max(0, newValue));
	}

	for( let i = 0; i < this.nFeedbacks; ++i ) {
		this.feedbackVals[ i ] = feedbackScale( this.feedbackVals[ i ], nnOutputs[ this.nControlOutputs + i ] );
	}

}
