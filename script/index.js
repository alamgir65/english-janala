const loadLevels = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => showLevels(json.data))
};

loadLevels();

const showLevels = (levels) => {
    const levelContainer = document.getElementById('level-container');
    for(const level of levels){
        // console.log(level.lessonName);

        const button = document.createElement('button');
        button.classList.add('btn', 'btn-outline', 'btn-primary');

        button.onclick = () => {
            // const wordContainer = document.getElementById('word-container');
            // wordContainer.innerHTML = '';

            fetch(`https://openapi.programming-hero.com/api/level/${level.level_no}`)
                .then(res => res.json())
                .then(json => showWords(json));

            // alert(`You clicked on ${level.lessonName}`);
        };

        button.innerText = level.lessonName;
        levelContainer.appendChild(button);
    }
}



const showWords = (json) => {
    // console.log(json.data);

    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';


    for(const word of json.data){
        console.log(word)

        const div = document.createElement('div');
        div.classList.add('bg-white', 'px-5', 'py-7', 'rounded-lg');

        div.innerHTML = `
                <div class="text-center space-y-3 mb-5">
                    <h2 class="text-xl font-semibold">${word.word}</h2>
                    <p class="text-lg ">Meaning/Pronounciation</p>
                    <h5 class="font-bangla text-xl font-semibold opacity-80">"${word.meaning} / ${word.pronunciation}"</h5>
                </div>

                <div class="flex justify-between ">
                    <div class="bg-sky-100 p-1 rounded-sm"><i class="fa-solid fa-circle-info"></i></div>
                    <div class="bg-sky-100 p-1 rounded-sm"><i class="fa-solid fa-volume-high"></i></div>
                </div>
        `;

        wordContainer.appendChild(div);
    }
};