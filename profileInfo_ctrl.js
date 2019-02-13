var users = require('../models/users.js'),
profile_info = require('../models/profile_info.js'),

//GETTING PROFILE INFORMATION  
module.exports.getProfileInfo = function(req,res)
{
  var uname = new RegExp('^'+req.body.uname+'+@', 'i')
  users.findOne({ "email": { "$regex": uname, "$options": "m" } }, function (err, user_doc) {
    if (!err && user_doc) {
      profile_info.findOne({user_id:user_doc._id}).populate('user_id').populate('title').exec(function (err, get_doc) {
        if(!err && get_doc != null)
        {
           res.json({
              status:200,
              message:'profile information',
              data:get_doc,
           });  
        }
        else
        {
           res.json({
              status:401,
              message:'Something went wrong',
           });
        }
      });
    } else {
      res.json({
        status:401,
        message:'User not found'
      });
    }
  })
} 
//SAVING PROFILE INFORMATION
module.exports.profile_save = function(req,res)
{
 
  profile_info.findOne({user_id:req.headers.userid},function(err,doc){
      if(!err && doc != null)
      {
        profile_info.findOneAndUpdate({ user_id:req.headers.userid },{ $set: {description: req.headers.desc,current_activity: req.headers.current_activity}},function(err,pro_doc1){
          if(!err && pro_doc1 != null )
          {
            res.json({
              status:200,
              message:'profile updated successfully',
              data:pro_doc1,
            });
          }
          else
          {
            res.json({
              status:401,
              message:'profile not updated',
            });
          }
        });
      }
      else
      {
        res.json({
          status:401,
          message:'sorry user not found'
        });
      }    
  });
} 