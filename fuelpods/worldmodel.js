/*
	Abstract model of the world
*/

function Rocket() {
	this.pos = new Vec2();

	this.MAX_VEL = 5;
	this.vel = new Vec2();

	// Direction rocket is pointing. Really just an angle but storing it as a unit vector makes it easier to process
	this.dir = new Vec2(0, 1);

	// Angular velocity (rotation angle applied to dir every tick)
	this.avl = 0;
	this.MAX_AVL = 0.05;

	// Fuel usage computations
	this.fuel = 0;
	this.BASE_FUEL_USE = 0.1; // per tick, always consumed to stay alive
	this.IDLE_LIFETIME = 10 * 60; // rocket stays "alive" for this many ticks if not fueled and not firing thrust
	this.START_FUEL = this.BASE_FUEL_USE * this.IDLE_LIFETIME;
	this.REFUEL_PER_POD = this.BASE_FUEL_USE * 5 * 60; // each fuel pod adds this much fuel on pickup
	this.ACCEL_FUEL_MULTI = 0.1; // multiplier per unit of thrust
	this.ROT_FUEL_MULTI = 0.1; // multiplier per unit of rotation

	this.reset(new Vec2(), new Vec2());
}

/*
@param accel  float: acceleration (>= 0), applied in current direction of rocket
@param rot    float: angular acceleration (>0 means anti-clockwise)
*/
Rocket.prototype.run = function(accel, rot) {
	// Check if there is enough fuel to run the rocket
	this.fuel = Math.max(0, this.fuel - this.BASE_FUEL_USE
		- accel * this.ACCEL_FUEL_MULTI
		- Math.abs(rot) * this.ROT_FUEL_MULTI
		);
	if(this.fuel == 0) {
		accel = 0;
		rot = 0;
	}

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

Rocket.prototype.reset = function(pos, vel, dir=null) {
	this.pos.copy( pos );
	this.vel.copy( vel );
	if(dir == null) {
		this.dir.set(0, 1);
	}
	else {
		this.dir.copy( dir );
	}

	this.avl = 0;
	this.fuel = this.START_FUEL;
}

function WorldModel() {
	this.rocket = new Rocket();

	this.ROCKET_SIZE = 20;
	this.POD_SIZE = 10;
	this.POD_COLLISION_DIST = this.ROCKET_SIZE + this.POD_SIZE;
	this.pods = []
}

WorldModel.prototype.run = function(accel, rot) {
	// Collision with pods
	for(i = 0; i < this.pods.length; ++i) {
		const podPos = this.pods[i];
		const dist = getVec2Distance(podPos, this.rocket.pos);
		if(dist <= this.POD_COLLISION_DIST) {
			this.rocket.fuel += this.rocket.REFUEL_PER_POD;
			this.pods.splice(i , 1);
			break;
		}
	}

	this.rocket.run(accel, rot);
}
