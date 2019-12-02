const labour_force = [
[1930,91.9,13],
[1931,84,13],
[1932,77,13],
[1933,81,14],
[1934,84,17],
[1935,86,18],
[1936,87,18],
[1937,88,21],
[1938,87,22],
[1939,87,23.1],
[1940,91,26.4],
[1941,90,32.1],
[1942,92,39.4],
[1943,93,37.8],
[1944,91,29.5],
[1945,92,28.2],
[1946,93,26.8],
[1947,95,21.5],
[1948,96,22.5],
[1949,95,22],
[1950,94.1,23.2],
[1951,94.5,23.1],
[1952,94.9,23.1],
[1953,95.9,23.5],
[1954,95.6,23.8],
[1955,95.8,24.5],
[1956,96.0,25.7],
[1957,96.1,27.1],
[1958,96.2,27.9],
[1959,96.2,28.7],
[1960,96.2,30.3],
[1961,96.0,31.4],
[1962,95.9,32.2],
[1963,96.0,33.2],
[1964,96.0,34.5],
[1965,95.9,35.5],
[1966,95.9,37.0],
[1967,95.4,38.6],
[1968,95.3,39.5],
[1969,95.0,40.8],
[1970,94.9,42.1],
[1971,94.7,43.3],
[1972,95.0,44.8],
[1973,95.1,46.6],
[1974,94.5,48.2],
[1975,94.5,50.7],
[1976,94.5,52.3],
[1977,94.3,53.7],
[1978,94.6,56.2],
[1979,94.7,58.0],
[1980,94.5,60.0],
[1981,94.6,62.6],
[1982,93.6,63.5],
[1983,93.5,65.2],
[1984,93.3,66.8],
[1985,93.5,68.7],
[1986,93.6,70.2],
[1987,93.8,71.5],
[1988,93.5,73.1],
[1989,93.5,74.4],
[1990,93.1,75.5],
[1991,92.4,75.9],
[1992,91.4,75.3],
[1993,91.4,75.7],
[1994,91.2,75.4],
[1995,90.9,75.7],
[1996,90.8,76.0],
[1997,90.9,76.9],
[1998,91.1,77.6],
[1999,91.1,78.2],
[2000,91.0,78.5],
[2001,91.1,79.1],
[2002,91.5,80.4],
[2003,91.6,81.1],
[2004,91.6,81.5],
[2005,91.5,81.1],
[2006,91.1,81.2],
[2007,91.1,82.1],
[2008,91.5,81.9],
[2009,90.8,82.1],
[2010,90.6,82.3],
[2011,90.7,82.2],
[2012,90.8,82.5],
[2013,90.7,82.7],
[2014,90.5,81.9],
[2015,91.5,82.9],
[2016,91.7,82.5],
[2017,91.5,82.9],
[2018,92.5,83.9],
[2019,93.5,84.1]
];

const labour_force_female_data = labour_force.map(function(row){
	return {"year" : row[0], "force" : row[2]}
});

const labour_force_male_data = labour_force.map(function(row){
	return {"year" : row[0], "force" : row[1]}
});

var labour_force_female = {
	"status" : "female",
	"color" : "#ff00ff",
	"x" : 180,
	"data" : labour_force_female_data,
};

var labour_force_male = {
	"status" : "male",
	"color" : "#0000ff",
	"x" : 80,
	"data" : labour_force_male_data,
};


var labour_force_data = [labour_force_female, labour_force_male];

// var labour_force_bars;

// var label_labour_forces;

const width_sidebar = 500;
const height_sidebar = 420;

var svg_sidebar = d3.select("#sidebar")
   .append("svg")
   .attr("width", width_sidebar)
   .attr("height", height_sidebar)

svg_sidebar.append('text')
            .attr("class", "configurations_text")
            .attr("x", 140)
            .attr("y", 30)
            .attr("text-align", "center")
            .style('font', '18px sans-serif')
            .style('font-weight', 'bold')
            .text('Labour Force Representation');   

svg_sidebar = svg_sidebar
			   	.append("g")
			    .attr("transform", "translate(60,20)");

var x = d3.scaleLinear()
	.domain([1930 ,2020])
    .range([0, width_sidebar-100]);

var y = d3.scaleLinear()
	.domain([0, 100])
    .range([height_sidebar-50, 0]);

// const y = d3.scale.linear()
// 			.domain([0, 100])
// 			.range([width_sidebar*0.10, width_sidebar - width_sidebar*0.10]);

var line = d3.line()
    .x(function(d) {
    	return x(d["year"]); 
    })
    .y(function(d) { 
    	return y(d["force"]); 
    });

var xAxis = d3.axisBottom()
    .scale(x)
    .tickPadding(15)
    .ticks(10);
    // .innerTickSize(15)
    // .outerTickSize(0)

var yAxis = d3.axisLeft()
    .scale(y)
    .tickFormat(function(d) { return d + "%";})
    .tickPadding(10)
    .ticks(10);
    // .innerTickSize(15)
    // .outerTickSize(0);

svg_sidebar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + 370 + ")")
      .call(xAxis);

svg_sidebar.append("g")
      .attr("class", "y axis")
      .call(yAxis);

svg_sidebar.append("line")
        .attr(
        {
            "class":"horizontalGrid",
            "x1" : 0,
            "x2" : width_sidebar,
            "y1" : y(0),
            "y2" : y(0),
            "fill" : "none",
            "shape-rendering" : "crispEdges",
            // "stroke" : "black",
            "stroke-width" : "2px",
            "stroke-dasharray": ("3, 3")
        });

var labour_force_data = svg_sidebar.selectAll(".data")
      .data(labour_force_data)
      .enter()
      .append("g")
      .attr("class", "data");


var path = svg_sidebar.selectAll(".data").append("path")
	.attr("class", "line")
	.attr("d", function(d) {
		return line(d["data"]); 
	})
	.style("stroke", function(d) { 
		if (d["status"] == "male") {
			return color_m;
		} else {
			return color_w;
		}
	});

// console.log(path._groups[0][0].getTotalLength());
var totalLength = [path._groups[0][0].getTotalLength(), path._groups[0][1].getTotalLength()];

d3.select(path._groups[0][0])
	.attr("stroke-dasharray", totalLength[0] + " " + totalLength[0] ) 
	.attr("stroke-dashoffset", totalLength[0])
	.transition()
		.duration(tickDuration*12*90*2)
		.attr("stroke-dashoffset", 0);

d3.select(path._groups[0][1])
	.attr("stroke-dasharray", totalLength[1] + " " + totalLength[1] )
	.attr("stroke-dashoffset", totalLength[1])
	.transition()
		.duration(tickDuration*12*90*2)
		.attr("stroke-dashoffset", 0);