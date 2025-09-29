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

// Fonction de déconnexion
function logoutUser() {
    // Clear session data
    localStorage.removeItem('sessionData');
    
    // Afficher le formulaire de login
    document.getElementById('login-section').style.display = 'flex';
    document.getElementById('portfolio-content').classList.add('hidden');
    
    // Reset form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Fonction de navigation forcée
function navigateTo(page) {
    window.location.href = page;
    return false;
}

// Gestionnaire de déconnexion manuelle
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
                logoutUser();
            }
        });
    }

    // Navigation manuelle pour tous les liens (sécurité)
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        if (!link.onclick) {
            link.addEventListener('click', function(e) {
                // Ne pas intercepter les liens qui ont déjà un onclick
                if (!this.getAttribute('onclick')) {
                    e.preventDefault();
                    window.location.href = this.getAttribute('href');
                }
            });
        }
    });
});

// FONCTION POUR AFFICHER/MASQUER LE CONTENU
function showContent(sectionId) {
    // Masquer toutes les sections de contenu
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Afficher la section demandée
    const targetSection = document.getElementById(sectionId + '-content');
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Scroll vers la section
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// FONCTIONS POUR LA MODAL IMAGE
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

// Fermer modal en cliquant dehors
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
}