/*

	panel.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Panel Variables
// -----------------------------------------------------------------------------
// =============================================================================

var panel = {
	"source" : null,
	"target" : null
};

// =============================================================================
// -----------------------------------------------------------------------------
// # Panel Functions
// -----------------------------------------------------------------------------
// =============================================================================

function hilitePanel(o) { // o = DOM element
	if (panel.source != o) {
		o.classList.add("active");
		panel.target = o;
	}
}

function unlitePanel(o) { // o = DOM element
	o.classList.remove("active");
	panel.target = null;
}

function unlitePanels() {
	panel.source = null;
	document.querySelectorAll(".panel").forEach(function(o) {
		unlitePanel(o);
	});
}

function getOppositePanel(o) { // o = DOM object
	let s;
	switch(o.id) {
		case "str" : s = "wkn"; break;
		case "wkn" : s = "str"; break;
		case "opp" : s = "thr"; break;
		case "thr" : s = "opp"; break;
	} return document.getElementById(s);
}

function equalizeOppositePanels(o) { // o = DOM object
	let u = getOppositePanel(o);
	if (u != null) {
		u.style.height = "";
		o.style.height = "";
		let h;
		let h1 = o.offsetHeight;
		let h2 = u.offsetHeight;
		h = h1 >= h2 ? h1 : h2;
		u.style.height = h + "px";
		o.style.height = h + "px";
	}
}

function equalizeAllPanels() {
	equalizeOppositePanels(document.getElementById("str"));
	equalizeOppositePanels(document.getElementById("opp"));
	if (frame.locked) lockFrame();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Panel Events
// -----------------------------------------------------------------------------
// =============================================================================

document.querySelectorAll(".panel").forEach(function(o) {

	o.addEventListener("mouseenter", function(e) {
		if (sheet.source != null) {
			hilitePanel(e.target);
		}
	});

	o.addEventListener("mouseleave", function(e) {
		unliteSheet();
		if (sheet.source != null) {
			unlitePanel(e.target);
		} else if (!label.write) {
			hideLabel();
			label.popped = false;
		}
	});

	o.addEventListener("mouseover", function(e) {
		if (isElementHilitable() && e.target.classList.contains("sheet")) {
			if (!(o.id != "pool" && frame.scale > conf.label.scale)) delayLabel(e.target);
			hiliteSheet(e.target);
		} else if (!label.write) {
			hideLabel();
		}
	});

	o.addEventListener("mouseout", function(e) {
		if (!label.write) hideLabel();
	});

});

