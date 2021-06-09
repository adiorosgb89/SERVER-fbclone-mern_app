const Post = require('../models/post-schema')
const {cloudinary} = require('../cloudinary');
const User = require('../models/user-schema')


module.exports.createPost = async (req, res) => {
  try{
    const {description, picture, user} = req.body
    const currentUser = await User.findById(JSON.parse(user)._id)
    
    const post = new Post({description})
    if(picture){
      const uploadedPic = await cloudinary.uploader.upload(picture,{folder:"fbapp", allowed_formats:['jpeg', 'png', 'jpg']});
      post.picture= {
        url: uploadedPic.url,
        public_id: uploadedPic.public_id
      }
    }
    post.author = currentUser;
    
    await post.save()
    res.send(post)
  } catch(err) {
    console.error(err)
  }
    
}

module.exports.showAllPosts = async(req, res) => {
  try{
    const posts = await Post.find().populate("author")
    res.send(posts)
  } catch(err){
    console.error(err)
}
}

// module.exports.showSelectedPost = async(req, res) => {
//     const post = await Post.findById(req.params.id)
//     console.log(post)

// }

module.exports.updateSelectedPost = async(req, res) => {
  try{

    let post;
    if(req.body.description.length > 0){
       post = await Post.findByIdAndUpdate(req.params.id, {description:req.body.description})
      
    } else {
       post = await Post.findById(req.params.id)
      
    }
    
  
  if(post.picture.public_id && post.picture.url !== req.body.picture){
             
     await cloudinary.uploader.destroy(post.picture.public_id)
     }

     if(req.body.picture.length > 0 && req.body.picture !== post.picture.url){
     const uploadedPic = await cloudinary.uploader.upload(req.body.picture,{folder:"fbapp", allowed_formats:['jpeg', 'png', 'jpg']});

     post.picture = {
      url : uploadedPic.url,
      public_id: uploadedPic.public_id
     }
    }

    if(req.body.description.length == 0 && req.body.picture == 0){
      await Post.findByIdAndDelete(req.params.id)
    } else {
      await post.save()
    }
    
    res.status(200).end()
  } catch(err){
    console.error(err)
}

}

module.exports.deletePost = async(req, res) => {
  try{
    const post = await Post.findById(req.params.id)
    if(post.picture){
      cloudinary.uploader.destroy(post.picture.public_id)
    }
    await Post.findByIdAndDelete(req.params.id)
    res.status(200).end()
  } catch(err){
    console.error(err)
}
}