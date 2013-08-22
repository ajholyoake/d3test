var nGraphs = 10,
	nSeries = 5,
	nStringLength = 5,
	nLaps = 0;
	nLapsRunMax = 10;
	svgHeight = 250;
	radius = 5;
	maxLaps = 100;

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

appendData(payload,100);
redraw();

setInterval(function(){
	newLaps = Math.round(Math.random()*nLapsRunMax+1);
	//newLaps = newLaps + nLaps - maxLaps < 0 ?  newLaps : maxLaps - nLaps;
	newLaps = Math.min(maxLaps-nLaps, newLaps);
	appendData(payload,newLaps);
	redraw();
	console.log(nLaps);
},1000);

//appendData(payload);
//redraw();
//setInterval(function(){
//	appendData(payload,Math.round(Math.random()*nLapsRunMax+1));
//	redraw();
//},2000)

function redraw(){
	//This is the meat of the thing!
	var graphs = d3.select("#graphList").selectAll("svg.graph").data(payload.graphs,function(d){return d.title});
	graphs.enter().append("svg:svg").attr("class","graph").attr('height',svgHeight);
	graphs.exit().remove();

	var series = graphs.selectAll('g').data(function(d){return d.series;},function(d){return d.name;});
	series.enter().append('g');
	series.exit().remove();

	var lines = series.selectAll('circle').data(function(d){return d.data;},function(d){return d[0];});
	lines.enter().append('circle').attr('opacity',1e-6);
	lines.attr('fill',function(d,i,j){return lines[j].parentNode.__data__.color;})
	lines.transition().duration(1000)
		.attr('cx',function(d){return 20*d[0]+radius;})
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
      if ( Math.random() < 0.05){
			//Change a bit
			cg.series[ll].data[mm]=[mm, Math.random()];
      }
		}

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
	for(var ii = 0; ii < ng; ii++){
		series = [];
		for (var jj = 0; jj < ns; jj++){
			series.push({data:[],color:randColor(),marker:"o-",name:randString()})
		}
		d.graphs.push({title:randString(),series:series});
	}
	return d;
}

function randColor(){
	var colors = ["red", "blue", "green", "yellow", "magenta","cyan"];
	return colors[Math.round(colors.length*Math.random())];
}

function randString(len){
	len = len || nStringLength;
	var abet = "abcdefghijklmnopqrstuvwxyz".split("");
	var res = [];
	for(var ii=0; ii<len; ii++)
		{ res.push(abet[Math.round(Math.random()*abet.length)]);}
	return res.join("");

}
