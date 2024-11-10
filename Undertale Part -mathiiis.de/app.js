document.addEventListener('DOMContentLoaded', () => {
    const options = Array.from(document.querySelectorAll('.option'));
    const selectSound = document.getElementById('select-sound');
    const hoverSound = document.getElementById('hover-sound');
    const backgroundMusic = document.getElementById('background-music');
    const sadMusic = document.getElementById('sad-music');
    const happyMusic = document.getElementById('happy-music');
    const heartBreakSound = document.getElementById('heart-break');
    const sansTalkingSound = document.getElementById('sans-talking');
    const sadSmiley = document.getElementById('sad-smiley');
    const undertaleDog = document.getElementById('undertale-dog');
    const container = document.querySelector('.container');
    const glitchTextContainer = document.getElementById('glitch-text-container');
    const glitchText = document.getElementById('glitch-text');
    let selectedIndex = 0;
    let volumeInterval;

    function updateSelection() {
        options.forEach((option, index) => {
            option.classList.toggle('selected', index === selectedIndex);
            
            if (index === selectedIndex) {
                if (selectedIndex === 0) {
                    playSound(sadMusic);
                    happyMusic.pause();  
                } else {
                    playSound(happyMusic);
                    sadMusic.pause();  
                }
            }
        });
    }

    function playSound(sound) {
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(err => {
                console.error("Error playing sound:", err);
            });
        }
    }

    function increaseVolume(music, targetVolume) {
        if (volumeInterval) clearInterval(volumeInterval);
        volumeInterval = setInterval(() => {
            if (music.volume < targetVolume) {
                music.volume = Math.min(music.volume + 0.01, targetVolume);
            } else {
                clearInterval(volumeInterval);
            }
        }, 100);
    }

    function stopAllMusic() {
        [backgroundMusic, sadMusic, happyMusic].forEach(music => {
            if (music) {
                music.pause();
                music.currentTime = 0;
            }
        });
    }

    function showSadScreen() {
        playSound(sadMusic);
        container.style.transition = 'opacity 1s';
        container.style.opacity = '0';
        
        setTimeout(() => {
            sadSmiley.style.display = 'flex';
            sadSmiley.style.justifyContent = 'center';
            sadSmiley.style.alignItems = 'center';

            setTimeout(() => {
                container.style.opacity = '1';
                sadSmiley.style.display = 'none';
            }, 30000);
        }, 0);

        setTimeout(() => {
            document.body.style.transition = 'background-color 2s';
            document.body.style.backgroundColor = 'black';
            playSound(heartBreakSound);

            setTimeout(() => {
                window.close();
            }, 3000);
        }, 30000);
    }


    function animateFall() {
        playSound(happyMusic);
        undertaleDog.style.transition = 'transform 1.5s';
        undertaleDog.style.transform = 'translateY(550%)';
        setTimeout(() => {
            container.style.transition = 'transform 1.5s';
            container.style.transform = 'translateY(550%)';
            setTimeout(() => {
                container.style.transform = 'translateY(0)';
                undertaleDog.style.transform = 'translateY(0)';
                triggerGlitchEffect();
                setTimeout(() => {
                    window.location.href = '/undert/game/index.html';
                }, 3000);
            }, 1500); 
        }, 1500);
    }

    function triggerGlitchEffect() {
        container.classList.add('glitch');
        playSound(sansTalkingSound);
        glitchTextContainer.style.display = 'block';
        typeText("What, WHAT!! IS HAPPENING!");
    }

    function typeText(text) {
        let index = 0;
        glitchText.textContent = '';  

        function type() {
            if (index < text.length) {
                glitchText.textContent += text[index];
                index++;
                setTimeout(type, 50);
            } else {
                glitchText.classList.add('glitch'); 
            }
        }
        type();
    }

    function playBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.volume = 0.1;
            backgroundMusic.loop = true;
            backgroundMusic.play().catch(err => {
                console.error("Error playing background music:", err);
            });
        }
    }

    function fadeToBlackAndClose() {
        container.style.transition = 'background-color 2s';
        container.style.backgroundColor = 'black';
        playSound(heartBreakSound);
        setTimeout(() => {
            window.close();
        }, 5000); 
    }

    updateSelection();
    playBackgroundMusic();

 
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : options.length - 1;
        updateSelection();
        playSound(hoverSound);
    } else if (e.key === 'ArrowRight') {
        selectedIndex = (selectedIndex < options.length - 1) ? selectedIndex + 1 : 0;
        updateSelection();
        playSound(hoverSound);
    } else if (e.key === 'Enter') {
        stopAllMusic();
        playSound(selectSound);
        if (selectedIndex === 0) {
            increaseVolume(sadMusic, 1.0);
            showSadScreen();
            setTimeout(() => {
                fadeToBlackAndClose();
            }, 3000);
        } else {
            playSound(happyMusic);
            animateFall();
        }
    }
});

options.forEach((option, index) => {
    option.addEventListener('focus', () => {
        selectedIndex = index;
        updateSelection();
    });
    
    option.addEventListener('mouseover', () => {
        selectedIndex = index;
        updateSelection();
        playSound(hoverSound);
    });

    option.addEventListener('click', () => {
        playSound(selectSound);
        stopAllMusic();

        if (index === 0) {
            increaseVolume(sadMusic, 1.0);
            showSadScreen();
            setTimeout(() => {
                fadeToBlackAndClose();
            }, 3000);
        } else {
            playSound(happyMusic);
            animateFall();
        }
    });
});

options[0].focus();



document.addEventListener('DOMContentLoaded', () => {
    const muteButton = document.getElementById('mute-button');
    let isMuted = false;

    muteButton.addEventListener('click', () => {
        isMuted = !isMuted;
        muteButton.textContent = isMuted ? 'Unmute Sound' : 'Mute Sound';
        toggleMute();
    });

    function toggleMute() {
        const allSounds = [
            document.getElementById('select-sound'),
            document.getElementById('hover-sound'),
            document.getElementById('background-music'),
            document.getElementById('sad-music'),
            document.getElementById('happy-music'),
            document.getElementById('heart-break'),
            document.getElementById('sans-talking')
        ];
        allSounds.forEach(sound => {
            if (sound) sound.muted = isMuted;
        });
    }
})})
