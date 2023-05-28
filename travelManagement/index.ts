var express = require('express');
var indexRouter = require('./api/routes/travelManagementRoutes');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

app.use('/', indexRouter);
