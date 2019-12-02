
var width_chart = 780,
    height_chart = 420

var color_label_w = "#f5daea";
var color_label_m = "#d4ecff";

var svg = d3.select("#chart").append("svg")
    .attr("width", width_chart)
    .attr("height", height_chart);

var act_counts;

d3.tsv("data/sample_off.csv").then(function(data){

	data.forEach(function(d) {
		split_schedule = d["schedule"].split("|");
		var activities = [];
		for(var i = 0; i < split_schedule.length -2 ; i++){
			activities.push({'act' : split_schedule[i].split(",")[2], 
							 'start' : split_schedule[i].split(",")[0],
							 'end' : split_schedule[i].split(",")[1],
							})
		}
		sched_objs.push(activities);
	});

	//Used for percentages by minute
	act_counts = { "dm": 0, "dw": 0, "mm": 0, "mw": 0 };


	
	// A node for each person's schedule
	var nodes = sched_objs.map(function(o,i) {
		var act = o[0]["act"];
		if(act != "i"){
			act_counts[act] += 1;
		}
		var init_x = foci[act].x + Math.random();
		var init_y = foci[act].y + Math.random();
		return {
			prime_minister: false,
			act: act,
			radius: circle_radius,
			x: init_x,
			y: init_y,
			color: color(act),
			moves: 0,
			next_move_time: o[0].end,
			sched: o,
		}
	});

	var force = d3.forceSimulation(nodes)
		.force("charge", d3.forceManyBody())
		.force("collide", forceCollide())
		.on("tick", tick);


	function tick() {

		// Push nodes toward their designated focus.
		nodes.forEach(function(o, i) {
			var curr_act = o.act;
			o.color = color(curr_act);

			var a = foci[curr_act].x - o.x;
			var b = foci[curr_act].y - o.y;
			var c = Math.sqrt( a*a + b*b );

			k= 0.06;

			if (c > 100){
				k=0.06
			} else if (c > 90){
				k=0.04
			} else if (c > 70){
				k=0.03
			} else if (c > 50){
				k=0.02
			} else {
				k = 0.01
			}
			o.y += (foci[curr_act].y - o.y) * k;
			o.x += (foci[curr_act].x - o.x) * k;
		});

		circle
			  .style("fill", function(d) { return d.color; })
		  	  .attr("cx", function(d) { return d.x; })
		      .attr("cy", function(d) { return d.y; });
	}

	function forceCollide() {
		const alpha = 0.3; // fixed for greater rigidity!
		const padding1 = 5; // separation between nodes
		let nodes;
		let maxRadius;

		function force() {
			const quadtree = d3.quadtree(nodes, d => d.x, d => d.y);
			for (const d of nodes) {
			  const r = d.radius + maxRadius;
			  const nx1 = d.x - r, ny1 = d.y - r;
			  const nx2 = d.x + r, ny2 = d.y + r;
			  quadtree.visit((q, x1, y1, x2, y2) => {
			    if (!q.length) do {
			      if (q.data !== d) {
			        const r = d.radius + q.data.radius + padding1;
			        let x = d.x - q.data.x, y = d.y - q.data.y, l = Math.hypot(x, y);
			        if (l < r) {
			          l = (l - r) / l * alpha;
			          d.x -= x *= l, d.y -= y *= l;
			          q.data.x += x, q.data.y += y;
			        }
			      }
			    } while (q = q.next);
			    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			  });
			}
		}

		force.initialize = _ => maxRadius = d3.max(nodes = _, d => d.radius) + padding1;

		return force;
	}

	var circle = svg.selectAll("circle")
		.data(nodes)
	  	.enter()
	  	.append("circle")
		.attr("r", function(d) { return d.radius; })
		.style("fill", function(d) { return d.color; });
		// .call(force.drag);

	//creating bars with shadow
    initialize_labels()

	// Activity labels
	var label = svg.selectAll("text")
		.data(act_codes)
	    .enter().append("text")
		.attr("class", "actlabel")
		.attr("x", function(d, i) {
			return foci_names[d.code]["x"];
		})
		.attr("y", function(d, i) {
			return foci_names[d.code]["y"];
		});

	label.append("tspan")
		 .style('font', '18px sans-serif')
		 .style('font-weight', 'bold')
		 .style('fill', 'gray')
		// .attr("dy", "1.3em")
		.attr("x", function() { return d3.select(this.parentNode).attr("x"); })
		.attr("text-anchor", "middle")
		.attr("class", "actpct")
		.text(function(d) {
			return formating_percentage(act_counts, d.code);;
		});

	label.append("tspan")
		 .style('font', '20px sans-serif')
		 .style('font-weight', 'bold')
		 .attr("x", function() { return d3.select(this.parentNode).attr("x"); })
		 .attr("dy", "1.3em")
		 .attr("text-anchor", "middle")
		 .text(function(d) {
			return d.short;
		 });

	var previous_image = "";

	// initialize_labour_force();

	// Update nodes based on activity and duration
	function timer() {
		if (curr_minute % 2 == 0 ){
			updateMonths(0, Math.floor(curr_minute/2));
			// update_labour_force();
		}
		
		d3.range(nodes.length).map(function(i) {
			// console.log(curr_minute);
			var curr_node = nodes[i],
				curr_moves = curr_node.moves; 

			// Time to go to next activity
			if (curr_node.next_move_time == curr_minute) {
				if (curr_node.moves == curr_node.sched.length-1) {
					curr_moves = 0;
				} else {
					curr_moves += 1;
				}
			
				// Subtract from current activity count
				if(curr_node.act != "i"){
					act_counts[curr_node.act] -= 1;
				}
				// Move on to next activity
				curr_node.act = curr_node.sched[ curr_moves ].act;
			
				// Add to new activity count
				if(curr_node.act != "i"){
					act_counts[curr_node.act] += 1;
				}

				curr_node.moves = curr_moves;
				curr_node.cx = foci[curr_node.act].x;
				curr_node.cy = foci[curr_node.act].y;
				
				nodes[i].next_move_time = nodes[i].sched[ curr_node.moves ].start;
			}

		});

		force.restart();
		curr_minute += 1;

		//update tracking
		update_tracking_chart();

		// Update percentages
		label.selectAll("tspan.actpct")
			.text(function(d) {
				return formating_percentage(act_counts, d.code);
			});
	
		// Update time
		// d3.select("#current_time").text(curr_minute);
		
		//Update notes
		if (dates[Math.ceil(curr_minute/2)]["file"] != previous_image) {
			update_minister_timeline();
		} 
		
		setTimeout(timer, tickDuration);
		
	}
	setTimeout(timer, tickDuration);

	function formating_percentage(data, node){
		total_deputies = data["dw"] + data["dm"]
		total_ministers = data["mw"] + data["mm"]
		if (node == "dw") {
			if (data["dw"] == 0){
				return 0 + " % (" + 0 + ")"
			}
			perc = data["dw"]/total_deputies
			perc= perc.toFixed(2);
			return Math.round(perc*100) + " % (" + data[node] + ")"
		}

		if (node == "dm") {
			if (data["dm"] == 0){
				return 0 + " % (" + 0 + ")"
			}
			perc = data["dm"]/total_deputies
			perc= perc.toFixed(2);
			return Math.round(perc*100) + " % (" + data[node] + ")"
		}

		if (node == "mw") {
			if (data["mw"] == 0){
				return 0 + " % (" + 0 + ")"
			}
			perc = data["mw"]/total_ministers
			perc= perc.toFixed(2);
			return Math.round(perc*100) + " % (" + data[node] + ")"
		}

		if (node == "mm") {
			if (data["mm"] == 0){
				return 100 + " % (" + 20 + ")"
			}
			perc = data["mm"]/total_ministers
			perc= perc.toFixed(2);
			return Math.round(perc*100) + " % (" + data[node] + ")"
		}
       
	}
	
	
	
	// Speed toggle
	d3.selectAll(".togglebutton")
      .on("click", function() {
        if (d3.select(this).attr("data-val") == "slow") {
            d3.select(".slow").classed("current", true);
			d3.select(".medium").classed("current", false);
            d3.select(".fast").classed("current", false);
        } else if (d3.select(this).attr("data-val") == "medium") {
            d3.select(".slow").classed("current", false);
			d3.select(".medium").classed("current", true);
            d3.select(".fast").classed("current", false);
        } 
		else {
            d3.select(".slow").classed("current", false);
			d3.select(".medium").classed("current", false);
			d3.select(".fast").classed("current", true);
        }
		
		USER_SPEED = d3.select(this).attr("data-val");
    });
}); // @end d3.tsv



