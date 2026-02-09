(function () {
    const session = JSON.parse(localStorage.getItem("sessionData"));

    if (!session || !session.isLoggedIn) {
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

