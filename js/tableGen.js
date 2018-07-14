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

// Builds the Priorities table from the loaded data

function rowStart( rowID ) {
	// Returns the html string start of the row
	var rowname = partyRowData["rows"][rowID]["name"];
	var htmlstring = '<tr id="row-'+rowID+'"><td id="row-'+rowID+'-name">'+rowname+'</td>';
	return htmlstring;
}

function chipSpot(id) {
	// Generates an html snippet for a chip spot with ID id
	var htmlstring = '<div id="'+id+'" class="chip"></div>';
	return htmlstring;
}

function chipSection( rowID, sectionNum ) {
	// Returns a single chip section, basically a TD cell with a proper count of
	// properly labeled chip locations
	var spotNameStart = "priority-row-"+rowID+"-spot-";
	var numslots = partyRowData["rows"][rowID]["seats"];
	var countStart = 1;
	//var htmlstring = '<td id="row-'+rowID+'-allseating">';
	for (i = 0; i < numslots; i++) {
		htmlstring += chipSpot(spotNameStart+(countStart+i));
	}
	//htmlstring += "</td>";
	return htmlstring;
}

function seating(rowID) {
	var htmlstring = "";
	var spotNameStart = "priority-row-"+rowID+"-spot-";
	var numslots = partyRowData["rows"][rowID]["seats"];
	for (spot = 1; spot <= numslots; spot++) {
		htmlstring += chipSpot(spotNameStart+spot);
		// Generate a break every 5 seats		
		if (!(spot % 5)) {
			htmlstring += "<br>";
		}
	}
	return htmlstring;
}

function allChipSections(rowID) {
	// Generates all the chip sections for a given row
	var htmlstring = '<td id="row-'+rowID+'-allseating">';
	//var htmlstring = "";
	htmlstring += seating(rowID);	
	htmlstring += "</td>";
	return htmlstring;
}

function rowEnd( rowID ) {
	var htmlstring = "</tr>";
	return htmlstring;
}

function rowFromData(rowID) {
	// Generates a whole new row from data
	var htmlstring = rowStart(rowID);
	htmlstring += allChipSections(rowID);
	htmlstring += rowEnd(rowID);
	return htmlstring;
}

function newRow() {
	// Get current row count
	var thisRow = partyRowData["nextRowID"];
	var numSeats = parties["defaultSeats"];
	partyRowData["rows"][thisRow]={"name":"Click to Change", "seats":numSeats};
	partyRowData["nextRowID"] += 1;
	return thisRow;
}

function addRowToTable(rowID=false) {
	if (rowID) {
		$("#lastTableRow").before(rowFromData(rowID));
	} else {
		rowID = newRow();
		$("#lastTableRow").before(rowFromData(rowID));
	}
	
	initializeTableRow(rowID);
	////dataChanged();
}

function changeNumberOfSeats(rowID) {
	// Generate an array of all current seated guests
	var currentSeatedGuests = [];
	$('div[id^="priority-row-'+rowID+'"]' ).each(function( index, value ) {
			// Test what the projectID for this DOM element is
			if ((peopleChips[value.id]["projectID"] != 0) && (peopleChips[value.id]["projectID"] != "stage")) {
				// To handle a reduction in seats at a table, I have to check to see if
				// I've already pushed a full table on to my guest stack
				if (currentSeatedGuests.length < partyRowData["rows"][rowID]["seats"]) {
					// push this projectID on to my seated guests Stack;
					currentSeatedGuests.push(peopleChips[value.id]["projectID"]);
				} else {
					// I need to push this into the unseated guests archive
					addChipToArchive(peopleChips[value.id]["projectID"] );
				}
				
				// Delete the existing seating location data
				delete peopleChips[this.id];
			}
	});
	
	// Reset the chip data
	$('#row-'+rowID+'-allseating').html(seating(rowID));
	
	// Now I need to go through the currentSeatedGuests and add their projectIDs to the seating locations
	// Or is it just to the peopleChips data?  Gah!
	// I think it is just the peopleChips data
	$.each(currentSeatedGuests, function(index, value) {
		peopleChips['priority-row-'+rowID+'-spot-'+(index+1)] = {"projectID":value, "blank":"stage"};
	});
	
}

function deleteRowFromTable(rowID, protecttables = true) {
	// rowID = the ID number, not the DOM ID name
	// if protecttables, then pops an alert if there are tables still assigned on the row
	if (protecttables) {
		var tablesDetected = false;
		$('div[id^="priority-row-'+rowID+'"]' ).each(function( index, value ) {
			// Test what the projectID for this DOM element is
			if ((peopleChips[value.id]["projectID"] != 0) && (peopleChips[value.id]["projectID"] != "stage")) {
				tablesDetected = true;
			}
		});
		if (tablesDetected) {
			// Set the modal data
			$("#savetablesModal-rowname").text($("#row-"+rowID+"-name").text());
			$("#savetablesModal").modal('open');
			return;
		}	
	}
	
	// Delete the associated data first
	$('div[id^="priority-row-'+rowID+'"]' ).each(function( index ) {
		// Test what the projectID for this DOM element is
		delete peopleChips[this.id];
	});
	// Delete the row
	$("#row-"+rowID).empty();
	// Delete the row from the data
	delete partyRowData["rows"][rowID];	
	
	//dataChanged();
}

function resetTable() {
	var lastRowHTML = '<tr id="lastTableRow">' +
							'<td>' +
							'<a class="waves-effect" href="#!">' +
							'<i id="addRowButton" class="small material-icons" style="font-size: 2rem">add_circle_outline</i>' +
							'</a></td></tr>';
	$("#priorityTableDynamicContent").html(lastRowHTML);
}


