import feedparser
from flask import Flask, jsonify, render_template

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

@app.route("/")
def index():
    return render_template("index.html")

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route("/api/notes")
def get_notes():
    # Fetch the feed using requests and parse with feedparser
    import requests
    response = requests.get(FEED_URL)
    feed = feedparser.parse(response.text)
    
    notes = []
    for entry in feed.entries:
        # Some feeds use different fields, but standard Atom/RSS parsed by feedparser
        # will typically have title, updated/published, summary/content, and link
        
        # Get content (prefer content over summary if available)
        content_html = ""
        if 'content' in entry and len(entry.content) > 0:
            content_html = entry.content[0].value
        elif 'summary' in entry:
            content_html = entry.summary
            
        note = {
            "title": entry.get("title", "No Title"),
            "date": entry.get("updated", entry.get("published", "Unknown Date")),
            "link": entry.get("link", ""),
            "content": content_html
        }
        notes.append(note)
        
    return jsonify({"notes": notes})

if __name__ == "__main__":
    app.run(debug=True, port=5002)
