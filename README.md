# Снаряжение — Арарат 5165

Мобильная страница со снаряжением для восхождения. Автодеплой на GitHub Pages через GitHub Actions при пуше в `main`.

## Структура

- `index.html`, `assets/style.css`, `assets/app.js` — сама страница
- `data/gear.json` — список снаряжения (статус: `have` / `buy` / `rent`)
- `images/` — фото снаряжения (имя файла указывается в поле `photo` соответствующего item в `gear.json`)
- `.github/workflows/deploy.yml` — деплой на Pages

## Как добавить фото

1. Положить файл в `images/`, например `images/boots-trek.jpg`.
2. В `data/gear.json` у нужного item проставить `"photo": "boots-trek.jpg"`.
3. Закоммитить и запушить — сайт передеплоится автоматически.

## Первая настройка репозитория

В настройках репозитория: **Settings → Pages → Source → GitHub Actions**.
