var nodeSize = 17

build_root = function(data){ 

    let i = 0; 
    return d3.hierarchy(data).eachBefore(d => d.index = i++); 

}

chart_1 = data => {

    console.log("i have loaded data")
    root = build_root(data)
    const nodes = root.descendants();
    console.log("i have built nodes")
    const svg = d3.select("#treemap1")
    width = +svg.attr("width") // -margin.left-margin.right;
    height = +svg.attr("height")

    //svg.attr("viewBox", [width , -nodeSize * 3 / 2, width, (nodes.length + 1) * nodeSize])
        svg.attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .style("overflow", "visible");
  
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#999")
      .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", d => `
          M${d.source.depth * nodeSize},${d.source.index * nodeSize}
          V${d.target.index * nodeSize}
          h${nodeSize}
        `);
  
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
        .attr("transform", d => `translate(0,${d.index * nodeSize})`);
  
    node.append("circle")
        .attr("cx", d => d.depth * nodeSize)
        .attr("r", 2.5)
        .attr("fill", d => d.children ? null : "#999");
  
    node.append("text")
        .attr("dy", "0.32em")
        .attr("x", d => d.depth * nodeSize + 6)
        .text(d => d.data.name);
  
    node.append("title")
        .text(d => d.ancestors().reverse().map(d => d.data.name).join("/"));
    
    
  
}

d3.json("../../dist/dataset/folder_to_json.json").then(chart_1)