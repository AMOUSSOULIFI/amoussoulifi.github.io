// Charger les articles
fetch("data/articles.json")
.then(res => res.json())
.then(data => {
    const container = document.getElementById("articles");

    // Affichage des articles
    data.forEach(a => {
        const div = document.createElement("div");
        div.className = "article";
        div.innerHTML = `
            <strong>${a.title}</strong><br>
            Source : ${a.source} | Date : ${a.date}<br>
            <a href="${a.link}" target="_blank">Lire l'article</a>
        `;
        container.appendChild(div);
    });

    // Générer graphique
    const counts = {};
    data.forEach(a => counts[a.date] = (counts[a.date] || 0) + 1);

    const labels = Object.keys(counts).sort();
    const values = labels.map(l => counts[l]);

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
                y: { beginAtZero: true }
            }
        }
    });
});
