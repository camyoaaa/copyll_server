const Auth = function(req, res, next) {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", req.url, req.session);
    if (req.url != "/mylogin.html" && req.url != "/mylogin" && req.session.password != "008008") {
        console.log("*******************", req.session.password);
        res.redirect("/mylogin.html");
        return;
    }
    next();
};
module.exports = Auth;
