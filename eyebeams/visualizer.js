/*
	Draw a model into a context

	Also stores reference to the model so can be used as the sole storage.
	The drawing method does not automatically run the model.
*/

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
	ctx.save();
	var rot = Math.PI / 2 * 3;
	var x = cx;
	var y = cy;
	var step = Math.PI / spikes;

	ctx.beginPath();
	ctx.moveTo(cx, cy - outerRadius)
	for (i = 0; i < spikes; i++) {
		x = cx + Math.cos(rot) * outerRadius;
		y = cy + Math.sin(rot) * outerRadius;
		ctx.lineTo(x, y)
		rot += step

		x = cx + Math.cos(rot) * innerRadius;
		y = cy + Math.sin(rot) * innerRadius;
		ctx.lineTo(x, y)
		rot += step
	}
	ctx.lineTo(cx, cy - outerRadius)
	ctx.closePath();
	ctx.lineWidth=5;
	ctx.strokeStyle='red';
	ctx.stroke();
	ctx.fillStyle='yellow';
	ctx.fill();
	ctx.restore();
}

// x,y = top left, s = edge length of square display
function Visualizer(model, pilotNet, x, y, s) {
	this.model = model;
	this.pilotNet = pilotNet;
	this.x = x;
	this.y = y;
	this.s = s;

	this.center = new Vec2(this.x + this.s/2, this.y + this.s/2);
	this.distanceMarker = 20;

	this._accelArrow = new Vec2();
	this._rocketFrame = 0;

	this._v1 = new Vec2();
}

