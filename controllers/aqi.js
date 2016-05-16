var User = require('../models/user');

exports.getAQI = function(req, res) {
	User.findOne({'username':req.params.username}, function(err, user) {
    	if (err)
      		res.send(err);
    	//res.json({longitude: user.workAddress.longitude, latitude: user.workAddress.latitude});
    	var request = require('request');

    	var work_address = user.workAddress.latitude + ',' + user.workAddress.longitude;
    	var home_address = user.homeAddress.latitude + ',' + user.workAddress.longitude;

    	var work_temp = 0, home_temp = 0, temperature=0;
    	var final_score = {'O3': 0.0, 'PM2.5': 0.0, 'PM10': 0.0};
    	var count = {'O3': 0.0, 'PM2.5': 0.0, 'PM10': 0.0};
    	var weight = {'O3': 0.1, 'PM2.5': 0.8, 'PM10': 0.1};
    	var score = 0;
    	// get temperature of source address

    	request(
			{ 
				url: 'http://api.openweathermap.org/data/2.5/weather?lat='+user.homeAddress.latitude+'&lon='+user.homeAddress.longitude+'&appid=8ed0caccaddf48878b4e23d2d3b11bb8',
				json: true
			}, 
			function (error, response, body) {
    		//Check for error
    		if(error){
        		return console.log('Error:', error);
    		}

    		//Check for right status code
    		if(response.statusCode !== 200){
        		return console.log('Invalid Status Code Returned:', response.statusCode);
    		}

    		
  			 console.log(body['main']['temp']);
  			 home_temp = body['main']['temp'];
  			request(
				{ 
					url: 'http://api.openweathermap.org/data/2.5/weather?lat='+user.workAddress.latitude+'&lon='+user.workAddress.longitude+'&appid=8ed0caccaddf48878b4e23d2d3b11bb8',
					json: true
				}, 
				function (error, response, body) {
    			//Check for error
    			if(error){
        			return console.log('Error:', error);
    			}

    			//Check for right status code
    			if(response.statusCode !== 200){
        			return console.log('Invalid Status Code Returned:', response.statusCode);
    			}

    		
  			 	console.log(body['main']['temp']);
  			 	work_temp = body['main']['temp'];
  			 	console.log("Work and Home" + work_temp + ", " + home_temp);
   				temperature = (work_temp + home_temp)/2.0;
   				console.log("TEMP: ", temperature);
    			console.log('\n');

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
   
			    	//var routes = body.routes;
    				//var len = routes[0].legs[0].steps.length;
    				var points = [];
    				points.push({lat: user.homeAddress.latitude, lng: user.homeAddress.longitude}); 
    				points.push({lat: user.workAddress.latitude, lng: user.workAddress.longitude}); 
    				//for(var i=0;i<routes[0].legs[0].steps.length; i++) {
    			//		points.push(routes[0].legs[0].steps[i].start_location);
    			//	}
    
    				//points.push(routes[0].legs[0].steps[len-1].end_location);
    				console.log(points);

    				var no_runs = 0;
    				for(var i=0;i<points.length;i++) 
    				{
    					(function(index, total_points) {
    					request(
						{
							url: 'http://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude='+points[i].lat+'&longitude=' + points[i].lng + '&distance=50&API_KEY=7C645E62-6EA3-4293-B3EE-A5DD1E59302F',
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
    						//console.log("POINTS: ", i, points);
    						points[0]['temperature'] = home_temp;
    							
    						points[1]['temperature'] = work_temp;
    							
    						points[index]['score'] = 0;
   							for(var j=0;j<body1.length;j++)
   							{
    							console.log(body1[j].ParameterName + ': ' + body1[j].AQI);
    							points[index][body1[j].ParameterName] = body1[j].AQI;
    							points[index]['score'] += weight[body1[j].ParameterName]*(500-body1[j]['AQI']);
    							final_score[body1[j].ParameterName] += body1[j]['AQI'];
    							count[body1[j].ParameterName] += 1.0;
    						}
    						points[index]['score'] = points[index]['score']/50;
    						if(points[index]['O3'] == undefined || points[index]['PM10'] == undefined || points[index]['PM2.5'] == undefined)
    							points[index]['score'] = 0;
    						console.log('\n');
    						no_runs++;
    						if(no_runs == total_points)
    						{
    							for(var category in final_score) { 
    								final_score[category] /= count[category];
    								final_score[category] = 500 - final_score[category];
    								score += final_score[category];
    							}
    							score = score/3.0;
    							score = score/50;
    							console.log(final_score);
    							res.json({points: points, temperature: temperature, score: score});
    						}
						});
						})(i, points.length);   	
    				}
    				//res.json({points: points});

				});
  			});
		});
		console.log('\n');
	});
};

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});