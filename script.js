function sortObj(a, b) {
    return b.tfIdf - a.tfIdf;
}

function sortObjDist(a, b) {
    return a.dist - b.dist;
}

function getXmlHttp() {
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}

function textInTheFile (pathFile) {

    var file = getXmlHttp();
    file.open('GET', pathFile, false);
    file.send(null);

    if (file.status == 200) return (file.responseText);
    else return undefined;

};

function textToObject(text) {
    text = text.toLowerCase();

    var wordList = {};
    var word = '';
    var i = 0;
    var kol = 0;
    var ind = 0;

    while (text[i]) {
        while (i+1<=text.length && text[i].match(/[a-za-я0-9]/)) {
            word += text[i];
            i++;
        }
        if (word != '') {
            kol ++;
            if (word in wordList) {
                wordList[word].num += 1;
                wordList[word].index.push(ind);
                ind++;
            }
            else {
                wordList[word] = {
                    num : 1,
                    index : [ind]
                }
                ind++;
            }
        }
        word = '';
        i++;
    }
    wordList.kolWords = kol;
    return wordList;
}

function searchToArr(text) {
    text = text.toLowerCase();

    var wordList = [];
    var word = '';
    var i = 0;

    while (text[i]) {
        while (i+1<=text.length && text[i].match(/[a-za-я0-9]/)) {
            word += text[i];
            i++;
        }

        if (word != '') {
            wordList.push(word);
        }
        word = '';
        i++;
    }
    return wordList;
}

function tf(objText, searchArr) {
    var kolIn = 0;
    for (var i = 0; i<searchArr.length; i++) {
        if (searchArr[i] in objText) {
            kolIn++;
        }
    }
    console.log(kolIn);
    var tf = kolIn/(objText.kolWords);
    return tf;
}

function distance(objText, searchArr) {
    var trueWordsArr = [];
    var j = 0;
    for (var i = 0; i<searchArr.length; i++) {
        if (searchArr[i] in objText) {
            trueWordsArr[j] = objText[searchArr[i]].index;
            j++;
        }
    }
    console.log(trueWordsArr);
    return trueWordsArr;
}

function searchTfIdf(allTexts, searchArr) {
    var kolTrueTexts = 0;
    for (var i = 0; i < allTexts.length; i++) {
        allTexts[i].tf = tf(allTexts[i], searchArr);
        if (allTexts[i].tf > 0) kolTrueTexts++;
    }

    if (kolTrueTexts > 0) {
        for (var i = 0; i < allTexts.length; i++) {
            allTexts[i].idf = (allTexts.length) / (kolTrueTexts);
            allTexts[i].tfIdf = (allTexts[i].tf) * (allTexts[i].idf);
        }
    }

    allTexts.sort(sortObj);
}

function searchDist(allTexts, searchArr) {
    for (var i = 0; i < allTexts.length; i++) {
        allTexts[i].trueWordsArr = distance(allTexts[i], searchArr);
        console.log("____");
        console.log(allTexts[i]);
    }

    var minDist = Infinity;
    for (var i = 0; i < allTexts.length; i++) { //тексты
        allTexts[i].dist = 0;
        for (var j = 0; j < allTexts[i].trueWordsArr.length; j++) { //найденные слова
            for (var k = 0; k < allTexts[i].trueWordsArr[j].length; k++) { //индексы найденного слова
                if (allTexts[i].trueWordsArr[j+1]) {
                    for (var l = 0; l < allTexts[i].trueWordsArr[j + 1].length; l++) { //индексы 2 слова
                        if (minDist > Math.abs(allTexts[i].trueWordsArr[j][k] - allTexts[i].trueWordsArr[j + 1][l])) {
                            minDist = Math.abs(allTexts[i].trueWordsArr[j][k] - allTexts[i].trueWordsArr[j + 1][l]);
                        }
                    }
                }
            }
            if (minDist != Infinity) {
                allTexts[i].dist = allTexts[i].dist + minDist;
            }
            minDist = Infinity;
        }

        console.log("____2222");
        console.log(allTexts[i]);

    }
    allTexts.sort(sortObjDist);
}

(function () {

    var searchForm = document.querySelector('.searchForm');
    var searchForm_text = document.querySelector('.searchForm__text');
    var result = document.querySelector('.result');
    var choice1 = document.getElementById('choice1');
    var choice2 = document.getElementById('choice2');

    searchForm.addEventListener('submit', function(evt){
        evt.preventDefault();

        var file1 = textInTheFile('file1.txt');
        var objText1 = textToObject(file1);
        objText1.numberFile = 0;
        objText1.title = 'file1';

        var file2 = textInTheFile('file2.txt');
        var objText2 = textToObject(file2);
        objText2.numberFile = 1;
        objText2.title = 'file2';

        var file3 = textInTheFile('file3.txt');
        var objText3 = textToObject(file3);
        objText3.numberFile = 2;
        console.log("_____");
        console.log(objText3.numberFile);
        objText3.title = 'file3';

        var allFiles = [file1, file2, file3];
        var allTexts = [objText1, objText2, objText3];

        while( result.firstChild ){
            result.removeChild(result.firstChild);
        }

        var searchArr = searchToArr(searchForm_text.value);

        if (choice1.checked) {
            searchTfIdf(allTexts, searchArr);
        }

        if (choice2.checked) {
            if (searchArr.length < 2) {
                searchTfIdf(allTexts, searchArr);
            }
            else {
                searchDist(allTexts, searchArr);
            }
        }

        for (var i = 0; i < allTexts.length; i++) {

            if (allTexts[i].tfIdf > 0 || allTexts[i].dist) {
                var newResult = document.createElement('li');
                newResult.innerHTML = '<a href="'+allTexts[i].title+'.txt">'+allTexts[i].title+'</a>'
                result.appendChild(newResult);

                for (var j = 0; j<searchArr.length; j++) {
                    if (searchArr[j] in allTexts[i]) {
                        var index = (allTexts[i][searchArr[j]].index[0]);
                        console.log(allTexts[i]);
                        var number = allTexts[i].numberFile;
                        console.log(number);
                        while (allFiles[number][index-1] && (!(allFiles[number][index].match(/[A-ZА-Я.;]/)))) {
                            index -= 1;
                        }
                        var textP = '';
                        var min = 0;
                        while (allFiles[number][index] && min < 300 && (!(allFiles[number][index].match(/[.;]/)) || (min < 50))) {
                            textP += allFiles[number][index];
                            index += 1;
                            min ++;
                        }
                        var newResultP = document.createElement('p');
                        newResultP.innerHTML = textP+'...';
                        result.appendChild(newResultP);
                        j = searchArr.length;
                    }
                }

            }
        }

        // console.log(allTexts);
        // console.log(searchArr);
        return false;
    });
})();