import { User } from "../models/index.js";

export const defaultUser = { id: null };

export async function ensureDefaultUser() {
  const [user] = await User.findOrCreate({
    where: { email: "dev@wecamp.local" },
    defaults: {
      email: "dev@wecamp.local",
      passwordHash: "dev-placeholder",
      displayName: "Dev User",
    },
  });
  defaultUser.id = user.id;
  console.log(`[defaultUser] Using default user id: ${user.id}`);
  return user;
}
