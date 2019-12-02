const width_configurations = 1280;
const height_configurations = 60;

const svg_configurations = d3.select("#configurations")
   .append("svg")
   .attr("width", width_configurations)
   .attr("height", height_configurations);

const g_selector = svg_configurations.append("g")
			   						 .attr('transform', 'translate(155,20)');


//appending title
svg_configurations.append('text')
            .attr("class", "configurations_text")
            .attr("x", 10)
            .attr("y", 30)
            .attr("text-align", "center")
            .style('font', '15px sans-serif')
            .style('font-weight', 'bold')
            .text('Speed of Display');   
// Fill
var data = [0, 0.5, 1];

var sliderFill = d3
.sliderBottom()
.min(d3.min(data))
.max(d3.max(data))
.width(100)
.tickFormat(d3.format('.2%'))
.ticks(3)
.default(0.5)
.fill('#000000');

g_selector.call(sliderFill)

//buttons French English
var button = d3.button()
    .on('press', function(d, i) { 
    	svg_configurations.selectAll('.button').selectAll("text").text("FR");
    })
    .on('release', function(d, i) { 
    	svg_configurations.selectAll('.button').selectAll("text").text("EN");
    });

var data_button = [{label: "EN",     x: 1250, y: 35 }];
// Add buttons
var buttons = svg_configurations.selectAll('.button')
    .data(data_button)
    .enter()
    .append('g')
    .attr('transform', 'translate(1000,20)')
    .attr('class', 'button')
    .call(button);