# Netflix

## 技術スタック

- frontend：Typescript（React・Next.js）
- backend：Python（FastAPI）
- database：PostgreSQL
- webserver：Nginx
- authentication : Json Web Token
- API check : Postman
- SQL GUI : DBeaver
- Bucket : S3

## 起動

- postgreSQL
  - brew services list
  - psql postgresql://myuser:passwordabva23fkenjavnklanbv32b2j3@localhost:5432/netflixDB
- Docker Compose

  - docker compose up --build

- postgreSQL のリフレッシュ

  - psql -U "username" -d postgres
  - psql
    - DROP DATABASE IF EXISTS "netflixDB";
    - CREATE DATABASE "netflixDB";
    - \q
  - uvicorn main:app --reload
    - local : postgresql://{config.POSTGRES_USER}:{config.POSTGRES_PASSWORD}@localhost:{config.POSTGRES_PORT}/{config.POSTGRES_DB}
    - docker : postgresql://{config.POSTGRES_USER}:{config.POSTGRES_PASSWORD}@{config.POSTGRES_HOST}:{config.POSTGRES_PORT}/{config.POSTGRES_DB}

- docker の postgresql 確認

  - docker compose exec db psql -U myuser -d netflixDB

- docker build cache 削除
  - docker builder prune

## ダミー

- email : exmaple@gmail.com
- password : 123456

## Terraform

1. terraform init
2. terraform validate
3. terraform apply

- terraform state list

```
data.aws_ami.ubuntu
aws_instance.app_server
```

- terraform show

```
# data.aws_ami.ubuntu:
data "aws_ami" "ubuntu" {
    architecture          = "x86_64"
    arn                   = "arn:aws:ec2:us-west-2::image/ami-0026a04369a3093cc"
    block_device_mappings = [
        {
            device_name  = "/dev/sda1"
            ebs          = {
                "delete_on_termination" = "true"
                "encrypted"             = "false"
                "iops"                  = "0"
                "snapshot_id"           = "snap-051c478203945e90f"
                "throughput"            = "0"
                "volume_size"           = "8"
                "volume_type"           = "gp3"
            }

## ...

    }
}
```

- terraform output
  - outputs.tf

```
output "instance_hostname" {
    description = "Private des name of the ec2 instance"
    value       = aws_instance.app_server.private_dns
}

###############################################################
$ terraform output
instance_hostname = "ip-172-31-36-145.us-west-2.compute.internal"

```

## やること

### 全体のステップ計画

- ✅ Step 1: ユーザー認証

  - password を hash 化して、DB に保存

- ✅ Step 2: 動画をアップロードして再生できる環境を作る

  - AWS S3 に動画を保存
  - Next.js でを使い再生(「最低限の Netflix っぽい UI」を実現)

- ✅ Step 3: バックエンド API

  - FastAPI（Python）で動画のメタデータ（タイトル・説明・URL）を管理
  - Next.js から API を呼び出して表示

- ✅ Step 4: 視聴履歴の保存

  - PostgreSQL に「誰が・いつ・何を見たか」を保存
  - どのタイミングで動画を start/stop したか収集し、再度開いたとき途中から見れる

- ✅ Step 5: セキュリティ

  - JWT 認証
  - S3 の署名付き URL（直リンク防止）

- Step 6: コンテンツ表示方法

  - 新作
  - 人気順
  - 視聴履歴
  - ジャンル
  - 協調フィルタリング（簡易版）
  - Pytorch で ML モデル開発(Two Tower model、embedding model)

- Step 7: クラウド

  - AWS(VPC、EC2、Route53、RDS Aurora、CDN)
  - セキュリティグループ、ルートテーブル、オートスケーリング、ELB、InternetGateway

## 改善点

- HLS (m3u8) 形式に変換してストリーミング
- Redis を使った Cache

## 気づき

- JWT の扱い

  - localstorage ではなく DB に保存したり、cookie の中に access/refresh token を入れるとよい
  - db 用のテーブルが別途必要

- ServerSide に access token があれば、SSR/ISR ができる

  - 今回は client side の LocalStorage で、access token を保持しているためできない
  - token は、Cookie で保存しておけばリクエストごとにサーバーに送ることができる
  - SSR/ISR が使える
  - XSS 対策になる

- CSR

  - ユーザー固有の表示コンテンツ（マイリスト・視聴履歴・レコメンド結果）は、異なるので CSR で呼ぶ必要がある
    - fetch のタイミングで user 情報で select するため

- ISR

  - 配列やオブジェクトのような文字列で構成されたデータを fetch した場合は、それらを読み込んだ HTML ファイルが作成される
  - リクエストされるとサーバーが HTML を作成し、キャッシュとして保存する
  - validation 指定して期限を設ける
    - 高頻度で変わる場合は、値を小さくする(ランキング・投稿)
    - 低頻度の場合、大きくする(ブログ・メタデータ)
  - .next/cache に HTML が生成される

  ```
  import type { GetStaticPaths, GetStaticProps } from 'next'
  export const getStaticProps: GetStaticProps<Props> = async ({
    params,
  }: {
    params: { id: string }
  }) => {
    const post = await fetch(`https://api.vercel.app/blog/${params.id}`).then(
      (res) => res.json()
    )

    return {
      props: { post },
      // Next.js will invalidate the cache when a
      // request comes in, at most once every 60 seconds.
      revalidate: 60,
    }
  }

  export default function Page({ post }: Props) {
    return (
      <main>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </main>
    )
  }
  ```

  - 極論、CSR と ISR だけでいい？

- 使い方

  - CSR
    - 署名付き URL
    - コメント一覧（最新の情報を毎回取得する必要がある）
    - ユーザー固有のコンテンツ（マイリスト・視聴履歴・おすすめ）
  - ISR
    - 動画タイトル・説明文・ジャンル・日付
    - S3 用の path
    - ランキングページ（人気動画・ジャンル別）

- 「用件定義」・「テーブル設計」・「処理についての説明」はかなり重要
- EC2 は使わないらしく、ECS・EKS のようなコンテナがメインらしい
