var nGraphs = 4,
	nSeries = 5,
	nStringLength = 5,
	nLaps = 0;
	nLapsRunMax = 10;
	svgHeight = 250;
	radius = 5;
	maxLaps = 30;
	duration = 1000;
	svgWidth = 1200;

//
// object {graphs:[],otherstats:[],a:[]}
// graphs:[ {title:"",
//			series:[]}]
// series:[{data:[[x0,y0],[x1,y1],...,[xn,yn]],
//			color:"#random",
//			marker:"circle",
//			name:""}]
//
//

var payload = initData(nGraphs,nSeries);
var newLaps;




//appendData(payload);
//redraw();
//setInterval(function(){
//	appendData(payload,Math.round(Math.random()*nLapsRunMax+1));
//	redraw();
//},2000)


appendData(payload,5);

var x = d3.scale.linear()
		.domain([-1, Math.max(2,nLaps)])
		.range(["0", svgWidth]);

var lineFunction = function(xscale){return d3.svg.line().x(function(d){return xscale(d[0]);}).y(function(d){return 200*d[1];}).interpolate('cardinal');};
var lf = lineFunction(x);


redraw();


setInterval(function(){
	newLaps = Math.round(Math.random()*nLapsRunMax+1);
	//newLaps = newLaps + nLaps - maxLaps < 0 ?  newLaps : maxLaps - nLaps;
	newLaps = Math.min(maxLaps-nLaps, newLaps);
	appendData(payload,newLaps);
	redraw();
	
},duration);


function redraw(){
	//This is the meat of the thing!




	var graphs = d3.select("#graphList").selectAll("svg.graph").data(payload.graphs,function(d){return d.title});
	graphs.enter().append("svg:svg").attr("class","graph").attr('height',svgHeight).attr('width',svgWidth);
	graphs.exit().remove();

	var series = graphs.selectAll('g').data(function(d){return d.series;},function(d){return d.name;});
	series.enter().append('g');
	series.exit().remove();

	var paths = graphs.selectAll('path').data(function(d){return d.series;},
		function(d){return d.name;});
	paths.enter().append('path');
	paths.exit().remove();

	paths.attr('stroke',function(d){return d.color;})
		 .attr('stroke-width',2)
		 .attr('fill','none')
		 .transition().duration(0.5*duration).attr('d',function(d){
		return lf(d.data);
	});



	var lines = series.selectAll('circle').data(function(d){return d.data;},function(d){return d[0];});
	lines.enter().append('circle').attr('cx',function(d){return x(d[0]);});

	x = d3.scale.linear()
		.domain([-1, nLaps])
		.range(["0", svgWidth]);

	lf = lineFunction(x);
	paths.transition().duration(0.5*duration).attr('d',function(d){return lf(d.data);});

	lines.attr('fill',function(d,i,j){return lines[j].parentNode.__data__.color;})
	lines.transition().duration(0.5*duration)
		.attr('cx',function(d){return x(d[0]);})
		.attr('cy',function(d){return 200*d[1];})
		.attr('r',radius)
		.attr('opacity',1);
	lines.exit().remove();
}


function appendData(d,n){ //Justs adds random data to the end of each series on the page
	n = n == undefined ?  5 : n ;
var g = d.graphs; 
var cg, kk, ll, mm;

for (kk = 0; kk < g.length; kk++){
	cg = g[kk];  //Current graph
	for (ll=0; ll < cg.series.length; ll++){
		for (mm=0; mm < cg.series[ll].data.length; mm++){
			//Change a bit
			cg.series[ll].data[mm]=[mm, Math.random()];
		}
		//cg.series[ll].data[0] = [0, Math.random()];

		for (mm=0; mm < n; mm++){
			//Add new stuff
			cg.series[ll].data.push([nLaps+mm, Math.random()]);
		}
	}
}
nLaps += n;
}

function initData(ng,ns){
	var d = {graphs:[]};
	var series;
	var cmap;
	for(var ii = 0; ii < ng; ii++){
		series = [];
		cmap = randomColMap()[ns];
		for (var jj = 0; jj < ns; jj++){
			series.push({data:[],color:cmap[jj],marker:"o-",name:randString()})
		}
		d.graphs.push({title:randString(),series:series});
	}
	return d;
}

function randColor(){
	var colors = ["red", "blue", "green", "yellow", "magenta","cyan"];
	return colors[Math.floor(colors.length*Math.random())];
}

function randomColMap(){
	var result;
	var count = 0;
	for (var prop in colorbrewer)
	{
		if (colorbrewer.hasOwnProperty(prop)){
			if (Math.random()< 1/++count)
				result = prop;
		}
	}
	return colorbrewer[result];
}

function randString(len){
	len = len || nStringLength;
	var abet = "abcdefghijklmnopqrstuvwxyz".split("");
	var res = [];
	for(var ii=0; ii<len; ii++)
		{ res.push(abet[Math.floor(Math.random()*abet.length)]);}
	return res.join("");

}