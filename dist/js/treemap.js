var margin_tree = {top: 10, right: 60, bottom: 10, left: 10}
var svg_tree = d3.select("#treemap")
var width_tree = +svg_tree.attr("width") - margin_tree.left - margin_tree.right;
var height_tree = +svg_tree.attr("height") - margin_tree.top - margin_tree.bottom;


svg_tree.attr("width", width_tree + margin_tree.left + margin_tree.right)
        .attr("height", height_tree + margin_tree.top + margin_tree.bottom)
        .append("g")
        .attr("transform","translate(" + margin_tree.left + "," + margin_tree.top + ")");

var tooltip_tree;

function addTooltip_tree() {                       


    tooltip_tree = svg_tree.append("g") // Group for the whole tooltip
        .attr("id", "tooltip-bias")
        .style("display", "none");
    
    tooltip_tree.append("polyline") // The rectangle containing the text, it is 210px width and 60 height
        .attr("points","0,0 210,0 210,60 0,60 0,0")
        .style("fill", "#222b1d")
        .style("stroke","black")
        .style("opacity","0.9")
        .style("stroke-width","1")
        .style("padding", "1em");
    
    tooltip_tree.append("line") // A line inserted between country name and score
        .attr("x1", 40)
        .attr("y1", 25)
        .attr("x2", 160)
        .attr("y2", 25)
        .style("stroke","#929292")
        .style("stroke-width","0.5")
        .attr("transform", "translate(0, 5)");
    
    var text_tree = tooltip_tree.append("text") // Text that will contain all tspan (used for multilines)
        .style("font-size", "13px")
        .style("fill", "#c1d3b8")
        .attr("transform", "translate(0, 20)");
    
        text_tree.append("tspan") // Country name udpated by its id
        .attr("x", 105) // ie, tooltip width / 2
        .attr("y", 0)
        .attr("id", "tooltip-bias-text")
        .attr("text-anchor", "middle")
        .style("font-weight", "100")
        .style("font-size", "12px");
    
        text_tree.append("tspan") // Fixed text
        .attr("x", 105) // ie, tooltip width / 2
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("fill", "929292")
        .text("Num. Incidents : ");
    
        text_tree.append("tspan") // Score udpated by its id
        .attr("id", "tooltip-bias-score")
        .style("fill","#c1d3b8")
        .style("font-weight", "bold");

    
    return tooltip_tree;
}
    
d3.json("../../dist/dataset/num_incident_2018.json").then(showdata)

function replace_long_terms(text){
    
    return text.replace("Anti American Indian Alaska Native","A-A.I.A.N")
                .replace("Anti Hawaiian Pacific Islander","A-H.P.I")
                .replace("Anti Multiple Race Group","A-M.Rac.G")
                .replace("Anti Multiple Religions Group","A-M.Rel.G")
                .replace("Anti Lesbian Gay Bisexual or Transgender","A-L.G.B.T")
                .replace("Anti Physical","A-P")
                .replace("Anti Male","A-M")
                .replace("Anti Female","A-F")
                .replace("Anti Heterosexual","A-Het.")
                .replace("Anti Bisexual","A-Bi")
                .replace("Anti Other Religion","A-Oth.Rel.")
                .replace("Anti Lesbian","A-Lesb.")
                .replace("Anti Atheism Agnosticism etc","A-Ath")
                .replace("Anti Non Conforming","A-N.C.")
                .replace("Multiple bias","")
}

function showdata(data){

    var root = d3.hierarchy(data).sum(function(d){ return d.value})
    d3.treemap()
    .size([width_tree, height_tree])
    .paddingTop(28)
    .paddingRight(17)
    .paddingInner(10)     
    (root)

    var color = d3.scaleOrdinal()
                    .domain(["Racial bias", "Religious bias", "Sexual Orientation bias",
                                "Disability bias","Gender bias","Multiple bias"])
                    .range([ "#cc0000", "#e6b800", "#0047b3","#804000","#33331a","#003300"])

    var opacity = d3.scaleLinear().domain([0, 2000]).range([.4,0.9])

    svg_tree.selectAll("rect")
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr('id',function(d){return "treemap-bias-rect_"+Math.round(d.x0)+"_"+Math.round(d.x1)+"_"+Math.round(d.y0)+"_"+Math.round(d.y1)})
            .style("stroke", "black")
            .style("fill", function(d){ return color(d.parent.data.name)} )
            .style("opacity", function(d){ return opacity(d.data.value)})


    svg_tree.selectAll("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function(d){ return d.x0+5}) 
            .attr("y", function(d){ return d.y0+10})  
            .text(function(d){ return replace_long_terms(d.data.name) })
            .attr("font-size", "10px")
            .attr("fill", "black")

    svg_tree.selectAll("vals")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function(d){ return d.x0+5})    
            .attr("y", function(d){ return d.y0+25}) 
            .text(function(d){ return d.data.value })
            .attr("font-size", "11px")
            .attr("fill", "black")

    svg_tree.selectAll("titles")
            .data(root.descendants().filter(function(d){return d.depth==1}))
            .enter()
            .append("text")
            .attr("x", function(d){ return d.x0})
            .attr("y", function(d){ return d.y0+21})
            .text(function(d){ return d.data.name })
            .attr("font-size", "19px")
            .attr("fill",  function(d){ return color(d.data.name)} )
        

    tooltip_tree = addTooltip_tree()
    root.leaves().forEach(function(d,i) {

        var bias_rect = d3.select("#treemap-bias-rect_" +Math.round(d.x0)+"_"+Math.round(d.x1)+"_"+Math.round(d.y0)+"_"+Math.round(d.y1));
        bias_rect
            .on("mouseover", function(e) {
                bias_rect.style("opacity", "0.2");
                tooltip_tree.style("display", null);
                tooltip_tree.select('#tooltip-bias-text').text(d.data.name)
                tooltip_tree.select('#tooltip-bias-score').text(d.data.value);
            })
            .on("mouseout", function(e) {
                bias_rect.style("opacity", opacity(d.data.value));
                tooltip_tree.style("display", "none");
            })
            .on("mousemove", function(e) {
                var mouse = d3.pointer(e);
                tooltip_tree.attr("transform", "translate(" + (mouse[0]-50) + "," + (mouse[1] - 75) + ")");
            });

    })

};
