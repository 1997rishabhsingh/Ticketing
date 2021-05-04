import { Schema, model, Model, Document } from "mongoose";
import { Password } from "../services/password";

// inerface to define structure to create new User

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

interface UserDocument extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      versionKey: false, // not include __v (could also be done via delete ret.__v)
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret._id;
        delete ret.password;

        return ret;
      }
    }
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = model<UserDocument, UserModel>("User", userSchema);

export { User };
