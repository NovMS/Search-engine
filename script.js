function sortObj(a, b) {
    return b.tfIdf - a.tfIdf;
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

    while (text[i]) {
        while (i+1<=text.length && text[i].match(/[a-za-я0-9]/)) {
            word += text[i];
            i++;
        }
        if (word != '') {
            kol ++;
            if (word in wordList) {
                wordList[word].num += 1;
                wordList[word].index.push(i);
            }
            else {
                wordList[word] = {
                    num : 1,
                    index : [i]
                }
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

function snip(objText, searchArr) {

}

(function () {

    var searchForm = document.querySelector('.searchForm');
    var searchForm_text = document.querySelector('.searchForm_text');
    var result = document.querySelector('.result');

    searchForm.addEventListener('submit', function(evt){
        evt.preventDefault();

        var file1 = textInTheFile('file.txt');
        var objText1 = textToObject(file1);
        objText1.title = 'file1';

        var file2 = textInTheFile('file2.txt');
        var objText2 = textToObject(file2);
        objText2.title = 'file2';

        var file3 = textInTheFile('file3.txt');
        var objText3 = textToObject(file3);
        objText3.title = 'file3';

        var allFiles = [file1, file2, file3];
        var allTexts = [objText1, objText2, objText3];

        while( result.firstChild ){
            result.removeChild(result.firstChild);
        }

        var searchArr = searchToArr(searchForm_text.value)

        var kolTrueTexts = 0;
        for (var i = 0; i<allTexts.length; i++) {
            allTexts[i].tf = tf(allTexts[i],searchArr);
            if (allTexts[i].tf > 0) kolTrueTexts++;
        }

        if (kolTrueTexts > 0) {
            for (var i = 0; i < allTexts.length; i++) {
                allTexts[i].idf = (allTexts.length) / (kolTrueTexts);
                allTexts[i].tfIdf = (allTexts[i].tf) * (allTexts[i].idf);
            }
        }

        allTexts.sort(sortObj);

        for (var i = 0; i < allTexts.length; i++) {

            if (allTexts[i].tfIdf > 0) {
                var newResult = document.createElement('li');
                newResult.innerHTML = allTexts[i].title;
                result.appendChild(newResult);

                // for (var j = 0; j<searchArr.length; j++) {
                //     if (searchArr[j] in allTexts[j]) {
                //         var newResult = document.createElement('p');
                //
                //         var index = (allTexts[j].searchArr[j]).index[0];
                //         console.log(index);
                //         // var charInFile = index;
                //         // while (allFiles[i][index].match(/[A-ZА-Я]/)) {
                //         //
                //         // }
                //     }
                // }

            }
        }

        // console.log(allTexts);
        // console.log(searchArr);
        return false;
    });
})();