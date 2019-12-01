const width_configurations = 1280;
const height_configurations = 60;

const svg_configurations = d3.select("#configurations")
   .append("svg")
   .attr("width", width_configurations)
   .attr("height", height_configurations)
   .append("g");
   
// Fill
var data = [0, 0.005, 0.01, 0.015, 0.02, 0.025];

var sliderFill = d3
.sliderBottom()
.min(d3.min(data))
.max(d3.max(data))
.width(300)
.tickFormat(d3.format('.2%'))
.ticks(5)
.default(0.015)
.fill('#2196f3')
.on('onchange', val => {
  d3.select('p#value-fill').text(d3.format('.2%')(val));
});

var gFill = d3
.select('div#slider-fill')
.append('svg')
.attr('width', 500)
.attr('height', 100)
.append('g')
.attr('transform', 'translate(30,30)');

gFill.call(sliderFill);

d3.select('p#value-fill').text(d3.format('.2%')(sliderFill.value()));