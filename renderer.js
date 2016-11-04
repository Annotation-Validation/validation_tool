// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var fs = require("fs");
var csv = require("fast-csv");
var $ = require("jquery");
// Include app dependency on ngMaterial

angular.module('YourApp', ['ngMaterial'])
    .controller("YourController", function ($scope, $interval, $timeout, $mdToast) {
    	//fs.writeFile("reviewed2.json", "");//cause of tests

            $timeout(function () {
                checkIt($scope.phrases);
            }, 2000)

        readTextFile("reviewed2.json", function(text){
            console.log(text);
             $scope.array1 = JSON.parse(text);
        });

        //$scope.array1 = [{"text":"Changes","annotation":"0","$$hashKey":"object:Boss"}];
        $scope.currentIndex = 0;
        $scope.entriesPerPage = 3;
        $scope.indexArray = getIndexArray($scope.currentIndex, $scope.entriesPerPage);
        $scope.clickedWord = function (phraseIndex, wordIndex) {
            console.log("Clicked on", $scope.phrases[phraseIndex], "with word", $scope.phrases[phraseIndex].reviewphrase[wordIndex]);
            var currAnnotation = $scope.phrases[phraseIndex].reviewphrase[wordIndex].annotation;
            if (currAnnotation == 1) {
                $scope.phrases[phraseIndex].reviewphrase[wordIndex].annotation = -1;
            } else {
                $scope.phrases[phraseIndex].reviewphrase[wordIndex].annotation++;
            }

                $scope.array1 = justIf($scope.array1,$scope.phrases[phraseIndex].reviewphrase[wordIndex]);
               // $scope.array1=$scope.phrases[phraseIndex].reviewphrase[wordIndex];
            //$scope.array1.push($scope.phrases[phraseIndex].reviewphrase[wordIndex]);
            //justIf($scope.array1,$scope.phrases[phraseIndex].reviewphrase[wordIndex]);
                console.log($scope.array1);
                //console.log($scope.array1[0].$$hashKey);
        }
        $scope.rightClickedWord = function (phraseIndex, wordIndex) {
            console.log("RightClicked on", $scope.phrases[phraseIndex], "with word", $scope.phrases[phraseIndex].reviewphrase[wordIndex]);
            $scope.phrases[phraseIndex].reviewphrase[wordIndex].annotation = 0;
        }
        $scope.nextEntries = function () {
            console.log("Removing old entries");
            changes($scope.array1, $scope.phrases);
            for(var i = 0;i<$scope.entriesPerPage;i++) {
                                //fs.appendFile("reviewed2.json", safeIt($scope.phrases,$scope.currentIndex), function () {
                                fs.writeFile("reviewed2.json", JSON.stringify($scope.array1), function () {
                                console.log("Successfully saved data to disk: "+$scope.currentIndex);
                            });
                            $scope.currentIndex++;

                        }
            $scope.indexArray = [];
            $timeout(function () {
                console.log("Loading next entries");
                $scope.currentIndex += $scope.entriesPerPage;
                $scope.entriesPerPage=howMany($scope.currentIndex,$scope.phrases,$scope.entriesPerPage);
                $scope.indexArray = getIndexArray($scope.currentIndex, $scope.entriesPerPage);
                //generateAnnotations($scope.phrases, $scope.indexArray);


            }, 255)

            //fs.writeFile("GPS_all_corpus_review_rating.csv"), angular.to
//            fs.writeFile("reviewed2.json", angular.toJson($scope.phrases), function () {
//                console.log("Successfully saved data to disk");
//            })
        }
        $scope.report = function () {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Die Phrase wurde erfolgreich gemeldet, danke für die Hilfe!')
                    .action('Alles klar!')
                    .highlightAction(false)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        }
        $scope.remove = function (phraseIndex, index) {
            console.log("Removing review");
            $scope.phrases.slice(phraseIndex, 1);
            $scope.indexArray.slice(index, 0);
            $scope.indexArray = getIndexArray($scope.currentIndex, $scope.entriesPerPage);

        }
        /*$scope.resetIndex = function () {
            $scope.currentIndex = 0;
        }*/
        loadData("annotation_data/GPS_all_corpusalexPattern.csv", function (data) {
            $scope.phrases = data;
            getReviews($scope.phrases);
            //generateAnnotations($scope.phrases, $scope.indexArray);
        });

        $interval(function () {
            //Electron is dumb
        }, 1000)
    })
    //src: http://stackoverflow.com/questions/15731634/how-do-i-handle-right-click-events-in-angular-js
    .directive('ngRightClick', function ($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, {$event: event});
                });
            });
        };
    });
;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function checkIt(phrases){
    console.log(phrases[1].reviewphrase[1].$$hashKey);
    var array1=["we","2","3"];
    var array2=["we","2"];

    array1.filter(function(n) {
        console.log(array2.indexOf(n) != -1);
    });


    //for (var b = 0; b <= phrases[phrases.length - 1].id; b++) {
    //    for (var i = 0; i < phrases.reviewphrase.length; i++) {
    //        array1.filter(function(n) {
    //            return array2.indexOf(n) != -1;
    //        });
    //    }
    //}
}

