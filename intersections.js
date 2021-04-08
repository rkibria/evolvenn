
/**
 * Determine if ray intersects a circle outline
 * @param  {Vec2}  P   Initial point of ray
 * @param  {Vec2}  D   Direction of ray (unit vector expected)
 * @param  {Vec2}  C   Center point of circle
 * @param  {Float} r   Radius of circle
 * @return {Float} Multiplier t for P+t*D to reach nearest intersection point, or -1 if no intersection
 */
function nearestCircleLineIntersect(P, D, C, r) {
  function sq(i) {
	return i * i;
  }
  const a = sq(D.x) + sq(D.y);
  const b = (2 * D.x * P.x - 2 * C.x * D.x) + (2 * D.y * P.y - 2 * C.y * D.y);
  const c = (sq(P.x) - 2 * C.x * P.x + sq(C.x)) + (sq(P.y) - 2 * C.y * P.y + sq(C.y)) - sq(r);
  const discriminant = sq(b) - 4 * a * c;
  if(discriminant == 0) {
	return -b / (2 * a);
  }
  else if (discriminant > 0) {
	return (-b - Math.sqrt( discriminant )) / (2 * a);
  }
  return -1;
}
