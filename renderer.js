// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var fs = require("fs");
var csv = require("fast-csv");
// Include app dependency on ngMaterial

angular.module( 'YourApp', [ 'ngMaterial' ] )
    .controller("YourController", function($scope, $interval, $timeout, $mdToast){
        $scope.currentIndex = 0;
        $scope.entriesPerPage = 3;
        $scope.indexArray = getIndexArray($scope.currentIndex, $scope.entriesPerPage);
        $scope.clickedWord = function(phraseIndex, wordIndex){
            console.log("Clicked on", $scope.phrases[phraseIndex], "with word", $scope.phrases[phraseIndex].reviewphrase[wordIndex]);
            var currAnnotation = $scope.phrases[phraseIndex].reviewphrase[wordIndex].annotation;
            if (currAnnotation == 1){
                $scope.phrases[phraseIndex].reviewphrase[wordIndex].annotation = -1;
            } else {
                $scope.phrases[phraseIndex].reviewphrase[wordIndex].annotation++;
            }
        }
        $scope.rightClickedWord = function(phraseIndex, wordIndex){
            console.log("RightClicked on", $scope.phrases[phraseIndex], "with word", $scope.phrases[phraseIndex].reviewphrase[wordIndex]);
            $scope.phrases[phraseIndex].reviewphrase[wordIndex].annotation = 0;
        }
        $scope.nextEntries = function(){
            console.log("Removing old entries");
            $scope.indexArray = [];
            $timeout(function(){
                console.log("Loading next entries");
                $scope.currentIndex += $scope.entriesPerPage;
                $scope.indexArray = getIndexArray($scope.currentIndex, $scope.entriesPerPage);
                generateAnnotations($scope.phrases, $scope.indexArray);

            }, 255)

            fs.writeFile("reviewed.json", angular.toJson($scope.phrases), function(){
                console.log("Successfully saved data to disk");
            })
        }
        $scope.report = function(){
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Die Phrase wurde erfolgreich gemeldet, danke für die Hilfe!')
                    .action('Alles klar!')
                    .highlightAction(false)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        }
        $scope.remove = function(phraseIndex, index){
            console.log("Removing review");
            $scope.phrases.slice(phraseIndex, 1);
            $scope.indexArray.slice(index,0);
            $scope.indexArray = getIndexArray($scope.currentIndex, $scope.entriesPerPage);

        }
        loadData("annotation_data/output.csv", function(data){
            $scope.phrases = data;        
            generateAnnotations($scope.phrases, $scope.indexArray);
        });

        $interval(function(){
            //Electron is dumb
        }, 1000)
    } )
    //src: http://stackoverflow.com/questions/15731634/how-do-i-handle-right-click-events-in-angular-js
    .directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});;

function loadData(pathToFile, callback){
    console.log("Loading CSV from", pathToFile);
    csvData = [];
    csv.fromPath(pathToFile, {
        headers: true,
        delimiter: "%"
    })
        .on("data", function(newLine){
            //Split Phrase into Words
            newLine.reviewphrase = newLine.reviewphrase.split(" ");

            //Beautify AppStore Name
            if(newLine.appstore == "GPS"){
                newLine.appstore = "Google Play Store";
            }

            //Create Rating String
            var ratingString = "";
            for(var i=0;i<newLine.reviewrating;i++){
                ratingString += "★";
            }
            for(var i=ratingString.length;i<5;i++){
                ratingString += "☆";
            }
            newLine.ratingString = ratingString;
            csvData.push(newLine);
        })
        .on("end", function(){
            console.log("done");
            callback(csvData);
        });
}

function getIndexArray(start,length){
    var indexes = [];
    for(var i=start;i<start+length;i++){
        indexes.push(i);
    }
    return indexes;
}

function generateAnnotations(phrases, indexesToUse){
    console.log("Generating Random Annotations for the following Indices", indexesToUse);
    for(var i=indexesToUse[0];i<indexesToUse[indexesToUse.length - 1] + 1;i++){
        //Decide if the review is positive or negative
        var reviewIsPositive = probability(0.3);
        for(var j=0;j<phrases[i].reviewphrase.length;j++){
            var wordIsAnnotated = probability(0.3);
            var newWord = {
                "text" : phrases[i].reviewphrase[j],
                "annotation" : 0
            };
            if(wordIsAnnotated){
                if(reviewIsPositive){
                    newWord.annotation = 1;
                } else {
                    newWord.annotation = -1;
                }
            }
            phrases[i].reviewphrase[j] = newWord;
        }
        console.log(phrases[i]);
    }
}

//src: http://stackoverflow.com/questions/26271868/is-there-a-simpler-way-to-implement-a-probability-function-in-javascript
function probability(n) {
     return !!n && Math.random() <= n;
};

//src: http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}
