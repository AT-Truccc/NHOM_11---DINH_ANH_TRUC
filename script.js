const paragraphs = Array.from(document.querySelectorAll('.paragraph'));
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const voicesSelect = document.getElementById('voices');
const rateInput = document.getElementById('rate');
const rateVal = document.getElementById('rateVal');

let currentIndex = 0;
let isPlaying = false;
let utterance = null;

function loadVoices() {
  voicesSelect.innerHTML = '';
  speechSynthesis.getVoices().forEach((v, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${v.name} — ${v.lang}` + (v.default ? ' (default)' : '');
    voicesSelect.appendChild(opt);
  });
}
speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

function highlight(index) {
  paragraphs.forEach((p, i) => p.classList.toggle('active', i === index));
  if (index >= 0 && paragraphs[index]) {
    paragraphs[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function speakParagraph(index) {
  if (!('speechSynthesis' in window)) {
    alert('Trình duyệt không hỗ trợ Web Speech API.');
    return;
  }
  speechSynthesis.cancel();
  const text = paragraphs[index]?.textContent.trim();
  if (!text) return;

  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  const selectedVoice = speechSynthesis.getVoices()[voicesSelect.value];
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.rate = parseFloat(rateInput.value);

  utterance.onend = () => {
    if (currentIndex < paragraphs.length - 1 && isPlaying) {
      currentIndex++;
      highlight(currentIndex);
      speakParagraph(currentIndex);
    } else {
      isPlaying = false;
      highlight(-1);
    }
  };
  utterance.onerror = () => { isPlaying = false; };

  highlight(index);
  speechSynthesis.speak(utterance);
  isPlaying = true;
}

// ==== Nút điều khiển ====
playBtn.addEventListener('click', () => {
  if (isPlaying) return;
  if (currentIndex >= paragraphs.length) currentIndex = 0;
  speakParagraph(currentIndex);
});
pauseBtn.addEventListener('click', () => {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
  } else if (speechSynthesis.paused) {
    speechSynthesis.resume();
  }
});
stopBtn.addEventListener('click', () => {
  speechSynthesis.cancel();
  isPlaying = false;
  highlight(-1);
});
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) currentIndex--;
  speechSynthesis.cancel();
  speakParagraph(currentIndex);
});
nextBtn.addEventListener('click', () => {
  if (currentIndex < paragraphs.length - 1) currentIndex++;
  speechSynthesis.cancel();
  speakParagraph(currentIndex);
});

paragraphs.forEach((p, i) => {
  p.addEventListener('click', () => {
    currentIndex = i;
    speechSynthesis.cancel();
    speakParagraph(i);
  });
});

rateInput.addEventListener('input', () => {
  rateVal.textContent = rateInput.value;
});
