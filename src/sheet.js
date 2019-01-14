/*

	sheet.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Sheet Variables
// -----------------------------------------------------------------------------
// =============================================================================

var sheet = {
	"source" : null,
	"hilite" : null,
	"taken" : false,
	"x" : 0,
	"y" : 0,
	"delete" : {
		"toggled" : false
	}
};

// =============================================================================
// -----------------------------------------------------------------------------
// # Sheet Functions
// -----------------------------------------------------------------------------
// =============================================================================

function switchSheetButtons(b) { // b = on/off flag
	let e = document.getElementById("edit");
	let c = document.getElementById("create");
	let d = document.getElementById("delete");
	if (b) {
		hideMenu(true);
		e.setAttribute("disabled", "disabled");
		c.setAttribute("disabled", "disabled");
		d.style.display = "";
	} else {
		showMenu(true);
		e.removeAttribute("disabled", "disabled");
		c.removeAttribute("disabled", "disabled");
		d.style.display = "none";
	}
}

function toggleDelete() {
	let o = document.getElementById("delete");
	let u = document.getElementById("sheet");
	o.classList.toggle("active");
	u.classList.toggle("translucid");
	sheet.delete.toggled = sheet.delete.toggled ? false : true;
}

function hiliteSheet(o) { // o = DOM element
	if (sheet.hilite != null) sheet.hilite.classList.remove("hilite");
	o.classList.add("hilite");
	sheet.hilite = o;
}

function unliteSheet() {
	if (sheet.hilite != null) {
		sheet.hilite.classList.remove("hilite");
		sheet.hilite = null;
	}
}

function showSheet() {
	let o = document.getElementById("sheet");
	o.innerHTML = sheet.source.innerHTML;
	o.style.display = "";
	sheet.x = -Math.round(o.offsetWidth / 2);
	sheet.y = -Math.round(o.offsetHeight / 2);
}

function hideSheet() {
	let o = document.getElementById("sheet");
	o.style.display = "none";
	o.innerHTML = "";
	sheet.x = 0;
	sheet.y = 0;
}

function moveSheet() {
	let o = document.getElementById("sheet");
	o.style.left = (mouse.x + sheet.x) + "px";
	o.style.top = (mouse.y + sheet.y) + "px";
}

function takeSheet(o) { // o = DOM element
	sheet.source = o;
	panel.source = o.parentElement;
	showSheet();
	switchSheetButtons(true);
	moveSheet();
	sheet.source.classList.add("active");
	panel.source.classList.add("disable");
	sheet.taken = true;
	changeCursor("grabbing");
}

function dropSheet(o) { // o = DOM element
	let b = false, h;
	if (frame.locked) h = getFrameHeight();
	if (sheet.delete.toggled) { // delete
		panel.source.removeChild(o);
		equalizeOppositePanels(panel.source);
		toggleDelete();
		b = true;
	} else if (panel.target != null
		 && panel.target != panel.source) { // drop
		panel.target.appendChild(o);
		if (panel.target.id == "pool") scrollRosterMax();
		equalizeOppositePanels(panel.target);
		if (getOppositePanel(panel.target) != panel.source) equalizeOppositePanels(panel.source);
		b = true;
	}
	if (b) {
		saveSlot();
		if (frame.locked && h != getFrameHeight()) lockFrame();
	}
	sheet.source.classList.remove("active");
	panel.source.classList.remove("disable");
	unlitePanels();
	hideSheet();
	sheet.taken = false;
	switchSheetButtons(false);
	resetCursor();
}

function createSheet() {
	let s = getLabelRecord();
	if (s != "") {
		let q = document.createElement("div");
		let u = document.createElement("span");
		q.classList.add("sheet");
		u.innerText = s;
		q.appendChild(u);
		panel.target.appendChild(q);
		saveSlot();
		scrollRosterMax();
		hideLabel();
		if (conf.input.click.create) document.getElementById("create").click();
	} else {
		hideLabel();
	}
}

function enterEditMode(b) { // b = set edit mode flag (boolean)
	let o = document.getElementsByTagName("body")[0];
	let u = document.getElementById("edit");
	o.classList.add("edit");
	u.classList.add("active");
	if (b) input.edit_mode = true;
}

function exitEditMode(b) { // b = set edit mode flag (boolean)
	let o = document.getElementsByTagName("body")[0];
	let u = document.getElementById("edit");
	o.classList.remove("edit");
	u.classList.remove("active");
	if (b) input.edit_mode = false;
}

function toggleEditMode(b) { // b = set edit mode flag (boolean)
	input.edit_mode ? exitEditMode(b) : enterEditMode(b);
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Sheet Events
// -----------------------------------------------------------------------------
// =============================================================================

document.getElementById("edit").addEventListener("click", function() {
	toggleEditMode(true);
});

document.getElementById("create").addEventListener("click", function() {
	showLabel(this, true);
});

document.getElementById("delete").addEventListener("mouseenter", function() {
	if (sheet.source != null) toggleDelete();
});

document.getElementById("delete").addEventListener("mouseleave", function() {
	if (sheet.delete.toggled) toggleDelete();
});

