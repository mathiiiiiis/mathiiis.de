document.querySelector('.donate-btn').addEventListener('mouseenter', () => {
    hoverSound.currentTime = 0;
    hoverSound.play();
});

const hoverSound = document.getElementById('hoverSound');
const clickSound = document.getElementById('clickSound');

document.querySelectorAll('.project-card, button, nav a').forEach(element => {
    element.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.play();
    });
    
    element.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
});

const updateDiscordProfile = async () => {
    try {
        const DISCORD_USER_ID = '1263479329824702539';
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);

        if (!response.ok) throw new Error('Failed to fetch Discord profile');
        
        const { data } = await response.json();
        const profileImg = document.getElementById('discordProfile');

        const avatarHash = data.discord_user.avatar || 'default';
        profileImg.src = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${avatarHash}.png?size=512`;

    } catch (error) {
        console.error('Failed to fetch Discord profile:', error);
    }
};

document.addEventListener("DOMContentLoaded", updateDiscordProfile);

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href') || '#about';
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

document.querySelectorAll('.contact-card, .social-link').forEach(element => {
    element.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.play();
    });

    element.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
});

const scrollToTopBtn = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});