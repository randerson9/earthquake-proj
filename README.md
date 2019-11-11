# EarthquakeProj

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.9.
insert description here. 

## Get started

### Clone the repo

```shell
git clone https://github.com/[INSERT LINK HERE]
cd earthquake-proj
```

### Install npm packages

Install the `npm` packages described in the `package.json` and verify that it works:

```
npm install
npm start
```

The `npm start` command builds (compiles TypeScript and copies assets) the application into `dist/`, watches for changes to the source files, and runs `lite-server` on port `3000`.

Shut it down manually with `Ctrl-C`.

#### Starting the server
Note: In order for this project to work, we must start the server to fetch the earthquake data. The backend is written in Node.js. For this project, geoJSON data is stored in a static file. To run the server, navigate to the proper directory (in this case, it should be called earthquake-proj) and run the following command:

```
node server.js
```


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.




## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
