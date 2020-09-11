/*
	Fitness progress graph
*/

/*
@param x
@param y
@param width
@param height
*/
function FitnessGraph( x, y, width, height )
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.generation = 0;

	this.history = [];
}

FitnessGraph.prototype.push = function( fitness )
{
	if( this.history.length == this.width ) {
		this.history.shift();
	}
	this.generation += 1;
	this.history.push( fitness );
}

FitnessGraph.prototype.clear = function()
{
	this.history = [];
	this.generation = 0;
}

FitnessGraph.prototype.draw = function( ctx )
{
	const sections = 10;
	for( let i = 0; i < sections; ++i ) {
		ctx.save();
		ctx.fillStyle = ( i % 2 == 0 ) ? "lightgrey" : "silver";
		ctx.fillRect( this.x + i * this.width / sections, this.y, this.width / sections, this.height );
		ctx.restore();
	}

	ctx.beginPath();
	ctx.moveTo( this.x, this.y );
	for( let i = 0; i < this.history.length; ++i ) {
		const f = this.history[ i ];
		let lineHeight = 0;
		if( f >= 0 ) {
			lineHeight = Math.log10( f );
			lineHeight *= 5;
		}
		else {
		}
		lineHeight = Math.max( 0, lineHeight ) / this.height;
		ctx.lineTo( this.x + i, this.y + this.height - lineHeight * this.height );
	}
	ctx.stroke();

	ctx.save();
	ctx.font = "12px sans-serif";
	ctx.fillText(
		"Generation: " + this.generation + "  Fitness: " + (Math.trunc(this.history[this.history.length-1] * 100) / 100),
		this.x, this.y + this.height - 10
		);
	ctx.restore();
}
