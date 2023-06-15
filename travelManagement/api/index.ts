var express = require('express');
var indexRouter = require('./routes/travelManagementRoutes');
var cors = require('cors');

const app = express();
const port = process.env.PORT || 3666;
app.use(
	cors({
		origin: '*',
	})
);
app.use(express.json());

app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

app.use('/', indexRouter);
