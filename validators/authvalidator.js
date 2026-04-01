import z, { email } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required").transform(val => val.trim()),
    email: z.string().email("Invalid email address").transform(val => val.trim().toLowerCase()),
    password: z.string().min(8, "Password must be atleast 8 letter").max(20, "Password too long").transform(val => val.trim()),
});

export const otpSchema = z.object({
    email: z.string().email("Invalid email address").transform(val => val.trim().toLowerCase()),
    otp: z.string().min(1, "OTP is required").transform(val => val.trim()),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address").transform(val => val.trim().toLowerCase()),
    password: z.string().min(1, "Password is required").transform(val => val.trim()),
});