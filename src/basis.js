/*

	basis.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Basis Variables
// -----------------------------------------------------------------------------
// =============================================================================

var script = {
	"name" : "SWOT",
	"version" : "1.0"
}

var backdrop = {
	"scale" : 1.0
}

var mouse = {
	"target" : null,
	"down" : false,
	"x" : 0,
	"y" : 0
};

// =============================================================================
// -----------------------------------------------------------------------------
// # Utility Functions
// -----------------------------------------------------------------------------
// =============================================================================

function getSign(n) { // n = number (numeric) ; returns signed integer
	return n > 0 ? 1 : -1;
}

function isPointOverElement(s, x, y) { // s = HTML element id (string), x, y = coordinates (pixel) ; returns boolean
	let o = document.getElementById(s);
	let r = o.getBoundingClientRect();
	return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

function isElementOnScreen(s) { // s = HTML element id (string) ; returns boolean
	let o = document.getElementById(s);
	let r = o.getBoundingClientRect();
	return r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth && r.bottom <= window.innerHeight;
}

function isElementHilitable() {
	return !isInputScaling()
			&& !isInputMoving()
			&& !label.write
			&& !frame.moving
			&& sheet.source == null;
}

function canMoveOverElement(o) { // o = DOM element (object) ; returns boolean
	let s = o.id;
	let c1 = s != "bulb" && s != "tribar" && s != "create" && s != "delete";
	let c2 = true;
	if (o.parentElement != null) {
		s = o.parentElement.id;
		c2 = s != "bubble" && s != "menu" && s != "lock" && s != "create" && s!= "delete"
	}  return c1 && c2;
}

function forceClick(s) { // s = HTML element id (string)
	let o = document.getElementById(s);
	o.click();
	o.focus();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Basis Functions
// -----------------------------------------------------------------------------
// =============================================================================

function initElementsTitle() {
	let k, o, l = conf.title;
	for (k in l) {
		o = document.getElementById(k);
		if (o != null) o.setAttribute("title", l[k]);
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Cursor Functions
// -----------------------------------------------------------------------------
// =============================================================================

function changeCursor(s) { // s = CSS cursor (string)
	let o = document.getElementsByTagName("body")[0];
	o.style.cursor = s;
}

function resetCursor() {
	changeCursor("");
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Topic Functions
// -----------------------------------------------------------------------------
// =============================================================================

function getTopicText(s) { // returns topic text (string)
	let o = document.getElementById("topic");
	return o.innerText;
}

function setTopicText(s) { // s = topic text (string)
	let o = document.getElementById("topic");
	o.innerText = s;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Topic Events
// -----------------------------------------------------------------------------
// =============================================================================

document.getElementById("topic").addEventListener("mouseenter", function(e) {
	if (isElementHilitable()) {
		this.classList.add("hilite");
	}
});

document.getElementById("topic").addEventListener("mouseleave", function(e) {
	this.classList.remove("hilite");
});

// =============================================================================
// -----------------------------------------------------------------------------
// # Backdrop Functions
// -----------------------------------------------------------------------------
// =============================================================================

function setBackdropImage(s) { // s = string
	let o = document.getElementById("backdrop");
	o.style.backgroundImage = "url('img/backdrop/" + s + ".svg')";
}

function centerBackdropOnScreen() {
	let o = document.getElementById("backdrop");
	o.style.left = -((o.offsetWidth - window.innerWidth) / 2) + "px";
	o.style.top = -((o.offsetHeight - window.innerHeight) / 2) + "px";
}

function centerBackdropOnFrame() {
	let o = document.getElementById("frame");
	let u = document.getElementById("backdrop");
	let w1 = o.offsetWidth * frame.scale;
	let h1 = o.offsetHeight * frame.scale;
	let w2 = u.offsetWidth * backdrop.scale;
	let h2 = u.offsetHeight * backdrop.scale;
	let x1 = o.offsetLeft;
	let y1 = o.offsetTop;
	let x2 = x1 - ((w2 - w1) / 2);
	let y2 = y1 - ((h2 - h1) / 2);
	u.style.left = x2 + "px";
	u.style.top = y2 + "px";
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Document Events
// -----------------------------------------------------------------------------
// =============================================================================

document.addEventListener("mousedown", function(e) {

	if (modal.shown) return; // TEMP

	if (e.button == 0) { // left click

		mouse.x = e.clientX;
		mouse.y = e.clientY;
		mouse.down = true;

		if (e.target.parentElement.id != "label"
		 && e.target.parentElement.id != "bubble") hideLabel(); // TEMP

		if (menu.shown
		 && e.target.id != "tribar"
		 && !isPointOverElement("menu", e.clientX, e.clientY)) hideMenu();

		setFrameOrigin(mouse.x, mouse.y); // TEMP

		if (!(isInputScaling() || isInputMoving())) {
			if ((isInputEditing() || isEditModeActive())
			 && (e.target.classList.contains("sheet") || e.target.id == "topic")) {
				showLabel(e.target, true);
				mouse.down = false;
			} else if (e.target.id == "slider") {
				startRosterSliding();
			} else if (e.target.classList.contains("sheet")) {
				takeSheet(e.target);
			} else if (canMoveOverElement(e.target)) {
				changeCursor("grab");
			} else {
				mouse.down = false;
			}
		}

	}
});

document.addEventListener("mouseup", function(e) {
	if (e.button == 0) { // left click

		mouse.down = false;

		setFrameOrigin(mouse.x, mouse.y); // TEMP

		if (sheet.source != null) {
			dropSheet(sheet.source);
			sheet.source = null;
			if (frame.automove.start) stopAutoMove();
		}

		if (frame.moving) frame.moving = false;

		checkInput();

	}
});

document.addEventListener("mousemove", function(e) {

	if (mouse.down) {

		let x = e.clientX - mouse.x;
		let y = e.clientY - mouse.y;

		// * (A) Drag sheet
		if (sheet.source != null) {
			// * (1) Move sheet
			moveSheet(sheet.source);
			// * (2) Check auto-move
			if (!frame.locked) checkAutoMove(e.clientX, e.clientY);
		}
		// * (B) Scale frame
		if (isInputScaling()) {
			// * (1) Check frame origin
			if (frame.moving) { // has moved before scaling without releasing left mouse button
				setFrameOrigin(mouse.x, mouse.y); // TEMP
				frame.moving = false;
			}
			// * (2) Scale frame
			increaseFrameScale(Math.max(Math.min(Math.abs(x) / 200, 1.0), 0.01) * getSign(-x), true);
		}
		// * (C) Resize roster
		else if (roster.sliding) {
			slideRoster(e.clientX);
		}
		// * (D) Move frame
		else if (isInputMoving() || sheet.source == null) {
			// * (1) Change cursor
			changeCursor("grab"); // TEMP
			// * (2) Move frame
			if (!frame.moving) frame.moving = true;
			moveFrameOnScreen(x, y);
		}

		mouse.x = e.clientX;
		mouse.y = e.clientY;

	}

});

document.addEventListener("wheel", function(e) {

	if (modal.shown) return; // TEMP

	if (e.ctrlKey) return; // browser increase/decrease font size

	if (roster.shown && isPointOverElement("roster", e.clientX, e.clientY)) return; // not on roster

	if (e.shiftKey) {
		setFrameScale(e.deltaY > 0 ? getFrameScaleMin() : getFrameScaleMax());
	} else {
		upgradeFrameScale(getSign(-e.deltaY));
	}

	// console.log("x = " + e.deltaX + " y = " + e.deltaY + " z = " + e.deltaZ); // DEBUG

});

// =============================================================================
// -----------------------------------------------------------------------------
// # Window Events
// -----------------------------------------------------------------------------
// =============================================================================

window.addEventListener("load", function() {
	if (conf.backdrop.show) {
		setBackdropImage(conf.backdrop.image);
		centerBackdropOnScreen(); // TEMP
	}
	initElementsTitle();
	initLabelRecord();
	if (conf.launch.show_roster) showRoster();
	if (conf.launch.lock_frame) lockFrame(); else setScaleText(1.0);
	if (conf.launch.load_last_data) loadLastData();
	equalizeAllPanels();
});

window.addEventListener("resize", function() {
	if (conf.backdrop.show) centerBackdropOnScreen(); // TEMP
	if (roster.shown) resizeRoster();
	if (label.write) resizeLabel(null, true); // TEMP
	frame.locked ? lockFrame() : checkFrameOnScreen();
});

