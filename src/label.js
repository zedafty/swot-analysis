/*

	label.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Label Variables
// -----------------------------------------------------------------------------
// =============================================================================

var label = {
	"target" : null,
	"popped" : false,
	"shown" : false,
	"write" : false,
	"create" : false,
	"timer" : 0,
	"x" : 0,
	"y" : 0
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Label Functions
// -----------------------------------------------------------------------------
// =============================================================================

function initLabelRecord() {
	let o = document.getElementById("record");
	o.setAttribute("maxlength", conf.label.length);
}

function getLabelRecord() {
	let o = document.getElementById("record");
	return o.value.trim().substr(0, conf.label.length);
}

function updateLabelRecord() {
	let s = getLabelRecord();
	if (label.target.id == "topic") label.target.innerText = s == "" ? conf.topic.holder : s;
	else label.target.firstElementChild.innerText = s;
	saveSlot();
	hideLabel();
}

function setLabelOrigin() {
	let u = document.getElementById("label");
	let q = u.querySelector(".stalk");
	let r = label.target.getBoundingClientRect();
	label.x = (r.left + Math.round(r.width / 2));
	label.y = Math.min(r.bottom - Math.round(q.offsetHeight / 2), (r.top - Math.round(q.offsetHeight / 4)));
}

function resizeLabel(s, b) { // s = text value (string), b = also vertical
	let u = document.getElementById("label");
	let q = u.querySelector(".stalk");
	let p = u.querySelector("#bubble");
	let i = p.querySelector("#record");
	let t = p.querySelector("#commit");
	let l = p.querySelector("#cancel");

	let outer = document.getElementById("label").querySelector(".outer");
	let inner = document.getElementById("label").querySelector(".inner");

	// * Reset inner width
	inner.style.width = "";

	// * Set inner text value
	if (s == null) s = i.value;
	inner.innerHTML = s.replace(/\s/g, "&nbsp;");

	// * Set minimal width (if necessary)
	if (inner.offsetWidth < conf.label.width) inner.style.width = conf.label.width + "px";

	// * Get button width
	let z = label.write ? t.offsetWidth + conf.label.button.spacing : 0;

	// * Set text input width
	if (label.write && outer.offsetWidth + z > window.innerWidth) {
		i.style.width = (window.innerWidth - z - (outer.offsetWidth - inner.offsetWidth)) + "px";
	} else {
		i.style.width = inner.offsetWidth + "px";
	}

	// * Set label origin and vertical position (almost fixed)
	if (b) {
		setLabelOrigin();
		let y = label.y - outer.offsetHeight;
		if (y < 0) { // pop on bottom
			let r = label.target.getBoundingClientRect();
			label.y = Math.max(r.top - Math.round(q.offsetHeight / 2), (r.bottom - Math.round(q.offsetHeight / 4)));
			q.style.top = (label.y - Math.round(q.offsetHeight / 2)) + "px";
			p.style.top = (label.y + Math.round(q.offsetHeight / 2)) + "px";
			q.classList.add("reverse");
		} else { // pop on top
			p.style.top = y + "px";
			q.style.top = (label.y) + "px";
		}
	}

	// * Set horizontal position (variable)
	let v = p.offsetWidth + z;
	let w = window.innerWidth;
	let x = label.x - Math.round(v / 2); // center toward target

	// * Adjust horizontal position (i.e. handle overflowing)
	if (v < w) { // enough space
		if (x < 0) x = 0; // stick to left
		else if (x + v > w) { // stick to right
			x = w - v;
			if (label.write) {
				t.classList.add("reverse");
				l.classList.add("reverse");
				x += z;
			}
		}
	} else { // not enough space
		x = -Math.round((v - w) / 2); // center on screen
	}

	p.style.left = x + "px";
	q.style.left = (label.x - Math.round(q.offsetWidth / 2)) + "px";

}

function hideLabel() {
	let u = document.getElementById("label");
	let q = u.querySelector(".stalk");
	let p = u.querySelector("#bubble");
	let i = p.querySelector("#record");
	let t = p.querySelector("#commit");
	let l = p.querySelector("#cancel");

	// * Clear label delay
	clearTimeout(label.timer);

	// * Set label shown
	label.shown = false;

	// * Remove reverse classes
	if (q.classList.contains("reverse")) q.classList.remove("reverse");
	if (t.classList.contains("reverse")) t.classList.remove("reverse");
	if (l.classList.contains("reverse")) l.classList.remove("reverse");

	// * Hide label
	if (label.write) {
		p.style.pointerEvents = ""; // disallow pointer events
		t.style.display = l.style.display = "none"; // hide buttons
	} p.style.display = q.style.display = "none"; // hide bubble

	// * Reset label value
	i.value = "";

	if (label.target != null) {
		// * Reset referrer style
		label.target.classList.remove("active");
		// * Unset label target
		label.target = null;
	}

	if (label.write) {
		// * Unset panel target
		panel.target = null;
		// * Unset label write mode
		label.write = false;
	}

	// * Unset create sheet flag
	if (label.create) {
		label.create = false;
		setTimeout(function() {
			document.getElementById("create").focus();
		}, conf.input.focus.create);
	}

}

function showLabel(o, b) { // o = DOM element, b = write mode flag (bool)
	let u = document.getElementById("label");
	let q = u.querySelector(".stalk");
	let p = u.querySelector("#bubble");
	let i = p.querySelector("#record");
	let t = p.querySelector("#commit");
	let l = p.querySelector("#cancel");

	// * Set label shown and popped
	label.shown = label.popped = true;

	// * Set label write mode
	label.write = b ? true : false;

	// * Set create sheet flag
	label.create = o.id == "create";

	// * Set label target
	label.target = o;

	// * Set panel target
	if (label.write) panel.target = label.create ? document.getElementById("pool") : o.parentElement;

	// * Set label holder
	if (label.write) i.setAttribute("placeholder", label.target.id == "topic" ? conf.topic.holder : conf.sheet.holder);

	// * Show label
	if (label.write) {
		p.style.pointerEvents = "all"; // allow pointer events
		t.style.display = l.style.display = ""; // show buttons
	} p.style.display = q.style.display = ""; // show bubble

	// * Set label value
	i.value = label.create ? "" : label.target.innerText;

	// * Set text input write mode
	label.write ? i.removeAttribute("disabled") : i.setAttribute("disabled", "disabled");

	// * Resize label
	resizeLabel(label.create ? i.getAttribute("placeholder") : null, true);

	// * Set referrer style
	label.target.classList.add("active");

	// * Set text input focus
	setTimeout(function() {
		label.write ? i.focus() : i.blur();
	}, conf.input.focus.update);

}

function delayLabel(o) { // o = DOM element
	if (label.popped) { // show at once
		showLabel(o);
	} else { // delay popping
		clearTimeout(label.timer);
		label.timer = setTimeout(function() {
			showLabel(o);
		}, conf.label.delay);
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Label Events
// -----------------------------------------------------------------------------
// =============================================================================

document.getElementById("record").addEventListener("keydown", function(e) {
	let k = e.which;
	if (k == 27) { // Escape
		document.getElementById("cancel").click();
	} else if (k == 13) { // Enter
		document.getElementById("commit").click();
	} else {
		setTimeout(resizeLabel, conf.label.speed);
	}
});

document.getElementById("record").addEventListener("keyup", function(e) {
	if (this.value.length == 0) setTimeout(resizeLabel, conf.label.speed, this.getAttribute("placeholder"));
});

document.getElementById("commit").addEventListener("click", function() {
	label.create ? createSheet() : updateLabelRecord();
});

document.getElementById("cancel").addEventListener("click", function() {
	hideLabel();
});

