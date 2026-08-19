# 醫囑醫令 Functional Prototype V1

Angular 9.1 + Kendo UI for Angular 的純前端操作原型。

## 第一次安裝（Windows 新手版）

以下步驟不需要先安裝 Angular CLI。專案執行 `npm install` 時會自動安裝所需的 Angular 與 Kendo 套件。

### 1. 安裝 Node.js 12

本專案使用 Angular 9.1.13，請安裝相容的 **Node.js 12.22.12（64-bit）**，不要直接使用最新版 Node.js。

1. 下載 [Node.js 12.22.12 Windows 64-bit 安裝程式](https://nodejs.org/dist/v12.22.12/node-v12.22.12-x64.msi)。
2. 執行安裝程式，使用預設選項完成安裝。
3. 關閉並重新開啟 PowerShell。
4. 輸入以下指令檢查版本：

```powershell
node --version
npm --version
```

`node --version` 應顯示 `v12.22.12`。Node.js 12 已停止官方安全更新，僅建議用來執行這個本機 Prototype，不要用於正式對外服務。

### 2. 取得專案

可選擇 Git 或 ZIP，兩種方式擇一即可。

#### 方法 A：使用 Git（建議）

先安裝 [Git for Windows](https://git-scm.com/download/win)，重新開啟 PowerShell，然後執行：

```powershell
git clone https://github.com/PeterCH-NY/medical-order-ui-prototype.git
cd medical-order-ui-prototype
```

選擇要體驗的版本，只執行其中一行：

```powershell
git switch main
git switch v2-double-click
```

- `main`：V1 Checkbox／按鈕操作版本。
- `v2-double-click`：V2 雙擊快捷操作版本。

如果舊版 Git 不認得 `git switch`，請改用 `git checkout main` 或 `git checkout v2-double-click`。

#### 方法 B：下載 ZIP（不安裝 Git）

1. 開啟 [GitHub 專案頁面](https://github.com/PeterCH-NY/medical-order-ui-prototype)。
2. 點左上方分支選單，V1 選 `main`，V2 選 `v2-double-click`。
3. 點綠色 **Code** 按鈕，再點 **Download ZIP**。
4. 解壓縮 ZIP，進入解壓後的專案資料夾。
5. 在檔案總管的資料夾路徑列輸入 `powershell`，按 Enter 開啟終端機。

### 3. 安裝專案套件

確認 PowerShell 目前位於專案資料夾，且看得到 `package.json`，再執行：

```powershell
npm install
```

第一次安裝可能需要幾分鐘。畫面出現 `WARN` 通常仍可繼續；若出現 `ERR!` 才代表安裝失敗。

### 4. 啟動專案

```powershell
npm start
```

等待畫面出現編譯成功訊息後，瀏覽器通常會自動開啟。若沒有，請手動開啟：

```text
http://localhost:4200
```

看到「醫囑醫令」按鈕即代表啟動成功。點擊按鈕可開啟操作視窗。要停止程式，回到 PowerShell 按 `Ctrl + C`。

## 常見問題

### `node` 或 `npm` 不是可辨識的指令

關閉所有 PowerShell 視窗後重新開啟。若仍無法使用，請重新安裝 Node.js，並確認安裝程式有將 Node.js 加入 PATH。

### PowerShell 顯示「系統上已停用指令碼執行」

改用 `.cmd` 版本執行：

```powershell
npm.cmd install
npm.cmd start
```

### 出現 `digital envelope routines::unsupported`

目前使用的 Node.js 太新。請先執行 `node --version`，並切換為 `v12.22.12` 後重新啟動。

### `Port 4200 is already in use`

代表 4200 連接埠已被其他程式使用，可改用另一個連接埠：

```powershell
npm start -- --port 4300
```

然後開啟 `http://localhost:4300`。

## 建置與測試（選用）

一般操作不需要執行這一節。若要確認專案可正常建置與通過單元測試：

```powershell
npm run build -- --prod
npm test
```

Angular 9 的舊版 webpack 開發伺服器不支援 Node.js 24；請勿使用 Node.js 24 執行 `npm start`。

## 操作流程

1. 初始為檢視模式，Checkbox 與異動按鈕均停用。
2. 按「編輯」，再從右側勾選項目並按「帶入勾選項目」。
3. 左側可多選後按「刪除勾選項目」。
4. 按「儲存」會下載 UTF-8、Tab-separated 的 `RESULT.TXT`，並提交目前 Working Copy。
5. 編輯中直接關閉視窗會丟棄 Working Copy；重新開啟仍顯示最後成功儲存的資料。
6. 重新整理網頁會回到初始 Mock Data，未使用任何瀏覽器持久化儲存。
