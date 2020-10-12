var margin_curv_viz = {top: 10, right: 100, bottom: 30, left: 50},
    width_curv_viz = 1000 - margin_curv_viz.left - margin_curv_viz.right,
    height_curv_viz = 800 - margin_curv_viz.top - margin_curv_viz.bottom;

var svg_curve = d3.select("#svg_curve_lines")
                    .attr("width", width_curv_viz + margin_curv_viz.left + margin_curv_viz.right)
                    .attr("height", height_curv_viz + margin_curv_viz.top + margin_curv_viz.bottom)
                    .append("g")
                    .attr("transform","translate(" + margin_curv_viz.left + "," + margin_curv_viz.top + ")");

d3.csv("/../../dist/dataset/curves_data.csv").then(render_curve)

function render_curve(data){

    
    var allGroup = ["Race", "Religion", "Sexe", "Autre"]

    var dataReady = allGroup.map(function(grpName) { 
        return {
        name: grpName,
        values: data.map(function(d) {
            return {time: d.time, value: +d[grpName]};
        })
        };
    });

    // A color scale: one color for each group
    var color_scale_line_curve = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x_line_curve = d3.scaleLinear()
                         .domain([2005,2018])
                         .range([ 0, width ]);
    svg_curve.append("g")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(x_line_curve));

    // Add Y axis
    var y_line_curve = d3.scaleLinear()
                         .domain( [30,8000])
                         .range([ height, 0 ]);
    svg_curve.append("g")
             .call(d3.axisLeft(y_line_curve));

    // Creation of the line generating function
    var line_curve = d3.line()
                        .x(function(d) { return x_line_curve(+d.time) })
                        .y(function(d) { return y_line_curve(+d.value) })

    svg_curve.selectAll("all_lines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("d", function(d){ return line_curve(d.values) } )
        .attr("stroke", function(d){ return color_scale_line_curve(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none")

    // Add the points
    svg_curve
      // First we need to enter in a group
      .selectAll("myDots")
      .data(dataReady)
      .enter()
        .append('g')
        .style("fill", function(d){ return color_scale_line_curve(d.name) })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x_line_curve(d.time) } )
        .attr("cy", function(d) { return y_line_curve(d.value) } )
        .attr("r", 5)
        .attr("stroke", "white")

    // Add a legend at the end of each line
    svg_curve
      .selectAll("myLabels")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
          .attr("transform", function(d) { return "translate(" + x_line_curve(d.value.time) + "," + y_line_curve(d.value.value) + ")"; }) // Put the text at the position of the last point
          .attr("x", 12) // shift the text a bit more right
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return color_scale_line_curve(d.name) })
          .style("font-size", 15)

}
