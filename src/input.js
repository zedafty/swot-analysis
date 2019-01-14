/*

	input.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Input Variables
// -----------------------------------------------------------------------------
// =============================================================================

var input = {
	"key" : [],
	"last_key" : null,
	"edit_mode" : false
};

// =============================================================================
// -----------------------------------------------------------------------------
// # Input Functions
// -----------------------------------------------------------------------------
// =============================================================================

function isPressed(n) { // n = key number
	return input.key.includes(n);
}

function isInputScaling() {
	return input.key[0] == 16; // Shift -> scale
}

function isInputMoving() {
	return input.key[0] == 32; // Space -> move
}

function isInputEditing() {
	return input.key[0] == 17; // Ctrl -> edit
}

function isInputActive() {
	return isInputScaling() || isInputMoving() || isInputEditing();
}

function isEditModeActive() {
	return input.edit_mode;
}

function checkInput() {

	// * (1) Check keyboard inputs
	let s = "", b = false;
	switch (input.key[0]) {
		case 16 : s = "zoom-in"; break;              // Shift -> scale
		case 32 : s = "grab"; break;                 // Space -> move
		case 17 : if (!sheet.taken) b = true; break; // Ctrl  -> edit
	}

	// * (2) Toggle edit mode
	if (!input.edit_mode) b ? enterEditMode() : exitEditMode();

	// * (3) Handle roster slider
	if (roster.hilited) unliteRosterSlider();
	if (roster.sliding) stopRosterSliding();

	// * (4) Change cursor
	if (s == "") { // no input cursor
		if (frame.moving) s = "grab";
		if (sheet.source != null) s = "grabbing";
	} changeCursor(s);

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Input Events
// -----------------------------------------------------------------------------
// =============================================================================

document.addEventListener("keyup", function(e) {

	let k = e.which;

	// console.log(k); // DEBUG

	if (input.edit_mode && k == 17) exitEditMode(true); // TEMP

	input.key.splice(input.key.indexOf(k), 1);

	checkInput();

	input.last_key = null;

	// console.log(input.key); // DEBUG

});

document.addEventListener("keydown", function(e) {

	if (modal.shown) return; // TEMP

	let k = e.which;

	// console.log(k); // DEBUG

	// if (k == 9) console.log(e.target); // DEBUG

	let c = !label.write;

	// * (1) Triggered keys (i.e. only one impulse)
	if (!isPressed(k)) {
		input.key.unshift(k);
		switch(k) {
			case  16 :                                           // Shift
			case  32 : unliteSheet();                            // Space
			case  17 : checkInput(); break;                      // Ctrl
			case  72 : if (c) showHelp(); break;                 // Key H
			case 112 : showHelp(); break;                        // F1
			case  82 : if (c) forceClick("bulb"); break;         // Key R
			case 113 : forceClick("bulb"); break;                // F2
			case  77 :                                           // Key M
			case  79 : if (c) forceClick("tribar"); break;       // Key O
			case  69 : if (c) toggleEditMode(true); break;       // Key E
			case  70 :                                           // Key F
			case 106 : if (c) toggleFrameFitness(true); break;   // Keypad Star
			case  83 : if (c) takeScreenshot(); break;           // Key S
			case  67 : if (c) centerFrame(false, true); break;   // Key C
			case 111 : if (c) { e.preventDefault(); setFrameScale(1.0); centerFrame(); } break; // Keypad Slash
		}
	}

	// * (2) Pressed keys (i.e. one or more impulse)
	if (isPressed(17) && isPressed(90)) {
		cancelLastAction()
	} else if (k == 107) { // Keypad Plus
		if (c) upgradeFrameScale(1);
	} else if (k == 109) { // Keypad Minus
		if (c) upgradeFrameScale(-1);
	}

	input.last_key = k;

	// console.log(input.key); // DEBUG

});

