/*
	Neural network for controlling the particle

	Hardcoded 1 input layer, 1 hidden layer, 1 output layer
*/

function NeuralNet() {
	this.inputs = new Array(4).fill(0);

	this.weights = new Array(40).fill(0);

	for(let i = 0; i < 40; ++i) {
		this.weights[i] = Math.random() - 0.5;
	}

	this.outputs = new Array(10).fill(0);
}

// iLayer = 0..2, iNeuron = 0..3(1)
NeuralNet.prototype.getOutputIndex = function( iLayer, iNeuron ) {
	let i = 0;
	i += iLayer * 4;
	i += iNeuron;
	return i;
};

NeuralNet.prototype.setOutput = function( iLayer, iNeuron, activation ) {
	this.outputs[ this.getOutputIndex( iLayer, iNeuron, activation ) ] = activation;
}

// iLayer = 0..2, iNeuron = 0..3(1), iWeight = 0..3
NeuralNet.prototype.getWeightIndex = function( iLayer, iNeuron, iWeight ) {
	let i = 0;
	i += iLayer * 16;
	i += iNeuron * 4;
	i += iWeight;
	return i;
};

NeuralNet.prototype.getWeight = function( iLayer, iNeuron, iWeight ) {
	return this.weights[ this.getWeightIndex( iLayer, iNeuron, iWeight ) ];
}

// Input for iLayer = 0..2, iInput = 0..3
NeuralNet.prototype.getInput = function( iLayer, iInput ) {
	if( iLayer == 0) {
		return this.inputs[ iInput ];
	}
	else {
		return this.outputs[ ( iLayer - 1 ) * 4 + iInput ];
	}
}

NeuralNet.prototype.getActivation = function( weightedInputs ) {
	let activation = Math.max(0, weightedInputs);
	activation = Math.min(1, weightedInputs);
	return activation;
}

// Returns acceleration for the particle
NeuralNet.prototype.run = function( model, accel ) {
	this.inputs[ 0 ] = model.particle.pos.x;
	this.inputs[ 1 ] = model.particle.pos.y;
	this.inputs[ 2 ] = model.particle.vel.x;
	this.inputs[ 3 ] = model.particle.vel.y;

	for( let iLayer = 0; iLayer < 3; ++iLayer ) {
		const nNeurons = ( iLayer < 2 ) ? 4 : 2;
		for( let iNeuron = 0; iNeuron < nNeurons; ++iNeuron ) {
			let weightedInputs = 0;
			for( let iWeight = 0; iWeight < 4; ++iWeight ) {
				weightedInputs += this.getWeight( iLayer, iNeuron, iWeight ) * this.getInput( iLayer, iWeight );
			}
			const activation = this.getActivation( weightedInputs );
			this.setOutput( iLayer, iNeuron, activation );
		}
	}

	const outputIndex = this.getOutputIndex( 2, 0 );
	accel.set( this.outputs[ outputIndex ], this.outputs[ outputIndex + 1 ] );
};
