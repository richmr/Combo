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


$("#guest_list").click(function(event) {
		clickOnGuestList();		
	});

function initializeArchive() {
	// Loop over the archivedPeople array
	archivedPeople.forEach(function (item, index, array) {
		addChipToArchive(item);
	});
}	

function listByTable(){
	// Returns the complete guest list, sorted by tables, sorted by guest name
	var currentTableID = -1;
	var htmlstring = "";
	htmlstring += listByTable_header();
	var allGuests = guestsSortedByTableArray();
	$.each(allGuests, function (index, value) {
		var aGuest = value;
		if (aGuest["tableID"] != currentTableID) {
			// Different actions if first time or not
			if (currentTableID != -1) {
				htmlstring += "</blockquote>";
			}
			currentTableID = aGuest["tableID"];
			htmlstring += listByTable_newTable(currentTableID);
		}
		htmlstring += aGuestEntry(value, ["first", " ", "last"]);
	});
	htmlstring += listByTable_footer();
	return htmlstring;
}

function listByTable_header() {
	var htmlstring = "<p><b>Table List with Guests</b><p>";
	return htmlstring;
}

function listByTable_newTable(currentTableID) {
	var tablename = "Unknown?";
	if (tableObj = partyRowData["rows"][currentTableID]) {
		tablename = tableObj["name"];
	}	
	var htmlstring = "<p>"+tablename+"</p><blockquote>";
	return htmlstring;
}

function listByTable_footer() {
	var htmlstring = "</blockquote>";
	return htmlstring;
}

function listByGuest() {
	// Returns complete guest list, sorted by guest name
	var htmlstring = "";
	htmlstring += listByGuest_header();
	var allGuests = alphabeticalGuestArray();
	$.each(allGuests, function (index, value) {
		htmlstring += aGuestEntry(value);
	});
	htmlstring += listByGuest_footer();
	return htmlstring;
}

function listByGuest_header() {
	var htmlstring = "<p><b>Guest List and Seating</b><p>";
	htmlstring += "<p>For best results, cut and paste this information somewhere else to make it pretty.</p><blockquote>";
	return htmlstring;
}

function aGuestEntry(guestData, format=['last', ', ', 'first', ', ', 'table']) {
	// returns a html-formatted entry according to the format statement
	// last = print last name
	// first = print first name
	// table = print table name
	// Anything else prints as a string literal
	var htmlstring = "";
	$.each(format, function (index, value) {
		if (value == "last") {
			htmlstring += guestData["last"];
		} else if (value == "first") {
			htmlstring += guestData["first"];
		} else if (value == "table") {
			var tablename = "Unknown?";
			if (tableObj = partyRowData["rows"][guestData["tableID"]]) {
				tablename = tableObj["name"];
			}
			htmlstring += tablename;
		} else {
			htmlstring += value;
		}
	});
	htmlstring += "<br>";
	return htmlstring;	
}

function listByGuest_footer() {
	var htmlstring = "</blockquote>";
	return htmlstring;
}


function clickOnGuestList () {
	// Generate the data in the guest list
	// Clear the guest list
	var guestlisthtml = listByGuest();
	guestlisthtml += "<hr>" + listByTable();
	
	$("#guestList-content").html(guestlisthtml);
	
	// Open the modal
	$("#guestListModal").modal('open');
}

console.log("guest list loaded");