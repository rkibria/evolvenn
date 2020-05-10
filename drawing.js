
// https://gist.github.com/jwir3/d797037d2e1bf78a9b04838d73436197
/**
 * Draw an arrowhead on a line on an HTML5 canvas.
 *
 * Based almost entirely off of http://stackoverflow.com/a/36805543/281460 with some modifications
 * for readability and ease of use.
 *
 * @param context The drawing context on which to put the arrowhead.
 * @param from A point, specified as an object with 'x' and 'y' properties, where the arrow starts
 *             (not the arrowhead, the arrow itself).
 * @param to   A point, specified as an object with 'x' and 'y' properties, where the arrow ends
 *             (not the arrowhead, the arrow itself).
 * @param radius The radius of the arrowhead. This controls how "thick" the arrowhead looks.
 */
function drawArrowhead(context, from, to, radius, filled=false) {
	var x_center = to.x;
	var y_center = to.y;

	var angle;
	var x;
	var y;

	context.beginPath();

	angle = Math.atan2(to.y - from.y, to.x - from.x)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.moveTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.lineTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius *Math.cos(angle) + x_center;
	y = radius *Math.sin(angle) + y_center;

	context.lineTo(x, y);

	context.closePath();

	if(filled) {
		context.fill();
	}
	else {
		context.stroke();
	}
}

function drawLabel(ctx, txt, x, y, textAlign="center") {
	ctx.save();
	ctx.font = "12px sans-serif";
	ctx.textAlign = textAlign;
	ctx.setLineDash([]);
	ctx.strokeStyle = 'black';
	ctx.fillStyle = 'white';
	ctx.miterLimit = 2;
	ctx.lineJoin = 'circle';
	ctx.lineWidth = 3;
	ctx.strokeText(txt, x, y);
	ctx.lineWidth = 1;
	ctx.fillText(txt, x, y);
	ctx.restore();
}
