const svg_4 = d3.select('#treemap4');
const width_4 = +svg_4.attr("width");
const height_4 = +svg_4.attr("height") ;

const margin_4 = { top: 0, right: 50, bottom: 0, left: 75};
const innerWidth = width_4 - margin_4.left - margin_4.right;
const innerHeight = height_4 - margin_4.top - margin_4.bottom;

const treeLayout = d3.tree().size([innerHeight, innerWidth]);

const zoomG = svg_4.append('g');

const g = zoomG.append('g').attr('transform', `translate(${margin_4.left},${margin_4.top})`);

/*svg_4.call(d3.zoom().on('zoom', () => {
    zoomG.attr('transform', d3.event.transform);
}));*/
  
  
chart_4 = data => {
    const root = d3.hierarchy(data);
    const links = treeLayout(root).links();
    const linkPathGenerator = d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x);
    g.selectAll('path').data(links)
      .enter().append('path')
        .attr('d', linkPathGenerator);
  
    g.selectAll('text').data(root.descendants())
      .enter().append('text')
        .attr('x', d => d.y)
        .attr('y', d => d.x)
        .attr('dy', '0.32em')
        .attr('text-anchor', d => d.children ? 'middle' : 'start')
        .attr('font-size', d => (2 - d.depth/4)/3 + 'em')
        .text(d => {if(d.data.name.length > 15) return d.data.name.substring(0,15)+'...';else return d.data.name });
        //.text(d => d.data.data.id);
  };

  d3.json("../../dist/dataset/folder_to_json.json").then(chart_4)
