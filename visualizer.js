/*
	Draw a model into a context

	Also stores reference to the model so can be used as the sole storage.
	The drawing method does not automatically run the model.
*/

// x,y = top left, s = edge length of square display
function Visualizer(model, x, y, s) {
	this.model = model;
	this.x = x;
	this.y = y;
	this.s = s;

	this.center = new Vec2(this.x + this.s/2, this.y + this.s/2);

	this._accelArrow = new Vec2();
	this._rocketFrame = 0;
}

Visualizer.prototype.drawRocket = function(ctx, x, y, accel=null, rot=null) {
	ctx.save();
	ctx.translate( x, y );

	ctx.rotate( -(this.model.particle.dir.angle() - Math.PI / 2) );

	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.fillStyle = "cadetblue";
	ctx.moveTo( -10, 20 );
	ctx.lineTo( -5, 15 );
	ctx.lineTo( -5, -15 );
	ctx.lineTo( 0, -20 );
	ctx.lineTo( 5, -15 );
	ctx.lineTo( 5, 15 );
	ctx.lineTo( 10, 20 );
	ctx.closePath();
	ctx.fill();

	if( accel != null ) {
		if(accel > 0) {
			ctx.beginPath();
			ctx.fillStyle = "orange";
			ctx.moveTo( 0, 20 );
			ctx.lineTo( 3, 23 );
			ctx.lineTo( 0, 30 + this._rocketFrame * 2 + Math.min( accel, 5 ) * 15 );
			ctx.lineTo( -3, 23 );
			ctx.closePath();
			ctx.fill();
		}

		const rotFlameSize = 2;
		if(rot > 0) {
			ctx.beginPath();
			ctx.fillStyle = "orange";
			ctx.moveTo( -10, 20 );
			ctx.lineTo( -10 - rotFlameSize, 20 - rotFlameSize );
			ctx.lineTo( -10 - 2 * rotFlameSize - this._rocketFrame * 2 + Math.min( rot, rotFlameSize ) * 3, 20 );
			ctx.lineTo( -10 - rotFlameSize, 20 + rotFlameSize );
			ctx.closePath();
			ctx.fill();
		}
		else if(rot < 0){
			ctx.beginPath();
			ctx.fillStyle = "orange";
			ctx.moveTo( 10, 20 );
			ctx.lineTo( 10 + rotFlameSize, 20 - rotFlameSize );
			ctx.lineTo( 10 + 2 * rotFlameSize + this._rocketFrame * 2 + Math.min( rot, rotFlameSize ) * 3, 20 );
			ctx.lineTo( 10 + rotFlameSize, 20 + rotFlameSize );
			ctx.closePath();
			ctx.fill();
		}

		this._rocketFrame = ( this._rocketFrame + 1 ) % 5;
	}

	ctx.restore();
}

Visualizer.prototype.draw = function(ctx, accel=null, rot=null) {
	ctx.save();

	// Acceleration indicator
	if(accel != null && accel > 0) {
		const minArrowLen = 20;
		const maxArrowLen = this.s/2 * 0.95;
		const accelLen = accel;
		let arrowLen = accelLen * this.s/2;
		arrowLen = Math.min(arrowLen, maxArrowLen);
		arrowLen = Math.max(arrowLen, minArrowLen);

		if(this.model != null) {
			this._accelArrow.copy(this.model.particle.dir)
				.normalize()
				.multiplyScalar(arrowLen)
				.addComponents(this.center.x, -this.center.y);
		}
		this._accelArrow.y *= -1;

		ctx.save();
		ctx.strokeStyle = "green";
		ctx.fillStyle = "green"
		ctx.lineWidth = 1;
		drawArrowhead(ctx, this.center, this._accelArrow, 15);
		ctx.beginPath();
		ctx.moveTo(this.center.x, this.center.y);
		ctx.lineTo(this._accelArrow.x, this._accelArrow.y);
		ctx.stroke();
		ctx.restore();

		drawLabel( ctx, accelLen.toFixed(3), this.center.x, this.center.y );
	}

	// Distance marker
	ctx.save()
	ctx.strokeStyle = "darkred";
	ctx.beginPath();
	ctx.arc(this.center.x, this.center.y, 10, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.restore();

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

	if(this.model != null) {
		// Position and speed
		const lowerEdge = this.y + this.s;
		const leftEdge = this.x + 5;
		const lineHeight = 14;
		const prec = 2;

		drawLabel(ctx, "pos: " + this.model.particle.pos.x.toFixed(prec) + "," + this.model.particle.pos.y.toFixed(prec),
			leftEdge, lowerEdge - 3 * lineHeight, "left");
		drawLabel(ctx, "vel: " + this.model.particle.vel.x.toFixed(prec) + "," + this.model.particle.vel.y.toFixed(prec),
			leftEdge, lowerEdge - 2 * lineHeight, "left");
		drawLabel(ctx, "avl: " + this.model.particle.avl.toFixed(prec),
			leftEdge, lowerEdge - 1 * lineHeight, "left");

		// Particle
		let scale = 1;
		let dx = this.model.particle.pos.x;
		let dy = this.model.particle.pos.y;
		const edge = this.s / 2;
		while(Math.abs(dx) > edge || Math.abs(dy) > edge) {
			scale *= 2;
			dx /= 2;
			dy /= 2;
		}
		dx = Math.trunc(dx);
		dy = Math.trunc(dy);

		drawLabel(ctx, "scale 1:" + scale.toString(),
			this.center.x, lowerEdge - 1 * lineHeight, "center");
		if(scale > 1) {
			ctx.save();
			ctx.strokeStyle = "darkgrey";
			ctx.setLineDash([1, 1]);
			const scaleBoxSize = this.s / scale;
			ctx.strokeRect(this.center.x - scaleBoxSize/2, this.center.y - scaleBoxSize/2,
				scaleBoxSize, scaleBoxSize);
			ctx.restore();
		}

		const x = this.center.x + dx;
		const y = this.center.y - dy;
		const r = 2;

		this.drawRocket( ctx, x, y, accel, rot );

		// Rocket center mass
		ctx.save();
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(x, y, r, 0, (Math.PI * 2), true);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

}

// positions is an array of [x,y] arrays
// always draws at scale 1
Visualizer.prototype.drawPath = function(ctx, positions, color="white") {
	ctx.save();
	ctx.strokeStyle = color;
	ctx.beginPath();
	for(let i = 0; i < positions.length; ++i) {
		const x = positions[i][0];
		const y = positions[i][1];
		const ex = this.center.x + x;
		const ey = this.center.y - y;
		if(i == 0) {
			ctx.moveTo( ex, ey );

			ctx.save();
			ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.arc(ex, ey, 5, 0, (Math.PI * 2), true);
			ctx.closePath();
			ctx.fill();
			ctx.restore();
		}
		else {
			ctx.lineTo( ex, ey );
		}
	}
	ctx.stroke();
	ctx.restore();
}
