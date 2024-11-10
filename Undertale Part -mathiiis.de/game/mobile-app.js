document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const changelogBtn = document.getElementById('changelog-btn');
    const backBtn = document.getElementById('back-btn');
    const changelogBackBtn = document.getElementById('changelog-back-btn');
    const mainMenu = document.getElementById('main-menu');
    const settingsMenu = document.getElementById('settings-menu');
    const changelog = document.getElementById('changelog');
    const gameArea = document.getElementById('game-area');
    const player = document.getElementById('player');
    const dialogBox = document.getElementById('dialog-box');
    const dialogText = document.getElementById('dialog-text');
    const controlBtns = document.querySelectorAll('.control-btn');

    const selectSound = document.getElementById('select-sound');
    const menuMusic = document.getElementById('menu-music');
    const backgroundMusic = document.getElementById('background-music');
    const settingsMusic = document.getElementById('settings-music');
    const footstepSound = document.getElementById('footstep-sound');
    const textBoxSound = document.getElementById('text-box-sound');
    const textSpeakSound = document.getElementById('text-speak-sound');

    let sfxVolume = 0.5;
    let musicVolume = 0.5;
    let currentMusic = null;
    let isGameStarted = false;

    function playSound(sound) {
        if (sound) {
            sound.volume = sfxVolume;
            sound.currentTime = 0;
            sound.play().catch(err => console.error("Error playing sound:", err));
        }
    }

    function playMusic(music) {
        if (currentMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        }
        if (music) {
            music.volume = musicVolume;
            music.loop = true;
            music.play().catch(err => console.error("Error playing music:", err));
            currentMusic = music;
        }
    }

    function showScreen(screen) {
        [mainMenu, settingsMenu, changelog, gameArea].forEach(s => s.classList.add('hidden'));
        screen.classList.remove('hidden');
    }

    function startGame() {
        isGameStarted = true;
        showScreen(gameArea);
        playMusic(backgroundMusic);
        player.style.left = '50%';
        player.style.top = '50%';
        showDialog("Welcome to Undert!\nLet's start your journey...");
    }

    function showDialog(text) {
        dialogBox.classList.remove('hidden');
        dialogText.textContent = '';
        playSound(textBoxSound);
        
        let charIndex = 0;
        textSpeakSound.loop = true;
        textSpeakSound.play();
        
        function typeWriter() {
            if (charIndex < text.length) {
                dialogText.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            } else {
                setTimeout(() => {
                    textSpeakSound.pause();
                    textSpeakSound.currentTime = 0;
                    dialogBox.classList.add('hidden');
                }, 2000);
            }
        }
        
        typeWriter();
    }

    startBtn.addEventListener('click', startGame);
    settingsBtn.addEventListener('click', () => showScreen(settingsMenu));
    changelogBtn.addEventListener('click', () => showScreen(changelog));
    backBtn.addEventListener('click', () => showScreen(mainMenu));
    changelogBackBtn.addEventListener('click', () => showScreen(mainMenu));

    controlBtns.forEach(btn => {
        ['touchstart', 'touchend'].forEach(eventType => {
            btn.addEventListener(eventType, (e) => {
                e.preventDefault();
                if (eventType === 'touchstart') {
                    movePlayer(btn.id.replace('-btn', ''));
                } else {
                    stopPlayer();
                }
            });
        });
    });

    function movePlayer(direction) {
        const speed = 5;
        const interval = setInterval(() => {
            const rect = player.getBoundingClientRect();
            const gameRect = gameArea.getBoundingClientRect();
            
            switch(direction) {
                case 'up':
                    if (rect.top > gameRect.top) player.style.top = `${rect.top - speed}px`;
                    break;
                case 'down':
                    if (rect.bottom < gameRect.bottom) player.style.top = `${rect.top + speed}px`;
                    break;
                case 'left':
                    if (rect.left > gameRect.left) player.style.left = `${rect.left - speed}px`;
                    break;
                case 'right':
                    if (rect.right < gameRect.right) player.style.left = `${rect.left + speed}px`;
                    break;
            }
            playSound(footstepSound);
        }, 50);
        player.dataset.moveInterval = interval;
    }

    function stopPlayer() {
        clearInterval(player.dataset.moveInterval);
    }

    document.getElementById('music-volume').addEventListener('input', (e) => {
        musicVolume = parseFloat(e.target.value);
        if (currentMusic) currentMusic.volume = musicVolume;
    });

    document.getElementById('sfx-volume').addEventListener('input', (e) => {
        sfxVolume = parseFloat(e.target.value);
    });

    playMusic(menuMusic);
});