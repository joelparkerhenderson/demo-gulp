# Demo Gulp


## Add Gulp and related tools

Install:

```sh
npm init
npm install --save-dev gulp-cli
npm install --save-dev gulp
npm install --save-dev gulp-concat
npm install --save-dev gulp-mustache
npm install --save-dev gulp-postcss
npm install --save-dev tailwindcss
npm install --save-dev autoprefixer
npm install --save-dev pino
```

## Usage

Copy HTML files from `src/html` to `dist/html`:

```sh
npx gulp html
```

Copy image files from `src/assets/images` to `dist/assets/images`:

```sh
npx gulp images
```

Process style files via Tailwind CSS from `src/assets/styles` to `dist/assets/styles`:

```sh
npx gulp styles
```

Process template files via Mustache JS from `src/templates` to `dist/templates`:

```sh
npx gulp templates
```
