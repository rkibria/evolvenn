/*
	Neural network control for the model

	The visualizer contains the model.
*/

function NeuralController(visualizer, nnet) {
	this.visualizer = visualizer;
	this.nnet = nnet;

	this.accel = new Vec2();
}

/*
	Run model and optionally visualize in context ctx
*/
NeuralController.prototype.run = function(ctx=null) {
	this.accel.clear();

	this.visualizer.model.run(this.accel);

	if(ctx != null) {
		this.visualizer.draw(ctx, this.accel);
	}
};
