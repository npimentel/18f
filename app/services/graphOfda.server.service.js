'use strict'

var queryService = require("./queryOfda.server.service");
var config = require('./../../config/config');

module.exports.graphRpy = function (params, callback){
	var response = {};
	var graphEntries = {};
	var datasets = [{name:'drug', displayName:"Drugs"},{name:'device', displayName:"Devices"},{name:'food', displayName:"Food"}];

	var graphEntries = {};
	var completeQueries = 0;
	var state = config.states[params.state];
	var it = 0;

	datasets.forEach(function(dataset){
		var query = {
			    queryId: 1,
			    noun:dataset.name,
			    endpoint:'enforcement',
			    params:{
			      search:'(distribution_pattern:"'+params.state+'"+distribution_pattern:"'+state+'")+AND+(report_date:[2005-01-01+TO+2100-01-01])',
			      count:'report_date',
			      limit:1000, //if set to 0, it will default to 100 results
			      skip:0
			    }
			  };

//				console.log(query);

		queryService.getData(query,function(error,data, query){
			completeQueries++;

			if(error){
				console.error("ERROR: ", JSON.stringify(error), JSON.stringify(query));
			}

			if(data){
				data = JSON.parse(data);
			}else{
				data = {};
			}

			if(!data.results){
				console.log("No Results for: " + JSON.stringify(query));
				data.results = [];
			}
			console.log("SIZE:" + data.results.length);
			//console.log("RAW DATA: ", data);

			
			var yearTotals = {};
			data.results.forEach(function(entry){
				var currentYear = entry.time.substring(0,4);
			
				if(yearTotals[currentYear])
					yearTotals[currentYear] += entry.count;
				else
					yearTotals[currentYear] = entry.count;
				
			});
			
			for(var year in yearTotals){
				
				if(!graphEntries[year] )
					graphEntries[year] = [];
				
				while(graphEntries[year].length < it)
					graphEntries[year].push(0);
				
				graphEntries[year].push(yearTotals[year]);
			}

			it++;
			//response.temp[dataset] = yearTotals;
			if (completeQueries == datasets.length){
				console.log(graphEntries);
				var graphData = [];
			
				for(var entry in graphEntries){
					graphData.push({x:entry, y: graphEntries[entry]});
				}
				
				console.log(JSON.stringify(graphData));
				response.graph = {series: getDisplayNames(), data: graphData};


				/*response.graphData = {
					    series: getDisplayNames(),
					    data: [{
					      x: "2000",
					      y: [100, 500, 0]
					    }, {
					      x: "2001",
					      y: [300, 100, 100]
					    }, {
					      x: "2002",
					      y: [351]
					    }, {
					      x: "2003",
					      y: [54, 0, 879]
					    }]
					  };*/
				console.log('GRAPH RESPONSE: ' + JSON.stringify(response));
				callback(null, response);
			}


		});


	});


	function getDisplayNames(){
		var displayNames = [];
		datasets.forEach(function(dataset){
			displayNames.push(dataset.displayName);
		});

		return displayNames;
	}
};
