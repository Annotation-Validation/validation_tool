// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var fs = require("fs");
var csv = require("fast-csv");
var $ = require("jquery");
// Include app dependency on ngMaterial

angular.module('YourApp', ['ngMaterial'])
    .controller("YourController", function ($scope, $interval, $timeout, $mdToast) {
        readTextFile("reviewed2.json", function(text){
            console.log(text);
             $scope.array1 = JSON.parse(text);
        });

        //$scope.array1 = [{"text":"Changes","annotation":"0","$$hashKey":"object:Boss"}];
        $scope.invalid_entries = [];
        $scope.currentIndex = 0;
        $scope.entriesPerPage = 3;
        $scope.indexArray = getIndexArray($scope.currentIndex, $scope.entriesPerPage, $scope.invalid_entries);
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
            for(var i = 0;i<$scope.entriesPerPage;i++) {
                                //fs.appendFile("reviewed2.json", safeIt($scope.phrases,$scope.currentIndex), function () {
                                fs.writeFile("reviewed2.json", JSON.stringify($scope.array1), function () {
                                console.log("Successfully saved data to disk: "+$scope.currentIndex);
                            });
                            $scope.currentIndex++;

                        }
            $scope.indexArray = [];
            $timeout(function () {
                //checkIt($scope.phrases,$scope.array1);
                console.log("Loading next entries");
                $scope.currentIndex += $scope.entriesPerPage;
                $scope.entriesPerPage=howMany($scope.currentIndex,$scope.phrases,$scope.entriesPerPage);
                $scope.indexArray = getIndexArray($scope.currentIndex, $scope.entriesPerPage, $scope.invalid_entries);
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

            $scope.invalid_entries.pushIfNotExist(phraseIndex, function(e) { 
                return e == phraseIndex 
            })
            $scope.invalid_entries.sort(function(a, b){return a-b});
            $scope.indexArray = getIndexArray($scope.currentIndex, $scope.entriesPerPage, $scope.invalid_entries);
            console.log($scope.indexArray)
        }
        /*$scope.resetIndex = function () {
            $scope.currentIndex = 0;
        }*/
        loadData("annotation_data/GPS_all_corpusalexPattern.csv", function (data) {
            $scope.phrases = data;
            getReviews($scope.phrases, $scope.array1);
            //$timeout(function () {
            //    console.log($scope.phrases = checkIt($scope.phrases,$scope.array1));
            //
            //}, 200)
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

function justIf(array1, value1){
    //console.log(array1);
    //console.log(value1.$$hashKey);
    //console.log(array1[0].$$hashKey);
    if(isEmpty(array1)){
        console.log("It's empty");
        array1.push(value1);
        return array1;
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

    fs.open(file,'r',function(err, fd){
        if (err) {
            fs.writeFile(file, '[]', function(err) {
                if(err) {
                    console.log(err);
                }
                console.log("The file was saved!"); //Funktioniert scheiße ...
            });
        } else {
            console.log("The file exists!");
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
    });
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


function getIndexArray(start, length, invalid_indices) {
    var indexes = [];
    var previous_invalid = 0;
    if (invalid_indices === undefined){
        invalid_indices = [];
    }
    for (var index of invalid_indices){
        console.log("a new invalid index", index)
        if (index <= start){
            console.log("index is smaller than the start, adding to the previous invalid")
            previous_invalid++;
        }
    }
    console.log("previous invalid: ", previous_invalid)
    new_invalid = 0
    for (var i = start + previous_invalid; i < start + length + previous_invalid + new_invalid; i++) {
        for(var index of invalid_indices){
            if (index == i){
                new_invalid++;
                i++;
            }
        }
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

function partOf(one,two){
    //console.log(one,two);
    var returnedData = $.grep(two, function(element, index){
        return element.hashkey == one;
    });
    if(isEmpty(returnedData)){
        return {}
    }else{
    //console.log(returnedData[0].text+ returnedData[0].hashkey+ returnedData[0].annotation + " length: "+returnedData.length);
    return returnedData;
    }
}

function getReviews(phrases,array1) {
    phrase = [];
    //var text = [];
    //var annotation = [];
    //var count = new Object();
    //endsolu = [];
    var a = 0;
    var d = 0;
    var x = 0;
    var newWord;
    csv.fromPath("annotation_data/GPS_all_corpus_review_rating.csv", {
            headers: true,
            delimiter: "%"
        })
        .on("data", function (gay) {
            phrase.push(gay);
        })
        .on("end", function () {
            d = 0;
            console.log("donegay");
            //console.log(phrase[1].reviewparts);
            for (var b = 0; b <= phrase[phrase.length - 1].id; b++) {
                //console.log(b);
                for (var i = 0; i < phrase.length; i++) {
                    if (phrase[i].id == b) {
                        //console.log("Jeay");
                        //text.push(phrase[i].reviewparts);
                        //annotation.push(phrase[i].reviewrating);
                        if(partOf("object:"+d,array1).length==1){
                            //console.log("whattheheck"+partOf("object:"+d,array1)[0].annotation);
                            newWord = {
                                "text": phrase[i].reviewparts,
                                "annotation": partOf("object:"+d,array1)[0].annotation,
                                "hashkey": "object:" + d
                            };
                        }else {
                            newWord = {
                                "text": phrase[i].reviewparts,
                                "annotation": phrase[i].reviewrating,
                                "hashkey": "object:" + d
                            };
                        }
                        phrases[b].reviewphrase[a] = newWord;
                        //console.log(phrases[b].reviewphrase[a]);
                        a++;
                        d++;
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
            console.log(d);
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


//src http://stackoverflow.com/questions/1988349/array-push-if-does-not-exist
// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) { 
    for(var i=0; i < this.length; i++) { 
        if(comparer(this[i])) return true; 
    }
    return false; 
}; 

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function(element, comparer) { 
    if (!this.inArray(comparer)) {
        this.push(element);
    }
}; 
