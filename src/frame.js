/*

	frame.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Frame Variables
// -----------------------------------------------------------------------------
// =============================================================================

var frame = {
	"locked" : false,
	"moving" : false,
	"origin" : {"x" : 0, "y" : 0},
	"scale" : 1.0,
	"last" : {
		"position" : {"x" : 0, "y" : 0},
		"origin" : {"x" : 0, "y" : 0},
		"scale" : 1.0
	},
	"automove" : {
		"timer" : null,
		"count" : 0,
		"start" : false,
		"top" : false,
		"left" : false,
		"right" : false,
		"bottom" : false
	}
};

// =============================================================================
// -----------------------------------------------------------------------------
// # Frame Functions
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// * Properties
////////////////////////////////////////////////////////////////////////////////

function getFrameHeight() {
	let o = document.getElementById("frame");
	return o.offsetHeight * frame.scale;
}

////////////////////////////////////////////////////////////////////////////////
// * Origin
////////////////////////////////////////////////////////////////////////////////

function getFrameCenter() { // returns coordinates {x,y}
	let o = document.getElementById("frame");
	let r = o.getBoundingClientRect();
	x = r.x + Math.round(r.width / 2);
	y = r.y + Math.round(r.height / 2);
	return {"x" : x, "y" : y}
}

function setFrameOrigin(x, y, b) { // x, y = coordinates (px), b = force center
	if (b || !isPointOverElement("frame", x, y)) {
		// * (1) Center of screen
		// frame.origin.x = Math.round(window.innerWidth / 2);
		// frame.origin.y = Math.round(window.innerHeight / 2);
		// * (2) Center of box
		let c = getFrameCenter();
		// * (3) Center frame if center of box out of screen
		// if (c.x < 0 || c.y < 0 || c.x > window.innerWidth || c.y > window.innerHeight) {
		// 	centerFrame();
		// 	c = getFrameCenter();
		// }
		x = c.x;
		y = c.y;
	}
	frame.origin.x = x;
	frame.origin.y = y;
}

function centerFrameOrigin() {
	setFrameOrigin(null, null, true);
}

////////////////////////////////////////////////////////////////////////////////
// * Translate
////////////////////////////////////////////////////////////////////////////////

function translateFrame(x, y) { // x, y = coordinates (px)
	// * Move frame
	let o = document.getElementById("frame");
	o.style.left = x == 0 ? "" : x + "px";
	o.style.top = y == 0 ? "" : y + "px";
	// * Unlock
	checkFrameLock(false);
	// * Move backdrop
	if (conf.backdrop.move) centerBackdropOnFrame();
}

function centerFrame(b, c) { // b = stick to roster flag (boolean), c = center frame origin (boolean)
	let o = document.getElementById("frame");
	let u = document.getElementById("roster");
	let r = o.getBoundingClientRect();
	let x, y;
	if (b && roster.shown) x = u.offsetLeft + u.offsetWidth + conf.frame.border;
	else x = Math.floor((window.innerWidth - r.width) / 2);
	y = Math.floor((window.innerHeight - r.height) / 2);
	translateFrame(x, y);
	if (c) centerFrameOrigin();
}

function setFrameOnScreen(x, y, t, i) { // x, y = coordinates (px), t = translate flag (bool), incremental flag (bool); returns boolean
	let o = document.getElementById("frame");
	let r = o.getBoundingClientRect();
	if (x == null) x = r.x; else if (i) x += r.x;
	if (y == null) y = r.y; else if (i) y += r.y;
	let v = true;
	let lim = conf.frame.bound;
	let d_x = r.x == x ? 0 : r.x > x ? -1 : 1; // directionX => 0 OR -x/+x -> toward left/right
	let d_y = r.y == y ? 0 : r.y > y ? -1 : 1; // directionY => 0 OR -y/+y -> toward top/bottom
	let r_b = 0 - r.width + lim; // right bound
	let l_b = window.innerWidth - lim; // left bound
	let t_b = 0 - r.height + lim; // top bound
	let b_b = window.innerHeight - lim; // bottom bound
	let c_x = true; // not out of screen toward left
	let c_y = true; // not out of screen toward top
	if (d_x <= 0 && x + r.width < lim) {
		// console.log("--hit right bound toward left--"); // DEBUG
		c_x = false;
		v = false;
		x = r_b;
	}
	if ((d_x == 0 || c_x) && x > l_b) {
		// console.log("--hit left bound toward right--"); // DEBUG
		v = false;
		x = l_b;
	}
	if (d_y <= 0 && y + r.height < lim) {
		// console.log("--hit bottom bound toward top--"); // DEBUG
		c_y = false;
		v = false;
		y = t_b;
	}
	if ((d_y == 0 || c_y) && y > b_b) {
		// console.log("--hit top bound toward bottom--"); // DEBUG
		v = false;
		y = b_b;
	}
	if (t) translateFrame(x, y);
	return v;
}

function isFrameOnScreen() { // returns boolean
	return setFrameOnScreen();
}

function checkFrameOnScreen() {
	setFrameOnScreen(null, null, true);
}

function moveFrameOnScreen(x, y) { // x, y = coordinates (px)
	setFrameOnScreen(x, y, true, true);
}

function resetPosition() {
	translateFrame(0, 0);
}

////////////////////////////////////////////////////////////////////////////////
// * Scale
////////////////////////////////////////////////////////////////////////////////

function getFrameScaleMin() { // returns number (float)
	return conf.frame.scale[conf.frame.scale.length - 1];
}

function getFrameScaleMax() { // returns number (float)
	return conf.frame.scale[0];
}

function setScaleText(n) { // n = number (float)
	let q = document.getElementById("scale");
	q.innerHTML = (n * 100).toFixed(0) + "%";
}

function setFrameScale(n) { // n = number (float)
	let o = document.getElementById("frame");
	let p = document.getElementById("lock");
	// * Center at origin
	// let a = frame.origin.x - o.offsetLeft;
	// let b = frame.origin.y - o.offsetTop;
	// let fac_x = a / (o.offsetWidth * frame.scale);
	// let fac_y = b / (o.offsetHeight * frame.scale);
	// let new_a = o.offsetWidth * n * fac_x;
	// let new_b = o.offsetHeight * n * fac_y;
	// let new_x = frame.origin.x - new_a;
	// let new_y = frame.origin.y - new_b;
	// o.style.left = new_x + ("px");
	// o.style.top = new_y + ("px");
	// console.log("a = " + a + " b = " + b); // DEBUG
	// console.log("new_a = " + new_a + " new_b= " + new_b); // DEBUG
	o.style.left = (frame.origin.x - (o.offsetWidth * n * ((frame.origin.x - o.offsetLeft) / (o.offsetWidth * frame.scale)))) + "px";
	o.style.top = (frame.origin.y - (o.offsetHeight * n * ((frame.origin.y - o.offsetTop) / (o.offsetHeight * frame.scale)))) + "px";
	// * Scale frame
	frame.scale = n;
	o.style.transform = n == 1.0 ? "" : "scale(" + (n) + ")";
	// * Set scale text
	setScaleText(n);
	// * Keep on screen
	checkFrameOnScreen(); // TEMP
	// * Unlock
	checkFrameLock(false);
	// * Scale backdrop
	if (conf.backdrop.scale) {
		let u = document.getElementById("backdrop");
		let d = conf.backdrop.ratio;
		let m = n >= 1 ? 1.0 + ((n - 1.0) / d) : 1.0 - ((1.0 - n) / d);
		backdrop.scale = m;
		u.style.transform = m == 1.0 ? "" : "scale(" + (m) + ")";
		centerBackdropOnFrame();
	}
}

function increaseFrameScale(n, b) { // n = increment (signed float), b = change cursor (bool)
	// * Change cursor
	if (b) changeCursor("zoom-" + (n < 0 ? "in" : "out"));
	// * Scale frame (or not)
	let max = getFrameScaleMax();
	let min = getFrameScaleMin();
	if ((n > 0 && frame.scale > min)
	 || (n < 0 && frame.scale < max)) {
		n = frame.scale - n; // effective scaling
		n = n > max ? max : n < min ? min : Number.parseFloat(n.toFixed(3)); // max, min or round two decimals
		setFrameScale(n);
	} else {
		// console.log("-- no scale : min or max reached --"); // DEBUG
	}
}

function upgradeFrameScale(d, n) { // d = direction (signed int), n = scale value (float) [optional]
	if (n == null) n = frame.scale;
	let a = conf.frame.scale;
	let r = 1.0;
	if (d < 0) { // down direction (i.e. zoom in)
		r = a.find(function(v) { return v < n });
	} else if (d > 0) { // up direction (i.e. zoom out)
		a.reverse();
		r = a.find(function(v) { return v > n });
		a.reverse();
	}
	if (r != undefined) {
		setFrameScale(r);
	} else {
		// console.log("-- no scale : min or max reached --"); // DEBUG
	}
}

function maximizeFrameScale() {
	let o = document.getElementById("frame");
	let u = document.getElementById("roster");
	let a = roster.shown ? u.offsetLeft + u.offsetWidth : 0;
	let w = (window.innerWidth - conf.frame.border * 2 - a) / o.offsetWidth;
	let h = (window.innerHeight - conf.frame.border * 2) / o.offsetHeight;
	let s = 1.0;
	if (w > h) s = h; // lock on height
	else s = w; // lock on width
	// console.log("w = " + w + " h = " + h + " s = " + s); // DEBUG
	setFrameScale(s);
}

function resetFrameScale() {
	setFrameScale(1.0);
}

////////////////////////////////////////////////////////////////////////////////
// * Lock
////////////////////////////////////////////////////////////////////////////////

function playBackdropAnimation() {
	if (conf.backdrop.show && conf.frame.lock_anim.play) {
		let o = document.getElementById("backdrop");
		let s = conf.frame.lock_anim.name;
		o.style.animationName = o.style.animationName == s + "1" ? s + "2" : s + "1";
		o.style.animationPlayState = "running";
	}
}

function checkFrameLock(b) { // b = lock value (bool)
	if (frame.locked != b) {
		let o = document.getElementById("lock");
		o.removeAttribute("class")
		if (b) o.classList.add("locked");
		frame.locked = b;
	}
}

function lockFrame(b) { // b = register last properties
	// * Register last properties
	if (b) {
		let o = document.getElementById("frame");
		frame.last.position = {"x" : o.offsetLeft, "y" : o.offsetTop};
		frame.last.origin = {"x" : frame.origin.x, "y" : frame.origin.y};
		frame.last.scale = frame.scale;
	}
	// * Lock on screen
	maximizeFrameScale();
	centerFrame(true);
	centerFrameOrigin(); // TEMP
	// * Set lock
	checkFrameLock(true);
}

function restoreFrameProperties() {
	// * (1) Scale
	setFrameScale(frame.last.scale);
	// * (2) Move
	translateFrame(frame.last.position.x, frame.last.position.y);
	// * (3) Set origin
	setFrameOrigin(frame.last.origin.x, frame.last.origin.y);
}

function toggleFrameFitness(b) { // b = play animation (bool)
	// * Play animation
	if (b) playBackdropAnimation();
	// * Toggle lock
	frame.locked ? restoreFrameProperties() : lockFrame(true);
}

////////////////////////////////////////////////////////////////////////////////
// * Auto-move
////////////////////////////////////////////////////////////////////////////////

function autoMove() {
	frame.automove.count++;
	let b = frame.automove;
	let c = conf.frame.automove;
	let o = document.getElementById("frame");
	let r = o.getBoundingClientRect();
	if (r.top >= 0) b.top = false;
	if (r.left >= 0) b.left = false;
	if (r.right <= window.innerWidth) b.right = false;
	if (r.bottom <= window.innerHeight) b.bottom = false;
	let n = Math.min(b.count > c.delay ? (b.count - c.delay) * 1 : 1, c.value);
	let h = b.left ? n : b.right ? -n : 0;
	let v = b.top ? n : b.bottom ? -n : 0;
	moveFrameOnScreen(h, v);
}

function startAutoMove() {
	autoMove(); // initiate
	frame.automove.start = true;
	frame.automove.timer = setInterval(function() {
		if (!isInputActive()) autoMove() // repeat until stopped
	}, conf.frame.automove.speed);
}

function stopAutoMove() {
	frame.automove.count = 0;
	frame.automove.start =
	frame.automove.top =
	frame.automove.left =
	frame.automove.right =
	frame.automove.bottom = false;
	clearInterval(frame.automove.timer);
}

function checkAutoMove(x, y) { // x, y = coordinates (pixel)
	// * (1) Get directions
	let o = document.getElementById("frame");
	let r = o.getBoundingClientRect();
	let d_t = r.top < 0; // toward top
	let d_l = r.left < 0; // toward left
	let d_r = r.right > window.innerWidth; // toward right
	let d_b = r.bottom > window.innerHeight; // toward bottom
	// * (2) Get borders
	let lim = conf.frame.automove.bound;
	let b_t = d_t ? y < lim : false;
	let b_l = d_l ? x < lim : false;
	let b_r = d_r ? x > window.innerWidth - lim : false;
	let b_b = d_b ? y > window.innerHeight - lim : false;
	// * (3) Check automove
	if (b_t || b_l || b_r || b_b) {
		if (b_t || b_b) {
			if (x < Math.round(innerWidth / 3)) b_l = true;// also to the left
			else if (x > 2 * Math.round(innerWidth / 3)) b_r = true; // also to the right
		} else if (b_l || b_r) {
			if (y < Math.round(innerHeight / 3)) b_t = true; // also to the top
			else if (y > 2 * Math.round(innerHeight / 3)) b_b = true; // also to the bottom
		}
		frame.automove.top = b_t;
		frame.automove.bottom = b_b;
		frame.automove.left = b_l;
		frame.automove.right = b_r;
		if (!frame.automove.start) {
			startAutoMove();
		}
	} else {
		stopAutoMove();
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Frame Events
// -----------------------------------------------------------------------------
// =============================================================================

document.getElementById("lock").addEventListener("click", function() {
	toggleFrameFitness(true);
});

