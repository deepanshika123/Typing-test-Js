const typingText= document.querySelector('.typing-text p');
const input= document.querySelector('.wrapper .input-field ');
const time= document.querySelector('.time span b');
const mistakes = document.querySelector('.mistake span')
const wpm = document.querySelector('.wpm span')
const cpm = document.querySelector('.cpm span')
const btn = document.querySelector('button');

let timer;
let maxTime= 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistake =0;
let isTyping = false;



async function loadParagraph() {
    try {
        const response = await fetch('https://baconipsum.com/api/?type=all-meat&sentences=2');
    
        const data = await response.json();

        const paragraph = data[0];
        typingText.innerHTML = '';
        for (const char of paragraph) {
            typingText.innerHTML += `<span>${char}</span>`;
        }

        typingText.querySelectorAll('span')[0].classList.add('active');
        document.addEventListener('keydown', () => input.focus());
        typingText.addEventListener("click", () => input.focus());

    } catch (error) {
        console.error("Error fetching paragraph:", error);
        typingText.innerHTML = `<p style="color: red;">Failed to load text. Try again.</p>`;
    }
}






function initTyping(){
    const char= typingText.querySelectorAll('span');
    const typedChar = input.value.charAt(charIndex);
    if(charIndex < char.length && timeLeft >0){

        if(!isTyping){
            timer = setInterval(initTime,1000);
            isTyping=true;
        }

        if(char[charIndex].innerText === typedChar){
            char[charIndex].classList.add('correct');
            console.log("correct");
        }
        else{
            mistake++ ;
            char[charIndex].classList.add('incorrect');
            console.log("incorrect");
        }

        charIndex++;
        if (charIndex < char.length) {
            char[charIndex].classList.add('active');
        }

        // char[charIndex].classList.add('active');

        mistakes.innerText = mistake;
        cpm.innerText = charIndex- mistake;
    }
    else{
clearInterval(timer);
input.value='';
    }
}

function initTime(){
    if(timeLeft>0){
        timeLeft--;
        time.innerText=timeLeft;
        let wpmVal = Math.round(((charIndex - mistake) / 5) / ((maxTime - timeLeft) / 60));
        wpm.innerText = wpmVal > 0 ? wpmVal : 0;
    }
    else{
        clearInterval(timer);
    }
}

function reset(){
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    time.innerText= timeLeft;
    input.value='';
    charIndex = 0;
    mistake =0;
    isTyping = false;
    wpm.innerText=0;
    cpm.innerText=0;
    mistakes.innerText=0;

    typingText.querySelectorAll('span').forEach(span => {
        span.classList.remove('correct', 'incorrect', 'active');
    });
}


input.addEventListener("input",initTyping);
btn.addEventListener("click",reset);
loadParagraph();