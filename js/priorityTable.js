/*
Copyright 2018 Michael R Rich (mike@tofet.net)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions 
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Global var hack to track which chip is being edited
var chipBeingEdited;

function updatePriorityChip( chip ) {
	// This will update the chip with the most recent data
	// I assume all chips have been marked as draggable and droppable already
	
	// Check to see if this chip exists in the data
	var projID;
	if (peopleChips[chip.id]) {
		projID = peopleChips[chip.id].projectID;	
	} else {
		peopleChips[chip.id] = JSON.parse('{ "projectID":"stage", "blank":"stage"}');
		projID = "stage";	
	}	
	
	// Check to see if the project exists
	var thisProj;
	if (!(thisProj = permanentPeople[projID])) {
		if (!(thisProj = tables[projID])) {
			//console.log("Project ID "+projID+" was not found, replaced with empty slot");
			peopleChips[chip.id].projectID = "stage";
			thisProj = tables["stage"];
		}
	} 	
	
	// Remove all current classes
	$(chip).removeClass("chip-placeholder chip-status-red chip-status-green chip-status-yellow");
	
	// Add the requisite class
	$(chip).addClass(thisProj.status);
	
	// Set the title
	var displayText = thisProj.title;
	var lastName;
	if (lastName = thisProj["lastName"]) {
		displayText += " " + lastName[0] + ".";
	}
	$(chip).text(displayText);
	
	// Set attributes
	if (thisProj.draggable) {
		$(chip).draggable("enable");
	} else {
		$(chip).draggable("disable");
	}
	
	if (thisProj.droppable) {
		$(chip).droppable("enable");
	} else {
		$(chip).droppable("disable");
	}
	
	if (thisProj.click == "details") {
		$(chip).off("click");
		$(chip).click(function(event) {
			editChip( event.target );		
		});
	} else if (thisProj.click == "add") {
		$(chip).off("click");
		$(chip).click(function(event) {
			newChip( event.target );		
		});
	} else if (thisProj.click == "none") {
		$(chip).off("dblclick");
	}
	
	////dataChanged();
}

function editChip(chip) {
	chipBeingEdited = chip;
	editProject(peopleChips[chip.id].projectID);
}

function newChip(chip) {
	chipBeingEdited = chip;  
	editProject(tables["nextProjID"], true);  // true for newProject
}

function clickChip( chip ) {
	console.log(`id: ${chip.id} clicked`);
}

function clickOnRowName(chip) {
	var rowID = $(chip).data("rowID");
	
}

function initializeTableRow(rowID) {
	// Initialize the ability to click the name and set a data field on the name
	$("#row-"+rowID+"-name").off("click");
	$("#row-"+rowID+"-name").click(function(event) {
			editTableRow(rowID);		
		}).data("rowID", rowID);
		
	
	// This initializes all the chips in a row on the table, setting all necessary handlers
	$('div[id^="priority-row-'+rowID+'"]' ).each(function( index ) {
		initializeTableChip(this);
	});
}

function initializeTableChip(chip) {
	// Initializes all of the handlers for a specific chip
	$(chip).draggable({
		disabled: true,
      helper: "clone",
      revert: "invalid",
      start: function( event, ui ) {
      	// Store original project number in two places
      	$(this).data("originalProjNum", Number(peopleChips[$(this).attr("id")].projectID));
      	$(ui.helper).data("originalProjNum", Number(peopleChips[$(this).attr("id")].projectID));
      	// Set projectID = 0
      	peopleChips[$(this).attr("id")].projectID = peopleChips[$(this).attr("id")].blank;
      	// Reset format
      	$(this).removeClass("chip-black chip-status-red chip-status-green chip-status-yellow");
			$(this).text(" ");
			$(this).addClass("chip-placeholder");
			// Set revert flag to make sure we know where it goes
			$(ui.helper).data("revert", true);
		},
		stop: function( event, ui ) {
			//console.log("the drag stopped");
			if ($(ui.helper).data("revert")) {
				//console.log("I returned home");
				// Reset the project number
				peopleChips[$(this).attr("id")].projectID = $(this).data("originalProjNum");
				// Reset the chip
				updatePriorityChip(this);
			} else {
				//console.log("I landed somewhere else");
				updatePriorityChip(this);
				//dataChanged();	
			}	
		}
    });
    $(chip).droppable({
	   over: function( event, ui ) {
	   	//console.log("I'm over the chip");
	   	$(this).removeClass("chip-placeholder").addClass("chip-placeholder-hover");
		},
		out: function( event, ui ) {
			//console.log("I left the chip");
			$(this).removeClass("chip-placeholder-hover").addClass("chip-placeholder");
		},
		drop: function( event, ui ) {
			//$(this).text("Left behind");
			//console.log("something dropped on a priority chip");
			
			// Tag the helper to make sure it knows it landed somewhere else
			$(ui.helper).data("revert", false);
	
			// Set this droppable to the new project number
			peopleChips[$(this).attr("id")].projectID = $(ui.helper).data("originalProjNum");
			
			// Update the chip
			updatePriorityChip(this);
		},
		tolerance: "pointer"
    });
    // Now establish the actual chip values
	updatePriorityChip(chip);
}

var firstTableInit = true;

function initializePriorityTable() {
	// If the chip stage has already been built, then don't do this
	if (firstTableInit) {
		$("#priority-chipStage").each(function( index ) {
 			initializeTableChip(this);
		});
		firstTableInit = false;
				
	} else {
		// Still need to at least update this chip
		$("#priority-chipStage").each(function( index ) {
 			updatePriorityChip(this);
		});
	}
		
	// Builds the table from the data
	$.each( partyRowData["rows"], function( key, value ) {
		addRowToTable(key);
  		initializeTableRow(key);
	});
}


function clearPriorityTable() {
	// Deletes all rows from the table
	// This is a non-recoverable delete used when new data is delivered
	resetTable();
	
	// reactivate the "Add Row" button
	$("#addRowButton").off("click");
	$("#addRowButton").click(function(event) {
			clickAddRow();		
	});
}

function clickAddRow() {
	addRowToTable();
}

//console.log("PriorityTable loaded");
