exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    next();
}

exports.checkCsrfError = (err, req, res, next) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
        return res.status(403).send('Erro: CSRF Token inválido');
    }
    next(err);
};

exports.csrfMiddleware = (req,res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
}