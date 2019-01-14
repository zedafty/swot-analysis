/*

	store.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Store Functions
// -----------------------------------------------------------------------------
// =============================================================================

function getJSON() { // returns stringified JSON object
	let r = {"topic" : getTopicText()};
	document.querySelectorAll(".panel").forEach(function(o) {
		let i, l = o.children, a = [];
		for (i = 0; i < l.length; i++) {
			if (l[i].classList.contains("sheet")) {
				a.push(l[i].innerText);
			}
		} r[o.id] = a;
	});
	return JSON.stringify(r);
}

function putJSON(s) { // s = stringified JSON object
	let r = JSON.parse(s);
	setTopicText(r.topic);
	document.querySelectorAll(".panel").forEach(function(o) {
		let t = o.querySelector("h2");
		o.innerHTML = "";
		if (t != null) o.appendChild(t)
		let i, l = r[o.id], q, u;
		for (i = 0; i < l.length; i++) {
			q = document.createElement("div");
			u = document.createElement("span");
			q.classList.add("sheet");
			u.innerText = l[i];
			q.appendChild(u);
			o.appendChild(q);
		}
	});
}

function saveData(k, s, b) { // k = storage key name, s = stringified JSON object, b = console log (boolean)
	if (s == null) s = getJSON();
	localStorage.setItem(k, s);
	if (b) console.info("Current SWOT saved in local storage."); // DEBUG
}

function loadData(k, b) { // k = storage key name, b = console log (boolean)
	let s = localStorage.getItem(k);
	if (typeof(s) == "string") {
		putJSON(s);
		equalizeAllPanels(); // TEMP
		if (b) console.info("Previous SWOT loaded from local storage."); // DEBUG
	} else {
		if (b) console.error(" No previous SWOT found in local storage."); // DEBUG
	}
}

function clearData(b) { // b = console log (boolean)
	localStorage.clear();
	if (b) console.info("SWOT data cleared from local storage."); // DEBUG
}

function getSlotKey(n) { // n = storage slot index
	return conf.store.slot + (n < 10 ? "0" : "") + n;
}

function getLastSlot() {
	let n = localStorage.getItem(conf.store.index);
	return n == null ? -1 : n;
}

function saveSlot() {
	let n = localStorage.getItem(conf.store.index);
	n == null || n == 0 || n == conf.store.limit + 1 ? n = 1 : n++;
	localStorage.setItem(conf.store.index, n);
	saveData(getSlotKey(n));
	if (localStorage.length > 2) enableCancelAction();
}

function loadLastData() {
	let n = getLastSlot();
	n > 0 ? loadData(getSlotKey(n), true) : saveSlot(); // first save slot
	if (localStorage.length > 2) enableCancelAction();
}

function cancelLastAction() {
	let n = getLastSlot();
	if (n <= 0 || localStorage.length == 2) return; // no index or initial slot
	// * (1) Remove current slot
	localStorage.removeItem(getSlotKey(n));
	// * (2) Get previous slot
	let m;
	if (n - 1 == 0 && localStorage.length > 1) {
		let l = localStorage.length, i, s, a = [];
		for (i = 0; i < l; i++) {
			s = localStorage.key(i);
			if (s == conf.store.index) continue;
			a.push(parseInt(s.substr(conf.store.slot.length)));
		} a.sort(function(a, b) { return b-a });
		m = a[0];
	} else {
		m = n - 1;
	}
	// * (3) Load previous slot
	loadData(getSlotKey(m));
	// * (4) Reset index
	localStorage.setItem(conf.store.index, m);
	if (localStorage.length <= 2) disableCancelAction(); // no more cancelable action
}

