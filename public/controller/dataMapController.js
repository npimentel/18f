openFDA.controller('DataMapCtrl', [ '$scope', 'FetchOpenFDASrvc', '$routeParams',
		function($scope , FetchOpenFDASrvc, $routeParams) {

	var mapDataAll = null;
	var orderedDataAll = null
	var titleAll = null;
	var isTableTop = false;
	var top = null;
	var bottom = null;
	$scope.changeTopStates = function(){
		isTableTop = !isTableTop;
		
		if(isTableTop){
			
			if(!top)
				top = $scope.orderedData.slice(0,10);
			
			$scope.glyPos = "down";
			$scope.tableTopTitle = "Top ";
			$scope.orderedDataTable = top;
		}
		else{
			
			if(!bottom)
				bottom = $scope.orderedData.reverse().slice(0,10);
			
			$scope.glyPos = "up";
			$scope.tableTopTitle = "Bottom ";
			$scope.orderedDataTable = bottom;
		}
	};
	
	$scope.selectedDatasetDrugs = true;
	$scope.changeMap = function(dataset){
		isTableTop = false;
		$scope.map.data = mapDataAll[dataset];
		$scope.orderedData = orderedDataAll[dataset];
		$scope.changeTopStates();
		$scope.title = titleAll[dataset];
		
		switch (dataset) {
		case "Drugs":
			$scope.selectedDatasetDrugs = true;
			$scope.selectedDatasetDevices = false;
			$scope.selectedDatasetFood = false;
			break;
		case "Devices":
			$scope.selectedDatasetDrugs = false;
			$scope.selectedDatasetDevices = true;
			$scope.selectedDatasetFood = false;
			break;
		case "Food":
			$scope.selectedDatasetDrugs = false;
			$scope.selectedDatasetDevices = false;
			$scope.selectedDatasetFood = true;
			break;
		default:
			break;
		}
	};
	
	
	FetchOpenFDASrvc.get({appId:$routeParams.appId, modId: $routeParams.modId, fnId:$routeParams.fnId, qId:"mapRps"},
			function success(response) {
				
				
				if(!response){
					console.warn("No data found for MapId="+$routeParams);
					return;
				}
				

				console.log("Map Success:" + JSON.stringify(response));
				mapDataAll = response.mapData;
				orderedDataAll = response.orderedData;
				titleAll = response.mapDataTitle;
				
				$scope.changeMap("Drugs");
				
				},
			function error(errorResponse) {
				console.log("Error:" + JSON.stringify(errorResponse));					
				
				$scope.error.push(errorResponse.data);
				});
	
	$scope.map = {
			  scope: 'usa',
			  options: {
				  staticGeoData: true,
				  labels: true,
				  labelSize: 10,
			    width: 900,
			    legendHeight: 60 // optionally set the padding for the legend
			  },
			  geographyConfig: {
			    highlighBorderColor: '#EAA9A8',
			    highlighBorderWidth: 2
			  },
			  fills: {
				"VH":'#2a4644',
			    "H": '#558C89',
			    "M": '#74AFAD',
			    "L": '#D5E7E6',
			    'defaultFill': '#ECECEA'
			  },
			  data: {},
			  geographyConfig: {
		            popupTemplate: function(geo, data) {
		            	if(!data)
		            		return ['<div class="hoverinfo"><strong>',
			                        'No Known Recalls for ' + geo.properties.name
			                       ].join('');
		            	
		                return ['<div class="hoverinfo"><strong>',
		                        'Number of Recalls in ' + geo.properties.name,
		                        ': ' + data.count,
		                        '</strong></div>'].join('');
		            }
		        }
			}
			
	
	$scope.mapPlugins = {
			  bubbles: null,
			  customLegend: function(layer, data, options) {
			    var html = ['<ul class="list-inline" style="padding-left:40px">'],
			        label = '';
			    for (var fillKey in this.options.fills) {
			    	switch (true) {
			    	case fillKey === "VH": label = ">400"; break;
					case fillKey === "H": label = ">300";  break;
					case fillKey === "M": label = ">200";  break;
					case fillKey === "L": label = ">0 &nbsp;&nbsp;&nbsp;"; 	break;
					case fillKey === "defaultFill" : label = "unknown"; break;
					default:
						break;
					}
			      html.push('<li class="key" ',
			                  'style="border-top: 10px solid ' + this.options.fills[fillKey] + '">',
			                  label,
			                  '</li>');
			    }
			    html.push('</ul>');
			    d3.select(this.options.element).append('div')
			      .attr('class', 'datamaps-legend')
			      .html(html.join(''));
			  }
			};
			
	$scope.mapPluginData = { bubbles: [{}]};
	
	
	
	//GRAPH
	
$scope.title2 = "Drug Recalls per Year for ..."
	
	$scope.config2 = {
			  title: 'Drug Recalls Per Year for ...'  , // chart title. If this is false, no title element will be created.
			  tooltips: true,
			  labels: false, // labels on data points
			  // exposed events
			  mouseover: function() {},
			  mouseout: function() {},
			  click: function() {},
			  // legend config
			  legend: {
			    display: true, // can be either 'left' or 'right'.
			    position: 'right',
			    // you can have html in series name
			    htmlEnabled: false
			  },
			  // override this array if you're not happy with default colors
			  colors: ['#558C89', '#96281B', '#4DAF7C'],
			  innerRadius: 0, // Only on pie Charts
			  lineLegend: 'lineEnd', // Only on line Charts
			  lineCurveType: 'cardinal', // change this as per d3 guidelines to avoid smoothline
			  isAnimate: true, // run animations while rendering chart
			  yAxisTickFormat: 's', //refer tickFormats in d3 to edit this value
			  xAxisMaxTicks: 7, // Optional: maximum number of X axis ticks to show if data points exceed this number
			  yAxisTickFormat: 's', // refer tickFormats in d3 to edit this value,
			  yAxisLabel: '# of Recalls',
			  waitForHeightAndWidth: true // if true, it will not throw an error when the height or width are not defined (e.g. while creating a modal form), and it will be keep watching for valid height and width values
			};
	
	$scope.acData = {
		    series: ['Drugs', 'Devices', 'Food'],
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
		  };
	
	$scope.drillDownToYear = function(geography){
		var stateName = geography.properties.name;
		var stateCode = geography.id;
		console.log(stateName + " : " +  stateCode);
		
		FetchOpenFDASrvc.get({appId:$routeParams.appId, modId: $routeParams.modId, fnId:$routeParams.fnId, qId:"graphRpy"},
				function success(response) {
					
					
					if(!response){
						console.warn("No data found for graph="+$routeParams);
						return;
					}
					

					console.log("Graph per Year Success:" + JSON.stringify(response));
					
					
					},
				function error(errorResponse) {
					console.log("Error:" + JSON.stringify(errorResponse));				
					$scope.error.push(errorResponse.data);
					});
	};

		} ]);