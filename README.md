# nodejs-express
Node.jsのフレームワークであるExpressを使ってサイト構築

## Installation
```
git clone https://github.com/walk8243/nodejs-express.git
npm install
```

## How to use
### サーバの起動

### サーバの構成
![サーバの構成](https://github.com/walk8243/nodejs-express/blob/master/docs/%E3%82%B5%E3%83%BC%E3%83%90%E6%A7%8B%E6%88%90.jpg)

### 同じサーバ内に新しくサイトを立ち上げるとき
```
npm run create createSite
```
`createSite`は新しく作成するサイトに合わせてください。  
何も指定されなかった場合は、`create`として作成されます。  
同じ名前でサイトを作成することはできないので、プログラム終了後に変更してください。
