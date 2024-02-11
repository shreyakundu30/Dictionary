const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");

// Function to convert text to speech
function textToSpeech(text) {
    // Using built-in Web Speech API for text-to-speech
    const utterance = new SpeechSynthesisUtterance(text);
    // Speak the text
    window.speechSynthesis.speak(utterance);
}

btn.addEventListener("click", () => {
    let inpWord = document.getElementById("inp-word").value;
    fetch(`${url}${inpWord}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            let audioUrl = data[0].phonetics[0].audio;
            // Call textToSpeech function to speak the word
            textToSpeech(data[0].word);
            displayResults(data, audioUrl);
        })
        .catch(() => {
            displayError();
        });
});

function displayResults(data, audioUrl) {
    let meaningsHTML = data[0].meanings.map(meaning => {
        let exampleHTML = meaning.definitions.map(definition => {
            return `<p class="word-example">${definition.example || ""}</p>`;
        }).join('');
        return `
            <div class="word">
                <h3>${data[0].word}</h3>
                <button onclick="playSound('${audioUrl}', '${data[0].word}')">
                    <i class="fa-solid fa-volume-high"></i>
                </button>
            </div>
            <div class="details">
                <p>${meaning.partOfSpeech}</p>
                <p>${data[0].phonetic}</p>
            </div>
            <p class="word-meaning">
                ${meaning.definitions[0].definition}
            </p>
            ${exampleHTML}
        `;
    }).join('');

    result.innerHTML = meaningsHTML;
}

function displayError() {
    result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
}

function playSound(audioUrl, word) {
    // Speak the word using text-to-speech
    textToSpeech(word);
    
    // Play the audio
    let audio = new Audio(`https:${audioUrl}`);
    audio.play();
}

