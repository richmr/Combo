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

// Global variable for ease
var editRowID;

function initializeEditTableRow() {
	// Turn on the buttons
	$("#saveTableRow").click(function(event) {
		clicksaveTableRow();		
	});	
	
	$("#deleteTableRow").click(function(event) {
		clickdeleteTableRow();		
	});
	
	$("#cancelTableRow").click(function(event) {
		clickcancelTableRow();		
	});
	
	// Enable "Enter" detection on the row name field (same as "Save")
	$("#editTableRow-Title").keypress(function(e) {
	    var keycode = (e.keyCode ? e.keyCode : e.which);
	    if (keycode == '13') {
	        clicksaveTableRow();
	    }
	});
}

function clicksaveTableRow() {
	$("#row-"+editRowID+"-name").text($("#editTableRow-Title").val());
	partyRowData["rows"][editRowID]["name"] = $("#editTableRow-Title").val();
	var numSeats;
	if (numSeats = Number($("#editTableRow-numSeats").val())) {
		// Did it change
		if (numSeats != partyRowData["rows"][editRowID]["seats"]) {
			// Update value
			partyRowData["rows"][editRowID]["seats"] = numSeats;
			// And then do something with this..  Table gen
			changeNumberOfSeats(editRowID);
			initializeTableRow(editRowID);
		}
	} else {
		// Just set it back to what it was
		// Which actually means do nothing
	}
	
	$("#editTableRowModal").modal("close");
	//dataChanged("partyRowData");
}

function clickdeleteTableRow() {
	// Safety check is built into the table gen functions
	// It would actually be best to simply have Delete disabled if there are still tables in the row, 
	// but lets go with current flow
	$("#editTableRowModal").modal("close");
	deleteRowFromTable(editRowID);	
}

function clickcancelTableRow() {
	// Data not saved until Save, so just close
	$("#editTableRowModal").modal("close");
}

function editTableRow(rowID) {
	editRowID = rowID;
	$("#editTableRow-Title").val(partyRowData["rows"][rowID]["name"]);
	$("#editTableRow-numSeats").val(partyRowData["rows"][rowID]["seats"]);
	
	$("#editTableRowModal").modal("open");
	$("#editTableRow-Title").focus();
}