O-SORA v14：Web Pushテスト版

目的
まず「iPhoneのホーム画面Webアプリへリモート通知が届くか」だけを確認します。雨判定はまだ入れていません。

1. Firebaseプロジェクトを作成
- Firebase Consoleで新規プロジェクトを作成
- ウェブアプリ（</>）を追加
- 表示されたFirebase設定を firebase-config.js に入力

2. Web Push用VAPID公開鍵
- Firebase Console > Project settings > Cloud Messaging
- Web Push certificates の鍵を用意
- 公開鍵を firebase-config.js の vapidKey に入力

3. GitHub Pagesへアップ
index.html / sw.js / manifest.json / firebase-config.js / アイコンを同じ階層へ。

4. iPhone
- SafariでGitHub Pagesを開く
- ホーム画面に追加し、「Webアプリとして開く」をON
- O-SORAをホーム画面から起動
- 「🔔 通知を有効にする」をタップ
- 通知を許可
- 画面にFCMトークンが表示されたら登録成功

5. Firebaseからテスト通知
Firebase Console > Messaging > 新しいキャンペーン > 通知
- テストメッセージを送信
- FCM登録トークン欄へO-SORA画面のトークンを貼り付け
- iPhoneのO-SORAをバックグラウンドにしてテスト

注意
- GitHub PagesはHTTPSなので条件を満たします。
- iOS/iPadOSのWeb Pushはホーム画面に追加したWebアプリで利用します。
- 通知許可の要求はユーザー操作（ボタンタップ）から行います。
- Firebase設定を公開ページに置くこと自体は通常のWeb Firebase設定として想定されていますが、秘密鍵やサービスアカウント鍵は絶対に置かないでください。
