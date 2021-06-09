// https://flaviocopes.com/express-cookies/

const User = require('../models/user-schema')
const Post = require('../models/post-schema')
const {cloudinary} = require('../cloudinary');



module.exports.registerUser = async (req,res, next) =>{
    
    try {
        const {name, email, username, password } = req.body
        const user = new User({name, email, username, password})
        user.profile_pic = {
            url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
        } 
        
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(err) return next(err)
            res.send(user)
        })
    } catch(err){
        console.error(err)
    }
}

module.exports.loginUser =  async (req, res) => {
    try{
    const reqData = req.body
    const user = await User.findOne({username : reqData.username})
     
    res.send(user)
    } catch(err){
        console.error(err)
    }
}

module.exports.logoutUser = (req, res) => {
    try{
        res.status(200).clearCookie('session').end()
    } catch(err){
        console.error(err)
    }
    
}

module.exports.showCurrentUser = async (req, res) => {
    try{
    const user = await User.findById(req.user._id)
    res.send(user)
    } catch(err){
        console.error(err)
    }
}

module.exports.updateUser =  async(req, res) => {
    try{
     const reqData = req.body;
    
       const currentUser = req.params
       const user = await User.findByIdAndUpdate(currentUser.id, {name: req.body.name, email:req.body.email}, {new:true})
     if(reqData.picture != 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'){ 
            
     if(user.profile_pic.public_id){
             
        await cloudinary.uploader.destroy(user.profile_pic.public_id)
         }
        const uploadedPic = await cloudinary.uploader.upload(reqData.picture,{folder:"fbapp", allowed_formats:['jpeg', 'png', 'jpg']});

         
    user.profile_pic = {
        url : uploadedPic.url,
        public_id: uploadedPic.public_id
    
    }
    }
    
    await user.save()
    res.send(user);
} catch(err){
    console.error(err)
}
    
}

module.exports.deleteUser = async (req, res) => {
    try{
    const currentUser = req.params
    const posts = await Post.find()
    if(posts){
        for(let post of posts){
            if(post.author.equals(currentUser.id)){
                
                if(post.picture.public_id){
                    
                    await cloudinary.uploader.destroy(post.picture.public_id)
                }
                  await Post.findByIdAndDelete(post._id)
            }
        }
    }
     await User.findByIdAndDelete(currentUser.id)
     res.status(200).end()
    } catch(err){
        console.error(err)
    }
}