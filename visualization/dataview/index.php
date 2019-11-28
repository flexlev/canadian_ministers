<!DOCTYPE html>
<html><head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title>Simulation de l'utilisation du temps</title>
<link rel="stylesheet" href="css/style.css" type="text/css" media="screen">
<link rel="stylesheet" type="text/css" href="css/fonts.css">
<link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet" type="text/css">
<meta charset="utf-8"><style>.node{stroke-width:1.5px;}</style></head>


<body>
<div id="main-wrapper">
<div id="sidebar">
<div id="speed">

</div>
<div id="current_minister"></div>
<!-- <div id="image_container">
</div> -->
<!-- <img id="image" src="" width="250" style="top: 600px; color: rgb(255, 255, 255);"></div> -->

</div>
<div id="chart"></div>
<div class="clr"></div>
</div>
<script src="js/d3-3-5-5.js"></script>
<script src="js/globals.js"></script>
<script src="js/date.js"></script>
<script src="js/labour_force.js"></script>

<script>

// Load data and let's do it.
d3.tsv("data/sample_off.csv", function(data) {	

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
	var act_counts = { "dm": 0, "dw": 0, "mm": 0, "mw": 0 };
	
	// A node for each person's schedule
	var nodes_all = sched_objs.map(function(o,i) {
		var act = o[0]["act"];
		if(act != "i"){
			act_counts[act] += 1;
		}
		var init_x = foci[act].x + Math.random();
		var init_y = foci[act].y + Math.random();
		return {
			prime_minister: false,
			act: act,
			radius: 8,
			x: init_x,
			y: init_y,
			color: color(act),
			moves: 0,
			next_move_time: o[0].end,
			sched: o,
		}
	});

	nodes_all.push({"prime_minister" : true,
					"radius" : radius_minister,
					"color" : "#0000ff",
					"x" : minister_center_x + 100,
					"y" : -100,
					"act" : "minister",
	});

	nodes = nodes_all.filter(function(node){
		return !node["prime_minister"];
	});

	var node_minister = nodes_all.filter(function(node){
		return node["prime_minister"];
	});

	var force = d3.layout.force()
		.nodes(nodes_all)
		.size([width, height])
		.gravity(0)
		.charge(-5)
		.friction(0.9)
		.on("tick", tick)
		.start();

	var circle = svg.selectAll("circle")
		.data(nodes)
	  	.enter()
	  	.append("circle")
		.attr("r", function(d) { return d.radius; })
		.style("fill", function(d) { return d.color; });
		// .call(force.drag);

	var defs = svg.append("defs");

	defs.append('pattern')
	    .attr("id", dates[Math.ceil(curr_minute/2)]["file"])
	    .attr("width", 1)
	    .attr("height", 1)
	    .attr('patternContentUnits', 'objectBoundingBox')
	    .append("svg:image")
	    .attr("xlink:href", "images/" + dates[Math.ceil(curr_minute/2)]["file"])
	    .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "xMinYMin slice");

	var minister_circle = svg.selectAll("circle_minister")
		.data(node_minister)
	  	.enter()
	  	.append("circle")
		.attr("r", function(d) { 
			return d.radius; 
		})
		.attr("fill", "url(#" + dates[Math.ceil(curr_minute/2)]["file"] +")")
		.attr("cx", function(d){
			return d["x"];
		})
		.attr("cy", function(d){
			return d["y"];
		});

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
		 .style('font', '25px sans-serif')
		 .style('font-weight', 'bold')
		 .attr("x", function() { return d3.select(this.parentNode).attr("x"); })
		// .attr("dy", "1.3em")
		 .attr("text-anchor", "middle")
		 .text(function(d) {
			return d.short;
		 });
	label.append("tspan")
		 .style('font', '20px sans-serif')
		 .style('font-weight', 'bold')
		 .style('fill', 'gray')
		.attr("dy", "1.3em")
		.attr("x", function() { return d3.select(this.parentNode).attr("x"); })
		.attr("text-anchor", "middle")
		.attr("class", "actpct")
		.text(function(d) {
			return formating_percentage(act_counts, d.code);;
		});
		
	var previous_image = "";

	initialize_labour_force();

	// Update nodes based on activity and duration
	function timer() {
		if (curr_minute % 2 == 0 ){
			updateMonths(0, Math.floor(curr_minute/2));
			update_labour_force();
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

		force.resume();
		curr_minute += 1;

		// Update percentages
		label.selectAll("tspan.actpct")
			.text(function(d) {
				return formating_percentage(act_counts, d.code);
			});
	
		// Update time
		// d3.select("#current_time").text(curr_minute);
		
		//Update notes
		if (dates[Math.ceil(curr_minute/2)]["file"] != previous_image) {
			update_minister();
		} 
		
		if (curr_minute > 2000){
			setTimeout(timer, 200);
		} else if (curr_minute > 1800){
			setTimeout(timer, 150);
		} else if(curr_minute > 1400){
			setTimeout(timer, 100);
		} else{
			setTimeout(timer, 40);
		}
		
	}
	setTimeout(timer, tickDuration);

	function update_minister(){
		// d3.select("#image")
		// 	.attr('src', "images/" + dates[Math.ceil(curr_minute/2)]["file"] )
		// 	.style("opacity", 0)
		//   	.transition()
		// 	.duration(600)
		// 	.style("opacity", 1);

		previous_image = dates[Math.ceil(curr_minute/2)]["file"];

		defs.select('pattern')
		    .attr("id", dates[Math.ceil(curr_minute/2)]["file"])
		    .attr("width", 1)
		    .attr("height", 1)
		    .attr('patternContentUnits', 'objectBoundingBox')
		    .append("svg:image")
		    .attr("xlink:href", "images/" + dates[Math.ceil(curr_minute/2)]["file"])
		    .attr("height", 1)
	        .attr("width", 1)
	        .attr("preserveAspectRatio", "xMinYMin slice");


	    minister_circle
			.attr("fill", "url(#" + dates[Math.ceil(curr_minute/2)]["file"] + ")")
			.style("opacity", 0)
			.style("stroke", "red")
			.attr("stroke-width", 10)
		  	.transition()
			.duration(600)
			.style("opacity", 1);
			// .transition()
			// .duration(600)
			// .style("opacity", 1);


		// TODO :
		// - PUTTING SOCIO DEMO DATA INTO PREVIOUS PICTURE SPOT
		// - PUTTING COUPLE OF MALE FEMALE MINISTERS PICTURE ON circle
		//d3.select("#current_minister").text(dates[Math.ceil(curr_minute/2)]["info"] );
	}
		
	function tick(e) {
	  var k = 0.04 * e.alpha;
  
	  // Push nodes toward their designated focus.
	  nodes_all.forEach(function(o, i) {
		var curr_act = o.act;
		
		// Make sleep more sluggish moving.
		var damper = 1;
		o.color = color(curr_act);
	    o.y += (foci[curr_act].y - o.y) * k * damper;
	    o.x += (foci[curr_act].x - o.x) * k * damper;
	  });

	  circle
	  	  .each(collide(.5))
	  	  .style("fill", function(d) { return d.color; })
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });

	  minister_circle
	  	  .each(collide(.5))
	  	  // .style("fill", function(d) { return d.color; })
	      .attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; });
	}


	// Resolve collisions between nodes.
	function collide(alpha) {
	  var quadtree = d3.geom.quadtree(nodes_all);
	  return function(d) {
	    var r = d.radius + maxRadius + padding,
	        nx1 = d.x - r,
	        nx2 = d.x + r,
	        ny1 = d.y - r,
	        ny2 = d.y + r;
	    quadtree.visit(function(quad, x1, y1, x2, y2) {
	      if (quad.point && (quad.point !== d)) {
	        var x = d.x - quad.point.x,
	            y = d.y - quad.point.y,
	            l = Math.sqrt(x * x + y * y),
	            r = d.radius + quad.point.radius + (d.act !== quad.point.act) * padding;
	        if (l < r) {
	          l = (l - r) / l * alpha;
	          d.x -= x *= l;
	          d.y -= y *= l;
	          quad.point.x += x;
	          quad.point.y += y;
	        }
	      }
	      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	    });
	  };
	}

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
		"dm": "#0000ff",
		"dw": "#ff00ff",
		"mm": "#0000ff",
		"mw": "#ff00ff",
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


</script></body></html>