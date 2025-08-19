# Netflix

uvicorn main:app --reload

hiroki@example.com
123456

🪜 全体のステップ計画
Step 1: 動画をアップロードして再生できる環境を作る
AWS S3 に動画を保存
Next.js で <video> を使い再生
「最低限の Netflix っぽい UI」を実現

Step 2: ユーザー認証
Firebase Auth or Clerk を使ってログイン機能
Netflix っぽく「ログイン画面」を作成

Step 3: バックエンド API
FastAPI（Python）で動画のメタデータ（タイトル・説明・URL）を管理
Next.js から API を呼び出して表示

Step 4: 視聴履歴の保存
DB (SQLite → PostgreSQL) に「誰が何を見たか」を保存
履歴から「最近見た作品」リストを作る

Step 5: レコメンドエンジン
人気順
協調フィルタリング（簡易版）
最後は TensorFlow で ML モデルを導入

Step 6: CDN・配信最適化
CloudFront or Cloudflare 経由で低遅延配信
HLS (m3u8) 形式に変換してストリーミング

Step 7: セキュリティ
JWT 認証
S3/GCS の署名付き URL（直リンク防止）
