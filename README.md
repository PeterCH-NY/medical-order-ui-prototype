# 醫囑醫令 Functional Prototype V2

Angular 9.1 + Kendo UI for Angular 的純前端操作原型。

V2 在完整保留 V1 Checkbox／按鈕操作流程的前提下，加入 Grid 資料列雙擊快捷操作。

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

## V2 雙擊快捷操作

雙擊快捷操作只有在按下「編輯」、進入編輯模式後才會生效：

- 雙擊右側「檢驗項目」資料列：立即將該筆加入左側「申請項目」。
- 雙擊左側「申請項目」資料列：立即移除該筆資料。
- 檢視模式下雙擊任一 Grid：資料不會改變，也不會自動進入編輯模式。
- 單擊資料列仍只會反白選取，不會新增或刪除資料。
- 雙擊只處理被雙擊的資料列，不使用或改變目前 Checkbox 勾選狀態。
- 新增時以「醫令代碼」防止重複；重複項目會直接忽略，不顯示警告。

所有雙擊異動只會修改 Working Copy。按「儲存」才會下載 `RESULT.TXT` 並提交為 Saved State；未儲存即關閉視窗則會捨棄異動。

原有的 Checkbox 多選、「帶入勾選項目」及「刪除勾選項目」流程仍可正常使用。
