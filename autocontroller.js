/*
	Handmade automatic control for the model

	The visualizer contains the model.
*/

function AutoController(visualizer) {
	this.visualizer = visualizer;
	this.MAX_ACCEL = 0.1;

	this.accel = new Vec2();
	this.reset();
}

AutoController.prototype.reset = function() {
	this.phase = 0;
	this.burnTime = 0;

	this.visualizer.model.particle.pos.randomInUnitDisk().multiplyScalar(300);
	this.visualizer.model.particle.vel.randomInUnitDisk().multiplyScalar(10);
}

AutoController.prototype.computeAcceleration = function() {
	let feedback = "";

	this.accel.clear();

	if( this.phase == 0) {
		feedback = "1. Come to full stop";
		const curVel = this.visualizer.model.particle.vel.length();
		if( curVel > 0.01 ) {
			const decel = Math.min( this.MAX_ACCEL, curVel );
			this.accel.copyScaled( this.visualizer.model.particle.vel, -1/curVel )
				.multiplyScalar( decel );
		}
		else {
			this.phase = 1;

			const distance = this.visualizer.model.particle.pos.length();
			this.burnTime = Math.sqrt( distance / this.MAX_ACCEL );
		}
	}

	if( this.phase == 1 ) {
		feedback = "2. Accelerate to target";
		if( this.burnTime >= 0 ) {
			this.accel.copy( this.visualizer.model.particle.pos ).normalize().multiplyScalar( -this.MAX_ACCEL );
			this.burnTime -= 1;
		}
		else {
			this.phase = 2;

			const distance = this.visualizer.model.particle.pos.length();
			this.burnTime = Math.sqrt( distance / this.MAX_ACCEL );
		}
	}

	if( this.phase == 2 ) {
		feedback = "3. Decelerate";
		if( this.burnTime >= 0 ) {
			this.accel.copy( this.visualizer.model.particle.pos ).normalize().multiplyScalar( this.MAX_ACCEL );
			this.burnTime -= 1;
		}
		else {
			this.phase = 3;
		}
	}

	if( this.phase == 3 ) {
		feedback = "4. Come to full stop";
		const curVel = this.visualizer.model.particle.vel.length();
		if( curVel > 0.01 ) {
			const decel = Math.min( this.MAX_ACCEL, curVel );
			this.accel.copyScaled( this.visualizer.model.particle.vel, -1/curVel )
				.multiplyScalar( decel );
		}
		else {
			this.phase = 4;
		}
	}

	if( this.phase == 4 ) {
		feedback = "4. Finished";
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
