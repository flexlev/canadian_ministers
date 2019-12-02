//timeline
var maxWidth=1000;

var months=[],
	delay=0,
	baseYear=1930,
    maxMonth=1,
    maxYear=12,
    monthOffset=6,
    year = 1930,
    current_month = -1;

var monthsMap=["Jan","Feb","Mar","Apr","May","Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const width_timeline = 1280;
const height_timeline = 230;

const svg_timeline = d3.select("#timeline")
               .append("svg")
               .attr("width", width_timeline)
               .attr("height", height_timeline);

//appending title
svg_timeline.append('text')
            .attr("class", "title")
            .attr("y", 20)
            .attr("x", 400)
            .attr("text-align", "center")
            .style('font', '25px sans-serif')
            .style('font-weight', 'bold')
            .text('The Inequalities Between Male and Woman');

//appending prime minister bubble
var minister_image = svg_timeline.append("defs");

minister_image.append('pattern')
    .attr("id", dates[Math.ceil(curr_minute/2)]["file"])
    .attr("width", 1)
    .attr("height", 1)
    .attr('patternContentUnits', 'objectBoundingBox')
    .append("svg:image")
    .attr("xlink:href", "images/" + dates[Math.ceil(curr_minute/2)]["file"])
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRatio", "xMinYMin slice");

timeline_minister_circle = svg_timeline.selectAll("circle")
        .data([0])
        .enter()
        .append("circle")
        .attr("fill", "url(#" + dates[Math.ceil(curr_minute/2)]["file"] +")")
        .attr("transform", "translate(205,90)")
        .attr("cx", 0)
        // .attr("cy", 90)
        .attr("r", function(d) { return 45; });

// gradientGroup =svg_timeline.append("g")
//     .attr("class","gradient")
//     .attr("transform","translate(400,110)" )
//     .attr("align","center");

// gradientGroup.append("rect")
//     .attr("height",652.5)
//     .attr("width",0)
//     .style("fill","url(#gradient1)");

var mGroup=svg_timeline.append("g")
    .attr("class","months")
    .attr("transform", "translate(200,150)");

var count=maxYear*12+maxMonth;


for (var i=0; i < count; i++) {
    var o={};
    o.index=i;
    o.month=monthsMap[i % 12];
    o.year=baseYear + Math.floor(i/12);
    months.push(o);
}

function update_minister_timeline(){
    minister_image.select('pattern')
        .attr("id", dates[Math.ceil(curr_minute/2)]["file"])
        .attr("width", 1)
        .attr("height", 1)
        .attr('patternContentUnits', 'objectBoundingBox')
        .append("svg:image")
        .attr("xlink:href", "images/" + dates[Math.ceil(curr_minute/2)]["file"])
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "xMinYMin slice");


    timeline_minister_circle
        .attr("fill", "url(#" + dates[Math.ceil(curr_minute/2)]["file"] + ")")
        .style("stroke", color_m)
        .attr("stroke-width", 10);
}

function update_years(){
    var month_axis=mGroup.selectAll("g.month")
                        .data(months);
    for (var i=0; i < count; i++) {
        var o={};
        o.index=i;
        o.month=monthsMap[i % 12];
        o.year=baseYear + Math.floor(i/12);
        months.push(o);
    }
    month_axis.data(months);
    month_axis.exit().remove();

}


function updateMonths(y,m) {
    if ((m%144 == 0) & (m>0)){
        months= [];
        baseYear = baseYear+12;
        update_years();
    }

    if ((m%12 == 0) & (m>0)) {
        year = year + 1;
    }

    m = m%144
    current_month = m%12;

    timeline_minister_circle
        .transition()
        .attr("cx", m*monthOffset);

    var monthAxis=mGroup.selectAll("g.month")
        .data(months);

    monthEnter= monthAxis.enter()
        .append("g")
        .attr("class","month");

    monthEnter.append("line")
        .attr("x1",function (d,i) {
            return i*monthOffset;
        })
        .attr("x2",function (d,i) { 
        	return i*monthOffset; 
        })
        .attr("y1",function (d,i) {
            var ratio=(y*12+m)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 0;
            else if (ratio==1)
                return 4;
            else if (ratio==2)
                return 8;
            else if (ratio==3)
                return 11;
            else if (ratio==4)
                return 14;
            else if (ratio==5)
                return 15;
            else if (ratio==6)
                return 15;
            else
                return 16;

        })
        .attr("y2",22)
        .attr("shape-rendering","crispEdges")
        .style("stroke-opacity", function (d,i) {
            var ratio=(y*12+m)-i;
            if (ratio < 0) 
                ratio=ratio*-1;
            if (ratio==0)
                return 1;
            else if (ratio==1)
                return .9;
            else if (ratio==2)
                return .8;
            else if (ratio==3)
                return .7;
            else if (ratio==4)
                return .6;
            else if (ratio==5)
                return .5;
            else if (ratio==6)
                return .4;
            else
                return .3;

        })
        .style("stroke","#000");



    monthEnter.append("text")
        .attr("style", "font-family:Inconsolata;font-size:24px")
        .attr("transform",function (d,i) { return "translate (" + String(i*monthOffset-10) + ",-2)"; })
        .text(function(d,i) { 
            return "";
            // return monthsMap[i % 12]; 
        })
        .style("fill-opacity",function (d,i) { return (i==0) ? 1:0;});

    monthEnter.append("text")
        .attr("style", "font-family:Inconsolata;font-size:16px")
        .attr("transform",function (d,i) { return "translate (" + String(i*monthOffset-10) + ",33)"; })
        .text(function(d,i) {
            if ((i==0) || (i % 12==0)) {
                return String(baseYear + Math.floor(i/12));
            }
            else
                return "";
        })
        .on("click",function (d) {
            year= Math.floor(d.index/12);
            month=0;
            if (running==true) stopStart();
            update(year,month);
            //          console.log("y=" + y + " m=" + m);
        });

    monthUpdate=monthAxis.transition();

    monthUpdate.select("text")
        .delay(delay/2)
        .style("fill-opacity",function (d) {
            if (d.index==(y*12+m)) {
                return 1;
            }
            else
                return 0;
        });

    monthUpdate.select("line")
        .delay(delay/2)
        .attr("y1",function (d,i) {
            var ratio=(y*12+m)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 0;
            else if (ratio==1)
                return 4;
            else if (ratio==2)
                return 8;
            else if (ratio==3)
                return 11;
            else if (ratio==4)
                return 14;
            else if (ratio==5)
                return 15;
            else if (ratio==6)
                return 15;
            else
                return 16;

        })
        .style("stroke-width",function (d,i) {
            var ratio=(y*12+m)-i;
            if (ratio < 0) 
                ratio=ratio*-1;
            if (ratio==0){
                return 1.5;
            }
            else
                return 1;
        })
        .style("stroke-opacity", function (d,i) {
            var ratio=(y*12+m)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 1;
            else if (ratio==1)
                return .9;
            else if (ratio==2)
                return .8;
            else if (ratio==3)
                return .7;
            else if (ratio==4)
                return .6;
            else if (ratio==5)
                return .5;
            else if (ratio==6)
                return .4;
            else
                return .3;
        })
        .style("stroke","#000");

}