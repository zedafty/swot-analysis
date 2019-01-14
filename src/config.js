/*

	config.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Configuration
// -----------------------------------------------------------------------------
// =============================================================================

var conf = {

	//////////////////////////////////////////////////////////////////////////////
	// * Basis
	//////////////////////////////////////////////////////////////////////////////

	"launch" : {
		"load_last_data" : true, // load last data found in local storage at page launch -- Default : true
		"lock_frame" : true, // lock frame on screen at page launch -- Default : true
		"show_roster" : false // show roster at page launch -- Default : false
	},

	"topic" : {
		"holder" : "SWOT?" // no topic default text -- Defaut : "SWOT?"
	},

	"backdrop" : {
		"image" : "grid", // backdrop image ; allowed values are "dot", "grid" or "square" -- Default : "grid"
		"show" : true, // should the backdrop be shown -- Default : true
		"move" : false, // should the backdrop be moved along with the frame -- Default : false
		"scale" : false, // should the backdrop be scaled along with the frame -- Default : false
		"ratio" : 2 // backdrop scale ratio divider (e.g. ratio -> 2, frame scale -> 2.0, backdrop scale -> 1.5) -- Default : 2
	},

	//////////////////////////////////////////////////////////////////////////////
	// * Store
	//////////////////////////////////////////////////////////////////////////////

	"store" : {
		"limit" : 20, // maximum number of cancelable actions (up to 99) -- Default : 20
		"index" : "save_index", // local storage key name for save index-- Default : "save_index"
		"slot" : "save_slot" // local storage key name prefix for save slots-- Default : "save_slot"
	},

	//////////////////////////////////////////////////////////////////////////////
	// * Input
	//////////////////////////////////////////////////////////////////////////////

	"input" : {
		"click" : {
			"create" : false, // trigger again the create button after a sheet is created -- Default : false
		},
		"focus" : {
			"create" : 50, // time in milliseconds before the create button is focused after a sheet is created -- Default : 50
			"update" : 50 // time in milliseconds before the text input is focused after triggering a sheet update -- Default : 50
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// * Label
	//////////////////////////////////////////////////////////////////////////////

	"label" : { // pops up a label containing an hovered sheet content
		"length" : 96, // maximal number of characters per sheet -- Default : 96
		"scale" : 1.0, // frame scale above which the label will not appears on frame panels -- Default : 1.0
		"delay" : 375, // time in milliseconds before the label first appears on a panel -- Default : 375
		"speed" : 25, // time in milliseconds before the label width is refreshed after pressing a key -- Default : 25
		"width" : 80, // minimal bubble width in pixels -- Default : 80
		"button" : {
			"spacing" : 10 // space in pixels left blank between bubble outer and buttons -- Default : 10
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// * Frame
	//////////////////////////////////////////////////////////////////////////////

	"frame" : {
		"border" : 40, // border width when frame is maximized on screen -- Default : 40
		"scale" : [
			2,    // 200%
			3/2,  // 150%
			5/4,  // 125%
			1,    // 100%
			3/4,  // 75%
			2/3,  // 66.66%
			1/2,  // 50%
			1/3,  // 33.33%
			1/4,  // 25%
			1/10, // 10%
			1/20  // 5%
		],
		"bound" : 80, // minimal frame width in pixels left visible on screen -- Default : 80
		"lock_anim" : { // play backdrop animation when frame is locked on screen
			"play" : true, // should the lock animation be played -- Default : true
			"name" : "flash" // animation name ; allowed values are "boing", "flash", or "whirl" -- Default : "flash"
		},
		"automove" : { // move screen automatically when a sheet is dragged over screen bounds
			"bound" : 80, // screen bounds width in pixels which overing triggers automove -- Default : 80
			"speed" : 15, // time elapsed in milliseconds between two automove triggers -- Default : 15
			"value" : 20, // maximum number of pixels displaced per automove trigger -- Default : 20
			"delay" : 0 // number of automove trigger(s) unaffected by acceleration -- Default : 0
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// * Panel
	//////////////////////////////////////////////////////////////////////////////

	"panel" : {},

	//////////////////////////////////////////////////////////////////////////////
	// * Sheet
	//////////////////////////////////////////////////////////////////////////////

	"sheet" : {
		"holder" : "Idea!" // new idea default text -- Default : "Idea!"
	},

	//////////////////////////////////////////////////////////////////////////////
	// * Roster
	//////////////////////////////////////////////////////////////////////////////

	"roster" : {
		"width" : {
			"default" : 480, // roster base width in pixels -- Default : 480
			"minimum" : 320 // roster minimal width in pixels -- Default : 320
		},
		"margin" : 60, // roster bottom margin in pixels -- Default : 60
		"border" : 6, // roster total border width in pixels -- Default : 6
		"delay" : {
			"drag_sheet" : 750, // time in milliseconds before showing roster when a sheet is dragged over the bulb -- Default : 750
			"slider" : 250 // time in milliseconds before showing slider when it is overed -- Default : 250
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// * Menu
	//////////////////////////////////////////////////////////////////////////////

	"menu" : {},

	//////////////////////////////////////////////////////////////////////////////
	// * Screenshot
	//////////////////////////////////////////////////////////////////////////////

	"screenshot" : {
		"loading" : "Loading...", // screenshot loading text -- Default : "Loading..."
		"caption" : "Right Click + Save image as..." // screenshot caption text -- Default : "Right Click + Save image as..."
	},

	//////////////////////////////////////////////////////////////////////////////
	// * Elements Title
	//////////////////////////////////////////////////////////////////////////////

	"title" : {
		"commit" : "Commit Record",
		"cancel" : "Cancel Record",
		"bulb"   : "Show Roster (press R or F2)",
		"tribar" : "Open Menu (press M or O)",
		"create" : "Create New Sheet",
		"edit"   : "Toggle Edit Mode (press E or hold Ctrl)",
		"delete" : "Drag & Drop Sheet Here To Delete",
		"lock"   : "Switch Frame Lock (press F or Keypad *)"
	}

};

