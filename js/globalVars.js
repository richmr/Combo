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

// Global variable declarations

var parties = {"name":"Click to name your party", "defaultSeats":10};
var partyRowData = { "categories":["Guests"],
								"nextRowID":2,
								"rows":{1:{"name":"Click to Change", "seats":10}}
							};
var people = {};

var peopleChips = { "priority-row-1-spot-1": { "projectID":"stage", "blank":"stage"},
							"priority-row-1-spot-2": { "projectID":"stage", "blank":"stage"},
							"priority-row-1-spot-3": { "projectID":"stage", "blank":"stage"},
							"priority-row-1-spot-4": { "projectID":"stage", "blank":"stage"},
							"priority-row-1-spot-5": { "projectID":"stage", "blank":"stage"},
							"priority-row-1-spot-6": { "projectID":"stage", "blank":"stage"},
							"priority-row-1-spot-7": { "projectID":"stage", "blank":"stage"},
							"priority-row-1-spot-8": { "projectID":"stage", "blank":"stage"},
							"priority-chipStage" : {"projectID":"stage", "blank":"stage"}
						};
var archivedPeople = [];
var donePeople = [];
var graveyardPeople = [];
								
var tables = { "nextProjID":1
					};
var seatsDataSaved = true;
var permanentPeople = {"0": {"title":"New Guest", "status":"chip-placeholder", "draggable":false, "droppable":true, "click":"add"},
									"stage": {"title":"New Guest", "status":"chip-placeholder", "draggable":false, "droppable":true, "click":"add"},
								};

function consolidateData() {
	// Returns a consolidated JSON object with all data
	// First update the pools
	saveArchive();
	saveGraveyard();
	saveDone();
	
	return makeAllDataJSON();
}

console.log("Global vars loaded.");