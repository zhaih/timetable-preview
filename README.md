# timetable-preview
preview the unimelb course timetable

a simple webpage to visualize the timetable given by unimelb handbook

it is deployed at https://timetable-preview-345678.herokuapp.com

## to run it locally,

```sh
npm install
npm start
```

## to choose using database or file system to store
you could choose whether to use database(if you have installed mongodb) or save the timetable data as json file. The default for local running is using file system, if you want to use your own mongodb, you could change it at db.js and make the `var MONGODB_URI` your db uri, or you could set environment variable MONGODB_URI.