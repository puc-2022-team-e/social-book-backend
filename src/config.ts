const config = {
	port: process.env.PORT || 8077,
	serverMod: process.env.NODE_ENV || 'development',
	mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017'
}

export default config;