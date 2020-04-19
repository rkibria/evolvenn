
function Visualizer(model, x, y, s) {
	this.model = model;
	this.x = x;
	this.y = y;
	this.s = s;

	this.center = new Vec2(this.x + this.s/2, this.y + this.s/2);

	this._accelArrow = new Vec2();
}

Visualizer.prototype.draw = function(ctx, accel=null) {
	const accelLen = accel.length();

	ctx.save();

	// Acceleration indicator
	if(accel != null && !accel.isZero()) {
		const minArrowLen = this.s/8;
		const maxArrowLen = this.s/2 * 0.9;
		let arrowLen = accelLen;
		arrowLen = Math.min(arrowLen, maxArrowLen);
		arrowLen = Math.max(arrowLen, minArrowLen);

		this._accelArrow.copy(accel)
			.normalize()
			.multiplyScalar(arrowLen)
			.addComponents(this.center.x, -this.center.y);
		this._accelArrow.y *= -1;

		ctx.save();
		ctx.strokeStyle = "green";
		ctx.fillStyle = "green"
		ctx.lineWidth = 1;
		drawArrowhead(ctx, this.center, this._accelArrow, 5);
		ctx.beginPath();
		ctx.moveTo(this.center.x, this.center.y);
		ctx.lineTo(this._accelArrow.x, this._accelArrow.y);
		ctx.stroke();
		ctx.restore();
		drawLabel(ctx, accelLen.toFixed(3), this._accelArrow.x, this._accelArrow.y);
	}

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

	// Position and speed
	const lowerEdge = this.y + this.s;
	const leftEdge = this.x + 5;
	const prec = 2;
	drawLabel(ctx, "pos: " + this.model.particle.pos.x.toFixed(prec) + "," + this.model.particle.pos.y.toFixed(prec),
		leftEdge, lowerEdge - 2 * 12, "left");
	drawLabel(ctx, "vel: " + this.model.particle.vel.x.toFixed(prec) + "," + this.model.particle.vel.y.toFixed(prec),
		leftEdge, lowerEdge - 1 * 12, "left");

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
