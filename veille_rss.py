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

def get_entry_date(entry):
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        return datetime(*entry.published_parsed[:6])
    return datetime.now()

def fetch_new_articles(feeds, existing_links):
    new_articles = []

    for url in feeds:
        feed = feedparser.parse(url)
        source = feed.feed.get("title", "Source inconnue")

        for entry in feed.entries[:MAX_ARTICLES_PER_FEED]:
            if entry.link in existing_links:
                continue

            published = get_entry_date(entry)

            new_articles.append({
                "date": published.isoformat(),
                "source": source,
                "title": entry.title,
                "analysis": (
                    "Cet article met en évidence une évolution récente "
                    "liée à la cybersécurité, au Zero Trust ou "
                    "à l’automatisation des infrastructures."
                ),
                "link": entry.link,
                "auto": True
            })

    return new_articles

def clean_old_articles(articles):
    cutoff = datetime.now() - timedelta(days=MAX_AGE_DAYS)
    cleaned = []

    for a in articles:
        # Articles manuels : toujours conservés
        if not a.get("auto"):
            cleaned.append(a)
            continue

        # Articles automatiques récents uniquement
        try:
            article_date = datetime.fromisoformat(a["date"])
            if article_date > cutoff:
                cleaned.append(a)
        except Exception:
            cleaned.append(a)

    return cleaned

def sort_articles(articles):
    return sorted(
        articles,
        key=lambda a: datetime.fromisoformat(a["date"]),
        reverse=True
    )

def main():
    for topic, feeds in RSS_SOURCES.items():
        path = f"{OUTPUT_DIR}/{topic}.json"

        existing_articles = load_existing_articles(path)
        existing_links = {a["link"] for a in existing_articles}

        new_articles = fetch_new_articles(feeds, existing_links)
        all_articles = existing_articles + new_articles
        all_articles = clean_old_articles(all_articles)
        all_articles = sort_articles(all_articles)

        if new_articles:
            save_articles(path, all_articles)
            print(f"[OK] {topic} : +{len(new_articles)} nouveaux articles")
        else:
            print(f"[INFO] {topic} : aucun nouvel article")

if __name__ == "__main__":
    main()
