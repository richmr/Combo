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

// Edit project global vars
var editProjectID;
var editNewProject = false;

function initializeEditProject() {
	// Set up the date picker
/*	
	$('.datepicker').pickadate({
	    selectMonths: true, // Creates a dropdown to control month
	    selectYears: 5, // Creates a dropdown of 15 years to control year,
	    today: 'Today',
	    clear: 'Clear',
	    close: 'Ok',
	    closeOnSelect: true // Close upon selecting a date,
  });
  */
  // Activate buttons:
  $("#addANote").off("click");
	$("#addANote").click(function(event) {
		clickaddANote();		
	});
	
	$("#saveProjectData").off("click");
	$("#saveProjectData").click(function(event) {
		clicksaveProjectData();		
	});
	
	$("#cancelProjectData").off("click");
	$("#cancelProjectData").click(function(event) {
		clickcancelProjectData();		
	});
	
	/*
	$("#cancelProjectNotes").off("click");
	$("#cancelProjectNotes").click(function(event) {
		clickcancelProjectNotes();		
	});
	*/
	/*
	$("#saveProjectNotes").off("click");
	$("#saveProjectNotes").click(function(event) {
		clicksaveProjectNotes();		
	});
	*/
	// Enable "Enter" detection on the project name field (same as "Save")
	$("#editProject-Title").off("keypress");
	$("#editProject-Title").keypress(function(e) {
	    var keycode = (e.keyCode ? e.keyCode : e.which);
	    if (keycode == '13') {
	        $("#editProject-Title-lastName").focus();
	    }
	});
	$("#editProject-Title-lastName").off("keypress");
	$("#editProject-Title-lastName").keypress(function(e) {
	    var keycode = (e.keyCode ? e.keyCode : e.which);
	    if (keycode == '13') {
	        clicksaveProjectData();
	    }
	});	
  // open the modal - this was for testing and design
  //$("#editProjectModal").modal("open");
}

function clickaddANote() {
	// Set the note to current data
	$("#projectNoteField").val(tables[editProjectID]["note"]);
	
	// open the modal - this was for testing and design
  $("#addANoteModal").modal("open");
  $("#projectNoteField").focus();	
}

function clicksaveProjectData() {
	// if this is a new project, then we need to create the object and increment the projID
	if (editNewProject) {
		tables[editProjectID] = {};
		tables[editProjectID]["draggable"] = true;
		tables[editProjectID]["droppable"] = true;
		tables[editProjectID]["click"] = "details";
		// Set peopleChips
		peopleChips[chipBeingEdited.id].projectID = editProjectID;
		// increment nextProjID
		tables["nextProjID"] = Number(editProjectID) + 1;
	}
	
  // Save basic data
  	tables[editProjectID]["title"] = $("#editProject-Title").val();
  	tables[editProjectID]["lastName"] = $("#editProject-Title-lastName").val();
	tables[editProjectID]["goal"] = $("#editProject-goal").val();
	
	if ($("#status-green").prop("checked")) {
		tables[editProjectID]["status"]="chip-status-green";	
	} else if ($("#status-yellow").prop("checked")) {
		tables[editProjectID]["status"]="chip-status-yellow";	
	} else if ($("#status-red").prop("checked")) {
		tables[editProjectID]["status"]="chip-status-red";	
	}
	/*
	// Iterate over tasks, we can use the nextTaskID stored in editProject-TaskList to make this easier
	var numtasks = $("#editProject-TaskList").data("nextTaskID");
	
	// delete the current tasks for this project
	tables[editProjectID]["tasks"] = [];
	for (i = 1; i < numtasks; i++) {
		var taskobj = {};
		var taskpre = "#task-"+i;
		// I only add incomplete tasks to the data
		if (!$(taskpre+"-done").prop("checked")) {
			taskobj["who"] = $("#task-"+i+"-who").val();
			taskobj["what"] = $("#task-"+i+"-what").val();
			taskobj["when"] = $("#task-"+i+"-when").val();
			tables[editProjectID]["tasks"].push(taskobj);
		}			
	}
	*/
	// Save the notes
	tables[editProjectID]["note"] = $("#projectNoteField").val();
	
	updatePriorityChip(chipBeingEdited);
	$("#editProjectModal").modal("close");
	//dataChanged();	
}

function clickcancelProjectData() {
	// By design, no changes are made to the actual underlying data until "save" is clicked.
	// So just close the modal.
  $("#editProjectModal").modal("close");
  
  // The only caveat to that is if this were a new project.. Maybe not.  	
}

function clickcancelProjectNotes() {
	// By design, no changes are made to the actual underlying data until "save" is clicked.
	// So just close the modal.
	$("#projectNoteField").val("");
  $("#addANoteModal").modal("close");
}

function clicksaveProjectNotes() {
	  tables[editProjectID]["note"] = $("#projectNoteField").val();
	  //dataChanged("tables");
  $("#addANoteModal").modal("close");	
}

