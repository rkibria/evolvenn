

/**
 * Keeps track of the current mouse position, relative to an element.
 * @param {HTMLElement} element
 * @return {object} Contains properties: x, y, event
 */
function captureMouse(element) {
	var mouse = {x: 0, y: 0, event: null},
		body_scrollLeft = document.body.scrollLeft,
		element_scrollLeft = document.documentElement.scrollLeft,
		body_scrollTop = document.body.scrollTop,
		element_scrollTop = document.documentElement.scrollTop,
		offsetLeft = element.offsetLeft,
		offsetTop = element.offsetTop;

	element.addEventListener('mousemove', function (event) {
	var x, y;

	if (event.pageX || event.pageY) {
		x = event.pageX;
		y = event.pageY;
		} else {
		x = event.clientX + body_scrollLeft + element_scrollLeft;
		y = event.clientY + body_scrollTop + element_scrollTop;
		}
	x -= offsetLeft;
	y -= offsetTop;

	mouse.x = x;
	mouse.y = y;
	mouse.event = event;
	}, false);

	return mouse;
};

function captureMouseclick(element) {
	const mouseclick = {down: false};

	element.addEventListener('mousedown', function (event) {
			if(event.which == 1)
				mouseclick.down = true;
		}, false);

	element.addEventListener('mouseup', function (event) {
			if(event.which == 1)
				mouseclick.down = false;
		}, false);

	return mouseclick;
};
