var width_3, height_3;
const margin_3 = {top: 10, right: 50, bottom: 10, left: 50}

chart_3 = data => {
    
    var svg = d3.select("#treemap3");
    
    width_3 = svg.attr("width")
    height_3 = svg.attr("height")
    radius = (width_3-margin_3.left-margin_3.right) / 2
    svg = svg.append("g").attr('transform', `translate(${width_3/2},${height_3/2})`);
    tree = d3.tree()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)

    data = d3.hierarchy(data)
             .sort((a, b) => d3.ascending(a.data.name, b.data.name))    
    const root = tree(data);
    
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", d3.linkRadial()
            .angle(d => d.x)
            .radius(d => d.y));
    
    svg.append("g")
        .selectAll("circle")
        .data(root.descendants())
        .join("circle")
        .attr("transform", d => `
            rotate(${d.x * 180 / Math.PI - 90})
            translate(${d.y},0)
        `)
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);
    
    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("text")
        .data(root.descendants())
        .join("text")
        .attr("transform", d => `
            rotate(${d.x * 180 / Math.PI - 90}) 
            translate(${d.y},0) 
            rotate(${d.x >= Math.PI ? 180 : 0})
        `)
        .attr("dy", "0.31em")
        .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .text(d => {if(d.data.name.length > 20) return d.data.name.substring(0,20)+'...';else return d.data.name })
        .clone(true).lower()
        .attr("stroke", "white"); 
    
}

d3.json("../../folder_to_json.json").then(chart_3)
