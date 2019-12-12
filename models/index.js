const mongoose = require("mongoose");
const {
    Schema
} = mongoose;
const userSchema = require('./users');
const TaskSchema = require('./tasks');

const DB_URL = "mongodb://localhost:27017/kdd";
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on("connected", function () {
    console.log("********************** mongoose connect success **********************");
});


const models = {
    User: userSchema,
    Task: TaskSchema
}

//注册所有的表
for (let m in models) {
    mongoose.model(m, new Schema(models[m]));
}

module.exports = {
    getModel: function (name) {
        return mongoose.model(name);
    }
};