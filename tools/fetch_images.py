#!/usr/bin/env python3
"""Download the images listed in docs/assets.md from Wikimedia Commons.

Fetches Wikimedia's standard thumbnail sizes (cached, and the sizes it asks
automated clients to use), waits between requests, and refuses any file whose
licence on Commons differs from the one recorded in docs/assets.md.

Usage: python3 tools/fetch_images.py
"""
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = {"User-Agent": "SpainSocialDemocracyMod/0.1 (open-source non-commercial game mod)"}
STANDARD_WIDTHS = [330, 500, 960, 1280]
WIDTHS = {"bg_": 1280, "deck_": 500, "portrait_": 330, "event_": 960}


def rows():
    for line in (ROOT / "docs" / "assets.md").read_text(encoding="utf-8").splitlines():
        m = re.match(r"\| `(img/spain/[^`]+)` \|[^|]+\| \[([^\]]+)\]\([^)]+\) \|[^|]+\| ([^|]+) \|", line)
        if m:
            yield m.group(1), "File:" + m.group(2), m.group(3).strip()


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read()


def main():
    for path, title, licence in rows():
        width = next(w for p, w in WIDTHS.items() if Path(path).name.startswith(p))
        assert width in STANDARD_WIDTHS
        q = urllib.parse.urlencode({
            "action": "query", "format": "json", "titles": title, "prop": "imageinfo",
            "iiprop": "url|extmetadata", "iiurlwidth": width,
            "iiextmetadatafilter": "LicenseShortName",
        })
        page = next(iter(json.loads(get("https://commons.wikimedia.org/w/api.php?" + q))["query"]["pages"].values()))
        info = page["imageinfo"][0]
        found = info["extmetadata"].get("LicenseShortName", {}).get("value", "")
        if not licence.startswith(found.split(" (")[0]) and found not in licence:
            print(f"SKIP {path}: licence on Commons is {found!r}, recorded {licence!r}")
            continue
        target = ROOT / "out" / "html" / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(get(info.get("thumburl") or info["url"]))
        print(f"OK   {path} ({target.stat().st_size // 1024} KiB, {found})")
        time.sleep(5)


if __name__ == "__main__":
    main()
