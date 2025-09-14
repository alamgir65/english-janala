const loadLevels = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => showLevels(json.data))
};

loadLevels();

const showLevels = (levels) => {
    const levelContainer = document.getElementById('level-container');
    for (const level of levels) {
        // console.log(level.lessonName);

        const button = document.createElement('button');
        button.classList.add('btn', 'btn-outline', 'btn-primary');
        button.id = `level-btn-${level.level_no}`;

        button.onclick = () => {
            // const wordContainer = document.getElementById('word-container');
            // wordContainer.innerHTML = '';

            manageSpinner(true);

            fetch(`https://openapi.programming-hero.com/api/level/${level.level_no}`)
                .then(res => res.json())
                .then(json => showWords(json.data));


            // Active level button 
            const thisButton = document.getElementById(`level-btn-${level.level_no}`);

            const allButtons = document.querySelectorAll('#level-container button');
            for (const btn of allButtons) {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline');
            }

            thisButton.classList.add('btn-primary');
            thisButton.classList.remove('btn-outline');

            // alert(`You clicked on ${level.lessonName}`);
        };

        button.innerText = level.lessonName;
        levelContainer.appendChild(button);
    }
}



const showWords = (words) => {
    // console.log(json.data);
    // manageSpinner(true);


    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';

    if (words.length === 0) {
        wordContainer.classList.remove('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-5');

        wordContainer.innerHTML = `
            <div class="text-center space-y-4">
                <div>
                    <img src="./assets/alert-error.png" alt="" class="mx-auto">
                </div>
                <p class="text-[8px]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h5 class="text-2xl">নেক্সট Lesson এ যান</h5>
            </div>
        `;
        manageSpinner(false);
        return;
    }

    wordContainer.classList.add('grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-5');


    for (const word of words) {
        // console.log(word)

        const div = document.createElement('div');
        div.classList.add('bg-white', 'px-5', 'py-7', 'rounded-lg');

        div.innerHTML = `
                <div class="text-center space-y-3 mb-5">
                    <h2 class="text-xl font-semibold">${word.word ? word.word : "Word not found!"}</h2>
                    <p class="text-lg ">Meaning/Pronounciation</p>
                    <h5 class="font-bangla text-xl font-semibold opacity-80">"${word.meaning ? word.meaning : "Meaning not found!"} / ${word.pronunciation ? word.pronunciation : "Pronunciation not found!"}"</h5>
                </div>

                <div class="flex justify-between ">
                    <button onclick="loadWordDetails(${word.id})" class="btn bg-sky-100 p-2 hover:bg-gray-500 rounded-sm"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn bg-sky-100 p-2 hover:bg-gray-500 rounded-sm"><i class="fa-solid fa-volume-high"></i></button>
                </div>
        `;

        wordContainer.appendChild(div);
    }
    manageSpinner(false);
};

const loadWordDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    showModal(details.data);
}


const manageSpinner = (isLoading) => {
    const spinner = document.getElementById('sppiner');

    if(isLoading){
        spinner.classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    }else{
        spinner.classList.add('hidden');
        document.getElementById('word-container').classList.remove('hidden');
    }
}

const showModal = (word) => {
    // console.log(word);

    const modalBox = document.getElementById('modal-box');
    modalBox.innerHTML = `
        <h1 class="text-2xl font-bold mb-5">${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation})</h1>
                <div>
                    <h3 class="text-xl font-semibold mb-2">Meaning:</h3>
                    <p class="font-bangla text-lg opacity-80">${word.meaning}</p>
                </div>
                <div class="my-4">
                    <h3 class="text-xl font-semibold mb-3">Example</h3>
                    <p class="font-bangla text-lg opacity-80">${word.sentence}</p>
                </div>
                <div>
                    <h3 class="text-xl font-bangla mb-2 font-semibold">সমার্থক শব্দ গুলো</h3>
                    <div>
                        ${word.synonyms.map(syn => `<button class="btn bg-sky-100 mr-2 mb-2">${syn}</button>`).join('')}
                    </div>
                </div>
    `;

    document.getElementById('detail_modal').showModal();
}



// Search Functionality

document.getElementById('search-btn').addEventListener('click', () => {
    const searchInput = document.getElementById('search-input');
    const searchText = searchInput.value.trim().toLowerCase();

    fetch('https://openapi.programming-hero.com/api/words/all')
        .then(res => res.json())
        .then(json => {
            const allWords = json.data;
            const matchedWords = allWords.filter(word => word.word && word.word.toLowerCase().includes(searchText));
            // console.log(matchedWords);
            showWords(matchedWords);
        })
})



// FOr listen 
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}