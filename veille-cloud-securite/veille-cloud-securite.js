// Charger les articles
fetch("data/articles.json")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("articles");
        if (!container) return;

        // === 1. Fonction pour détecter si un article concerne les vulnérabilités cloud ===
        function isCloudRisk(article) {
            const keywords = [
                "cloud", "aws", "azure", "google cloud", "gcp", "kubernetes", "docker",
                "s3", "bucket", "serverless", "lambda", "cloudflare", "vertex ai",
                "iaas", "paas", "saas", "multicloud", "hybrid cloud", "cloud native",
                "vulnerabilit", "cve", "faille", "exploit", "zero-day", "compromis",
                "data leak", "exfiltration", "ransomware", "backdoor", "injection",
                "bypass", "escalade de privilèges", "divulgation", "piratage", "attaque"
            ];
            // Vérifier dans le titre et la source
            const text = (article.title + " " + article.source).toLowerCase();
            return keywords.some(kw => text.includes(kw));
        }

        // Ajouter un champ "isCloudRisk" à chaque article
        data.forEach(article => {
            article.isCloudRisk = isCloudRisk(article);
        });

        // === 2. Fonction d'affichage avec filtre ===
        function renderArticles(filter = "all") {
            let filtered = data;
            if (filter === "cloud-risks") {
                filtered = data.filter(a => a.isCloudRisk === true);
            }
            // Vider le conteneur
            container.innerHTML = "";
            if (filtered.length === 0) {
                container.innerHTML = "<p style='text-align:center;'>Aucun article correspondant à ce filtre.</p>";
                return;
            }
            // Afficher chaque article
            filtered.forEach(a => {
                const div = document.createElement("div");
                div.className = "article";
                // Ajout du badge si c'est un risque cloud
                let badgeHtml = "";
                if (a.isCloudRisk) {
                    badgeHtml = `<span class="badge-cloud-risk">⚠️ Vulnérabilité cloud</span>`;
                }
                div.innerHTML = `
                    <strong>${a.title}</strong> ${badgeHtml}<br>
                    Source : ${a.source} | Date : ${a.date}<br>
                    <a href="${a.link}" target="_blank">Lire l'article</a>
                `;
                container.appendChild(div);
            });
        }

        // === 3. Gestion des boutons de filtre ===
        const filterButtons = document.querySelectorAll(".filter-btn");
        filterButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                const filterValue = this.getAttribute("data-filter");
                // Mise à jour de l'état actif
                filterButtons.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                // Affichage filtré
                renderArticles(filterValue);
            });
        });

        // === 4. Affichage initial (tous les articles) ===
        renderArticles("all");

        // === 5. Graphique (par mois) ===
        const countsByMonth = {};
        data.forEach(a => {
            const month = a.month; // Utilise le champ "month" du JSON (ex: "2026-04")
            if (month) countsByMonth[month] = (countsByMonth[month] || 0) + 1;
        });
        const labels = Object.keys(countsByMonth).sort();
        const values = labels.map(l => countsByMonth[l]);

        new Chart(document.getElementById("graphique"), {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Articles par mois",
                    data: values,
                    borderColor: "#667eea",
                    backgroundColor: "#667eea33",
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: "Nombre d'articles" } },
                    x: { title: { display: true, text: "Mois" } }
                }
            }
        });
    })
    .catch(err => console.error("Erreur chargement articles :", err));
