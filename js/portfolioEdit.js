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

function initializePortfolio() {
	// Reset the portfolio title
	$("#portfolioName").text(parties["name"]);
	
	// Make the name clickable
	$("#portfolioName").off("click");
	$("#portfolioName").click(function(event) {
			clickeditPortfolio();		
	});
	
	// Attach events to the modal buttons
	$("#savePortfolioData").off("click");
	$("#savePortfolioData").click(function(event) {
			clickSavePortfolio();		
	});
	
	$("#cancelPortfolioData").off("click");
	$("#cancelPortfolioData").click(function(event) {
			clickCancelPortfolio();		
	});
	
	// Enable "Enter" detection on the row name field (same as "Save")
	$("#editPortfolioName").off("keypress");
	$("#editPortfolioName").keypress(function(e) {
	    var keycode = (e.keyCode ? e.keyCode : e.which);
	    if (keycode == '13') {
	        clickSavePortfolio();
	    }
	});
}

function clickeditPortfolio() {
	// Set the portfolio name form field
	$("#editPortfolioName").val(parties["name"]);
	$("#editPortfolio-defaultNumSeats").val(parties["defaultSeats"]);
	
	
	// Open the modal
	$("#editPortfolioDataModal").modal("open");
	$("#editPortfolioName").focus();
}

function clickSavePortfolio() {
	parties["name"] = $("#editPortfolioName").val();
	parties["defaultSeats"] = $("#editPortfolio-defaultNumSeats").val();
	
	$("#portfolioName").text(parties["name"]);
	
	$("#editPortfolioDataModal").modal("close");

}

function clickCancelPortfolio() {
	// Just close the modal
	
	$("#editPortfolioDataModal").modal("close");
}