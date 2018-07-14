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

var keyGlobalVars = [
	"parties",
	"partyRowData",
	"people",
	"peopleChips",
	"archivedPeople",
	"donePeople",
	"graveyardPeople",
	"tables"
	];

var savedDataFlag = "seatsDataSaved";

var lastKnownState = {};
var resetState = {};

function dataChanged(hint=false) {
	// Called whenever an important piece of data is changed
	// If there is a hint, then only worries about the data in the hint
	// If not iterates over chosen global variables and looks for any that changed
	// Then calls the data change handler to deal with the detected change	
	console.log("//dataChanged() called");	
	
	if (hint) {
		saveData(hint);
	} else {
		$.each(keyGlobalVars, function (key, aGlobalVar) {
			if (_.isEqual(window[aGlobalVar], lastKnownState[aGlobalVar])) {
				// This variable didn't change, don't do anything
				console.log(aGlobalVar+" did not change");
			} else {
				// This variable did change, do something
				lastKnownState[aGlobalVar] = window[aGlobalVar];
				console.log(aGlobalVar+" DID change");
				saveData(aGlobalVar);
			}		
		});
	}	
}

function saveAllData() {
	$.each(keyGlobalVars, function (key, aGlobalVar) {
		saveData(aGlobalVar);
	});
	localStorage.setItem(savedDataFlag, true);
}

function saveData(objToSave) {
	// Just storing in localStorage for now.	
	localStorage.setItem(objToSave, JSON.stringify(window[objToSave]));
	lastKnownState[objToSave] = window[objToSave];
}

function loadData(objToLoad, isJSON = true) {
	var obj = localStorage.getItem(objToLoad);
	if (isJSON) {
		obj = JSON.parse(obj);
	}
	lastKnownState[objToLoad] = obj;
	window[objToLoad] = obj;
}

function loadAllData() {
	$.each(keyGlobalVars, function (key, aGlobalVar) {
		loadData(aGlobalVar);
	});
}

function makeAllDataJSON() {
	var allData = {};
	$.each(keyGlobalVars, function (key, aGlobalVar) {
		allData[aGlobalVar] = window[aGlobalVar];
	});
	
	return allData;
}

function wasDataSaved() {
	if (localStorage.getItem(savedDataFlag)) {
		return true;
	} else {
		return false;
	}
}

function saveResetState() {
	$.each(keyGlobalVars, function (key, aGlobalVar) {
		resetState[aGlobalVar] = JSON.stringify(window[aGlobalVar]);
	});
}

function deleteStoredData() {
	$.each(keyGlobalVars, function (key, aGlobalVar) {
		localStorage.removeItem(aGlobalVar);
	});
	localStorage.removeItem(savedDataFlag)
}

function loadResetState() {
	$.each(keyGlobalVars, function (key, aGlobalVar) {
		window[aGlobalVar] = JSON.parse(resetState[aGlobalVar]);
	});
}

