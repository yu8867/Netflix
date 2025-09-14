import requests
import subprocess
import boto3
from config import config

url = f"https://api.themoviedb.org/3/movie/popular"


s3 = boto3.client(
    "s3", 
    aws_access_key_id=config.S3_ACCESS_KEY,
    aws_secret_access_key=config.S3_SECRET_KEY,
    region_name=config.S3_REGION
)


url = s3.generate_presigned_url(
    "get_object",
    Params = {
        "Bucket": config.S3_BUCKET, 
        "Key": "trailer/War of the Worlds.mp4"
    },
    ExpiresIn=300  # 有効期限 300秒
)
print("Presigned URL:", url)

# response = s3.list_buckets()
# for bucket in response['Buckets']:
#     print(bucket["Name"])

# movies = requests.get(url, params={"api_key": config.TMDB_API_KEY, "page": 1}).json()

# for m in movies['results'][:2]:
#     url = f"https://api.themoviedb.org/3/movie/{m['id']}/videos"
#     res = requests.get(url, params={"api_key": config.TMDB_API_KEY}).json()
#     title = m['original_title'] + ".mp4"

#     for v in res["results"]:
#         if v["site"] == "YouTube" and v["type"] == "Trailer":
#             yt_url = f"https://www.youtube.com/watch?v={v['key']}"
#             cmd = ["yt-dlp", "-f", "best", "-o", title, yt_url]
            # subprocess.run(cmd, check=True)
            # with subprocess.Popen(cmd, stdout=subprocess.PIPE) as proc:
            #     s3.upload_fileobj(proc.stdout, S3_BUCKET, f"trailer/{title}")