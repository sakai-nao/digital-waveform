const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('frequencySlider');
const freqDisplay = document.getElementById('freqValue');
const playButton = document.getElementById('playButton');

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = 300;
    drawWaveform(slider.value);
}

function drawWaveform(frequency) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let amplitude = 50;
    let sampleRate = 100;
    let offsetAnalog = 100;
    let offsetDigital = 220;
    ctx.beginPath();
    ctx.strokeStyle = '#007BFF';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x++) {
        let angle = (x / sampleRate) * frequency * 2 * Math.PI / 100;
        let y = Math.sin(angle) * amplitude + offsetAnalog;
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = '#FF5733';
    let prevX = 0;
    let prevY = Math.sin(0) < 0 ? offsetDigital - amplitude : offsetDigital + amplitude;
    for (let x = 0; x < canvas.width; x += sampleRate / frequency / 2) {
        let angle = (x / sampleRate) * frequency * 2 * Math.PI / 100;
        let isHigh = Math.sin(angle) < 0;
        let y = isHigh ? offsetDigital - amplitude : offsetDigital + amplitude;
        ctx.lineTo(prevX, prevY);
        ctx.lineTo(prevX, y);
        ctx.lineTo(x, y);
        prevX = x;
        prevY = y;
    }
    ctx.stroke();
}

slider.addEventListener('input', () => {
    const freq = slider.value;
    freqDisplay.textContent = freq;
    drawWaveform(freq);
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function playSound(frequency) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => oscillator.stop(), 2000);
}

playButton.addEventListener('click', () => {
    playSound(slider.value);
});
