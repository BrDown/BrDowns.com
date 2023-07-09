// main code

// waits for all of the jsons before doing anything
var link;
var nodes;
var togged = true;
function toggleNewNode(onoff) {
  if(onoff === undefined)
    togged = !togged;
  else
    togged = onoff;
  if(togged){
    document.getElementById("nodeModification").className = "hidden"
    document.getElementById("newNode").className = ""
  } else {
    document.getElementById("nodeModification").className = ""
    document.getElementById("newNode").className = "hidden"
  }
}

function linkNodes(foo) {
  link = foo;
  console.log(foo)
}
function updateNODE(nodeID, name, color){
  console.log("trying to update...")
  if(name == null) name = "null"
  if(color == null) color = "null"
  let data = {
    id:nodeID,
    name:name,
    color:color
  }
  fetch('node.php', {
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
Promise.all([
  d3.json('nodes.json'),
  d3.json('links.json'),
  d3.json('position.json')
]).then(([nodes, links, nodePosition]) => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let originalPos = JSON.parse(JSON.stringify(nodePosition));

  // if you resize the page
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    console.log("size change")
    refresh()
});
  
  const svg = d3.select('#diagram')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%');
  
  document.getElementById("Change Name").addEventListener("keyup", () => {
    let name = document.getElementById("Change Name").value;
    updateNODE(document.getElementById('linker').class, name, null)
    var index = nodes.findIndex(obj => obj.id==document.getElementById('linker').class);
    if(index!=-1){
      document.getElementById('name').innerText = name
      refresh()
      nodes[index].name=name;
    }
  });
  document.getElementById("Change Color").addEventListener("input", () => {
    let color = document.getElementById("Change Color").value;
    var index = nodes.findIndex(obj => obj.id==document.getElementById('linker').class);
    if(index!=-1){
      nodes[index].color=color;
    }
    refresh()
  });
  document.getElementById("Change Color").addEventListener("change", () => {
    let color = document.getElementById("Change Color").value;
    updateNODE(document.getElementById('linker').class, null, color)
  });
  document.getElementById("delete Node").addEventListener("click", () => {
    let name = confirm('Are you sure you want to delete this node?');
    updateNODE(document.getElementById('linker').class, null, null)
    updateJSON(document.getElementById('linker').class, true)
    updateLINK(document.getElementById('linker').class, "null")
    var index = nodes.findIndex(obj => obj.id==document.getElementById('linker').class);
    nodes.splice(index, 1)
    console.log(links)
    for(let i = links.length-1; i >= 0; i--)
      if(links[i].source == document.getElementById('linker').class || links[i].target == document.getElementById('linker').class)
        links.splice(i, 1)
    refresh()
  });
  
  function refresh() { // initalizes the lines
  svg.html("")
  originalPos = JSON.parse(JSON.stringify(nodePosition));
  svg.selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('x1', d => getNodeX(d.source)*width)
    .attr('y1', d => getNodeY(d.source)*height)
    .attr('x2', d => getNodeX(d.target)*width)
    .attr('y2', d => getNodeY(d.target)*height)
    .attr('stroke', 'white');

  // initalizes the nodes
  const nodesSelection = svg.selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(d3.drag()
      .on('drag', handleDrag)
      .on('end', handleDragEnd)
    )
    .on('click', handleClick);

  nodesSelection.append('circle')
    .attr('id', d => d.id)
    .attr('cx', d => getNodeX(d.id) * width)
    .attr('cy', d => getNodeY(d.id) * height)
    .attr('r', 10)
    .attr('fill', d => d.color);

  nodesSelection.append('text')
    .attr('class', 'label')
    .attr('x', d => getNodeX(d.id) * width)
    .attr('y', d => getNodeY(d.id) * height + 20) // Adjust the y position for the label
    .text(d => d.name);
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
      refresh()
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
     refresh()
     return .5
    }
    return rangeFix(nodePosition[index].y,0,1);
    
  }
  
  function handleClick(event, d) {
    console.log(event)
    console.log(d)
    if(link != null && link != d.id) {
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
    } else {
      toggleNewNode(false)
      document.getElementById("name").innerHTML = d.name;
      document.getElementById("linker").class = d.id;
      document.getElementById("Change Name").value = d.name;
      document.getElementById("Change Color").value = d.color;
    }
  }
  document.getElementById("newNode").addEventListener('click', () => {
    let randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
    let id = ""+Math.floor(Math.random()*16777215)
    let name = generateName()
    nodes.push({
      id:id,
      name:name,
      color:randomColor
     });
     updateNODE(id,name,randomColor)
    nodePosition.push({
      id:id,
      x:.5,
      y:.5
     });
     refresh()
  });
  document.addEventListener('click', function(event) {
    const target = event.target;
    if (!target.matches('circle') && !target.matches('input')) {
      if(link == null)clearBar()
    }
  });
  
  function clearBar(){
    document.getElementById("name").innerHTML = "None Selected";
    document.getElementById("linker").class = null;
    toggleNewNode(true)
  }
  // Drag function, AKA move the node to the mouse position
  function handleDrag(event, d) {
    const { x, y } = event;
    if(link == null){
      toggleNewNode(false)
      document.getElementById("name").innerHTML = d.name;
      document.getElementById("linker").class = d.id;
      document.getElementById("Change Name").value = d.name;
      document.getElementById("Change Color").value = d.color;
    }
    var index = nodePosition.findIndex(obj => obj.id==d.id);
    console.log(nodePosition[index].x);
    nodePosition[index].x = rangeFix(x/width,0,1)
    nodePosition[index].y = rangeFix(y/height,0,1)
    const group = d3.select(this);
    console.log(originalPos)
    group.attr('transform', `translate(${-((originalPos[index].x * width) - (nodePosition[index].x * width))},${-((originalPos[index].y * height) - (nodePosition[index].y * height))})`);
    updateLinks();
    
  }
  // at the end of the drag, update the global JSON
  function handleDragEnd(event, d) {
    updateJSON(d.id) 
  }
  // ajusts the nodes if the page is resized
  function updateNodes() {
    svg.selectAll('.node')
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
  function updateJSON(nodeID, deleted = false){
    console.log("trying to update...")
    var index = nodePosition.findIndex(obj => obj.id==nodeID);
    if(deleted){
      nodePosition[index].x = "null"
      nodePosition[index].y = "null"
    }
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

  
})