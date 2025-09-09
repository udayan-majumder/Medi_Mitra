export const config = {
  port: process.env.PORT || 5000,
  cors: {
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
};
