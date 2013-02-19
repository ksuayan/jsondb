module.exports = {
    app : {
        host : "http://localhost",
        port : process.env.PORT || 80,
        mongoURL : process.env.MONGOHQ_URL || "mongodb://localhost/itunes",
        name : 'JsonDB',
        author : 'Kyo Suayan',
        description : 'JsonDB is a sandbox application.',
        keywords : 'jsondb, mongodb, mongoose'
    }
};
