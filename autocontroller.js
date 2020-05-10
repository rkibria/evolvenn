/*
	Handmade automatic control for the model

	The visualizer contains the model.
*/

function AutoController(visualizer) {
	this.visualizer = visualizer;

	this.accel = new Vec2();
	this.vec1 = new Vec2();
	this.vec2 = new Vec2();
}

AutoController.prototype.computeAcceleration = function() {
	let feedback = "";

	this.accel.clear();

	this.vec1.copy(this.visualizer.model.particle.pos) // Vector from origin to particle
		.normalize() // Normalize it
		.perpendicularize(); // Vector perpendicular to the one from origin to particle

	let perpVel = this.visualizer.model.particle.vel.dot(this.vec1);
	if(Math.abs(perpVel) > 0.001) {
		perpVel = Math.min(1, perpVel); // Limit to 1
		this.accel.copyScaled(this.vec1, -perpVel);
		feedback = "Phase 1: remove perpendicular velocity";
	}

	return feedback;
}

/*
	Run model and optionally visualize in context ctx
*/
AutoController.prototype.run = function(ctx=null) {
	const feedback = this.computeAcceleration();

	this.visualizer.model.run(this.accel);

	if(ctx != null) {
		drawLabel(ctx, feedback,
			this.visualizer.x + this.visualizer.s/2, this.visualizer.y + 20,
			"center");

		this.visualizer.draw(ctx, this.accel);
	}
};
