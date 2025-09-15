import requests
import subprocess

import json
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from config import config
from pprint import pprint

url = f"https://api.themoviedb.org/3/movie/popular"
print("Presigned URL:", url)


movies = requests.get(url, params={"api_key": config.TMDB_API_KEY, "page": 1}).json()

# print(movies['results'][0]['poster_path'])
# cmd = ["curl", "-o", "poster.jpg", movies['results'][0]['poster_path']]
# subprocess.run(cmd, check=True)


# print(len(movies['results']))
# print(movies['results'][0]['poster_path'])

# for i in range(len(movies['results'])):
#     print()
#     cmd = ["curl", "-o", f"poster_{i}.jpg", movies['results'][0]['poster_path']]
#     subprocess.run(cmd, check=True)


# print(json.dumps(movies, indent=4, ensure_ascii=False))
print(movies['results'][0]['id'])
url = f"https://api.themoviedb.org/3/movie/{movies['results'][0]['id']}/videos"
res = requests.get(url, params={"api_key": config.TMDB_API_KEY}).json()

# print(json.dumps(res, indent=4, ensure_ascii=False))
# print(res['results'][0]['key'])

# cmd = [
#     "yt-dlp", 
#     "-f", 
#     "best", 
#     "-o", 
#     "test.mp4", 
#     f"https://www.youtube.com/watch?v={res['results'][0]['key']}"]
# subprocess.run(cmd, check=True)

for m in movies['results'][:1]:
    url = f"https://api.themoviedb.org/3/movie/{m['id']}/videos"
    res = requests.get(url, params={"api_key": config.TMDB_API_KEY}).json()
    title = m['original_title'] + ".mp4"

    for v in res["results"]:
        if v["site"] == "YouTube" and v["type"] == "Trailer":
            yt_url = f"https://www.youtube.com/watch?v={v['key']}"
            cmd = ["yt-dlp", "--geo-bypass-country", "US" ,"-f", "b", "-o", title, yt_url]
            subprocess.run(cmd, check=True)