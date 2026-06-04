export function getJwtSecret() {
  return process.env.JWT_SECRET || "development-secret-key";
}

