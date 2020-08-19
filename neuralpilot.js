/*
	Neural network-powered autopilot

	The visualizer contains the model.
*/

function NeuralPilot( visualizer, pilotNet ) {
	this.visualizer = visualizer;
	this.pilotNet = pilotNet;

	this.accel = new Vec2();
}

/*
	Run model and optionally visualize in context ctx
*/
NeuralPilot.prototype.run = function( ctx = null ) {
	this.accel.clear();

	this.pilotNet.run( this.accel, this.visualizer.model );
	this.visualizer.model.run( this.accel );

	if( ctx != null ) {
		this.visualizer.draw( ctx, this.accel );
	}
};
