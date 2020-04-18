
function ManualController(visualizer, model, mouse, mouseclick) {
	this.visualizer = visualizer;
	this.model = model;
	this.mouse = mouse;
	this.mouseclick = mouseclick;

	this.accel = new Vec2();
}

ManualController.prototype.run = function(ctx) {
	if(this.mouseclick.down) {
		this.accel.set(this.mouse.x, this.visualizer.y + this.visualizer.s/2);
		this.accel.subComps(this.visualizer.x + this.visualizer.s/2, this.mouse.y);
		this.accel.divideScalar(100);
	}
	else {
		this.accel.clear();
	}
	this.model.run(this.accel);

	this.visualizer.draw(ctx);
};
