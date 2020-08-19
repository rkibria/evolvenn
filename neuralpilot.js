/*
	Neural network-powered autopilot

	The visualizer contains the model.
*/

function NeuralPilot( visualizer, pilotNet ) {
	this.visualizer = visualizer;
	this.pilotNet = pilotNet;

	this.accel = new Vec2();
	this.reset();
}

NeuralPilot.prototype.reset = function() {
	this.visualizer.model.particle.pos.randomInUnitDisk().multiplyScalar( 300 );
	this.visualizer.model.particle.vel.randomInUnitDisk().multiplyScalar( 10 );
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
