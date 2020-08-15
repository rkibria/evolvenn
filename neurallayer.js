/*
	A single neural network layer
*/

///////////////////////////////////////////////////////////

function NeuralLayer( nInputs, nNeurons ) {
	this.nInputs = nInputs;
	this.nNeurons = nNeurons;
	// 1 bias input per neuron
	this.weights = new Array( ( nInputs + 1 ) * nNeurons ).fill( 0 );
	this.outputs = new Array( nNeurons ).fill( 0 );
}

NeuralLayer.prototype.copy = function(other) {
	this.nInputs = other.nInputs;
	this.nNeurons = other.nNeurons;
	console.assert(this.weights.length == other.weights.length);
	console.assert(this.outputs.length == other.outputs.length);
	for(let i = 0; i < this.weights.length; ++i) {
		this.weights[ i ] = other.weights[ i ];
	}
}

NeuralLayer.prototype.randomize = function() {
	this.bias = Math.random() - 0.5;
	for(let i = 0; i < this.weights.length; ++i) {
		this.weights[ i ] = Math.random() - 0.5;
	}
}

NeuralLayer.prototype.noise = function(spread)
{
	return spread * (gaussianRand() - 0.5);
}

NeuralLayer.prototype.mutate = function(spread) {
	this.bias += this.noise(spread);
	for(let i = 0; i < this.weights.length; ++i) {
		this.weights[ i ] += this.noise(spread);
	}
}

/*
@param inputs List of numbers containing input values
@return Outputs array
*/
NeuralLayer.prototype.run = function( inputs ) {
	let weightIndex = 0;
	for( let i = 0; i < this.nNeurons; ++i ) {
		let weightedInputs = this.weights[ weightIndex++ ];
		for( let j = 0; j < this.nInputs; ++j ) {
			weightedInputs += this.weights[ weightIndex++ ] * inputs[ j ];
		}
		// https://en.wikipedia.org/wiki/Rectifier_(neural_networks)
		const activation = Math.max( 0, weightedInputs );
		this.outputs[ i ] = activation;
	}
	return this.outputs;
}
