/*

	roster.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Roster Variables
// -----------------------------------------------------------------------------
// =============================================================================

var roster = {
	"timer" : null,
	"shown" : false,
	"hilited" : false,
	"sliding" : false
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Roster Functions
// -----------------------------------------------------------------------------
// =============================================================================

function getRosterMaxWidth() {
	return Math.round(window.innerWidth / 2);
}

function resizeRoster() {
	// ---------------------------------------------------------------------------
	// * Box sizing calculation
	// ---------------------------------------------------------------------------
	// outer = 20 (top margin) + 60 (bulb height) + 20 (bottom margin)
	// inner = 2 x -3 (border width)
	// ---------------------------------------------------------------------------
	let o = document.getElementById("roster");
	let p = document.getElementById("toolbar");
	let q = o.querySelector(".list");
	let r = o.querySelector(".panel");
	let h = window.innerHeight - o.offsetTop - conf.roster.margin - Math.round(p.offsetHeight / 2);
	// ---------------------------------------------------------------------------
	// * Alternative for conf.roster.border -- UNUSED (time-consuming process)
	// ---------------------------------------------------------------------------
	// let s = window.getComputedStyle(q);
	// let b = s.getPropertyValue("border-top-width");
	// ---------------------------------------------------------------------------
	// * (1) Set height
	o.style.height = h + "px";
	q.style.height = r.style.minHeight = (h - conf.roster.border) + "px";
	// * (2) Check width
	let w = getRosterMaxWidth();
	if (o.offsetWidth > w) {
		o.style.width = (w) + "px";
		q.style.width = (w - conf.roster.border) + "px";
	}
}

function setRosterWidth(w) { // w = element width (pixel)
	let o = document.getElementById("roster");
	let q = o.querySelector(".list");
	let max = getRosterMaxWidth();
	let min = conf.roster.width.minimum;
	w = Math.max(Math.min(w, max), min);
	o.style.width = (w) + "px";
	q.style.width = (w - conf.roster.border) + "px";
	if (frame.locked) lockFrame();
}

function slideRoster(x) { // x = horizontal coordinate (pixel)
	let o = document.getElementById("roster");
	let q = o.querySelector(".list");
	setRosterWidth(x - o.offsetLeft);
}

function startRosterSliding() {
	let o = document.getElementById("slider");
	o.classList.add("active");
	roster.sliding = true;
	changeCursor("ew-resize");
}

function stopRosterSliding() {
	let o = document.getElementById("slider");
	o.classList.remove("active");
	roster.sliding = false;
}

function scrollRosterMax() {
	let o = document.getElementById("roster");
	let q = o.querySelector(".list");
	let u = o.querySelector(".panel");
	q.scrollTop = u.offsetHeight - q.offsetHeight + conf.roster.border;
}

function hiliteRosterSlider() {
	if (!sheet.taken) {
		roster.timer = setTimeout(function() {
			let o = document.getElementById("slider");
			o.classList.add("hilite");
			roster.hilited = true;
		}, conf.roster.delay.slider);
	}
}

function unliteRosterSlider() {
	clearTimeout(roster.timer);
	if (roster.hilited) {
		let o = document.getElementById("slider");
		o.classList.remove("hilite");
		roster.hilited = false;
	}
}

function showRoster() {
	let o = document.getElementById("roster");
	let p = document.getElementById("bulb");
	o.style.display = "";
	p.classList.add("active");
	resizeRoster();
	roster.shown = true;
}

function hideRoster() {
	let o = document.getElementById("roster");
	let p = document.getElementById("bulb");
	o.style.display = "none";
	p.classList.remove("active");
	roster.shown = false;
	unliteRosterSlider();
	if (label.shown && label.create) hideLabel();
}

function toggleRoster() {
	roster.shown ? hideRoster() : showRoster();
	if (frame.locked) lockFrame();
	if (label.shown) resizeLabel(null, true);
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Roster Events
// -----------------------------------------------------------------------------
// =============================================================================

document.getElementById("bulb").addEventListener("click", function() {
	toggleRoster();
});

document.getElementById("bulb").addEventListener("mouseenter", function() {
	if (sheet.taken && !roster.shown) {
		clearTimeout(roster.timer);
		roster.timer = setTimeout(toggleRoster, conf.roster.delay.drag_sheet);
	}
});

document.getElementById("bulb").addEventListener("mouseleave", function() {
	if (sheet.taken && !roster.shown) {
		clearTimeout(roster.timer);
	}
});

document.getElementById("slider").addEventListener("mouseenter", function() {
	if (!isInputEditing()) hiliteRosterSlider();
});

document.getElementById("slider").addEventListener("mouseleave", function() {
	unliteRosterSlider();
});

document.getElementById("slider").addEventListener("dblclick", function() {
	setRosterWidth(conf.roster.width.default);
});

