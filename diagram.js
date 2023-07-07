// Example data representing nodes and links
Promise.all([
  d3.json('nodes.json'),
  d3.json('links.json'),
  d3.json('position.json')
]).then(([nodes, links, nodePosition]) => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    console.log("size change")
    updateLinks()
    updateNodes()
});
  // Create the diagram
  const svg = d3.select('#diagram')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%');
  // Create links
  svg.selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('x1', d => getNodeX(d.source)*width)
    .attr('y1', d => getNodeY(d.source)*height)
    .attr('x2', d => getNodeX(d.target)*width)
    .attr('y2', d => getNodeY(d.target)*height)
    .attr('stroke', 'black');

  // Create nodes
  svg.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('id', d => d.id)
    .attr('cx', d => getNodeX(d.id)*width)
    .attr('cy', d => getNodeY(d.id)*height)
    .attr('r', 10)
    .attr('fill', 'blue')
    .call(d3.drag()
      .on('drag', handleDrag)
      .on('end', handleDragEnd)
    );

  function rangeFix(number, min, max){
    if(number >= min && number <= max) return number;
    else if(number < min) return min;
    else return max;
  }
  // Helper functions to position nodes
  function getNodeX(nodeId) {
    // Return the X coordinate for a given node ID
    // Add your logic here
    var index = nodePosition.findIndex(obj => obj.id==nodeId);
    if(index == -1){
      nodePosition.push({
       id:nodeId,
       x:.5,
       y:.5
      })
      return .5
     }
    return rangeFix(nodePosition[index].x,0,1);
  }

  function getNodeY(nodeId) {
    // Return the Y coordinate for a given node ID
    var index = nodePosition.findIndex(obj => obj.id==nodeId);
    if(index == -1){
     nodePosition.push({
      id:nodeId,
      x:.5,
      y:.5
     })
     return .5
    }
    return rangeFix(nodePosition[index].y,0,1);
    // Add your logic here
  }

  // Drag event handler
  function handleDrag(event, d) {
    const { x, y } = event;
    var index = nodePosition.findIndex(obj => obj.id==d.id);
    console.log(nodePosition[index].x);
    nodePosition[index].x = rangeFix(x/width,0,1)
    nodePosition[index].y = rangeFix(y/height,0,1)
    d3.select(this)
      .attr('cx', nodePosition[index].x*width)
      .attr('cy', nodePosition[index].y*height);
    updateLinks();
  }
  function handleDragEnd(event, d) {
    updateJSON(d.id) // Update positions JSON file
  }
  // Update links when nodes are dragged
  function updateNodes() {
    svg.selectAll('circle')
      .attr('cx', d => getNodeX(d.id)*width)
      .attr('cy', d => getNodeY(d.id)*height)
    }
  function updateLinks() {
    svg.selectAll('line')
      .attr('x1', d => getNodeX(d.source)*width)
      .attr('y1', d => getNodeY(d.source)*height)
      .attr('x2', d => getNodeX(d.target)*width)
      .attr('y2', d => getNodeY(d.target)*height);
  }
  function updateJSON(nodeID){
    console.log("trying to update...")
    var index = nodePosition.findIndex(obj => obj.id==nodeID);
    console.log(nodePosition[index])
    fetch('fix.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nodePosition[index])
    })
      .then(response => console.log(response))
      .then(responseData => {
        // Handle the response from PHP
        return responseData
      })
      .catch(error => {
        // Handle any errors that occurred
        throw error
      });
  }
})