const express = require("express")
const {Url} = require('./db')
const app = express();
const signup = require("./controllers/Signup");
const signin = require('./controllers/Signin');
const user = require("./controllers/User");
const userPost = require("./controllers/Post/UserPost");
const createPost = require("./controllers/Post/CreatePost");
const singlePost = require("./controllers/Post/SinglePost");
const likeCount = require("./controllers/Post/LikeCount")
const comment = require('./controllers/Post/Comment')
const allPost = require('./controllers/Post/AllPost');
const followDataAndList = require("./controllers/FollowerListAndData");
const  Superchat  = require("./controllers/Post/Superchat");
// const superchat = require("./controllers/Post/Superchat")
const cors  = require("cors");


app.use(cors());

require('dotenv').config();
app.use(express.json());


const router = express.Router();
const PORT = process.env.PORT || 3000;

// console.log(Url);

app.use("/signup",signup);
app.use('/signin',signin);
app.use('/user',user);
app.use('/allPost',allPost);
app.use('/createPost',createPost);
app.use('/user-posts', userPost);
app.use('/',singlePost)
app.use('/', likeCount);
app.use('/',comment);
app.use('/',followDataAndList);
app.use('/',Superchat)


app.listen(PORT, ()=>{
    console.log(`Server started at ${PORT}`);
    
})


