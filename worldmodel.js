
function Particle() {
	this.pos = new Vec2();
	this.vel = new Vec2();
}

function WorldModel() {
	this.particle = new Particle();
}

WorldModel.prototype.run = function(accel) {
	this.particle.vel.add(accel);
	this.particle.pos.add(this.particle.vel);
};
