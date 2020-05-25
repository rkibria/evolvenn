/*
	A single neural network layer
*/

///////////////////////////////////////////////////////////

function NeuralLayer( nInputs, nNeurons ) {
	this.nInputs = nInputs;
	this.nNeurons = nNeurons;
	this.weights = new Array( nInputs * nNeurons ).fill( 0 );
	this.outputs = new Array( nNeurons ).fill( 0 );
}

NeuralLayer.prototype._activation = function( weightedInputs ) {
	let activation = Math.max( 0, weightedInputs );
	activation = Math.min( 1, activation );
	return activation;
}

/*
input 1 -w1.1- N --- output 1 = i1 * w1.1 + i2 * w1.2
            \ /
             X
           /  \
input 2 -w1.2  N ---
*/
NeuralLayer.prototype.run = function( inputs ) {
	for( let i = 0; i < this.nNeurons; ++i ) {
		let weightedInputs = 0;
		for( let j = 0; j < this.nInputs; ++j ) {
			weightedInputs += this.weights[ j ] * inputs[ j ];
		}
		this.outputs[ i ] = this._activation( weightedInputs );
	}
}
