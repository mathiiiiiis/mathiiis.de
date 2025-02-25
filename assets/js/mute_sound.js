const muteToggle = document.querySelector('.mute-toggle');
const muteIcon = muteToggle.querySelector('i');

document.addEventListener('DOMContentLoaded', () => {
    const savedMute = localStorage.getItem('mute') === 'true';
    if (savedMute) {
        muteIcon.classList.remove('fa-volume-up');
        muteIcon.classList.add('fa-volume-mute');
        hoverSound.muted = true;
        clickSound.muted = true;
    }
});

let isMuted = hoverSound.muted || clickSound.muted;

muteToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    muteIcon.classList.toggle('fa-volume-up', !isMuted);
    muteIcon.classList.toggle('fa-volume-mute', isMuted);
    
    hoverSound.muted = isMuted;
    clickSound.muted = isMuted;

    localStorage.setItem('mute', isMuted);
});