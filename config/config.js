const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
    mongoUri: process.env.MONGODB_URI || "mongodb://root:example@localhost:27017/",
    // process.env.MONGO_HOST ||
    // 'mongodb://' + (process.env.IP || 'localhost') + ':' +
    // (process.env.MONGO_PORT || '27017') +
    // '/mernproject',
    mongoUser: process.env.MONGODB_USER || "root",
    mongoPass: process.env.MONGODB_PASS || "example",

}
export default config