import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';
import cors from 'cors';

const version = require('../package').version
const app = express();

const port = process.env.PORT || 8077;

//kill container when Ctrl + C 
process.on('SIGINT', function() {
    process.exit();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());

app.use('/api/v1/', routes);

app.listen(port, () => {
	console.log(`Starting social books server 
	version: ${version}
	in mode ${process.env.NODE_ENV}`)
    console.log(`Server started on port ${port}`);
});

//export for test
export default app;
