const ctx = new AudioContext();

const player = document.getElementById("player");
const fileInput = document.getElementById("audioFile");

let source;

const gainNode = ctx.createGain();

const bass = ctx.createBiquadFilter();
bass.type = "lowshelf";
bass.frequency.value = 200;

const mid = ctx.createBiquadFilter();
mid.type = "peaking";
mid.frequency.value = 1000;

const treble = ctx.createBiquadFilter();
treble.type = "highshelf";
treble.frequency.value = 3000;

const subbass = ctx.createBiquadFilter();
subbass.type = "lowshelf";
subbass.frequency.value = 60;

const panner = ctx.createStereoPanner();

const delay = ctx.createDelay();
delay.delayTime.value = 0;

const feedback = ctx.createGain();
feedback.gain.value = 0;

delay.connect(feedback);
feedback.connect(delay);

fileInput.addEventListener("change", e => {

    const file = e.target.files[0];

    if(!file) return;

    const url = URL.createObjectURL(file);

    player.src = url;

    if(source){
        source.disconnect();
    }

    source = ctx.createMediaElementSource(player);

    source.connect(subbass);
    subbass.connect(bass);
    bass.connect(mid);
    mid.connect(treble);
    treble.connect(delay);
    delay.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(ctx.destination);
});

document.getElementById("volume").oninput = e => {
    gainNode.gain.value = Number(e.target.value);
};

document.getElementById("pitch").oninput = e => {
    player.playbackRate = Number(e.target.value);
};

document.getElementById("speed").oninput = e => {
    player.playbackRate = Number(e.target.value);
};

document.getElementById("bass").oninput = e => {
    bass.gain.value = Number(e.target.value);
};

document.getElementById("mid").oninput = e => {
    mid.gain.value = Number(e.target.value);
};

document.getElementById("treble").oninput = e => {
    treble.gain.value = Number(e.target.value);
};

document.getElementById("subbass").oninput = e => {
    subbass.gain.value = Number(e.target.value);
};

document.getElementById("pan").oninput = e => {
    panner.pan.value = Number(e.target.value);
};

document.getElementById("echo").oninput = e => {

    delay.delayTime.value =
        Number(e.target.value) * 0.8;

    feedback.gain.value =
        Number(e.target.value);
};

document.getElementById("play").onclick = async () => {
    await ctx.resume();
    player.play();
};

document.getElementById("pause").onclick = () => {
    player.pause();
};

document.getElementById("nuclear").onclick = () => {

    gainNode.gain.value = 1000;

    bass.gain.value = 100;
    mid.gain.value = 100;
    treble.gain.value = 100;
    subbass.gain.value = 100;

    delay.delayTime.value = 0.8;
    feedback.gain.value = 1;

    panner.pan.value = 0;

    player.playbackRate = 3;
};
