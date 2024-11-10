document.addEventListener('DOMContentLoaded', () => {
  const options = Array.from(document.querySelectorAll('.option'));
  const selectSound = document.getElementById('select-sound');
  const hoverSound = document.getElementById('hover-sound');
  const menuMusic = document.getElementById('menu-music');
  const backgroundMusic = document.getElementById('background-music');
  const settingsMusic = document.getElementById('settings-music');
  const footstepSound = document.getElementById('footstep-sound');
  const textBoxSound = document.getElementById('text-box-sound');
  const textSpeakSound = document.getElementById('text-speak-sound');
  const gameArea = document.getElementById('game-area');
  const player = document.getElementById('player');
  const settingsMenu = document.getElementById('settings-menu');
  const dialogBox = document.getElementById('dialog-box');
  const dialogText = document.getElementById('dialog-text');
  const container = document.querySelector('.container');

  let controls = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight'
  };
  let selectedIndex = 0;
  let sfxVolume = 0.5;
  let musicVolume = 0.5;
  let currentMusic = null;
  let isGameStarted = false;
  let movementDelay = 50; // Adjust movement speed to feel smooth.

  function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('gameSettings'));
    if (savedSettings) {
      sfxVolume = savedSettings.sfxVolume;
      musicVolume = savedSettings.musicVolume;
      controls = savedSettings.controls;
      updateSettingsDisplay();
    }
  }

  function saveSettings() {
    const settings = {
      sfxVolume,
      musicVolume,
      controls
    };
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }

  function updateSettingsDisplay() {
    document.getElementById('music-volume').value = musicVolume;
    document.getElementById('sfx-volume').value = sfxVolume;
    document.getElementById('control-up').value = controls.up;
    document.getElementById('control-down').value = controls.down;
    document.getElementById('control-left').value = controls.left;
    document.getElementById('control-right').value = controls.right;
  }

  function updateSelection() {
    options.forEach((option, index) => {
      option.classList.toggle('selected', index === selectedIndex);
    });
  }

  function playSound(sound) {
    if (sound) {
      sound.volume = sfxVolume;
      sound.currentTime = 0;
      sound.play().catch(err => {
        console.error("Error playing sound:", err);
      });
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
      music.play().catch(err => {
        console.error("Error playing music:", err);
      });
      currentMusic = music;
    }
  }

  function startGame() {
    isGameStarted = true;
    gameArea.classList.remove('hidden');
    container.classList.add('hidden');
    settingsMenu.classList.add('hidden');
    playMusic(backgroundMusic);
    generateWorld();
    showDialog("Welcome to Undert!\nLet's start your journey...");
  }

  function openSettings() {
    settingsMenu.classList.remove('hidden');
    container.classList.add('hidden');
    playMusic(settingsMusic);
  }

  function closeSettings() {
    settingsMenu.classList.add('hidden');
    container.classList.remove('hidden');
    playMusic(menuMusic);
    saveSettings();
  }

  function quitGame() {
    window.close();
  }

  function showDialog(text) {
    dialogBox.classList.remove('hidden');
    dialogText.textContent = '';
    playSound(textBoxSound);

    let charIndex = 0;
    textSpeakSound.loop = true; 

    function typeWriter() {
      if (charIndex === 0) {
        textSpeakSound.play();
      }

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

  function generateWorld() {
    const worldSize = 20;
    const tileSize = 40;
    const world = document.createElement('div');
    world.id = 'world';
    world.style.width = `${worldSize * tileSize}px`;
    world.style.height = `${worldSize * tileSize}px`;
    world.style.position = 'relative';

    for (let y = 0; y < worldSize; y++) {
      for (let x = 0; x < worldSize; x++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        tile.style.left = `${x * tileSize}px`;
        tile.style.top = `${y * tileSize}px`;
        tile.style.backgroundColor = Math.random() > 0.8 ? '#666' : '#444';
        world.appendChild(tile);
      }
    }

    gameArea.innerHTML = '';
    gameArea.appendChild(world);

    const middleX = Math.floor(worldSize / 2) * tileSize;
    const middleY = Math.floor(worldSize / 2) * tileSize;
    player.style.left = `${middleX}px`;
    player.style.top = `${middleY}px`;
    world.appendChild(player);
  }

  // Updated Player Movement with smooth feel
  let lastMoveTime = 0;
  function handlePlayerMovement(e) {
    const now = Date.now();
    if (now - lastMoveTime < movementDelay || !isGameStarted) return;

    const key = e.key;
    const moveDistance = 5;
    const world = document.getElementById('world');
    const worldRect = world.getBoundingClientRect();
    let playerRect = player.getBoundingClientRect();
    let newLeft = parseInt(player.style.left) || 0;
    let newTop = parseInt(player.style.top) || 0;

    if (key === controls.up) newTop -= moveDistance;
    else if (key === controls.down) newTop += moveDistance;
    else if (key === controls.left) newLeft -= moveDistance;
    else if (key === controls.right) newLeft += moveDistance;
    else return;

    newLeft = Math.max(0, Math.min(worldRect.width - playerRect.width, newLeft));
    newTop = Math.max(0, Math.min(worldRect.height - playerRect.height, newTop));

    player.style.left = `${newLeft}px`;
    player.style.top = `${newTop}px`;
    playSound(footstepSound);

    lastMoveTime = now;
    e.preventDefault();
  }

  document.addEventListener('keydown', (e) => {
    if (isGameStarted) {
      handlePlayerMovement(e);
    } else {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        selectedIndex = (e.key === 'ArrowUp')
          ? (selectedIndex > 0 ? selectedIndex - 1 : options.length - 1)
          : (selectedIndex < options.length - 1 ? selectedIndex + 1 : 0);
        updateSelection();
        playSound(hoverSound);
      } else if (e.key === 'Enter') {
        playSound(selectSound);
        if (selectedIndex === 0) {
          startGame();
        } else if (selectedIndex === 1) {
          openSettings();
        } else if (selectedIndex === 2) {
          quitGame();
        }
      }
    }
  });

  options.forEach((option, index) => {
    option.addEventListener('mouseover', () => {
      selectedIndex = index;
      updateSelection();
      playSound(hoverSound);
    });

    option.addEventListener('click', () => {
      playSound(selectSound);
      if (index === 0) {
        startGame();
      } else if (index === 1) {
        openSettings();
      } else if (index === 2) {
        quitGame();
      }
    });
  });

  document.getElementById('back-button').addEventListener('click', closeSettings);

  document.getElementById('music-volume').addEventListener('input', (e) => {
    musicVolume = parseFloat(e.target.value);
    if (currentMusic) currentMusic.volume = musicVolume;
  });

  document.getElementById('sfx-volume').addEventListener('input', (e) => {
    sfxVolume = parseFloat(e.target.value);
  });

  ['up', 'down', 'left', 'right'].forEach(direction => {
    const input = document.getElementById(`control-${direction}`);
    input.value = controls[direction]; 

    input.addEventListener('keydown', (e) => {
      e.preventDefault();
      controls[direction] = e.key;
      input.value = e.key;
    });
  });

  loadSettings();
  updateSelection();
  playMusic(menuMusic);
});