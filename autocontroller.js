/*
	Handmade automatic control for the model

	The visualizer contains the model.
*/

function AutoController(visualizer) {
	this.visualizer = visualizer;

	this.accel = new Vec2();
}

/*
	Run model and optionally visualize in context ctx
*/
AutoController.prototype.run = function(ctx=null) {
	this.accel.clear();

	this.visualizer.model.run(this.accel);

	if(ctx != null) {
		this.visualizer.draw(ctx, this.accel);
	}
};
