/*
	Neural network-powered autopilot

	The visualizer contains the model.
*/

function NeuralPilot( visualizer, pilotNet ) {
	this._visualizer = visualizer;
	this._pilotNet = pilotNet;

	this._accel = new Vec2();
	this.reset();
}

NeuralPilot.prototype.reset = function() {
	this._visualizer.model.particle.pos.randomInUnitDisk().multiplyScalar( 300 );
	this._visualizer.model.particle.vel.randomInUnitDisk().multiplyScalar( 10 );
}

/*
	Run model and optionally visualize in context ctx
*/
NeuralPilot.prototype.run = function( ctx = null ) {
	this._accel.clear();

	this._pilotNet.run( this._accel, this._visualizer.model );
	this._visualizer.model.run( this._accel );

	if( ctx != null ) {
		this._visualizer.draw( ctx, this._accel );
	}
};
