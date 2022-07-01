const checkAuthStatus = (status, path) => (
    (req, res, next) => {
        if(req.isAuthenticated() === status) return next();
        return res.redirect(path);
    }
);
module.exports = {checkAuthStatus};
