const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const seeder = require('./utils/seed');
const responder = require('./utils/responder');
const routes = require('./routes/routes');


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    responder.success(res, "Welcome to event management", 200)
})

app.use('/api', routes);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return responder.error(res, 'Invalid JSON', 400);
    } else {
        return responder.error(res, 'Not Found', 404);
    }
});


seeder.seedAdmins();


mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('connected to db');
})


app.listen(process.env.PORT || 3000, () => {
    console.log("Server started at port 3000");
})