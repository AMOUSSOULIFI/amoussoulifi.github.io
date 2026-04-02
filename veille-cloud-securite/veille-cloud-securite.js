// Charger les articles
fetch("data/articles.json")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("articles");
        if (!container) return;

        // === 1. Injection dynamique des styles (sans toucher au fichier CSS) ===
        const style = document.createElement('style');
        style.textContent = `
            .filters-container {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin: 2rem 0 1rem;
                flex-wrap: wrap;
            }
            .filter-btn {
                background: #e2e8f0;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 40px;
                font-weight: 600;
                cursor: pointer;
                transition: 0.2s;
                font-size: 0.9rem;
            }
            .filter-btn.active {
                background: #38bdf8;
                color: white;
                box-shadow: 0 2px 8px rgba(56,189,248,0.3);
            }
            .badge-cloud-risk {
                display: inline-block;
                background: #dc2626;
                color: white;
                font-size: 0.7rem;
                padding: 0.2rem 0.6rem;
                border-radius: 20px;
                margin-left: 0.5rem;
                vertical-align: middle;
            }
        `;
        document.head.appendChild(style);

        // === 2. Détection des vulnérabilités cloud ===
        function isCloudRisk(article) {
            const keywords = [
                "cloud", "aws", "azure", "google cloud", "gcp", "kubernetes", "docker",
                "s3", "bucket", "serverless", "lambda", "cloudflare", "vertex ai",
                "vulnerabilit", "cve", "faille", "exploit", "zero-day", "compromis",
                "data leak", "exfiltration", "ransomware", "backdoor", "injection",
                "bypass", "escalade de privilèges", "divulgation", "piratage", "attaque"
            ];
            const text = (article.title + " " + article.source).toLowerCase();
            return keywords.some(kw => text.includes(kw));
        }

        data.forEach(article => {
            article.isCloudRisk = isCloudRisk(article);
        });

        // === 3. Création des boutons de filtre (insérés avant la liste des articles) ===
        const filtersDiv = document.createElement('div');
        filtersDiv.className = 'filters-container';
        filtersDiv.innerHTML = `
            <button class="filter-btn active" data-filter="all">📰 Tous les articles</button>
            <button class="filter-btn" data-filter="cloud-risks">⚠️ Vulnérabilités & risques cloud</button>
        `;
        // Insérer juste avant le conteneur d'articles
        container.parentNode.insertBefore(filtersDiv, container);

        // === 4. Fonction d'affichage ===
        function renderArticles(filter = "all") {
            let filtered = data;
            if (filter === "cloud-risks") {
                filtered = data.filter(a => a.isCloudRisk === true);
            }

            container.innerHTML = "";
            if (filtered.length === 0) {
                container.innerHTML = "<p style='text-align:center;'>Aucun article correspondant à ce filtre.</p>";
                return;
            }

            filtered.forEach(a => {
                const div = document.createElement("div");
                div.className = "article";
                let badge = "";
                if (a.isCloudRisk) {
                    badge = `<span class="badge-cloud-risk">⚠️ Vulnérabilité cloud</span>`;
                }
                div.innerHTML = `
                    <strong>${a.title}</strong> ${badge}<br>
                    Source : ${a.source} | Date : ${a.date}<br>
                    <a href="${a.link}" target="_blank">Lire l'article</a>
                `;
                container.appendChild(div);
            });
        }

        // === 5. Gestion des clics ===
        const filterBtns = () => document.querySelectorAll(".filter-btn");
        const updateFilter = () => {
            filterBtns().forEach(btn => {
                btn.addEventListener("click", function() {
                    const filterValue = this.getAttribute("data-filter");
                    filterBtns().forEach(b => b.classList.remove("active"));
                    this.classList.add("active");
                    renderArticles(filterValue);
                });
            });
        };
        renderArticles("all");
        updateFilter();

        // === 6. Graphique (inchangé, utilise le champ "month") ===
        const countsByMonth = {};
        data.forEach(a => {
            const month = a.month;
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
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: "Nombre d'articles" } },
                    x: { title: { display: true, text: "Mois" } }
                }
            }
        });
    })
    .catch(err => console.error("Erreur chargement articles :", err));
