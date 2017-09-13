/*jshint esversion: 6 */
//Search functions in JS

//Create connections to DOM elements
let resultsStatus = $("#resultsStatus");
let searchBox = $("#searchBox");

//Create object for individual posts
function SubPost(title, score, comments) {
	this.title = title;
	this.score = score;
	this.comments = comment;
}

//Function for when search is clicked
function searchForSubreddit() {

	if (searchBox.val().length != 0) {
		//If the search box has an entry
		resultsStatus.show();
		resultsStatus.text("Loading...");

		$.getJSON('https://reddit.com/r/' + searchBox.val() + '.json').then(function(results) {

			if (results.data.children.length == 0) {
				resultsStatus.text(searchBox.val() + " is not a subreddit");
			} else {
				resultsStatus.hide();
				console.log(results);

				compileSearchResults(results);

			}

		}, function(error) {
			// If we got an error on the API request
			resultsStatus.text(searchBox.val() + " is not a subreddit");
		});
	} else {
		// If the search box is empty

		resultsStatus.show();
		resultsStatus.text("Enter a subreddit above");
	}

}

// Compiling Handelbar Template from API response
function compileSearchResults(results) {
	//Create and compile template
	let postTemplateScript = $("#postTemplate").html();
	let postTemplate = Handlebars.compile(postTemplateScript);
	let postContext = {
		post: []
	};

	// Iterate through API response posts
	$.each(results.data.children, function(key, value) {
		let commentValue = "No comments";
		if (value.data.num_comments > 0) {
			commentValue = "Comments: " + value.data.num_comments
		}
		postContext.post.push({
			"title": value.data.title,
			"score": value.data.score,
			"comments": commentValue
		});
	});

	let compiledResults = postTemplate(postContext);
	$("#resultsContainer").html(compiledResults);
}

// Have search activate on "Enter" key
$("#searchBox").keyup(function(event) {
	if (event.keyCode == 13) {
		$("#searchButton").click();
	}
});
