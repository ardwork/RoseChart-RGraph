////////////////////////////////////////////////////
//Version: 	1.0
//Author:  	Richard Byard
//Usage:	Rose chart using RGraph chart library.
//Date:		22 March 2017
////////////////////////////////////////////////////
define( [
        // Load the properties.js file using requireJS
        // Note: If you load .js files, omit the file extension, otherwhise
        // requireJS will not load it correctly 
		'jquery'
		,'qlik'
        ,'./properties/properties'
		,'./properties/initialProperties'
		,'./libraries/RGraph.common.core'
		,'./libraries/RGraph.common.dynamic'
		,'./libraries/RGraph.common.tooltips'
		,'./libraries/RGraph.common.resizing'
		,'./libraries/RGraph.common.key'
		,'./libraries/RGraph.rose' 
		//,'css!./css/BiPolarChart-RGraph.css'
		
    ],
	
    function ( $, qlik, props, initProps, styleSheet) {
        'use strict';	
		//Inject Stylesheet into header of current document
		//$( '<style>' ).html(styleSheet).appendTo( 'head' );
        return {
			//Define the properties tab - these are defined in the properties.js file
             definition: props,
			
			//Define the data properties - how many rows and columns to load.
			 initialProperties: initProps,
			
			//Not sure if there are any other options available here.
			 snapshot: {cantTakeSnapshot: true
			 },

			//paint function creates the visualisation. - this one makes a very basic table with no selections etc.
			paint:  function ($element, layout) {
			//debug propose only, please comment
			//console.log('Data returned: ', layout.qHyperCube);
			
			var app = qlik.currApp(this);
			
			// Get the Number of Dimensions and Measures on the hypercube
			var numberOfDimensions = layout.qHyperCube.qDimensionInfo.length;
			//console.log(numberOfDimensions);
			var numberOfMeasures = layout.qHyperCube.qMeasureInfo.length;
			//console.log(numberOfMeasures);
			
		
			
			var dimensionName = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
			//console.log(dimensionName);
			var measure1Name = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;

			
			// Get the number of fields of a dimension
			var numberOfDimValues = layout.qHyperCube.qDataPages[0].qMatrix.length;
			//console.log(numberOfDimValues);
			
			// Get the values of the dimension
			var dimArray =[];
			var dataArray =[];

			for (var i=0; i<numberOfDimValues;i++){
					dimArray[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][0].qText;
					dataArray[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][1].qText;
				}
	
				
			//console.log(dataArray);
			
			
			
			var valueTooltips = [];
			//var colors   = [];
			
			for (var i=0; i<dimArray.length; i+=1) {valueTooltips.push(measure1Name + ': ' + String(dimArray[i]) + ': ' + String(dataArray[i])) /*; colors.push('blue')*/ ;}
			

			//var dimensionLength=layout.qHyperCube.qDataPages[0].qMatrix.length;
			
			var chart;
			
			
			
			
 			//setup Chart Variant
			
			switch(layout.chartEffect) {
				case "2d": 
					var chartVariant = ""; 
					var chartShadow = layout.shadow;
					break;
				case "3d": 
					var chartVariant = "stacked3d"; 
					var chartShadow = false;
					break;
				default: 
					var chartVariant = ""; 
					var chartShadow = layout.shadow;
					break;
			} 
			
			

			
			// manage color selections
			var palette = [
									"#b0afae",
									"#7b7a78",
									"#545352",
									"#4477aa",
									"#7db8da",
									"#b6d7ea",
									"#46c646",
									"#f93f17",
									"#ffcf02",
									"#276e27",
									"#ffffff",
									"#000000"
								];
			
			// to create a gradient color effect from white to selected color.
			switch(layout.colorEffect) {
				case false: var fillColor = palette[layout.chartColor];	break;
				case true: 
					var str1 = 'Gradient(';
					var str2 = '#fff:';
					var str3 = ')';
					var str0 = palette[layout.chartColor];
					var fillColor = str1.concat(str2,str0,str3); break;
			}		
								
			//console.log(fillColor);

			
				
			var html = '';
			
			var width = $element.width(), height = $element.height();
			// add canvas for chart
			html+='<div id="canvas-wrapper"><canvas id="cvs" width="'+width+'" height="'+height+'">[No canvas support]</canvas></div>';
			
			$element.html(html);
			
			
			
			
						
			/*try {
				chart.Clear();
			}
			catch(err) {
			}		
			*/
			RGraph.Reset(document.getElementById('cvs'));
			
						
		
			
			
			chart = new RGraph.Rose({
						id: 'cvs',
						data: dataArray,
						options: {
							gutterLeft: 50,
							gutterRight: 50,
							strokestyle: 'rgba(0,0,0,0)',
							colors: [fillColor],
							margin: 7,
							variant: chartVariant,
							variantThreedDepth: 10,
							labelsAxes: 'x',
							scaleColor: 'rgba(0,0,0,0)',
							textSize: '10',
							textColor: '#595959',
							titlecolor: '#595959',
							labels: dimArray,
							textAccessible: false,
							shadow: chartShadow,
							shadowOffsetx: 5,
							shadowOffsety: 5,
							shadowColor: '#aaa',
							tooltips: valueTooltips,
							tooltipsEvent: 'onmousemove',
							eventsClick: onClickDimension
						}
					}).draw();
			
			
			
			
			
			
			// On Click actions
			function onClickDimension (e, shape)
			{
				var index = shape.index;
				app.field(dimensionName).toggleSelect(dimArray[index], true);
			}	
			
			// On Mouse Over actions
			function onMouseMove (e, shape)
			{
				var index = shape.index;
				//self.backendApi.selectValues(0, dimArray[index], true);
				app.field(dimensionName).toggleSelect(dimArray[index], true);
			}					 
			
			//needed for export
			return qlik.Promise.resolve();
		}	 
			

	}; 

} );

