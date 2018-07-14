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

$( "#archive").droppable({
	drop: function( event, ui ) {
     //console.log("Something was dropped on the archive");
		// Hide the item
		ui.helper.hide();
		ui.helper.data("revert", false);
				
		// Connect it to the archive sortable
		var projID = $(ui.helper).data("originalProjNum");
		addChipToArchive(projID);
		
		// Make the archive icon do something interesting.
		$("#archive").animate({
			color: "green"
		});
		$("#archive").animate({
			color: "black"
		});
   },
   over: function( event, ui ) {
		$(this).animate({
			color: "blue"
		});
	},
	out: function( event, ui ) {
		$(this).animate({
			color: "black"
		});
	},
	tolerance: "pointer"
});

$("#archive").click(function(event) {
		clickOnArchive();		
	});

function initializeArchive() {
	// Loop over the archivedPeople array
	archivedPeople.forEach(function (item, index, array) {
		addChipToArchive(item);
	});
}	


function addChipToArchive( projectID ) {	
	// Returns TRUE when the function completes correctly	
	// Add project to archivedPeople - Not done to prevent a lot of array searching and splitting
	// Instead on "Save" the data must be pulled directly from the DOM 
	
	// Prepend html to archivePool
	var title = tables[projectID].title;
	var lastName;
	if (lastName = tables[projectID]["lastName"]) {
		title += " " + lastName[0] + ".";
	}	
	var newCount = ($('div[id^="archivePool-"]').length + 1);
	var newID = "archivePool-" + newCount;
	
	// Reset the chip status to green.  If you put a project in idle, then no fault for not working on it
	//tables[projectID].status = "chip-status-green"
	
	var htmlSnippet = `<div id="${newID}" class="chip">${title}</div>`;
	$("#archivePool").prepend(htmlSnippet);
	
	// Set info for this chip
	$("#"+newID).data("projectID", projectID);
	
	// Set action attributes
	$("#"+newID).click(function (event) {
		clickOnArchivedChip(event.target);
	});
	
	$("#"+newID).disableSelection();
	
	// Set the count text
	$("#archive-count").text(newCount);
	
	// return true 
	return true;
}

function clickOnArchive () {
	// Check to see if a chip is already sitting on the stage
	// If so, rearchive it.
	var projID = peopleChips["priority-chipStage"].projectID;
	if (projID != "stage") {
		addChipToArchive(projID);
		peopleChips["priority-chipStage"].projectID = "stage";
		updatePriorityChip($("#priority-chipStage")[0]);
	}
	// Open the modal
	$("#archiveModal").modal('open');
}

function clickOnArchivedChip ( chipDOM ) {
	// Set up chipStage
	var projID = $(chipDOM).data("projectID");
	peopleChips["priority-chipStage"].projectID = projID;
	// Remove this from archivedPeople
	// not necessary, this is only saved on exit
	
	// Get the position of the staging chip
	//var stageoffset = $("#priority-chipStage").offset();
	//stageoffset["position"]="absolute";
	// Get the position of the top right corner of the modal
	var topright = $("#archiveModal-header").position();
	topright.left = topright.left + $("#archiveModal-content").width() - $(chipDOM).width() - $(chipDOM).position().left;
	topright.top = topright.top - $(chipDOM).position().top;
	
	// Send the chip there?
	$(chipDOM).draggable();
	$(chipDOM).animate(topright ,250, "linear", function() { $(chipDOM).remove(); updatePriorityChip($("#priority-chipStage")[0]);
	$("#archiveModal").modal('close');});
	
	// Reset the counter
	var newCount = ($('div[id^="archivePool-"]').length-1);
	// Set the count text
	$("#archive-count").text(newCount);
		
}

function saveArchive() {
	// Will populate the archivedPeople global var with the projectIDs
	archivedPeople=[];
	$('div[id^="archivePool-"]').each( function (index) {
		archivedPeople.push($(this).data("projectID"));
	});
}

function clearArchive() {
	// Non-recoverable delete of tables in archive
	// Intended for use only on a data reset
	$('div[id^="archivePool"]').each(function( index ) {
		$(this).empty();
	});
	$("#archive-count").text("0");
}


//console.log("archive loaded");