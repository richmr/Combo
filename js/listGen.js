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

function createArrayOfGuests() {
	// Purpose is to scan through the existing list of guests (called tables annoyingly enough)
	// And generate an array with the first name, last name, and assigned table id
	// Purpose is for sorting and display
	var allGuests = [];
	for (person = 1; person < tables["nextProjID"]; person++) {
		var aperson;
		saveGraveyard(); // Needed so we ignore guests who RSVP "No".
		if (aperson = tables[person]) {
			// Need to check if this person is in the list of declines:
			// indexOf returns a -1 if it isn't found.  If it is, it returns a 0
			if (_.indexOf(graveyardPeople, person) == -1) {
				var topush = {"first":aperson["title"], "last":aperson["lastName"]};
				// Find the table this person is at
				var tableID;
				if (tablespot = _.findKey(peopleChips, {"projectID":person})) {
					tableID = tablespot.split("-")[2];
				} else {
					tableID = 0;
				}
				topush["tableID"] = tableID;
				allGuests.push(topush);
			}
		}	
	}
	
	return allGuests;
}

function alphabeticalGuestArray(sorting=['last','first']) {
	// Returns an alphabetical list of guests
	var allGuests = createArrayOfGuests();
	allGuests = _.sortBy(allGuests, sorting);
	return allGuests;
}

function guestsSortedByTableArray() {
	var allGuests = alphabeticalGuestArray(['tableID', 'last', 'first']);
	return allGuests;
}
