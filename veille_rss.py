import feedparser
import json
from datetime import datetime, timedelta
import os

RSS_SOURCES = {
    "iam-zero-trust": [
        "https://www.ssi.gouv.fr/feed/",
        "https://www.zdnet.fr/feeds/rss/securite/"
    ],
    "network-automation": [
        "https://www.thehackernews.com/feeds/posts/default"
    ]
}

OUTPUT_DIR = "veilles-data"
MAX_ARTICLES_PER_FEED = 6
MAX_AGE_DAYS = 365

os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_existing_articles(path):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_articles(path, articles):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

def fetch_new_articles(feeds, existing_links):
    new_articles = []

    for url in feeds:
        feed = feedparser.parse(url)

        for entry in feed.entries[:MAX_ARTICLES_PER_FEED]:
            if entry.link in existing_links:
                continue

            published = datetime(*entry.published_parsed[:6])

            new_articles.append({
                "date": published.isoformat(),
                "source": feed.feed.title,
                "title": entry.title,
                "analysis": (
                    "Cet article met en évidence une évolution récente "
                    "liée aux infrastructures, à la sécurité ou à "
                    "l’automatisation des systèmes."
                ),
                "link": entry.link
            })

    return new_articles

def clean_old_articles(articles):
    cutoff = datetime.now() - timedelta(days=MAX_AGE_DAYS)
    return [
        a for a in articles
        if datetime.fromisoformat(a["date"]) > cutoff
    ]

def main():
    for topic, feeds in RSS_SOURCES.items():
        path = f"{OUTPUT_DIR}/{topic}.json"

        existing_articles = load_existing_articles(path)
        existing_links = {a["link"] for a in existing_articles}

        new_articles = fetch_new_articles(feeds, existing_links)

        all_articles = existing_articles + new_articles
        all_articles = clean_old_articles(all_articles)

        save_articles(path, all_articles)

        print(f"[OK] {topic} : +{len(new_articles)} articles, total {len(all_articles)}")

if __name__ == "__main__":
    main()

