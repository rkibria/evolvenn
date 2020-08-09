/*
	Generic neural network, uses NeuralLayer
*/

/*
@param nInputs Number of inputs of the whole net
@param layersList Array neuron counts per layer

(4, [ 4, 4, 2 ] ) = 4 inputs for input layer, 4 neurons in hidden layer, 2 output neurons
*/
function NeuralNet( nInputs, layersList ) {
	this._layers = [];
	let nNextInputs = nInputs;
	for( let i = 0; i < layersList.length; ++i ) {
		const nNeurons = layersList[ i ];
		this._layers.push( new NeuralLayer( nNextInputs, nNeurons ) );
		nNextInputs = nNeurons;
	}
}

NeuralNet.prototype.copy = function(other) {
	console.assert(this._layers.length == other._layers.length);
	for( let i = 0; i < this._layers.length; ++i ) {
		this._layers[i].copy(other._layers[i]);
	}
}

NeuralNet.prototype.randomize = function() {
	for( let i = 0; i < this._layers.length; ++i ) {
		this._layers[ i ].randomize();
	}
}

/*
@param inputs Array containing the input values
@return Outputs array
*/
NeuralNet.prototype.run = function( inputs ) {
	let nextInputs = inputs;
	for( let i = 0; i < this._layers.length; ++i ) {
		nextInputs = this._layers[ i ].run( nextInputs );
	}
	return nextInputs
};
