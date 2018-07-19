


var votes;
var moviesContainer = $("#results"); //! Change to actual container
moviesContainer.empty();
var votingData = $("#vote"); //! Change to actual container



database.ref("votes").on("value", function (snapshot) {
    votes = snapshot.val();
    if (votes == "empty"){
        // database.ref("votes")
    }

    var votesInOrder = [];
    for (var x in votes) {
        votesInOrder.push([x, votes[x]]);
    }

    votesInOrder.sort(function (a, b) {
        return b[1] - a[1];
    });
    var win1P = $("<p>").text(votesInOrder[0][0] + ": " + votesInOrder[0][1] + " vote(s)").css("margin","auto");
    var win2P = $("<p>").text(votesInOrder[1][0] + ": " + votesInOrder[1][1] + " vote(s)").css("margin","auto");
    var win3P = $("<p>").text(votesInOrder[2][0] + ": " + votesInOrder[2][1] + " vote(s)").css("margin","auto");
    votingData.empty();
    if(votesInOrder[0][1] == "0"){
        votingData.append("<p> No voting data yet.</p>")

    }else if (votesInOrder[1][1] == "0"){
        votingData.append(win1P);

    }else if(votesInOrder[2][1] == "0"){
        votingData.append(win1P, win2P);

    }else{
        votingData.append(win1P,win2P,win3P);
    }

    var clearVotesBtn = $("<button>").text("Clear Votes").attr("id","clearVotesBtn");
    var endVotingBtn = $("<button>").text("End Voting").attr("id", "endVotingBtn");
    votingData.append(clearVotesBtn);
    votingData.append(endVotingBtn);
});



var movieZip = 85204; //! Get from google API


var movieDate = moment().format("YYYY-MM-DD"); //! Testing
var movieDate = "2017-07-19"; 
var movieDate = "2018-07-19";
var movieDate = "2018-07-20";

// getDate(movieDate);

function getDate(movieDate) {

    database.ref("movieTimes").once("value", function (snapshot) {
        if (snapshot.hasChild(movieDate)) {
            console.log("Date in database");

        } else {
            var movieLookupURL = "http://data.tmsapi.com/v1.1/movies/showings?startDate=" + movieDate + "&zip=" + movieZip + "&api_key=" + gracenoteAPIKey
            console.log("Retrieving Times for " + movieDate);

            $.ajax({
                url: movieLookupURL,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                var movieTimes = JSON.stringify(response)

                database.ref("movieTimes").update({

                    [movieDate]: movieTimes
                });
                for (x in response) {
                    let movieName = response[x].title;
                    if (movieName.endsWith("3D")) {
                        console.log("3D detected");
                    }

                }
            });
            console.log("Date not in database");
        }



    });
}

populateMovies();


function populateMovies(){
    database.ref("movieTimes").once("value", function (snapshot) {
        // console.log(snapshot.val())
    
        var movieTimesJSON = JSON.parse(snapshot.child(movieDate).val());
        // console.log(movieTimesJSON);
    
        for (x in movieTimesJSON) {
            let movieNameResponse = movieTimesJSON[x].title;
            let movieID = movieTimesJSON[x].tmsId;
            if (movieNameResponse.endsWith("3D")) {
                movieName = movieNameResponse.slice(0, movieNameResponse.length - 3)
            } else {
                movieName = movieNameResponse;
            }
            var movieInfoLookupURL = "https://api.themoviedb.org/3/search/movie?api_key=" + tmdbAPIKey + "&language=en-US&query=" + movieName
    
    
            $.ajax({
                url: movieInfoLookupURL,
                method: "GET"
            }).then(function (omdbResponse) {
                // console.log(omdbResponse);
                if (omdbResponse.results.length == 0) {
                    console.log("no results for:" + movieName);
                } else {
                    movieImgURL = "https://image.tmdb.org/t/p/original" + omdbResponse.results[0].poster_path;
                    var movieContainer = $("<div>");
                    movieContainer.css("width", "14%").css("display", "inline-block");
                    var movieImg = $("<img>").attr("src", movieImgURL).addClass("poster").css("width", "90%").attr("id", movieID).attr("name", movieNameResponse).attr("vote", "false");
                    movieNameP = $("<p>").text(movieNameResponse);
                    var checkMark = $("<img>").attr("src", "assets/images/checkMark.png").css("z-index", "99").css("text-align", "center").css("width", "10%").css("position", "absolute").css("transform", "translate(-105%, 10%)").attr("id", movieID + "check").css("display", "none");
    
                    movieContainer.append(movieImg);
                    // movieContainer.append(movieNameP);
                    movieContainer.append(checkMark);
    
                    moviesContainer.append(movieContainer);
                }
            });
        }
    });

}




$(votingData).on("click", function(e){
    if (e.target.id == "clearVotesBtn") {
    console.log("Votes Cleared");
    database.ref("votes").set({
        "No votes yet 1":"0",
        "No votes yet 2":"0",
        "No votes yet 3":"0"
    });
    }
    if (e.target.id=="endVotingBtn"){
        console.log("Vote Ending");
    }

})

moviesContainer.on("click", function (e) {
    var targetImgID = e.target.id;

    if ((targetImgID).endsWith("check")) {
        targetImgID = targetImgID.slice(0, targetImgID.length - 5)
    } else if (targetImgID.startsWith("MV")) {
    } else {
        return;
    }
    var movieName = $("#" + targetImgID).attr("name");
    var targetCheckmarkID = targetImgID + "check";

    if ($("#" + targetCheckmarkID).css("display") == "none") {
        $("#" + targetImgID).attr("vote", "true");
        $("#" + targetCheckmarkID).toggle();
        if (movieName in votes) {
            updatedVote = (parseInt(votes[movieName]) + 1).toString();
        } else {
            updatedVote = "1"
        }
        database.ref("votes").update({
            [movieName]: updatedVote
        });
    } else {
        $("#" + targetImgID).attr("vote", "false");
        $("#" + targetCheckmarkID).toggle();
        if (movieName in votes) {
            updatedVote = (parseInt(votes[movieName]) - 1).toString();
        } else {
            updatedVote = "0"
        }
        database.ref("votes").update({
            [movieName]: updatedVote
        });
    }

});