module.exports = {
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  backendUrl: process.env.BACKEND_URL || "http://localhost:5000",
  webName: process.env.WEB_NAME || "UNICAMP",
  db: {
    mongodb: {
      uri: process.env.MONGODB_URI || "",
    },
  },
  env: process.env.NODE_ENV || "development",

  logtail: {
    apikey: process.env.LOGTAIL_API_KEY || "",
    endpoint: process.env.LOGTAIL_ENDPOINT || "",
  },

  providers: {
    aiProviders: {
      deepseek: {
        apiKey: process.env.DEEPSEEK_API_KEY || "",
        baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1",
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY || "",
        baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
      },
      brightdata: {
        apiKey: process.env.BRIGHTDATA_API_KEY || "",
        baseUrl:
          process.env.BRIGHTDATA_BASE_URL || "https://api.brightdata.com",
      },
    },
    
    email: {
      service: process.env.EMAIL_SERVICE || "gmail",
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE || false,
      username: process.env.EMAIL_USERNAME || "your_email@gmail.com",
      password: process.env.EMAIL_PASSWORD || "your_email_password",
    },
  },
  defaultProvider: {
    ai: process.env.DEFAULT_AI_PROVIDER || "auto",
  },
};
