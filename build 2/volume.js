let initialized = false;
let audioContext, source, gainNode, equalizerNodes;

function initAudioContext(video) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaElementSource(video);
    gainNode = audioContext.createGain();
    equalizerNodes = createEqualizerNodes();
    initialized = true;

    chainAudioNodes();
    video.onplay = () => {
        if (audioContext.state === 'suspended') audioContext.resume();
    };
}

function createEqualizerNodes() {
    const frequencyBands = [
        { freq: 60, label: "Sub Bass" },
        { freq: 170, label: "Bass" },
        { freq: 350, label: "Low Mid" },
        { freq: 1000, label: "Mid" },
        { freq: 3500, label: "Upper Mid" },
        { freq: 10000, label: "Treble" }
    ];

    return frequencyBands.map(band => {
        const filter = audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = band.freq;
        filter.Q.value = 1;
        filter.gain.value = 0;
        return filter;
    });
}

function chainAudioNodes() {
    source.connect(equalizerNodes[0]);
    equalizerNodes.reduce((prev, curr) => (prev.connect(curr), curr));
    equalizerNodes[equalizerNodes.length - 1].connect(gainNode);
    gainNode.connect(audioContext.destination);
}

function createSlider(min, max, step, onInput) {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.oninput = onInput;
    return slider;
}

function createEqualizerControlPanel(controlPanel) {
    equalizerNodes.forEach((node, index) => {
        const slider = createSlider(-12, 12, 1, (e) => node.gain.value = e.target.value);
        controlPanel.appendChild(slider);
    });
}

function createVolumeControlPanel(controlPanel) {
    const volumeSlider = createSlider(1, 3, 0.1, (e) => gainNode.gain.value = e.target.value);
    controlPanel.appendChild(volumeSlider);
}

export function VOLUME_EQUALIZER_AND_BOOSTER(isVolume, isEqualizer) {
    const video = document.querySelector('video');
    if (!video || initialized) return;

    initAudioContext(video);
    const controlPanel = document.createElement('div');

    if (isVolume) createVolumeControlPanel(controlPanel);
    if (isEqualizer) createEqualizerControlPanel(controlPanel);

    const controls = document.querySelector('#above-the-fold') || document.querySelectorAll('.sp-content')[0];
    if (controls) controls.prepend(controlPanel);
}
