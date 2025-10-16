onload = () =>{
    document.body.classList.remove("container");
};

// 🌠 Multi-layered, realistic fireworks
function createFirework() {
  const container = document.querySelector('.fireworks');
  const firework = document.createElement('div');
  firework.classList.add('firework');

  // Random position & layer
  const depth = Math.random();
  firework.style.left = Math.random() * 100 + 'vw';
  firework.style.top = Math.random() * 60 + 'vh';
  firework.style.background = `radial-gradient(circle, ${randomColor()}, transparent)`;

  // Layer scaling (closer = bigger & slower)
  const scale = 0.6 + depth * 1.2;
  firework.style.transform = `scale(${scale})`;
  firework.dataset.depth = depth;

  container.appendChild(firework);

  // Create multi-burst based on layer depth
  setTimeout(() => {
    for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
      createBurst(firework.offsetLeft, firework.offsetTop, scale);
    }
    firework.remove();
  }, 800);
}

// 🎇 Create explosion with variable size & glow
function createBurst(x, y, scale = 1) {
  const container = document.querySelector('.fireworks');
  const numSparks = 20 + Math.floor(Math.random() * 20);

  for (let i = 0; i < numSparks; i++) {
    const spark = document.createElement('div');
    spark.classList.add('spark');

    const angle = Math.random() * 2 * Math.PI;
    const radius = (100 + Math.random() * 150) * scale; // scaled distance
    const dx = Math.cos(angle) * radius + 'px';
    const dy = Math.sin(angle) * radius + 'px';

    spark.style.setProperty('--x', dx);
    spark.style.setProperty('--y', dy);
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    spark.style.background = `radial-gradient(circle, ${randomColor()}, transparent)`;
    spark.style.opacity = scale > 1 ? 0.9 : 0.6; // closer = brighter

    container.appendChild(spark);
    setTimeout(() => spark.remove(), 2000);
  }
}

// 🎨 Random color
function randomColor() {
  const colors = ['#ff66b2', '#ffd700', '#66ffff', '#ff3399', '#99ff66', '#ff9966', '#aaffff', '#ff99cc'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 🚀 Continuous fireworks, various intervals
setInterval(createFirework, 600 + Math.random() * 800);


// 🎵 Music control
function toggleMusic() {
  const music = document.getElementById('birthdayMusic');
  const btn = document.querySelector('.music-btn');

  if (music.paused) {
    music.play();
    btn.textContent = '⏸️ Pause Music';
  } else {
    music.pause();
    btn.textContent = '🎵 Play Music';
  }
}

// Auto-play after short delay (browsers require user interaction)
window.addEventListener('click', () => {
  const music = document.getElementById('birthdayMusic');
  if (music.paused) music.play();
}, { once: true });


// 🎶 Beat-synced fireworks using Web Audio API
let audioCtx, analyser, dataArray, sourceNode, music;

function setupAudioAnalyser() {
  music = document.getElementById("birthdayMusic");
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  sourceNode = audioCtx.createMediaElementSource(music);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  sourceNode.connect(analyser);
  analyser.connect(audioCtx.destination);

  animateFireworksBeat();
}

function animateFireworksBeat() {
  requestAnimationFrame(animateFireworksBeat);
  analyser.getByteFrequencyData(dataArray);
  const avg =
    dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

  // When the beat energy spikes, trigger extra fireworks
  if (avg > 180 && Math.random() > 0.7) {
    createFirework();
  }
}

// 🎵 Button toggle + audio context resume
function toggleMusic() {
  const btn = document.querySelector(".music-btn");
  music = document.getElementById("birthdayMusic");

  if (music.paused) {
    music.play();
    if (!audioCtx) setupAudioAnalyser();
    else audioCtx.resume();
    btn.textContent = "⏸️ Pause Music";
    console.log("Music Playing...");
  } else {
    music.pause();
    audioCtx.suspend();
    btn.textContent = "🎵 Play Music";
    console.log("Music paused.");
  }
}

window.addEventListener('click', () => {
  const music = document.getElementById('birthdayMusic');
  if (music.paused) {
    music.volume = 0;
    music.play();
    let fade = setInterval(() => {
      if (music.volume < 0.3) music.volume += 0.02; // fade to 30% max
      else clearInterval(fade);
    }, 200);
  }
}, { once: true });


