import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    verificationExpiresAt: { type: Date, required: false },
    refreshToken: { type: String, default: null }
}, { timestamps: true })

export const UserModel = model("User", userSchema)
