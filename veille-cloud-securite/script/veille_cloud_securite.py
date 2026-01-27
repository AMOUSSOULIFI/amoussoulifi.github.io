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

today = datetime.now()
one_year_ago = today - timedelta(days=365)

for source, url in RSS_FEEDS.items():
    feed = feedparser.parse(url)

    for entry in feed.entries:
        # ✅ RÉCUPÉRATION DE LA DATE CORRECTE
        date_struct = None

        if hasattr(entry, "published_parsed"):
            date_struct = entry.published_parsed
        elif hasattr(entry, "updated_parsed"):
            date_struct = entry.updated_parsed

        if not date_struct:
            continue

        published = datetime(*date_struct[:6])

        # 🔎 FILTRAGE SUR 12 MOIS
        if published < one_year_ago:
            continue

        articles.append({
            "source": source,
            "title": entry.title,
            "link": entry.link,
            "date": published.strftime("%Y-%m-%d"),
            "month": published.strftime("%Y-%m")
        })

# 🔽 TRI CORRECT (DATE RÉELLE)
articles.sort(
    key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d"),
    reverse=True
)

# 📁 DOSSIER DE SORTIE
output_dir = "veille-cloud-securite/data"
os.makedirs(output_dir, exist_ok=True)

output_path = os.path.join(output_dir, "articles.json")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)

print(f"✅ {len(articles)} articles enregistrés (12 derniers mois)")
