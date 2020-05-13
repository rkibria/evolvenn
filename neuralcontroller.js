/*
	Neural network control for the model

	The visualizer contains the model.
*/

function NeuralController(visualizer, nnet) {
	this.visualizer = visualizer;
	this.nnet = nnet;

	this.accel = new Vec2();
	this.reset();
}

NeuralController.prototype.reset = function() {
	this.visualizer.model.particle.pos.randomInUnitDisk().multiplyScalar(300);
	this.visualizer.model.particle.vel.randomInUnitDisk().multiplyScalar(10);
}

/*
	Run model and optionally visualize in context ctx
*/
NeuralController.prototype.run = function(ctx=null) {
	this.accel.clear();

	this.nnet.run(this.visualizer.model, this.accel);
	this.visualizer.model.run(this.accel);

	if(ctx != null) {
		this.visualizer.draw(ctx, this.accel);
	}
};
