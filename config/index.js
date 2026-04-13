import env from "./env.js";

const config = Object.freeze({
	app: {
		port: env.PORT,
		env: env.NODE_ENV,
		isProduction: env.NODE_ENV === "production",
	},
	database: {
		mongoUri: env.MONGO_URI,
	},
	auth: {
		jwtAccessSecret: env.JWT_ACCESS_SECRET,
		jwtRefreshSecret: env.JWT_REFRESH_SECRET,
		accessTokenExp: env.ACCESS_TOKEN_EXP,
		refreshTokenExp: env.REFRESH_TOKEN_EXP,
	},
	redis: {
		url: env.REDIS_URL,
	},
	email: {
		user: env.EMAIL_USER,
		pass: env.EMAIL_PASS,
	},
	oauth: {
		googleClientId: env.GOOGLE_CLIENT_ID,
		googleClientSecret: env.GOOGLE_CLIENT_SECRET,
		frontendUrl: env.FRONTEND_URL,
	},
	logging: {
		level: env.LOG_LEVEL,
		revision: env.GIT_COMMIT,
	},
});

export default config;
