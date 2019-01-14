/*

	menu.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Menu Variables
// -----------------------------------------------------------------------------
// =============================================================================

var menu = {
	"shown" : false
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Menu Functions
// -----------------------------------------------------------------------------
// =============================================================================

function showMenu(b, c) { // b = only show toggler (boolean), c = focus toggler (boolean)
	let o = document.getElementById("menu");
	let p = document.getElementById("tribar");
	if (b) p.style.display = "";
	else {
		o.style.display = "";
		p.classList.add("active");
		menu.shown = true;
	}
	if (c) p.focus();
}

function hideMenu(b, c) { // b = also hide toggler (boolean), c = focus toggler (boolean)
	let o = document.getElementById("menu");
	let p = document.getElementById("tribar");
	if (b) p.style.display = "none";
	if (c) p.focus();
	o.style.display = "none";
	p.classList.remove("active");
	menu.shown = false;
}

function toggleMenu(c) { // c = focus toggler (boolean)
	menu.shown ? hideMenu(false, c) : showMenu(false, c);
}

function showHelp() {
	showModal("help");
}

function clearStorage() {
	clearData(true);
	disableCancelAction();
}

function eraseAll() {
	setTopicText(conf.topic.holder);
	document.querySelectorAll(".panel").forEach(function(o) {
		let t = o.querySelector("h2");
		o.innerHTML = "";
		if (t != null) o.appendChild(t)
	});
	saveSlot();
}

function enableCancelAction() {
	let o = document.querySelector("[data-action='cancel']");
	o.classList.remove("disable");
	o.setAttribute("tabindex", "0");
}
function disableCancelAction() {
	let o = document.querySelector("[data-action='cancel']");
	let p = document.getElementById("tribar");
	o.classList.add("disable");
	o.setAttribute("tabindex", "-1");
	p.focus();
}

function takeAction(k) { // k = action key name
	switch(k) {
		case "help" : showHelp(); break;
		case "cancel" : cancelLastAction(); break;
		case "erase" : eraseAll(); break;
		case "clear-storage" : clearStorage(); break;
		case "take-screenshot" : takeScreenshot(); break;
	}
}

function focusMenuItemByKey(u, k) { // u = current item (DOM element), k = key code (integer)
	let t = document.getElementById("tribar");
	let o = document.getElementById("menu");
	// * (1) Get available menu items
	let l = o.children, n = -1, m = 0, i, a = [];
	for (i = 0; i < l.length; i++) {
		if (!l[i].classList.contains("disable")) a.push(i);
		if (u != null && u == l[i]) n = a.length - 1;
	}
	// * (2) Focus menu item matching given directional key
	if (a.length > 0) {
		if (k == 36 || k == 33 || k == 37) { // Home OR Page Up OR Key Left (min)
			t.focus();
		} else if (k == 35 || k == 34 || k == 39) { // End OR Page Down OR Key Right (max)
			l[a[a.length - 1]].focus();
		} else if (k == 38) { // Key Up (-1)
			n - 1 < 0 ? t.focus() :l[a[n - 1]].focus();
		} else if (k == 40) { // Key Down (+1)
			l[a[Math.min(a.length - 1, n + 1)]].focus();
		}
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Menu Events
// -----------------------------------------------------------------------------
// =============================================================================

document.getElementById("tribar").addEventListener("click", function() {
	toggleMenu();
});

document.getElementById("tribar").addEventListener("keyup", function(e) {
	if (menu.shown && e.which == 27) { // Escape
		hideMenu(false, true);
	}
});

document.getElementById("tribar").addEventListener("keydown", function(e) {
	focusMenuItemByKey(null, e.which);
});

document.getElementById("menu").addEventListener("click", function(e) {
	if (!e.target.classList.contains("disable") && e.target.hasAttribute("data-action")) {
		takeAction(e.target.getAttribute("data-action"));
	}
});

document.getElementById("menu").addEventListener("keyup", function(e) {
	if (e.which == 27) { // Escape
		hideMenu(false, true);
	} else if (e.which == 13 || e.which == 32) { // Enter or Space
		e.target.click();
	}
});

document.getElementById("menu").addEventListener("keydown", function(e) {
	focusMenuItemByKey(e.target, e.which);
});

