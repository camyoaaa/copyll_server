const mongoose = require("mongoose");
const DB_URL = "mongodb://localhost:27017/kdd";

//mongoose配置
const MongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

module.exports = new Promise((resolve, reject) => {
    try {
        mongoose.connect(DB_URL, MongooseConfig);
        // mongoose.set('useFindAndModify', false);
        mongoose.connection.on("connected", function () {
            console.log("********************** mongoose connect success **********************");
            resolve();
        });
    } catch (error) {
        reject(error)
    }

});