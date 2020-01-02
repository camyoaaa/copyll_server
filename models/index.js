const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = require("./users");
const TaskSchema = require("./tasks");
const ScoreSchema = require("./score");

const DB_URL = "mongodb://localhost:27017/kdd";
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set("useFindAndModify", false);
mongoose.connection.on("connected", function() {
    console.log("********************** mongoose connect success **********************");
});

const models = {
    Users: userSchema,
    Tasks: TaskSchema,
    Scores: ScoreSchema
};

//注册所有的表
for (let m in models) {
    mongoose.model(m, new Schema(models[m]), m);
}

module.exports = {
    getModel: function(name) {
        return mongoose.model(name);
    }
};
