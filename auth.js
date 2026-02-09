(function () {
    const sessionStr = localStorage.getItem("sessionData");
    if (!sessionStr) {
        window.location.href = "index.html";
        return;
    }

    let session;
    try {
        session = JSON.parse(sessionStr);
    } catch (e) {
        // Données corrompues → déconnexion
        localStorage.removeItem("sessionData");
        window.location.href = "index.html";
        return;
    }

    if (!session.isLoggedIn) {
        window.location.href = "index.html";
        return;
    }

    // Vérification expiration
    if (Date.now() > session.expiresAt) {
        localStorage.removeItem("sessionData");
        alert("Session expirée. Veuillez vous reconnecter.");
        window.location.href = "index.html";
    }
})();
