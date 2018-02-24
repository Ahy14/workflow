# My personal workflow
It's files that I use when I code for frontend, using Webpack with SASS and Babel for ES6.
I also use a reset CSS, a normalize style and somes personal JS functions. Each one are already imported in the app.css and app.js sources files.

## Download and intallation
Open a terminal in your dev folder and run the command :
```sh
$ git clone https://github.com/ahy14/workflow && npm run hello
```
The first will download from repository and the second will run a personal command that install the dependencies.
Don't forget to make yourself a index.html or index.php on root folder.

## Run the workflow for developpement
When you are in developpement, you can run the workflow with this command :
```sh
$ npm run dev
```

For watching the files during developpement, use instead this :
```sh
$ npm run watch
```

## Compile the sources for production
Sources files are not optimized for production, when your project is fine to be released, you can use this command for uglify and minify the files. Images are also optimized :
```sh
$ npm run prod
```