function color(activity) {
	
	var colorByActivity = {
		"dm": color_m,//"#0000ff",
		"dw": color_w,//"#ff00ff",
		"mm": color_m,//"#0000ff",
		"mw": color_w,//"#ff00ff",
	}
	
	return colorByActivity[activity];
	
}



// Output readable percent based on count.
function readablePercent(n) {
	
	var pct = 100 * n / 1000;
	if (pct < 1 && pct > 0) {
		pct = "<1%";
	} else {
		pct = Math.round(pct) + "%";
	}
	
	return pct;
}


// Minutes to time of day. Data is minutes from 4am.
function minutesToTime(m) {
	return "" + m
}

function initialize_labels(){
	legend = svg.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color_label_m)
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "90%")
      .attr("stop-color", color_label_m)
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#FFFFFF")
      .attr("stop-opacity", 1);
	
	svg.append("rect")
	  .attr("x" , 40)
	  .attr("y" , 0)
      .attr("width", 120)
      .attr("height",  60)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(0,10)");


    legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color_label_m)
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "90%")
      .attr("stop-color", color_label_m)
      .attr("stop-opacity", 1);

    legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#FFFFFF")
      .attr("stop-opacity", 1);
	
	svg.append("rect")
	  .attr("x" , 40)
	  .attr("y" , 150)
      .attr("width", 120)
      .attr("height",  60)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(0,10)");



    legend2 = svg.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient2")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend2.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#FFFFFF")
      .attr("stop-opacity", 1);

    legend2.append("stop")
      .attr("offset", "10%")
      .attr("stop-color", color_label_w)
      .attr("stop-opacity", 1);

    legend2.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color_label_w)
      .attr("stop-opacity", 1);
	
	svg.append("rect")
	  .attr("x" , 620)
	  .attr("y" , 0)
      .attr("width", 120)
      .attr("height",  60)
      .style("fill", "url(#gradient2)")
      .attr("transform", "translate(0,10)");

    legend2.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#FFFFFF")
      .attr("stop-opacity", 1);

    legend2.append("stop")
      .attr("offset", "10%")
      .attr("stop-color", color_label_w)
      .attr("stop-opacity", 1);

    legend2.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color_label_w)
      .attr("stop-opacity", 1);
	
	svg.append("rect")
	  .attr("x" , 620)
	  .attr("y" , 150)
      .attr("width", 120)
      .attr("height",  60)
      .style("fill", "url(#gradient2)")
      .attr("transform", "translate(0,10)");
}