/*
	Handmade automatic control for the model

	The visualizer contains the model.
*/

function AutoController(visualizer) {
	this.visualizer = visualizer;

	this.phase = 0;

	this.accel = new Vec2();
	this.vec1 = new Vec2();
	this.vec2 = new Vec2();
}

AutoController.prototype.computeAcceleration = function() {
	let feedback = "";

	this.accel.clear();

	if( this.phase == 0) {
		feedback = "1. Come to full stop";
		const curVel = this.visualizer.model.particle.vel.length();
		if( curVel > 0.001 ) {
			const decel = Math.min( 1, curVel );
			this.accel.copyScaled(this.visualizer.model.particle.vel, -decel);
		}
		else {
			this.phase = 1;
		}
	}

	if( this.phase == 1) {
		feedback = "2. Accelerate to target";
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
