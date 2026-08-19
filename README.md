# 醫囑醫令 Functional Prototype V1

Angular 9.1 + Kendo UI for Angular 的純前端操作原型。

## 執行環境

本專案固定使用 Angular 9.1.13。開發伺服器建議使用 Angular 9 官方相容範圍內的 Node.js 12.x。

## 安裝與啟動

```powershell
npm install
npm start
```

瀏覽器開啟 `http://localhost:4200`。按「醫囑醫令」可開啟視窗。

建置與單元測試：

```powershell
npm run build -- --prod
npm test
```

若只使用本工作區附帶的新版 Node.js 執行 production build，需先設定：

```powershell
$env:NODE_OPTIONS = '--openssl-legacy-provider'
pnpm exec ng build --prod
```

Angular 9 的舊版 webpack 開發伺服器不支援 Node.js 24；請勿用 Node.js 24 執行 `npm start`。

## 操作流程

1. 初始為檢視模式，Checkbox 與異動按鈕均停用。
2. 按「編輯」，再從右側勾選項目並按「帶入勾選項目」。
3. 左側可多選後按「刪除勾選項目」。
4. 按「儲存」會下載 UTF-8、Tab-separated 的 `RESULT.TXT`，並提交目前 Working Copy。
5. 編輯中直接關閉視窗會丟棄 Working Copy；重新開啟仍顯示最後成功儲存的資料。
6. 重新整理網頁會回到初始 Mock Data，未使用任何瀏覽器持久化儲存。
