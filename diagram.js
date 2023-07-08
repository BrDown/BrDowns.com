// main code

// waits for all of the jsons before doing anything
var link;
function linkNodes(foo) {
  link = foo;
  console.log(foo)
}
Promise.all([
  d3.json('nodes.json'),
  d3.json('links.json'),
  d3.json('position.json')
]).then(([nodes, links, nodePosition]) => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  
  // initalizes the panel
  const clickPanel = document.getElementById('clickPanel');

  // if you resize the page
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    console.log("size change")
    updateLinks()
    updateNodes()
});
  
  const svg = d3.select('#diagram')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%');
  
  function refresh() { // initalizes the lines
  svg.html("")
  svg.selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('x1', d => getNodeX(d.source)*width)
    .attr('y1', d => getNodeY(d.source)*height)
    .attr('x2', d => getNodeX(d.target)*width)
    .attr('y2', d => getNodeY(d.target)*height)
    .attr('stroke', 'black');

  // initalizes the nodes
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
    )
    .on('click', handleClick);
}
refresh()
    // helper function that takes a number, then keeps it within a min/max range
  function rangeFix(number, min, max){
    if(number >= min && number <= max) return number;
    else if(number < min) return min;
    else return max;
  }
  // another helper function that simply asks the position JSON for a X value of a node
  // also has a catch (the index being -1) incase it doesnt exist which creates a new position in the JSON
  function getNodeX(nodeId) {
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

  // same as above, but for Y
  function getNodeY(nodeId) {
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
    
  }
  
  function handleClick(event, d) {
    console.log(event)
    console.log(d)
    clickPanel.style.left = event.pageX + 'px';
    clickPanel.style.top = event.pageY + 'px';
    document.getElementById("name").innerHTML = d.name;
    document.getElementById("linker").class = d.id;
    if(link != null) {
      console.log(`linking ${link} and ${d.id}`)
      updateLINK(link, d.id)
      found = false
      for(let i = links.length-1; i >= 0; i--)
        // console.log(links[i])
        if((links[i].source == link && links[i].target == d.id) || (links[i].target == link && links[i].source == d.id)){
          found = true;
          links.splice(i, 1)
        }
      if(!found)
        links.push({
          "source":link,
          "target":d.id
        });
      link = null;
      refresh()
    } else
      clickPanel.classList.remove('hidden');
  }
  // Drag function, AKA move the node to the mouse position
  function handleDrag(event, d) {
    clickPanel.classList.add('hidden');
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
  // at the end of the drag, update the global JSON
  function handleDragEnd(event, d) {
    updateJSON(d.id) 
  }
  // ajusts the nodes if the page is resized
  function updateNodes() {
    svg.selectAll('circle')
      .attr('cx', d => getNodeX(d.id)*width)
      .attr('cy', d => getNodeY(d.id)*height)
    }
  // ajusts the lines if the page is resized
  function updateLinks() {
    svg.selectAll('line')
      .attr('x1', d => getNodeX(d.source)*width)
      .attr('y1', d => getNodeY(d.source)*height)
      .attr('x2', d => getNodeX(d.target)*width)
      .attr('y2', d => getNodeY(d.target)*height);
  }

  // makes a php post request to fix.php which will update the global JSON
  function updateJSON(nodeID){
    console.log("trying to update...")
    var index = nodePosition.findIndex(obj => obj.id==nodeID);
    console.log(nodePosition[index])
    fetch('position.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nodePosition[index])
    })
      .then(response => console.log(response))
      .then(responseData => {
        
        return responseData
      })
      .catch(error => {
        
        throw error
      });
  }

  function updateLINK(originalNode, targetNode){
    console.log("trying to update...")
    let data = {
      source:originalNode,
      target:targetNode
    }
    fetch('links.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => console.log(response))
      .then(responseData => {
        
        return responseData
      })
      .catch(error => {
        
        throw error
      });
  }

  function updateJSON(nodeID){
    console.log("trying to update...")
    var index = nodePosition.findIndex(obj => obj.id==nodeID);
    console.log(nodePosition[index])
    fetch('position.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nodePosition[index])
    })
      .then(response => console.log(response))
      .then(responseData => {
        
        return responseData
      })
      .catch(error => {
        
        throw error
      });
  }
})