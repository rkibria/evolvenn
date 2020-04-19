
function Visualizer(model, x, y, s) {
	this.model = model;
	this.x = x;
	this.y = y;
	this.s = s;

	this.center = new Vec2(this.x + this.s/2, this.y + this.s/2);
}

Visualizer.prototype.draw = function(ctx, accel=null) {
	ctx.save();

	// Center cross
	ctx.strokeStyle = "darkgrey";
	ctx.beginPath();
	const crossSize = 10;
	ctx.moveTo(this.center.x - crossSize, this.center.y);
	ctx.lineTo(this.center.x + crossSize, this.center.y);
	ctx.stroke(); 
	ctx.moveTo(this.center.x, this.center.y - crossSize);
	ctx.lineTo(this.center.x, this.center.y + crossSize);
	ctx.stroke(); 

	// Frame
	ctx.strokeRect(this.x, this.y, this.s, this.s);

	// Acceleration indicator
	if(accel != null) {
	}

	// Particle
	ctx.fillStyle = "red";
	ctx.beginPath();
	const x = this.center.x + Math.trunc(this.model.particle.pos.x);
	const y = this.center.y - Math.trunc(this.model.particle.pos.y);
	const r = 3;
	ctx.arc(x, y, r, 0, (Math.PI * 2), true);
	ctx.closePath();
	ctx.fill();

	ctx.restore();
};
