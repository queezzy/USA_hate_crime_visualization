//const { values } = require("d3");

var svg = d3.select("svg[id=map]");
var width = svg.attr("width");
var height = svg.attr("height");
var legendCellSize = 20;
var colors = ['#ffcccc', '#ffb3b3', '#ff9999', '#ff8080', '#ff6666', '#ff4d4d', '#ff3333', 
            '#ff1a1a', '#ff0000', '#e60000', '#cc0000', '#b30000', '#990000', '#800000', '#660000', '#4d0000'];


var legend = svg.append("g").attr("transform","translate(40,50)")
var tooltip;

function addLegend(min,max){

    legend.selectAll()
        .data(d3.range(colors.length))
        .enter()
        .append("rect")
        .attr("height",legendCellSize + "px")
        .attr("width",legendCellSize+ "px")
        .attr("x",5)
        .attr("y",d=>d*legendCellSize)
        .attr("fill",d=>colors[d])
        .attr("class","legend_rect")

    var legendScale = d3.scaleLinear().domain([min,max]).range([0,colors.length*legendCellSize])
    legendAxis = legend.append("g")
                        .attr("class","axis axis_legend")
                        .call(d3.axisLeft(legendScale));

    return legend
}


function addTooltip() {


    tooltip = svg.append("g") // Group for the whole tooltip
        .attr("id", "tooltip")
        .style("display", "none");
    
    tooltip.append("polyline") // The rectangle containing the text, it is 210px width and 60 height
        .attr("points","0,0 210,0 210,60 0,60 0,0")
        .style("fill", "#222b1d")
        .style("stroke","black")
        .style("opacity","0.9")
        .style("stroke-width","1")
        .style("padding", "1em");
    
    tooltip.append("line") // A line inserted between country name and score
        .attr("x1", 40)
        .attr("y1", 25)
        .attr("x2", 160)
        .attr("y2", 25)
        .style("stroke","#929292")
        .style("stroke-width","0.5")
        .attr("transform", "translate(0, 5)");
    
    var text = tooltip.append("text") // Text that will contain all tspan (used for multilines)
        .style("font-size", "13px")
        .style("fill", "#c1d3b8")
        .attr("transform", "translate(0, 20)");
    
    text.append("tspan") // Country name udpated by its id
        .attr("x", 105) // ie, tooltip width / 2
        .attr("y", 0)
        .attr("id", "tooltip-country")
        .attr("text-anchor", "middle")
        .style("font-weight", "600")
        .style("font-size", "16px");
    
    text.append("tspan") // Fixed text
        .attr("x", 105) // ie, tooltip width / 2
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("fill", "929292")
        .text("Num. Incidents : ");
    
    text.append("tspan") // Score udpated by its id
        .attr("id", "tooltip-score")
        .style("fill","#c1d3b8")
        .style("font-weight", "bold");

    
    return tooltip;
}

    
function getColorIndex(color) {
    for (var i = 0; i < colors.length; i++) {
        if (colors[i] === color) {
            return i;
        }
    }
    return -1;
}

/*const projection = d3.geoNaturalEarth1()
    .scale((width) /1.2)
    .translate([((width)*2.0), height/0.8]);
svg.attr("width",width*1.5)    
const path = d3.geoPath()
    .pointRadius(2)
    .projection(projection);*/

var projection = d3.geoAlbersUsa()
                    .translate([width/2, height/2])    // translate to center of screen
                    .scale([600]); 
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection); 
    
const cGroup = svg.append("g");
var select_menu = d3.select("#year_menu").on("change",change);
var select_menu_incident = d3.select("#bias_menu").on("change",change);

var actual_year = select_menu.node().value

var curve_index = ["Total_Incidents","Total_Racial_Ethnicity_Bias","Bias_Motivation_Religion",
                    "Bias_Motivation_SexualOrientation"]
var actual_curve = curve_index[select_menu_incident.node().selectedIndex]

var promises = [];
promises.push(d3.json("../../dist/dataset/usa_states.json"));
promises.push(d3.csv("../../dist/dataset/incidents_per_state.csv"));

var geojson;
var incidents_all;
var scores;
var tooltip;
var quantile
Promise.all(promises).then(function(values) {
    geojson = values[0]

    incidents_all = values[1];
  
    
  
    
    cGroup.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", d => "code" + d.properties.STATE_CODE)
            .attr("class","us_state_boundary");
            
    
    tooltip = addTooltip();

    const min = d3.min(incidents_all, d =>  +d[actual_curve]),
    max = d3.max(incidents_all, d =>  +d[actual_curve]);
    quantile = d3.scaleQuantile().domain([min, max])
                        .range(colors);
    legend = addLegend(min, max);
    render(actual_year,actual_curve)
    
});


function change(){

    if(this.id == "bias_menu"){

        actual_curve = curve_index[this.selectedIndex]
        render(actual_year,actual_curve,true)

    }
    else if(this.id == "year_menu"){
        console.log(this.selectedIndex)
        actual_year = this.value
        render(actual_year,actual_curve)
    }
    
}

function filter_year(elt){

    return elt.Year == this.valueOf();

}

function render(actual_year,actual_curve,build_legend){

    scores = incidents_all.filter(filter_year,actual_year);
   
    // Le traitement du CSV est réalisé ici

    if(build_legend) {
        
        d3.selectAll(".legend_rect").remove();
        d3.selectAll(".axis_legend").remove();
        console.log(actual_curve)
        const min = d3.min(incidents_all, d =>  +d[actual_curve]);
        const max = d3.max(incidents_all, d =>  +d[actual_curve]);
        quantile = d3.scaleQuantile().domain([min, max]).range(colors);
        legend = addLegend(min, max);


    }

    //We remove all the listeners

    d3.selectAll(".us_state_boundary").style("fill","gray")
                                        .on("mouseover",null)
                                        .on("mousemove",null)
                                        .on("mouseout",null);

    scores.forEach(function(e,i) {
        var countryPath = d3.select("#code" + e.State_Code);
        countryPath.attr("scorecolor", quantile(+e[actual_curve]))
                    .style("fill", quantile(+e[actual_curve]))
                    .on("mouseover", function(event) {
                        countryPath.style("fill", "#9966cc");
                        tooltip.style("display", null);
                        tooltip.select('#tooltip-country')
                                .text(e.State_label)
                            //.text(shortCountryName(e.State_label));
                        tooltip.select('#tooltip-score')
                            .text(e[actual_curve]);
                        legend.select("#cursor")
                            .attr('transform', 'translate(' + (legendCellSize + 5) + ', ' + (getColorIndex(quantile(+e[actual_curve])) * legendCellSize) + ')')
                            .style("display", null);
                    })
                    .on("mouseout", function(event) {
                        countryPath.style("fill", quantile(+e[actual_curve]));
                        tooltip.style("display", "none");
                        legend.select("#cursor").style("display", "none");
                    })
                    .on("mousemove", function(event) {
                        var mouse = d3.pointer(event);
                        tooltip.attr("transform", "translate(" + mouse[0] + "," + (mouse[1] - 75) + ")");
                    });
    });

}