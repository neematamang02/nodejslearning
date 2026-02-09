const validate = (schema) => (req, res, next) => {
    try {
        req.body=schema.parse(req.body);
        next();
    } catch (err) {
        return res.status(400).json({
            success: false,
            errors: err.errors.map(e => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }
};
export default validate;