
const mongoose = require("mongoose");

mongoose.connect(process.env.URL, {

    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true
}).then(()=> console.log('Connection established successfully')
).catch(err => console.log(err)
);

