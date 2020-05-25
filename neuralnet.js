/*
	Generic neural network, uses NeuralLayer
*/

/*
layersList is an array of numbers which are the neuron counts in that layer,
which is also the number of outputs of that layer.

e.g. (4, [ 4, 4, 2 ] ) = 4 inputs for input layer, 4 neurons in hidden layer, 2 output neurons
*/
function NeuralNet( nInputs, layersList ) {
	// this.MAX_ACCEL = 0.1;

	this.inputs = new Array(4).fill(0);

	this.layers = [];
	let inputs = nInputs;
	for(let i = 0; i < layersList.length; ++i) {
		const curLayerNeurons = layersList[ i ];
		const layer = new NeuralLayer( inputs, curLayerNeurons );
		this.layers.push( layer );
		inputs = curLayerNeurons;
	}
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

	// Translate raw outputs to length/angle
	const outputIndex = this.getOutputIndex( 2, 0 );
	const out_0 = this.outputs[ outputIndex ];
	const out_1 = this.outputs[ outputIndex + 1 ];

	const accelLen = out_0 * this.MAX_ACCEL;
	const accelAngle = out_1 * 2 * Math.PI;

	accel.setLengthAngle( 1, accelAngle ).multiplyScalar( accelLen );
};
