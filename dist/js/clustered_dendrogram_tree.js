
var width_2, height_2;
const margin_2 = {top: 10, right: 10, bottom: 10, left: 10}

tree = data => {
    const root = d3.hierarchy(data).sort((a, b) => d3.descending(a.height, b.height) || d3.ascending(a.data.name, b.data.name));
    root.dx = 10;
    root.dy = width_2 / (root.height + 1);
    console.log(root.height)
    return d3.cluster().size([height_2,width_2])(root);
  }


chart_2 = data => {
    
  
    var svg_2 = d3.select("#treemap2");
    width_2 = +svg_2.attr("width") 
    height_2 = +svg_2.attr("height") 
    const root = tree(data); 
    svg_2.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", d => `
          M${d.target.y},${d.target.x}
          C${d.source.y + root.dy / 2},${d.target.x}
           ${d.source.y + root.dy / 2},${d.source.x}
           ${d.source.y},${d.source.x}
        `);
  
    svg_2.append("g")
      .selectAll("circle")
      .data(root.descendants())
      .join("circle")
        .attr("cx", d => d.y)
        .attr("cy", d => d.x)
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);
  
    svg_2.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .attr("x", d => d.y)
        .attr("y", d => d.x)
        .attr("dy", "0.31em")
        .attr("dx", d => d.children ? -6 : 6)
        .text(d => {if(d.data.name.length > 15) return d.data.name.substring(0,15)+'...';else return d.data.name })
      .filter(d => d.children)
        .attr("text-anchor", "end")
      .clone(true).lower()
        .attr("stroke", "white");
  
}
d3.json("../../dist/dataset/folder_to_json.json").then(chart_2)
