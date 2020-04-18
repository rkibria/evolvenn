
function Visualizer(model, x, y, s) {
	this.model = model;
	this.x = x;
	this.y = y;
	this.s = s;
}

Visualizer.prototype.draw = function(ctx) {
	ctx.save();

	// Center cross
	ctx.strokeStyle = "darkgrey";
	ctx.beginPath();
	const crossSize = 10;
	const centerX = this.x + this.s/2;
	const centerY = this.y + this.s/2;
	ctx.moveTo(centerX - crossSize, centerY);
	ctx.lineTo(centerX + crossSize, centerY);
	ctx.stroke(); 
	ctx.moveTo(centerX, centerY - crossSize);
	ctx.lineTo(centerX, centerY + crossSize);
	ctx.stroke(); 

	// Frame
	ctx.strokeRect(this.x, this.y, this.s, this.s);

	// Particle
	ctx.fillStyle = "red";
	ctx.beginPath();
	const x = centerX + Math.trunc(this.model.particle.pos.x);
	const y = centerY - Math.trunc(this.model.particle.pos.y);
	const r = 3;
	ctx.arc(x, y, r, 0, (Math.PI * 2), true);
	ctx.closePath();
	ctx.fill();

	ctx.restore();
};
