import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  if(!password) return false;
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  if(!plainPassword || !hashPassword) return false;
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const isPasswordSame = (password, confirmPassword) => {
  return password === confirmPassword;
}