import * as mongoose from "mongoose";

export interface IPost extends mongoose.Document{
    title: string;
    content: string;
    imagePath: string;
    creator: string;
}

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    imagePath: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

const Post = mongoose.model<IPost>("Post", postSchema)
export default Post;