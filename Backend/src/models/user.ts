import * as mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

export interface IUser extends mongoose.Document{
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);//package that throws an error if unique requirement is not met.

const User = mongoose.model<IUser>("User", userSchema)
export default User;