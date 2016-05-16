
exports.getLatLngAQI = function(req, res) {
	//if (err)
      //		res.send(err);
	var lat = req.body.lat;
	var lng = req.body.lon;
    var request = require('request');
    request(
		{ 
			url: 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&appid=8ed0caccaddf48878b4e23d2d3b11bb8',
			json: true
		}, 
		function (error, response, body) {
			if(error){
        		return console.log('Error:', error);
    		}

    		//Check for right status code
    		if(response.statusCode !== 200){
        		return console.log('Invalid Status Code Returned:', response.statusCode);
    		}

    		console.log(body);
    		temperature = body['main']['temp'];
    		var weight = {'O3': 0.1, 'PM2.5': 0.8, 'PM10': 0.1};

    		request(
				{
					url: 'http://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude='+lat+'&longitude=' + lng + '&distance=50&API_KEY=7C645E62-6EA3-4293-B3EE-A5DD1E59302F',
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
    				var aqi_data = {};
    				var score = 0;
    				for (var i=0;i<body1.length;i++)
    				{
    					aqi_data[body1[i].ParameterName] = body1[i].AQI;
    					score += weight[body1[i].ParameterName]*(500-body1[i].AQI);
    				}
    				score /= 50.0;
    				aqi_data['temperature'] = temperature;
    				aqi_data['score'] = Math.round(score * 100) / 100;
    				aqi_data['lat'] = lat;
    				aqi_data['lng'] = lng;
    				res.json(aqi_data);
    			});
    	});
}

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});