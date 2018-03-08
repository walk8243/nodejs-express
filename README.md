# nodejs-express
Node.jsのフレームワークであるExpressを使ってサイト構築

## Installation
```.sh
git clone https://github.com/walk8243/nodejs-express.git
npm install
```

## How to use
### サーバの起動
```.sh
npm run app
```

### サーバの構成
このシステムのサーバ構成は下の図のようになっています。  
全体に`app`サーバを作成し、その中に複数のサブサーバを作成します。
実質的にアクセスされるサーバはそのサブサーバです。

![サーバの構成](https://github.com/walk8243/nodejs-express/blob/master/docs/%E3%82%B5%E3%83%BC%E3%83%90%E6%A7%8B%E6%88%90.jpg)

### 新しくサイトを作るとき
*新しくサイトを作成するには、新しくサブサーバを作る必要があります。*  
**新しくサブサーバを作成** する際に、こちらを参照してください。  
オープンページだけでなく、auth認証が使用するページを作成する際は、その認証ページでも作成してください。
```.sh
npm run create [createSite]
```
`createSite`は新しく作成するサイトに合わせてください。  
何も指定されなかった場合は、`create`として作成されます。  
同じ名前でサイトを作成することはできないので、プログラム終了後に変更してください。

### 認証を使用するページを作成するとき
管理者のみがアクセスするようなページを作成するときなどにお使いください。

このシステムでは、認証にauth認証を使用しています。  
そのパスワードファイルを作成するモジュールには、
[htdigest](https://github.com/http-auth/htdigest)
を使っています。  
その理由として、一つのパスワードファイルで複数のサブサーバの認証情報を管理するためです。

認証情報を登録するコードは以下になります。
```.sh
htdigest .htpasswd `realm` `username`

-- 以下は返答要求です。 --
New password: `password`
Re-type new password: `password`
```
`realm`は、サブサーバの名前です。  
`username`は、認証情報のユーザ名です。  
`password`は、認証情報のユーザ名と対応させるパスワードです。

**注意）**  
「`apache2-utils`がインストールされていない」と言われるかもしれません。  
そのときは、指示に従ってインストールしてください。

## File organization
```
nodejs-express/
  |
  |-- config/
  |     |-- default.yml
  |     |-- route.yml
  |     `-- admin.yml  
  |-- docs/
  |-- page/
  |     |-- main/
  |     |     `-- index.js
  |     `-- admin/  
  |           `-- index.js
  |-- template/
  |     |-- main/
  |     |     |-- common/
  |     |     |     |-- _footer.ejs
  |     |     |     `-- _head.ejs
  |     |     |
  |     |     `-- index.ejs
  |     `-- admin/  
  |           `-- index.ejs
  |
  |-- .gitignore
  |-- LICENSE
  |-- package-lock.json
  |-- package.json
  |-- README.md
  |
  |-- .htpasswd
  |-- app.js
  |-- createServer.js
  |-- error.js
  |-- func.js
  `-- page.js
```
