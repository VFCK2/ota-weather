O-SORA PWA GPS FIX v1.4

今回の修正:
- iPhoneホーム画面PWAの現在地ボタンをinlineユーザー操作からGeolocation開始
- GPS取得処理をメインアプリのJSから分離し、PWAでボタン無反応になりにくい構造へ変更
- 取得した緯度経度をメインアプリへ確実に引き継ぎ
- Service Worker cacheをv1-4へ更新
- PC側のGAS高速化・安定化は前版を維持

GitHub Pagesのファイルを全置換してください。
特に index.html と sw.js は必ず更新してください。
