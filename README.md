# 政府採購法題庫 v1

這是可直接放入 VS Code、並部署到 GitHub Pages 的純前端刷題網站。

## 題庫來源
- 原始檔：考試題庫.docx
- 資料產生日期：115/09/04
- 共 3,599 題
- 共 14 個分類
- 題型：選擇題、是非題
- 題目、答案與「依據法源」（原檔有提供者）均依原始 Word 整理。

## 使用方式
1. 解壓縮後，用 VS Code 開啟整個 `procurement-quiz-v1` 資料夾。
2. 直接雙擊 `index.html` 即可測試；更推薦用 VS Code 的 Live Server 開啟。
3. 上傳整個資料夾內容到 GitHub repository。
4. GitHub → Settings → Pages → Deploy from a branch → main / root。

## 第一版功能
- 全題庫刷題
- 依大分類篩選
- 選擇題／是非題篩選
- 隨機／依序出題
- 20／50／100／全部題數
- 即時判定答案
- 錯題複習
- 收藏題目
- 答題數與正確率
- 瀏覽器 localStorage 保存紀錄
- 深色模式
- 手機與桌機版面

## 檔案結構
```
procurement-quiz-v1/
├─ index.html
├─ style.css
├─ script.js
├─ README.md
└─ data/
   └─ questions.js
```

## 注意
目前答題紀錄只存在「當前瀏覽器」內，清除瀏覽器資料或換裝置不會同步。這是第一版刻意採用的簡單架構，適合 GitHub Pages。