Visualizer.prototype.drawRocket = function(ctx, x, y, accel=null, rot=null) {
	ctx.save();
	ctx.translate( x, y );

	ctx.rotate( -(this.model.rocket.dir.angle() - Math.PI / 2) );

	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.fillStyle = "lightblue";
	ctx.moveTo( -10, 20 );
	ctx.lineTo( -5, 15 );
	ctx.lineTo( -5, -15 );
	ctx.lineTo( 0, -20 );
	ctx.lineTo( 5, -15 );
	ctx.lineTo( 5, 15 );
	ctx.lineTo( 10, 20 );
	ctx.closePath();
	ctx.fill();

	if( accel != null && this.model.rocket.fuel > 0 ) {
		if(accel > 0) {
			ctx.beginPath();
			ctx.fillStyle = "orange";
			ctx.moveTo( 0, 20 );
			ctx.lineTo( 3, 23 );
			ctx.lineTo( 0, 30 + this._rocketFrame * 2 + ( accel / 0.1 ) * 15 );
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
	const lineHeight = 14;

	// Acceleration indicator
	if(accel != null && accel > 0) {
		const minArrowLen = 20;
		const maxArrowLen = this.s/2 * 0.95;
		const accelLen = accel;
		let arrowLen = accelLen * this.s/2;
		arrowLen = Math.min(arrowLen, maxArrowLen);
		arrowLen = Math.max(arrowLen, minArrowLen);

		if(this.model != null) {
			this._accelArrow.copy(this.model.rocket.dir)
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

	// Rotation label
	if(rot != null && rot != 0) {
		drawLabel( ctx, "rot: " + rot.toFixed(3), this.center.x, this.center.y + lineHeight );
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

	if(this.model != null) {
		// Position and speed
		const lowerEdge = this.y + this.s;
		const leftEdge = this.x + 5;
		const prec = 2;

		const p = this.model.rocket;

//		drawLabel(ctx, "angle pos/dir: " + (getVec2Angle(p.pos, p.dir) / Math.PI * 180), leftEdge, lowerEdge - 5 * lineHeight, "left");
//		v1.copy(p.pos).normalize().multiplyScalar(-1);
//		drawLabel(ctx, "dot pos/vel: " + (v1.dot(p.vel)), leftEdge, lowerEdge - 5 * lineHeight, "left");

		drawLabel(ctx, "fuel: " + p.fuel.toFixed(prec),
			leftEdge, lowerEdge - 5 * lineHeight, "left");
		drawLabel(ctx, "dir: " + p.dir.x.toFixed(prec) + "," + p.dir.y.toFixed(prec),
			leftEdge, lowerEdge - 4 * lineHeight, "left");
		drawLabel(ctx, "pos: " + p.pos.x.toFixed(prec) + "," + p.pos.y.toFixed(prec),
			leftEdge, lowerEdge - 3 * lineHeight, "left");
		drawLabel(ctx, "vel: " + p.vel.x.toFixed(prec) + "," + p.vel.y.toFixed(prec),
			leftEdge, lowerEdge - 2 * lineHeight, "left");
		drawLabel(ctx, "avl: " + p.avl.toFixed(prec),
			leftEdge, lowerEdge - 1 * lineHeight, "left");

		// Rocket
		let scale = 1;
		let dx = p.pos.x;
		let dy = p.pos.y;
		const edge = this.s / 2;
		while(Math.abs(dx) > edge || Math.abs(dy) > edge) {
			scale *= 2;
			dx /= 2;
			dy /= 2;
		}
		dx = Math.trunc(dx);
		dy = Math.trunc(dy);

		// Pods
		this.drawPods( ctx, this.model.pods, this.model.POD_SIZE, scale );

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

		// 5 eye beams: -40, -20, 0, 20, 40
		if(this.model.pods.length > 0) {
			function drawBeam(dirVec, beamLen) {
				ctx.beginPath();
				ctx.lineWidth = "1";
				ctx.strokeStyle = "darkred";
				ctx.setLineDash([1, 1]);
				ctx.moveTo( x, y );
				ctx.lineTo( dirVec.x * beamLen + x, y - dirVec.y * beamLen );
				ctx.closePath();
				ctx.stroke();
			}
			ctx.save();
			for(let i = 0; i < this.pilotNet.nEyeBeams; ++i) {
				const beam = this.pilotNet.beams[ i ];
				if(beam.t >= 0 && scale == 1) {
					drawBeam(beam.dir, beam.t);
					this._v1.copy(beam.dir).multiplyScalar(beam.t).add(this.model.rocket.pos);
					ctx.save();
					ctx.fillStyle = "red";
					ctx.beginPath();
					ctx.arc(this.center.x + this._v1.x, this.center.y - this._v1.y, 3, 0, (Math.PI * 2), true);
					ctx.closePath();
					ctx.fill();
					ctx.restore();
				}
				else {
					drawBeam(beam.dir, 1000);
				}
			}
			ctx.restore();
		}

		// Rocket center mass
		ctx.save();
		ctx.fillStyle = "darkblue";
		ctx.beginPath();
		ctx.arc(x, y, r, 0, (Math.PI * 2), true);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

}

Visualizer.prototype.drawPods = function( ctx, pods, podSize, scale = 1 ) {
	for(i = 0; i < pods.length; ++i) {
		const podPos = pods[ i ];
		const x = Math.trunc(this.center.x + podPos.x / scale);
		const y = Math.trunc(this.center.y - podPos.y / scale);
		const r = Math.trunc(podSize / scale);

		ctx.save();
		ctx.fillStyle = "black";
		ctx.strokeStyle = "orange";
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.fillStyle = "orange";
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, r, 0, Math.PI / 2, false);
		ctx.fill();
		ctx.restore();

		ctx.fillStyle = "orange";
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, r, Math.PI, Math.PI / 2 * 3, false);
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

Visualizer.prototype.drawExplosion = function(ctx, radius) {
	const p = this.model.rocket;
	const dx = Math.trunc(p.pos.x);
	const dy = Math.trunc(p.pos.y);
	const x = this.center.x + dx;
	const y = this.center.y - dy;
	drawStar(ctx, x, y, 11, radius, Math.trunc(radius / 6));
}
