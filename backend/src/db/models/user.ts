import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  urlProfileImage: string;
  friends: string[];
  // refreshToken: string;
}

const userSchema: mongoose.Schema<IUser> = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    urlProfileImage: {
      type: String,
      default: "avatar.png",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

export const UserModel = mongoose.model("User", userSchema);
