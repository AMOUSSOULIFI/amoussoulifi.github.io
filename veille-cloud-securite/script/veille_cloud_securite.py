import feedparser
import json
from datetime import datetime, timedelta
import os

RSS_FEEDS = {
    "ANSSI": "https://www.cert.ssi.gouv.fr/feed/",
    "Cloudflare": "https://blog.cloudflare.com/rss/",
    "AWS Security": "https://aws.amazon.com/security/security-bulletins/rss/",
    "Microsoft Security": "https://www.microsoft.com/security/blog/feed/",
    "The Hacker News": "https://feeds.feedburner.com/TheHackersNews"
}

articles = []

# 📅 Date limite : 12 derniers mois
today = datetime.now()
one_year_ago = today - timedelta(days=365)

for source, url in RSS_FEEDS.items():
    feed = feedparser.parse(url)

    for entry in feed.entries:
        if not hasattr(entry, "published_parsed"):
            continue

        published = datetime(*entry.published_parsed[:6])

        # 🔎 FILTRAGE PAR DATE
        if published < one_year_ago:
            continue

        articles.append({
            "source": source,
            "title": entry.title,
            "link": entry.link,
            "date": published.strftime("%Y-%m-%d"),  # date complète
            "month": published.strftime("%Y-%m")     # pour graphique
        })

# 🔽 TRI DU PLUS RÉCENT AU PLUS ANCIEN
articles.sort(
    key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d"),
    reverse=True
)

# 📁 Création du dossier si nécessaire
output_dir = "veille-cloud-securite/data"
os.makedirs(output_dir, exist_ok=True)

output_path = os.path.join(output_dir, "articles.json")

# 💾 Écriture JSON
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)

print(f"{len(articles)} articles enregistrés (12 derniers mois)")
