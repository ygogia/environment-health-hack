var User = require('../models/user');

exports.postUser = function(req,res){
	User.findOne({'username':req.body.username},function(err,user){
		if(err) res.send(err);
		if(user) {
			res.json({isSuccess:false,message:'User Already Exists'});
		}
		if(!user){
			var newUser = new User();
			newUser.username = req.body.username;
			newUser.password = req.body.password;
			newUser.name	 = req.body.name;
			newUser.isAllergic= req.body.isAllergic;
			newUser.homeAddress=req.body.homeAddress!=undefined?{
				name :req.body.homeAddress.name,
				latitude:req.body.homeAddress.latitude,
				longitude :req.body.homeAddress.longitude
			}:undefined;
			newUser.workAddress = req.body.workAddress!=undefined?{
				name :req.body.name,
				latitude: req.body.workAddress.latitude,
				longitude:req.body.workAddress.longitude
			}:undefined;
			newUser.created_at = new Date();
			newUser.updated_at = newUser.created_at;

			newUser.save(function(err){
				if(err) res.send(err);
				newUser.password=undefined;
				newUser.isSuccess=true;
				res.json({isSuccess:true,message:'User Created'});
			});
		}
	});
};
exports.getUser = function(req, res) {
  User.findOne({'username':req.params.username}, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
};

exports.updateUser = function(req, res) {
	User.findOne({'username':req.body.username},function(err,user){
    if (err){
      res.send(err);
    }
  if(!user) {
  	res.json({isSuccess:false,message:'Username Does Not Exist'});
  }
 	if(user){
		user.password = req.body.password!=undefined?req.body.password:user.password;
		user.name	 = req.body.name!=undefined?req.body.name:user.name;
		user.isAllergic= req.body.isAllergic!=undefined?req.body.isAllergic:user.isAllergic;
		user.homeAddress = req.body.homeAddress!=undefined?{
			name :req.body.homeAddress.name,
			latitude:req.body.homeAddress.latitude,
			longitude :req.body.homeAddress.longitude
		}:user.homeAddress;
		user.workAddress= req.body.workAddress!=undefined?{
			name :req.body.workAddress.name,
			latitude: req.body.workAddress.latitude,
			longitude:req.body.workAddress.longitude
		}:user.workAddress;
		user.updated_at = new Date();

	    User.update({'username':req.body.username},user,function(err) {
	      if (err)
	        res.send(err);

	      res.json({isSuccess:true,message:'User Updated'});
	    });
	}
	
  });
};
