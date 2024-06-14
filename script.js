function searchQuery() {
    var query = document.getElementById('userQuery').value.toLowerCase();
    var file = document.getElementById('documentUpload').files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var content = event.target.result;
            var answer = searchInDocument(content, query);
            if (answer !== "No matching answer found.") {
                document.getElementById('answer').value = answer;
            } else {
                // Display "No matching answer found"
                document.getElementById('answer').value = answer;
                // Construct Google search link
                var googleSearchLink = "https://www.google.com/search?q=" + encodeURIComponent(query);
                // Open Google search link in a new tab
                window.open(googleSearchLink, '_blank');
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a text document first.');
    }
}



function searchInDocument(content, query) {
    var lines = content.split('\n');
    var answer = "No matching answer found.";
    var nonKeywords = ['what', 'when', 'where', 'who', 'whom', 'how', 'which', 'is', 'are', 'the', 'of', 'in', 'on', 'for', 'to', 'from', 'with', 'at', '?', 'you', 'work', 'do', 'purpose'];
    var importantQueryWords = query.split(' ').filter(word => !nonKeywords.includes(word));
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].toLowerCase();
        if (line.startsWith("question:")) {
            var question = line.substring(line.indexOf(":") + 1).trim();
            var questionWords = question.split(' ');
            var matchedWords = [];
            for (var j = 0; j < importantQueryWords.length; j++) {
                var wordIndex = questionWords.indexOf(importantQueryWords[j]);
                if (wordIndex !== -1) {
                    matchedWords.push(questionWords[wordIndex]);
                }
            }
            if (matchedWords.length === importantQueryWords.length) {
                answer = getAnswer(lines, i);
                break;
            }
        }
    }
    return answer;
}

function getAnswer(lines, index) {
    var startIndex = index;
    var endIndex = lines.length;
    for (var j = index + 1; j < lines.length; j++) {
        if (lines[j].startsWith("Question:")) {
            endIndex = j;
            break;
        }
    }
    var answerLines = lines.slice(startIndex + 1, endIndex);
    return answerLines.join('\n').trim();
}
