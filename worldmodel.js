/*
	Abstract model of the world
*/

function Particle() {
	this.pos = new Vec2();

	this.MAX_VEL = 5;
	this.vel = new Vec2();

	// Direction rocket is pointing. Really just an angle but storing it as a unit vector makes it easier to process
	this.dir = new Vec2(0, 1);

	// Angular velocity (rotation angle applied to dir every tick)
	this.avl = 0;
	this.MAX_AVL = 0.05;
}

/*
@param accel  float: acceleration (>= 0), applied in current direction of rocket
@param rot    float: angular acceleration (>0 means anti-clockwise)
*/
Particle.prototype.run = function(accel, rot) {
	// Apply angular acceleration
	this.avl += rot;
	this.avl = Math.min(this.avl, this.MAX_AVL);
	this.avl = Math.max(this.avl, -this.MAX_AVL);

	// Apply angular velocity to direction
	this.dir.rotate(this.avl);

	// Accelerate the rocket in the current direction (only pos. accel accepted)
	this.vel.addScaledVector(this.dir, Math.max(0, accel));

	// Limit velocity to a sane value
	const curVel = this.vel.length();
	if(curVel > this.MAX_VEL) {
		this.vel.multiplyScalar(this.MAX_VEL / curVel);
	}

	// Move the rocket
	this.pos.add(this.vel);
};

Particle.prototype.reset = function(pos, vel, dir=null) {
	this.pos.copy( pos );
	this.vel.copy( vel );
	if(dir == null) {
		this.dir.set(0, 1);
	}
	else {
		this.dir.copy( dir );
	}
	this.avl = 0;
}

function WorldModel() {
	this.particle = new Particle();
}

WorldModel.prototype.run = function(accel, rot) {
	this.particle.run(accel, rot);
}
