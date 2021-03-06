 	
var data_bar_chart;
var tooltip_bar_chart;
var svg_bar_chart = d3.select("#bar_chart");
// set the dimensions and margins of the graph
var margin_bar_chart = {top: 20, right: 20, bottom: 30, left: 200}
var width_bar_chart = +svg_bar_chart.attr("width") 
var height_bar_chart = +svg_bar_chart.attr("height")

// set the ranges
var y_bar_chart = d3.scaleBand()
          .range([0, height_bar_chart- margin_bar_chart.bottom])
          .padding(0.1);

var x_bar_chart = d3.scaleLinear()
          .range([0, width_bar_chart-200]);
          
svg_bar_chart = svg_bar_chart.append("g") 
    .attr("transform", "translate(" + margin_bar_chart.left + ", 0 )");

d3.csv("../../dist/dataset/bar_chart_dataset.csv").then(render_bar_chart)
  
select_menu_bar_chart = d3.select("#year_menu_bar_chart").on("change",change_year_bar_chart)

function render_bar_chart(data){
  
  data_bar_chart = data
  x_bar_chart.domain([0, d3.max(data_bar_chart, function(d){ return +d.value; })])
  y_bar_chart.domain(data_bar_chart.map(function(d) { return d.name; }));

  svg_bar_chart.append("g").attr("transform", "translate(0,"+(height_bar_chart - margin_bar_chart.bottom)  +")")
                .attr("class","bar_chart_axis_bottom")
               .call(d3.axisBottom(x_bar_chart));

  svg_bar_chart.append("g").attr("class","bar_chart_axis_left").call(d3.axisLeft(y_bar_chart))
  
  
  build_bars(select_menu_bar_chart.node().value)

  build_legend_bar_chart()
  
}

function build_legend_bar_chart(){
  at = svg_bar_chart.append('g')
  at.append("rect").attr("x",width_bar_chart/2.5).attr("y",height_bar_chart/2.8).attr("width", 20).attr("height",20).style("fill", "rgb(158, 15, 00)")
  at.append("rect").attr("x",width_bar_chart/2.5).attr("y",height_bar_chart/2.6).attr("width", 20).attr("height",20).style("fill", "rgb(223,99,93)")
  at.append("rect").attr("x",width_bar_chart/2.5).attr("y",height_bar_chart/2.4).attr("width", 20).attr("height",20).style("fill", "rgb(244, 203, 201)")
  at.append("rect").attr("x",width_bar_chart/2.5).attr("y",height_bar_chart/2.2).attr("width", 20).attr("height",20).style("fill", "gray")
  at.append("text").attr("x", (width_bar_chart/2.5)+30.0).attr("y", (height_bar_chart/2.8)+12).text("Biais Racial").style("font-size", "15px").attr("alignment-baseline","middle")
  at.append("text").attr("x", (width_bar_chart/2.5)+30.0).attr("y", (height_bar_chart/2.6)+12).text("Biais Religieux").style("font-size", "15px").attr("alignment-baseline","middle")
  at.append("text").attr("x", (width_bar_chart/2.5)+30.0).attr("y", (height_bar_chart/2.4)+12).text("Biais liés à l'orientation sexuelle").style("font-size", "15px").attr("alignment-baseline","middle")
  at.append("text").attr("x", (width_bar_chart/2.5)+30.0).attr("y", (height_bar_chart/2.2)+12).text("Autres Biais").style("font-size", "15px").attr("alignment-baseline","middle")

}


function build_bars(year_to_filter){

  data_filtered = data_bar_chart.filter(function(d){return d.date == year_to_filter})
  console.log(data_filtered)
  data_filtered.forEach(function(d) {
    d.value = +d.value;
  });
 

  svg_bar_chart.selectAll(".bar")
              .data(data_filtered)
              .enter().append("rect")
              .attr("width", function(d) {return x_bar_chart(d.value); } )
              .attr("y", function(d) { return y_bar_chart(d.name); })
              .attr("height", y_bar_chart.bandwidth())
              .attr("class",function(d){return "bar_barchart "+ d.category.replace(/\s+/g, '_')})
              .attr("id",function(d){return d.name.replace(/\s+/g, '_') +d.date});


}


function change_year_bar_chart(){

  if(this.id == "year_menu_bar_chart"){
     d3.selectAll(".bar_barchart").remove()
  
     build_bars(this.value)
  }
  
}