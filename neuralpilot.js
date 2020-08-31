/*
	Neural network-powered autopilot

	The visualizer contains the model.
*/

function NeuralPilot( visualizer, pilotNet ) {
	this.visualizer = visualizer;
	this.pilotNet = pilotNet;

	this.outputs = [0, 0];
}

/*
	Run model and optionally visualize in context ctx
*/
NeuralPilot.prototype.run = function( ctx = null, doRunModel = true ) {
	if( doRunModel ) {
		this.pilotNet.run( this.outputs, this.visualizer.model );
		const accel = this.outputs[0];
		const rot = this.outputs[1];
		this.visualizer.model.run( accel, rot );
	}

	if( ctx != null ) {
		const accel = this.outputs[0];
		const rot = this.outputs[1];
		this.visualizer.draw( ctx, accel, rot );
	}
};
