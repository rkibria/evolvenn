/*
	Mouse control for the model

	The visualizer contains the model.
*/

function ManualController(visualizer, mouse, mouseclick) {
	this.visualizer = visualizer;
	this.mouse = mouse;
	this.mouseclick = mouseclick;

	this.accel = new Vec2();
}

/*
	Run model and visualize in context ctx
*/
ManualController.prototype.run = function(ctx) {
	// Set acceleration
	if(this.mouseclick.down) {
		this.accel.set(this.mouse.x, this.visualizer.y + this.visualizer.s/2);
		this.accel.subComps(this.visualizer.x + this.visualizer.s/2, this.mouse.y);
		this.accel.divideScalar(this.visualizer.s/2);
	}
	else {
		this.accel.clear();
	}

	this.visualizer.model.run(this.accel);
	this.visualizer.draw(ctx, this.accel);
};
