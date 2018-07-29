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

// TODO: Make this editable from the UI to allow for different types of locks
viableEntries = [0,1,2,3,4,5,6,7,8,9];

// I looked for a way to get the chart object from the canvas reference, but all the answers were using a global variable..  Sigh
chartRefs = {};
var dialHistograms = {};

function doStats() {
	console.log("doStats(): I've got " + _.size(comboReadings) + " stats to work with");
	/*
		Overall process here:
		Break inputs into digits and put into dial arrays
		Calculate histogram
		Draw the results
		Display low seen numbers per dial
	*/
	
	dialReadings = getReadingsForDials();
	// You can't set a desired bin range in jStat.histogram, it only works on the range present in the data.
	// Two options: add a "fake" entry for each possibility in the range, and then subtract 1 from each entry in the built histogram
	// Or do the count manually.
	// Lets try Plan A
	$.each(dialReadings, function (dialID, readings) {
		readings = _.concat(readings, viableEntries);
		dialHistogram = jStat.histogram(readings, viableEntries.length);
		// Remove "fake" readings
		dialHistogram = dialHistogram.map(function (value) {return (value-1);});
		// Save to global object for combo gen
		dialHistograms[dialID] = dialHistogram;
		// Update plots
		doChart(dialID, dialHistogram);
	});	  		
}

function doChart(dialID, dialData) {
	// Does a ref for this chart exist already?
	if (chartRefs[dialID]) {
		// Just update data
		updateChart(dialID, dialData);			
	} else {
		// Make it
		initDialChart(dialID);
		updateChart(dialID, dialData);	
	}
}

function resetCharts() {
	// Just removes all the charts
	//$("#dial-stats").html('Dial Results:<span id ="dial-stats-bottom"></span>');
	$("canvas[id^='dialChart-']").remove();
	chartRefs = {};
}

function addChartCanvas(dialID) {
	// Adds a new chart canvas
	chartID = "dialChart-"+dialID;
	htmlsnippet = '<canvas id="'+chartID+'"></canvas>';
	$("#dial-stats-bottom").before(htmlsnippet);
	return chartID;
}

function initDialChart(dialID) {
	// Add the canvas
	chartID = addChartCanvas(dialID);
	// Make the chart
	var ctx = document.getElementById(chartID).getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: viableEntries,
	        datasets: [{
	            label: 'Dial ' + (dialID+1) + ' Stats',
	            data: [],
	            backgroundColor: 'rgba(54, 162, 235, 0.2)',
	            borderColor: 'rgba(54, 162, 235, 1)',
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true,
	                    stepSize: 1
	                }
	            }]
	        }
	    }
	});
	// Save the ref
	chartRefs[dialID] = myChart;
}

function updateChart(dialID, dialData) {
	myChart = chartRefs[dialID];
	myChart.data.datasets[0].data = dialData;
	myChart.update();
}

function drawChart(dialID, dialData) {
	var ctx = document.getElementById("dialChart-1").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: viableEntries,
	        datasets: [{
	            label: '# of Votes',
	            data: [],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});
}

function getReadingsForDials() {
	// Returns an array of arrays of the readings for given dial number
	var numDials = $("#dialreading-1").val().length;
	// Make an array of empty arrays
	var readingArray = [];
	for (i = 0; i < numDials; i++) {
		readingArray.push([]);	
	}
	$.each(comboReadings, function (key, reading) {
		for (i = 0; i < reading.length; i++) {
			readingArray[i].push(Number(reading[i]));
		}
	});
	
	return readingArray;
}