/*
	Neural network for autopiloting
*/

/*
@param innerLayers Array of neuron counts for each hidden layer (without the output layer)
*/
function PilotNet( innerLayers ) {
	this.nRadarSections = 6; // field of vision: 360 degrees, divided in x sections
	// 2: velocity
	// 2: direction
	// 1: avl from model
	this.nInputs = this.nRadarSections + 5;
	// 2: accelBit0 & accelBit1 of accel
	// 3: polarity, accelBit0 & accelBit1 of rot
	const nOutputs = 5;

	this.inputs = new Array( this.nInputs ).fill( 0 );

	const allLayers = innerLayers.slice();
	allLayers.push( nOutputs );
	this.nnet = new NeuralNet( this.nInputs, allLayers );

	this.MAX_ACCEL = 0.1;

	this._v1 = new Vec2();
}

function makePilotNet() {
	return new PilotNet( [ 11, 11, 11 ] );
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
	const serialObj = {
		nnet: this.nnet.toText()
	};
	return JSON.stringify(serialObj);
}

PilotNet.prototype.fromText = function(text) {
	const rawObject = JSON.parse(text);
	this.nnet.fromText(rawObject.nnet);
}

/*
@param outputs 2-element vector [accel, rot]
@param model
*/
PilotNet.prototype.run = function( outputs, model ) {
	for(i = 0; i < this.nRadarSections; ++i) {
		this.inputs[ i ] = 0;
	}

	// Closer pods lead to higher values (inverse of distance), choose the highest for each section (i.e. closest)
	for(i = 0; i < model.pods.length; ++i) {
		const podPos = model.pods[ i ];
		const dist = getVec2Distance(podPos, model.rocket.pos);
		const r2p = this._v1;
		r2p.copy(podPos).sub(model.rocket.pos);
		const angle = Math.trunc( getVec2Angle(model.rocket.dir, r2p) / Math.PI * 180 );
		const section = Math.trunc( ( angle + 180 ) / (360 / this.nRadarSections) );
		const invDist = 1000 * 1000 / ( dist + 1 ) / ( dist + 1 );
		this.inputs[ section ] += invDist;
	}

	this.inputs[ this.nRadarSections ] = model.rocket.vel.x;
	this.inputs[ this.nRadarSections + 1 ] = model.rocket.vel.y;

	this.inputs[ this.nRadarSections + 2 ] = model.rocket.dir.x;
	this.inputs[ this.nRadarSections + 3 ] = model.rocket.dir.y;

	this.inputs[ this.nRadarSections + 4 ] = model.rocket.avl;

	const nnOutputs = this.nnet.run( this.inputs );

	function outputScale(i) {
		return Math.log10(Math.max(0, i) + 1);
	}

	const bitThreshold = 1;

	const accelBit0 = (outputScale(nnOutputs[0]) > bitThreshold);
	const accelBit1 = (outputScale(nnOutputs[1]) > bitThreshold);
	const accelMulti = (accelBit0 ? 1 : 0) + (accelBit1 ? 2 : 0); // 0-3
	const accel = (this.MAX_ACCEL / 3) * accelMulti;

	const rotPolarityBit = (outputScale(nnOutputs[2]) > bitThreshold);
	const rotBit0 = (outputScale(nnOutputs[3]) > bitThreshold);
	const rotBit1 = (outputScale(nnOutputs[4]) > bitThreshold);
	const rotMulti = (rotBit0 ? 1 : 0) + (rotBit1 ? 2 : 0); // 0-3
	let rot = (rotPolarityBit ? 1 : -1) * (0.1 / 3) * rotMulti;
	if(rot > 0 && model.rocket.avl >= model.rocket.MAX_AVL) {
		rot = 0;
	}
	else if(rot < 0 && model.rocket.avl <= -model.rocket.MAX_AVL) {
		rot = 0;
	}

	outputs[0] = accel;
	outputs[1] = rot;
}
