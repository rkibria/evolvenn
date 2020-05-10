
function Vec2(x = 0.0, y = 0.0) {
	this.x = x;
	this.y = y;
}

Vec2.prototype.add = function(v) {
	this.x += v.x;
	this.y += v.y;
	return this;
};

Vec2.prototype.addComponents = function(x, y) {
	this.x += x;
	this.y += y;
	return this;
};

Vec2.prototype.addScalar = function(s) {
	this.x += s;
	this.y += s;
	return this;
};

Vec2.prototype.addScaledVector = function(v, s) {
	this.x += v.x * s;
	this.y += v.y * s;
	return this;
};

Vec2.prototype.addVectors = function(a, b) {
	this.x = a.x + b.x;
	this.y = a.y + b.y;
	return this;
};

Vec2.prototype.copy = function(v) {
	this.x = v.x;
	this.y = v.y;
	return this;
};

Vec2.prototype.copyScaled = function(v, s) {
	this.x = v.x * s;
	this.y = v.y * s;
	return this;
};

Vec2.prototype.clear = function() {
	this.x = this.y = 0;
	return this;
};

Vec2.prototype.divide = function(v) {
	this.x /= v.x;
	this.y /= v.y;
	return this;
};

Vec2.prototype.divideScalar = function(s) {
	this.x /= s;
	this.y /= s;
	return this;
};

Vec2.prototype.dot = function(v) {
	return this.x * v.x + this.y * v.y;
};

Vec2.prototype.equals = function(v) {
	return this.x == v.x && this.y == v.y;
};

Vec2.prototype.isZero = function() {
	return this.x == 0 && this.y == 0;
};

Vec2.prototype.length = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vec2.prototype.lengthSq = function() {
	return (this.x * this.x + this.y * this.y);
};

Vec2.prototype.map = function(f) {
	this.x = f(this.x);
	this.y = f(this.y);
	return this;
};

Vec2.prototype.mapFrom = function(v, f) {
	this.x = f(v.x);
	this.y = f(v.y);
	return this;
};

Vec2.prototype.multiply = function(v) {
	this.x *= v.x;
	this.y *= v.y;
	return this;
};

Vec2.prototype.multiplyScalar = function(s) {
	this.x *= s;
	this.y *= s;
	return this;
};

Vec2.prototype.multiplyVectors = function(a, b) {
	this.x = a.x * b.x;
	this.y = a.y * b.y;
	return this;
};

Vec2.prototype.normalize = function() {
	return this.divideScalar(this.length());
};

Vec2.prototype.perpendicularize = function() {
	const tx = this.x;
	this.x = -this.y;
	this.y = tx;
	return this;
};

Vec2.prototype.randomInUnitDisk = function() {
	do {
		this.x = 2.0 * Math.random() - 1.0;
		this.y = 2.0 * Math.random() - 1.0;
	} while(this.lengthSq() >= 1.0);
	return this;
};

Vec2.prototype.randomInRange = function(x1, x2, y1, y2) {
	this.x = Math.floor(Math.random() * (x2 - x1 + 1)) + x1;
	this.y = Math.floor(Math.random() * (y2 - y1 + 1)) + y1;
	return this;
};

Vec2.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
	return this;
};

Vec2.prototype.setScalar = function(s) {
	this.x = s;
	this.y = s;
	return this;
};

Vec2.prototype.sub = function(v) {
	this.x -= v.x;
	this.y -= v.y;
	return this;
};

Vec2.prototype.subComps = function(x, y) {
	this.x -= x;
	this.y -= y;
	return this;
};

Vec2.prototype.subScalar = function(s) {
	this.x -= s;
	this.y -= s;
	return this;
};

Vec2.prototype.subScaledVector = function(v, s) {
	this.x -= v.x * s;
	this.y -= v.y * s;
	return this;
};

Vec2.prototype.subVectors = function(a, b) {
	this.x = a.x - b.x;
	this.y = a.y - b.y;
	return this;
};

Vec2.prototype.clampLength = function(r) {
	const l = this.length();
	if(l > r) {
		this.multiplyScalar(r / l);
	}
	return this;
};

Vec2.prototype.toString = function Vec2ToString() {
	return "[" + this.x + ', ' + this.y + "]";
};

function getVec2DistanceSq(v1, v2) {
	const dx = v1.x - v2.x;
	const dy = v1.y - v2.y;
	return dx * dx + dy * dy;
}

function getVec2Distance(v1, v2) {
	const dx = v1.x - v2.x;
	const dy = v1.y - v2.y;
	return Math.sqrt(dx * dx + dy * dy);
}

function getVec2Angle(v1, v2) {
	return Math.atan2(v2.y - v1.y, v2.x - v1.x);
}
