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
one_year_ago = datetime.now() - timedelta(days=365)

for source, url in RSS_FEEDS.items():
    feed = feedparser.parse(url)
    for entry in feed.entries:
        if hasattr(entry, "published_parsed"):
            published = datetime(*entry.published_parsed[:6])
            if published >= one_year_ago:
                articles.append({
                    "source": source,
                    "title": entry.title,
                    "link": entry.link,
                    "date": published.strftime("%Y-%m")
                })

articles.sort(key=lambda x: x["date"], reverse=True)

# 🔥 CRÉATION DU DOSSIER SI NÉCESSAIRE
output_dir = "veille-cloud-securite/data"
os.makedirs(output_dir, exist_ok=True)

output_path = os.path.join(output_dir, "articles.json")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)

print(f"{len(articles)} articles enregistrés")
