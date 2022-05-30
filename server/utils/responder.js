const responder = {
    success: (res, data, code) => {
        res.status(code ? code : 200).json({
            success: true,
            data: data
        });
    },
    error: (res, err, code) => {
        res.status(code ? code : 500).json({
            success: false,
            error: err
        });
    }
}


module.exports = responder;