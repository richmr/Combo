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

var nextDialReadingRow = 1;
var initialLoad = true;

function initializeComboReadings() {
	// Delete all existing entries in the combo list
	deleteAllReadings();
	
	// Add a row for each reading in the existing data
	$.each(comboReadings, function (key, aReading) {
		addReadingEntryLine(aReading);
	});
	
	// Add a blank row
	addReadingEntryLine();
	
	// Show the stats
	initialLoad = false;
	doStats();
	
	/* issues:
		If a person makes a mistake in the data, and they change an entry, the stats change.  Has to recalced over full data set every time
		Data needs to be validated (same number of digits in each entry)
		Then probably best to redraw the whole list of data every time..  Kind of unwieldy...  But best way to maintain consistency.
		Could mark every EXISTING data field as that and do a different action when the field changes.
		The blank one will just add a new entry.  Changes to existing does a complete rebuild.
		Any change requires complete rework of the stats though
	*/
}

function deleteAllReadings() {
	var blankReadingsHTML = 'Enter Combos Below:' +
									  					'<span id="last-dialreading"></span>';
									  					
	$("#dial-reading-entries").html(blankReadingsHTML);
	
	nextDialReadingRow = 1;
	
}

function addReadingEntryLine(val="") {
	console.log("addReadingEntry with val: " + val);
	var rowID = 'dialreading-'+nextDialReadingRow;
	var htmlsnippet = '<div class="row">'+ 
	  									'<div class="input-field col s12">' +
							  			'<input placeholder="Dial reading" id="dialreading-'+nextDialReadingRow+'" type="text" >' +
								  		'</div>' +
									  	'</div>';
	$("#last-dialreading").before(htmlsnippet);
	nextDialReadingRow++;
	$("#"+rowID).keypress(function(e) {
	    var keycode = (e.keyCode ? e.keyCode : e.which);
	    if (keycode == '13') {
	        $(this).blur();
	    }
	});
	$("#"+rowID).change(function () {
		readingDataChanged(this);
	});
		
	if (val) {
		$("#"+rowID).val(val).change();	
	}
		
	return rowID;
}

function readingDataChanged(readingEntryObj) {
	// Two cases: last entry line changed, or a value was edited

	// Get the id of the object
	var entryID = $(readingEntryObj).attr("id");
	console.log("readingDataChanged with id: " + entryID);
	
	var reading = $(readingEntryObj).val();
	// Add the data to the json object, if valid
	if (validateReading(reading)) {
		$(readingEntryObj).removeClass("invalid").addClass("valid");
		comboReadings[entryID] = reading;
		if (!initialLoad) doStats();
		// Does it look like the last one (nextDialReading - 1)
		var entryNum = entryID.split("-")[1];
		if ((!initialLoad) && (entryNum == (nextDialReadingRow-1))) {
		// This is the current last row
		// Just add a new line and set focus
			newLineID = addReadingEntryLine();
			$("#"+newLineID).focus();			
		} 		
	} else {
		$(readingEntryObj).removeClass("valid").addClass("invalid");	
	}	
}

function validateReading(reading) {
	// returns true if the new reading passes validation
	
	// Validate
	// If this is the first one, then the array is empty
	if (_.size(comboReadings) > 0 ) {
		// check the length of this value compared the length of the first reading.
		// If different, pop an error (TODO))
		if (reading.length != $("#dialreading-1").val().length) {
			return false;
		} else {
			return true;
		}
	}	else {
		return true;
	}
}