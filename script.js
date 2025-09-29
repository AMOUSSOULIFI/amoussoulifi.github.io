// Configuration de l'authentification
const AUTH_CONFIG = {
    username: 'enock',
    password: 'enock2000*'
};

// Système de login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Vérification des identifiants
    if(username === AUTH_CONFIG.username && password === AUTH_CONFIG.password) {
        // Cache le login, montre le portfolio
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('portfolio-content').classList.remove('hidden');
        
        // Sauvegarde la session
        const sessionData = {
            loginTime: new Date().getTime(),
            isLoggedIn: true
        };
        localStorage.setItem('sessionData', JSON.stringify(sessionData));
        
    } else {
        alert('Login ou mot de passe incorrect');
    }
});

// Vérifier si déjà connecté au chargement
window.addEventListener('load', function() {
    const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    
    if (sessionData && sessionData.isLoggedIn) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('portfolio-content').classList.remove('hidden');
    }
});

// Fonctions pour le portfolio
function showContent(sectionId) {
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(sectionId + '-content');
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function openModal(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('caption');
    
    if (modal && modalImg && caption) {
        modal.style.display = 'block';
        modalImg.src = img.src;
        caption.innerHTML = img.alt;
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
}