function editProject(projID, newProject=false) {
	// Set the global variable
	editProjectID = projID;
	editNewProject = newProject;	
	
	// Opens the modal with the data for this project
	var title = "";
	var goal = "";
	var status = "chip-status-green";
	var tasks = [];
	var note="";
	var lastName = "";
	// Is this a new project?  Set text accordingly
	if (newProject) {
		$("#newOrEditProject").text("New");
	} else {
		$("#newOrEditProject").text("Edit");
		var proj = tables[projID];
		title = proj["title"];
		status = proj["status"];
		goal = proj["goal"];
		tasks = proj["tasks"];
		note = proj["note"];
		lastName = proj["lastName"];
	}
	
	// Set basic data
	$("#editProject-Title").val(title);
	$("#editProject-Title-lastName").val(lastName);
	//$("#editProject-goal").val(goal);
	
	if (status=="chip-status-green") {
		$("#status-green").prop("checked", true);	
	} else if (status=="chip-status-yellow") {
		$("#status-yellow").prop("checked", true);	
	} else if (status=="chip-status-red") {
		$("#status-red").prop("checked", true);	
	}
	
	// iterate over tasks
	// First set task list to empty list
	//$("#editProject-TaskList").html(addTaskButtonHTML());
	
	// Activate the button
	//$("#editProject-addTaskButton").off("click");
	//$("#editProject-addTaskButton").click(function(event) {
	//	clickaddTaskButton();		
	//});
	
	// Set the "next task ID" data
	//$("#editProject-TaskList").data("nextTaskID", 1);
	
	// Iterate
	//$.each(tasks, function( index, value ) {
		  //console.log("Adding task: :" + value);
	//	  addTaskRow(value);
		  
//	});
	 
	 // Set the note data
	 $("#projectNoteField").val(note);
	 // Make sure the collapsible is closed
	 $('#projectNotes-collapsible').collapsible('close', 0);
	 
	// Needed to reset text fields
	Materialize.updateTextFields();	 
	 
	 // Open the modal
	 $("#editProjectModal").modal("open");
	 $("#editProject-Title").focus();
}

function addTaskButtonHTML() {
	// Returns the html for the addTaskButton
	var htmlstring = '<div class="row" id="editProject-taskListEnd">' +
  							'<a class="waves-effect" href="#!">' +
							'<i id="editProject-addTaskButton" class="small material-icons">add_circle_outline</i>' +
							'</a></div>';
	return htmlstring;
}

function newTaskHeaderHTML(taskID) {
	return '<div id="task-'+taskID+'" class="row valign-wrapper">';
}

function newTaskWho(taskID, who=false) {
	var htmlstring = '<div class="input-field col s2">';
	if (who) {
		htmlstring += '<input placeholder="Who" id="task-'+taskID+'-who" type="text" value="'+who+'">';
	} else {
		htmlstring += '<input placeholder="Who" id="task-'+taskID+'-who" type="text">';
	}
	htmlstring += '</div>';
	return htmlstring;
}

function newTaskWhat(taskID, what=false) {
	var htmlstring = '<div class="input-field col s5">';
	if (what) {
		htmlstring += '<input placeholder="What" id="task-'+taskID+'-what" type="text" value="'+what+'">';
	} else {
		htmlstring += '<input placeholder="What" id="task-'+taskID+'-what" type="text">';
	}
	htmlstring += '</div>';
	return htmlstring;
}

function newTaskWhen(taskID, when=false) {
	var htmlstring = '<div class="input-field col s3">';
	if (when) {
		htmlstring += '<input placeholder="When" id="task-'+taskID+'-when" type="text" value="'+when+'">';
	} else {
		htmlstring += '<input placeholder="When" id="task-'+taskID+'-when" type="text">';
	}
	htmlstring += '</div>';
	return htmlstring;
}

function newTaskDone(taskID, done=false) {
	var htmlstring = '<div class="col s1">';
	htmlstring += '<input type="checkbox" class="filled-in" id="task-'+taskID+'-done">';
	htmlstring += '<label for="task-'+taskID+'-done"> </label>'
	htmlstring += '</div>';
	return htmlstring;
}

function newTaskFooter(taskID) {
	return '</div>';
}

function addTaskRow(taskObj = false) {
	// Adds a task row, with task data if present
	var taskID = $("#editProject-TaskList").data("nextTaskID");	
	var htmlstring = newTaskHeaderHTML(taskID);
	var who, what, when;
	if (taskObj) {
		who = taskObj["who"];
		what = taskObj["what"];
		when = taskObj["when"];		
	}
	
	htmlstring += newTaskWho(taskID, who);
	htmlstring += newTaskWhat(taskID, what);
	htmlstring += newTaskWhen(taskID, when);
	htmlstring += newTaskDone(taskID);
	htmlstring += newTaskFooter(taskID);
	
	$("#editProject-taskListEnd").before(htmlstring);

	// Activate the date picker
	$("#task-"+taskID+"-when").pickadate({
	    selectMonths: true, // Creates a dropdown to control month
	    selectYears: 5, // Creates a dropdown of 15 years to control year,
	    today: 'Today',
	    clear: 'Clear',
	    close: 'Ok',
	    closeOnSelect: true // Close upon selecting a date,
  });
  
  // Put focus on the "Who"
  $("#task-"+taskID+"-who").focus();
	
	// increment the nextTaskID
	$("#editProject-TaskList").data("nextTaskID", Number(taskID)+1);
}

function clickaddTaskButton() {
	addTaskRow();
}