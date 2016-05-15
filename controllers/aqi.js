var User = require('../models/user');


exports.getAQI = function(req, res) {
	User.findOne({'username':req.params.username}, function(err, user) {
    	if (err)
      		res.send(err);
    	res.json({longitude: user.workAddress.longitude, latitude: user.workAddress.latitude});
    	var request = require('request');

    	var work_address = user.workAddress.latitude + ',' + user.workAddress.longitude;
    	var home_address = user.homeAddress.latitude + ',' + user.workAddress.longitude;

		request(
			{ 
				url: 'https://maps.googleapis.com/maps/api/directions/json?origin=' + home_address + '&destination=' + work_address +'&key=AIzaSyCcrtrtFrkEz1thqWaEhbC_ku440GF1ops',
				json: true
			}, 
			function (error, response, body) {
    	//Check for error
    	if(error) {
        	return console.log('Error:', error);
    	}

    	//Check for right status code
    	if(response.statusCode !== 200){
        	return console.log('Invalid Status Code Returned:', response.statusCode);
    	}

    	//All is good. Print the body
    	//console.log(body.routes[0].legs[0].steps); // Show the HTML for the Modulus homepage.
   
    	var routes = body.routes;
    	var len = routes[0].legs[0].steps.length;
    	var points = []; 
    	for(var i=0;i<routes[0].legs[0].steps.length; i++) {
    		points.push(routes[0].legs[0].steps[i].start_location);
    	}
    
    	points.push(routes[0].legs[0].steps[len-1].end_location);
    	console.log(points);

    	for(var i=0;i<points.length;i++) 
    	{
    		request(
				{ 
					url: 'http://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude='+points[i].lat+'&longitude=' + points[i].lng + '&distance=25&API_KEY=7C645E62-6EA3-4293-B3EE-A5DD1E59302F',
				json: true
			}, 
			function (error1, response1, body1) {
    		//Check for error
    		if(error1){
        		return console.log('Error:', error1);
    		}

    		//Check for right status code
    		if(response1.statusCode !== 200){
        		return console.log('Invalid Status Code Returned:', response1.statusCode);
    		}

    		
  			// console.log(body1[0]);
   			for(var j=0;j<body1.length;j++)
   			{
    			console.log(body1[j].ParameterName + ': ' + body1[j].AQI);
    		}
    		console.log('\n');
			});   	
    	}

	});
  });
};