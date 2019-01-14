/*

	modal.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Modal Variables
// -----------------------------------------------------------------------------
// =============================================================================

var modal = {
	"id" : null,
	"shown" : false
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Modal Functions
// -----------------------------------------------------------------------------
// =============================================================================

function setElementsUnfocusable(u) { // u = excluded element (DOM element)
	document.querySelectorAll(".list, button, [tabindex='0']").forEach(function(o) {
		if (o != u && !o.classList.contains("modal")) o.setAttribute("tabindex", "-1");
	});
}

function setElementsFocusable() {
	document.querySelectorAll("[tabindex='-1']").forEach(function(o) {
		if (o.nodeName == "LI") o.setAttribute("tabindex", "0");
		else o.removeAttribute("tabindex");
	});
}

function showModal(s) { // s = element id (string)
	let o = document.getElementById(s);
	let u = o.querySelector(".close");
	o.style.display = "";
	u.focus();
	modal.id = s;
	modal.shown = true;
	setElementsUnfocusable(u);
}

function hideModal() {
	let s = modal.id;
	let o = document.getElementById(s);
	o.style.display = "none";
	modal.id = null;
	modal.shown = false;
	setElementsFocusable();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Screenshot Functions
// -----------------------------------------------------------------------------
// =============================================================================

function setScreenshotCaption(s) { // s = caption text (string)
	let o = document.getElementById("screenshot");
	let u = o.querySelector(".caption span");
	u.innerText = s;
}

function showScreenshot() {
	setScreenshotCaption(conf.screenshot.loading);
	showModal("screenshot");
}

function hideScreenshot() {
	hideModal("screenshot");
}

function captureScreenshot() {
	let o = document.getElementById("frame");
	let u = document.getElementById("screenshot");
	let w = o.offsetWidth;
	let h = o.offsetHeight;

	// * (1) Set frame scale to 1.0 and remove border radius
	o.style.transform = "scale(" + (1.0) + ")";
	o.style.borderRadius = "0";

	// * (2) Take screenshot
	html2canvas(o, {
		"canvas"       : u.querySelector("canvas"),
		"width"        : w,
		"height"       : h,
		"windowWidth"  : w,
		"windowHeight" : h
	})

	// * (3) Restore previous frame scale and border radius
	.then(function(canvas) {
		o.style.transform = "scale(" + (frame.scale) + ")";
		o.style.borderRadius = "";
		setScreenshotCaption(conf.screenshot.caption);
	});

}

function takeScreenshot() {
	showScreenshot();
	captureScreenshot();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Modal Events
// -----------------------------------------------------------------------------
// =============================================================================

document.querySelectorAll(".modal").forEach(function(o) {
	o.querySelector(".close").addEventListener("click", function() {
		hideModal();
	});
});

document.querySelectorAll(".modal").forEach(function(o) {
	o.addEventListener("keydown", function(e) {
		if (e.which == 27 || e.which == 112) { // Escape OR F1
			hideModal();
		}
	});
});

