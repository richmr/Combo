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

// Generates a list of possible combinations... Stops at 200 total

function comboListInit() {
	$("#combo_list").click(function(event) {
		clickOnComboList();		
	});
}

function clickOnComboList () {
	// Generate level 1 combos
	lvl1Combos = generateComboArray(1);
	lvl2Combos = generateComboArray(2);
	
	// Remove level 1 combos from level 2 list
	uniqLevel2Combos = _.differenceWith(lvl2Combos, lvl1Combos,  _.isEqual);
	// Generate the display	
	htmlsnippet = "Level 1 Combos ("+lvl1Combos.length+" found)<br><hr>"
	lvl1Combos.forEach(function (combo, index) {
		htmlsnippet += "- "+combo.join('')+"<br>";
	});
	
	htmlsnippet += '<br>Level 2 Combos ('+uniqLevel2Combos.length+' found)<br><hr>';
	uniqLevel2Combos.forEach(function (combo, index) {
		htmlsnippet += "- "+combo.join('')+"<br>";
	});
		
	$("#comboList-content").html(htmlsnippet);
	
	// Open the modal
	$("#comboListModal").modal('open');
}

function generateComboArray(level=1) {
	theseRareReadings = [];
	for (index in dialHistograms) {
		theseRareReadings.push(rareReadings(dialHistograms[index], level));	
	}
	
	theseComboArrays = possibleCombinations(theseRareReadings, 5000);
	return theseComboArrays;
}

function rareReadings(readingsHistogram, level = 1) {
	// Generates an array of combo readings that meet a rarity level
	// level 1 = only numbers that meet the lowest number of observations in the histogram
	// level 2 = numbers that meet the next lowest number of readings in the histogram and the lowest
	// Anything over that level of rarity probably isn't value added
	// This isn't my best algorithmic creation...
	// Need to create a copy of the array, so we don't modify original data!
	var copyOfReadings = readingsHistogram.slice();
	var rareReadingsIndex = [];
	for (run = 0; run < level; run++) {
		var minVal = Math.min(...copyOfReadings);  //  For the record I've never heard of that "..." operator before.
		var maxVal = Math.max(...copyOfReadings); // Just wait until you see what I do with this..  Hack time..
		copyOfReadings.forEach( function (value, index, theCopy) {
			if (value == minVal) {
				rareReadingsIndex.push(index);
				theCopy[index] = (maxVal+1);  // This is to make it non-rare for the next cycle while maintaining the index order
			}
		});	
	}
	
	// Now convert index locations to possible values
	var rareReadings = [];	
	$.each(rareReadingsIndex, function (index, value) {
			rareReadings.push(viableEntries[value]);
		});
		
		return rareReadings;
}

function possibleCombinations(rareReadings, maxCombos=200) {
	// rareReadings is an array of arrays of rare readings for each dial, where index 0 is the first dial
	(indexTrack = []).length = rareReadings.length;
	indexTrack.fill(0);
	done = false;
	comboCount = 0;
	var comboList = [];
	while (!done) {
			var aCombo = [];
			for (i = 0; i < rareReadings.length; i++) {
				aCombo.push(rareReadings[i][indexTrack[i]]);			
			}
			comboList.push(aCombo);
			comboCount += 1;
			if (comboCount >= maxCombos) {
				done = true;			
			} else {
				// Increment the sample
				indexTrack[rareReadings.length-1] += 1;
				for (j = (rareReadings.length - 1); j >= 0; j--) {
					if (indexTrack[j] >= rareReadings[j].length) {
						if ((j-1) < 0) {
							//  Then we have finished all the combos
							done = true;
							break;
						} else {
							indexTrack[j] = 0;
							indexTrack[j-1] += 1;						
						}					
					}				
				}
			
			}
	}
	return comboList;
}