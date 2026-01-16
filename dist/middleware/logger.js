const logger = (req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
};
export default logger;
