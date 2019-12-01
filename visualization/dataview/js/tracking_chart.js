const width_tracking_chart = 1280;
const height_tracking_chart = 10;

const svg_tracking = d3.select("#tracking")
   .append("svg")
   .attr("width", width_tracking_chart)
   .attr("height", height_tracking_chart)
   .append("g");

var tracking_chart_x = d3.scaleLinear()
								.domain([0,100])
							    .range([0, width_tracking_chart]);

male_tracking = svg_tracking.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", 100)
			.attr("height", height_tracking_chart)
			.attr("fill", color_m);

female_tracking = svg_tracking.append("rect")
			.attr("x", 100)
			.attr("y", 0)
			.attr("width", width_tracking_chart - 100)
			.attr("height", height_tracking_chart)
			.attr("fill", color_w);

var previous_prercentages = 0;

function update_tracking_chart(){
	var male_count = act_counts["dm"] + act_counts["mm"] + 0.1;
	var female_count = act_counts["dw"] + act_counts["mw"] + 0.1;

	male_tracking.transition()
				.duration(tickDuration*3)
				.attr("width", tracking_chart_x( Math.floor(male_count/(male_count+female_count)*100) ) );


	female_tracking.transition()
					.duration(tickDuration*3)
					.attr("x", tracking_chart_x( Math.floor(male_count/(male_count+female_count)*100) ))
					.attr("width", width_tracking_chart - tracking_chart_x( Math.floor(male_count/(male_count+female_count)*100) ) );
}