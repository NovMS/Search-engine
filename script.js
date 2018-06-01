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

    while (text[i]) {
        while (i+1<=text.length && text[i].match(/[a-za-я0-9]/)) {
            word += text[i];
            i++;
        }
        if (word != '') {
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
    return wordList;
}

(function () {

    var kolFile = 2;

    var file1 = textInTheFile('file.txt');
    var objText1 = textToObject(file1);
    objText1.title = 'file1';

    var file2 = textInTheFile('file2.txt');
    var objText2 = textToObject(file2);
    objText2.title = 'file2';

    var allTexts = [objText1, objText2];

    var searchForm = document.querySelector('.searchForm');
    var searchForm_text = document.querySelector('.searchForm_text');
    var result = document.querySelector('.result');

    searchForm.addEventListener('submit', function(evt){
        evt.preventDefault();

        while( result.firstChild ){
            result.removeChild(result.firstChild);
        }

        for (var i = 0; i<kolFile; i++) {
            if (searchForm_text.value in allTexts[i]) {
                var newResult = document.createElement('li');
                newResult.innerHTML = allTexts[i].title;
                result.appendChild(newResult);


            }
        }

        return false;
    });
})();