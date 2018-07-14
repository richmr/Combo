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


$("#load_data").click(function(event) {
		clickOnLoadData();		
	});
	
$("#updateData").click(function (event) {
		clickOnUpdateData();	
	});

$("#pickDataFile").change(function (event) {
		fileChosen();			
	});
	
$("#pickDataFile").click(function (event) {
		this.value = null;			
	});
	
function clickOnUpdateData(dataJSONString) {
	//$("#loadDataModal").modal('close');
	$("#dataAnalysisModal").modal('open');
	$("#dataAnalysis-collection").empty();
	
	// Parse the JSON data
	//var dataJSONString = fileReader.result;
	
	try {
		var fullSuccess = true;
		addDataAnalysisCollectionItem("dataAnalysis-jsoncheck", "Data properly formatted..");
		var theData = JSON.parse(dataJSONString);
		dataAnalysisSuccess("dataAnalysis-jsoncheck");		
		
		addDataAnalysisCollectionItem("dataAnalysis-parties", "Party data...");
		if (parties = theData["parties"]) {
			dataAnalysisSuccess("dataAnalysis-parties");
		} else {
			dataAnalysisFail("dataAnalysis-parties", "Party data not found");
			fullSuccess = false;
		}

		addDataAnalysisCollectionItem("dataAnalysis-partyRowData", "Table data...");
		if (partyRowData = theData["partyRowData"]) {
			dataAnalysisSuccess("dataAnalysis-partyRowData");
		} else {
			dataAnalysisFail("dataAnalysis-partyRowData", "Table data not found");
			fullSuccess = false;
		}
		
		
		addDataAnalysisCollectionItem("dataAnalysis-ptable", "Guest seating data...");
		if (peopleChips = theData["peopleChips"]) {
			dataAnalysisSuccess("dataAnalysis-ptable");
		} else {
			dataAnalysisFail("dataAnalysis-ptable", "Guest seating data not found");
			fullSuccess = false;
		}
		
		addDataAnalysisCollectionItem("dataAnalysis-archivedPeople", "Guests waiting for seating data...");
		if (archivedPeople = theData["archivedPeople"]) {
			dataAnalysisSuccess("dataAnalysis-archivedPeople");
		} else {
			dataAnalysisFail("dataAnalysis-archivedPeople", "Guests waiting for seating not found");
			fullSuccess = false;
		}
		/*
		addDataAnalysisCollectionItem("dataAnalysis-donePeople", "Done project data...");
		if (donePeople = theData["donePeople"]) {
			dataAnalysisSuccess("dataAnalysis-donePeople");
		} else {
			dataAnalysisFail("dataAnalysis-donePeople", "Done project data not found");
			fullSuccess = false;
		}
		*/
		addDataAnalysisCollectionItem("dataAnalysis-graveyardPeople", "Guests not coming data...");
		if (graveyardPeople = theData["graveyardPeople"]) {
			dataAnalysisSuccess("dataAnalysis-graveyardPeople");
		} else {
			dataAnalysisFail("dataAnalysis-graveyardPeople", "Guests not coming data not found");
			fullSuccess = false;
		}
		
		addDataAnalysisCollectionItem("dataAnalysis-tables", "Guest data...");
		if (tables = theData["tables"]) {
			dataAnalysisSuccess("dataAnalysis-tables");
		} else {
			dataAnalysisFail("dataAnalysis-tables", "No guest data found");
			fullSuccess = false;
		}
		
		stopDataProgressBar();
		
		if (fullSuccess) {
			newData();
		} else {
			addDataAnalysisCollectionItem("dataAnalysis-fail", "There are missing pieces of your data, I cannot continue");
			dataAnalysisFail("dataAnalysis-fail");
		}
		
		
		
	} catch(err) {
		// The only catch-able error here is a failed JSON parse
		errText = "Your Seats data is corrupt -> "+err.name + ": " + err.message;
		dataAnalysisFail("dataAnalysis-jsoncheck", errText);		
		stopDataProgressBar();
	}
	
	
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function addDataAnalysisCollectionItem(id, displayText) {
	// Adds a line to the dataAnalysisCollection display
	var htmlSnippet = `<li class="collection-item" id="${id}"><div><span id="${id}-displayText">${displayText}</span><span class="secondary-content"><i id="${id}-check" class="material-icons grey-text">check_circle</i></span></div></li>`
	$("#dataAnalysis-collection").append(htmlSnippet);
}

function dataAnalysisSuccess (id, displayText = false) {
	// Sets the "-check" to a green check circle for id
	$("#"+id+"-check").removeClass("grey-text").addClass("green-text");
	if (displayText) {
		$("#"+id+"-displayText").text(displayText);	
	}
}

function dataAnalysisFail (id, displayText = false) {
	// Sets the "-check" to a red do not enter for id
	$("#"+id+"-check").removeClass("grey-text").addClass("red-text").text("remove_circle");
	if (displayText) {
		$("#"+id+"-displayText").text(displayText);	
	}	
}

function stopDataProgressBar() {
	$("#dataAnalysisModal-progress").removeClass("indeterminate").addClass("determinate").css("width", "100%");
}

function startDataProgressBar() {
	$("#dataAnalysisModal-progress").removeClass("determinate").addClass("indeterminate");
}

function initializeLoadData() {
	// Loop over the graveyarddtables array
	
}	

function clickOnLoadData () {
	// Check for saved data
/*	if (wasDataSaved()) {
		// Get all of the saved data
		loadAllData();
		var savedData = makeAllDataJSON();
		// Set the text area
		$("#loadDataField").val(JSON.stringify(savedData));
		// Set the message
		$("#loadDataModal-message").html("I found data saved to your computer.  If you want to use this data, simply click Update.<br>If not, paste your data below and then click Update");
	} else {
		$("#loadDataModal-message").html("Please paste your data below and then click Update");
	}
	*/
	// Interesting "hack" found here: https://stackoverflow.com/questions/10216331/open-file-dialog-box-on-a-tag
	// Transfer the click to the hidden file selector	
	$("#pickDataFile").click();
	//$("#loadDataModal").modal('open');
}

function fileChosen() {
	// Called when the a file has been loaded
	var prioritiesJSONFile = $("#pickDataFile")[0].files[0];
	var fileReader = new FileReader();
	
	// the readAsText function returns immediately and then fires once done reading
	fileReader.onload = function (event) {
		clickOnUpdateData(fileReader.result);
		
	}
	fileReader.readAsText(prioritiesJSONFile);
}

//console.log("loadData-modal loaded");