function justIf(array1, value1){
    //array1.push("Pimmel");
    //console.log(array1);
    //console.log(value1.$$hashKey);
    //console.log(array1[0].$$hashKey);
    if(isEmpty(array1)){
        console.log("It's empty");
        return array1[0]=(value1);
    }
    //console.log("immerhin"+Object.keys(array1).length+""+array1.length);
    for(var i = 0; i<array1.length;i++) {
        //console.log("drin!"+i);
        if(value1.$$hashKey == array1[i].$$hashKey){
            array1[i] = value1;
            //console.log("existiert bereits");
            return array1;
        } else continue;
    }
    //console.log("something");
    array1.push(value1);
    return array1;
}

function readTextFile(file, callback) { //http://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function loadData(pathToFile, callback) {
    console.log("Loading CSV from", pathToFile);
    csvData = [];
    csv.fromPath(pathToFile, {
            headers: true,
            delimiter: "%"
        })
        .on("data", function (newLine) {
            //Split Phrase into Words
            newLine.reviewphrase = newLine.reviewphrase.split(" ");
            //Beautify AppStore Name
            if (newLine.appstore == "GPS") {
                newLine.appstore = "Google Play Store";
            }

            //Create Rating String
            var ratingString = "";
            for (var i = 0; i < newLine.reviewrating; i++) {
                ratingString += "★";
            }
            for (var i = ratingString.length; i < 5; i++) {
                ratingString += "☆";
            }
            newLine.ratingString = ratingString;
            csvData.push(newLine);
        })
        .on("end", function () {
            console.log("done");
            callback(csvData);
        });
}

function safeIt(phrases,indexnum){
    var JSONshit = JSON.stringify(phrases[indexnum].reviewphrase);
    console.log("JSONshit: "+JSONshit);
    return JSONshit;
}

function changes(array1, phrases){
    console.log(array1);
  var hash = $.grep(phrases[1].reviewphrase, function(b){
        return b.$$hashKey == array1.$$hashKey;
    });
    console.log(hash);
//for(var i = 0; i < array1.length;i++){
//    if(){
//
//    }
//}
}

function getIndexArray(start, length) {
    var indexes = [];
    for (var i = start; i < start + length; i++) {
        indexes.push(i);
    }
    return indexes;
}

function howMany(current,phrases,entriesPerPage){
    var lenge= phrases[current].reviewphrase.length+phrases[current+1].reviewphrase.length+phrases[current+2].reviewphrase.length;
    console.log("LÄNGE = "+phrases[current].reviewphrase.length+" | "+phrases[current+1].reviewphrase.length+" | "+phrases[current+2].reviewphrase.length+" | "+phrases[current].id);
    if(lenge>140){
        entriesPerPage = 2;
    }else{
        entriesPerPage = 3;
    }
    return entriesPerPage;
}

function getReviews(phrases) {
    phrase = [];
    //var text = [];
    //var annotation = [];
    //var count = new Object();
    //endsolu = [];
    var a = 0;
    csv.fromPath("annotation_data/GPS_all_corpus_review_rating.csv", {
            headers: true,
            delimiter: "%"
        })
        .on("data", function (gay) {
            phrase.push(gay);
        })
        .on("end", function () {
            console.log("donegay");
            //console.log(phrase[1].reviewparts);
            for (var b = 0; b <= phrase[phrase.length - 1].id; b++) {
                for (var i = 0; i < phrase.length; i++) {
                    if (phrase[i].id == b) {
                        //console.log("Jeay");
                        //text.push(phrase[i].reviewparts);
                        //annotation.push(phrase[i].reviewrating);
                        var newWord = {
                            "text": phrase[i].reviewparts,
                            "annotation": phrase[i].reviewrating
                        };
                        phrases[b].reviewphrase[a] = newWord;
                        //console.log(phrases[b].reviewphrase[a]);
                        a++;
                       // endsolu[b].text[i] = (phrase[i].reviewparts);
                        //endsolu[b].annotation[i] = (phrase[i].reviewrating);

                    } else {
                        //console.log("FUCK U");
                    }
                }
                a=0;
                //count.text = text;
                //count.annotation = annotation;
                //endsolu.push(count);
                //count = {};
                //text = [];
                //annotation = [];

                //console.log(phrases[b])
            }
        });
}

function generateAnnotations(phrases, indexesToUse) {
    console.log("Generating Random Annotations for the following Indices", indexesToUse);
    for (var i = indexesToUse[0]; i < indexesToUse[indexesToUse.length - 1] + 1; i++) {
        //Decide if the review is positive or negative
        var reviewIsPositive = probability(0.3);
        for (var j = 0; j < phrases[i].reviewphrase.length; j++) {
            var wordIsAnnotated = probability(0.3);
            var newWord = {
                "text": phrases[i].reviewphrase[j],
                "annotation": 0
            };
            if (wordIsAnnotated) {
                if (reviewIsPositive) {
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
