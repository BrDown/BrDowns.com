// main code

// waits for all of the jsons before doing anything
var startOffsetX = 0;
var startOffsetY = 0;
var offsetX = 0;
var offsetY = 0;
var totaloffsetX = (localStorage.getItem('X')?parseInt(localStorage.getItem('X')):0);
let tempLink = null;
var totaloffsetY = (localStorage.getItem('Y')?parseInt(localStorage.getItem('Y')):0);
var mouseIsDown = false;
var zoom = 1
var link;
// var nodes;
let linker2 = false
var togged = true;
var toggedDes = false;
let nodes = (localStorage.getItem('nodes')?JSON.parse(localStorage.getItem('nodes')):[])
let links = (localStorage.getItem('links')?JSON.parse(localStorage.getItem('links')):[])
let nodePosition = (localStorage.getItem('nodePosition')?JSON.parse(localStorage.getItem('nodePosition')):[])

// console.log(nodePosition)

function RESETLOCALSTOARTE(){
  
}
// if(nodes == null) {
  // RESETLOCALSTOARTE()
  // nodes = JSON.parse(localStorage.getItem('nodes'))
  // links = JSON.parse(localStorage.getItem('links'))
  // nodePosition = JSON.parse(localStorage.getItem('nodePosition'))

// }
function rangeFix(number, min, max){
  if(number >= min && number <= max) return number;
  else if(number < min) return min;
  else return max;
}



function toggleNewNode(onoff) {
  if(onoff === undefined)
    togged = !togged;
  else
    togged = onoff;
  if(togged){
    document.getElementById("nodeModification").className = "hidden"
    document.getElementById("newNode").className = ""
    document.getElementById("closebtn").className = "hidden"
    document.getElementById("descript").className = "hidden"
    toggleDescript(false)
    
  } else {
    document.getElementById("nodeModification").className = ""
    document.getElementById("newNode").className = "hidden"
    document.getElementById("closebtn").className = "" 
    document.getElementById("descript").className = ""
  }
}
document.onkeydown = function(evt) {
  if (evt.keyCode == 27) {
      toggleDescript()
  }
};
function toggleDescript(onoff) {
  if(onoff === undefined)
    toggedDes = !toggedDes;
  else
  toggedDes = onoff;
  if(toggedDes){
    document.getElementById("descript").style.top= "11%";
    document.getElementById("descript").style.left= "10%";
    document.getElementById("descript").style.right= "10%";
    document.getElementById("descript").style.bottom= "10%";
  } else {
    document.getElementById("descript").style.top= "-10%";
    document.getElementById("descript").style.left= "-10%";
    document.getElementById("descript").style.right= "100%";
    document.getElementById("descript").style.bottom= "100%";
    
  }
}

function linkNodes(foo) {
  // link = foo;
  linker2 = true
  foo.disabled = true
  document.getElementById("newNode").disabled = true
  document.getElementById("CA").innerHTML = "(Un)Link Dots"
  // console.log("e")
}
function updateNODE(nodeID, name, color, description){
  // console.log("trying to update...")
  localStorage.setItem('X', totaloffsetX)
  localStorage.setItem('Y', totaloffsetY)
  localStorage.setItem('nodes', JSON.stringify(nodes))
  localStorage.setItem('links', JSON.stringify(links))
  localStorage.setItem('nodePosition', JSON.stringify(nodePosition))
  // if(name == null) name = "null"
  // if(color == null) color = "null"
  // if(description == null) description = "null"
  // let data = {
  //   id:nodeID,
  //   name:name,
  //   color:color,
  //   description:description
  // }
  // fetch('node.php', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(data)
  // })
  //   .then(response => console.log(response))
  //   .then(responseData => {
      
  //     return responseData
  //   })
  //   .catch(error => {
      
  //     throw error
  //   });
}
  localStorage.setItem('nodes', JSON.stringify(nodes))
  localStorage.setItem('links', JSON.stringify(links))
  localStorage.setItem('nodePosition', JSON.stringify(nodePosition))
  let newNode2 = false
  let width = window.innerWidth*zoom;
  let height = window.innerHeight*zoom;
  let originalPos = JSON.parse(JSON.stringify(nodePosition));
  // if you resize the page
  window.addEventListener("resize", () => {
    width = window.innerWidth*zoom;
    height = window.innerHeight*zoom;
    console.log("size change")
    refresh()
});







window.addEventListener('mousewheel', (event) => {
  // console.log(event.wheelDelta)
  if(event.wheelDelta>0) zoom += 0.05
  else zoom -= 0.05
  zoom = rangeFix(zoom, 0.1, 2)
  width = window.innerWidth*zoom;
  height = window.innerHeight*zoom;
  if(!(zoom == 0.1 || zoom == 2))
  if(event.wheelDelta>0){
    totaloffsetX -= zoom*20;
    totaloffsetY -= zoom*20;
  } else {
    totaloffsetX += zoom*20;
    totaloffsetY += zoom*20;
  }
  // console.log(centerScreenX - mouseX)
  refresh()
});  



  const svg = d3.select('#diagram')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%');
  
  document.getElementById("Change Name").addEventListener("keyup", () => {
    let name = document.getElementById("Change Name").value;
    updateNODE(document.getElementById('linker').class, name, null, null)
    var index = nodes.findIndex(obj => obj.id==document.getElementById('linker').class);
    if(index!=-1){
      // document.getElementById('name').innerText = name
      
      nodes[index].name=name;
      refresh()
    }
  });
  document.getElementById("descript").addEventListener("keyup", () => {
    let description = document.getElementById("descript").value;
    updateNODE(document.getElementById('linker').class, null, null, description)
    var index = nodes.findIndex(obj => obj.id==document.getElementById('linker').class);
    if(index!=-1){
      nodes[index].description=description;
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
  function zoomed(soom){
    zoom += soom
    zoom = rangeFix(zoom, 0.1, 2)
    width = window.innerWidth*zoom;
    height = window.innerHeight*zoom;
    if(!(zoom == 0.1 || zoom == 2))
    if(soom>0){
      totaloffsetX -= zoom*20;
      totaloffsetY -= zoom*20;
    } else {
      totaloffsetX += zoom*20;
      totaloffsetY += zoom*20;
    }
    refresh()
    // console.log(centerScreenX - mouseX)
  }
  // document.getElementById('zoomin').addEventListener('click', zoomed(.1))
  // document.getElementById('zoomout').addEventListener('click', zoomed(-.1))
  document.getElementById("Change Color").addEventListener("change", () => {
    let color = document.getElementById("Change Color").value;
    updateNODE(document.getElementById('linker').class, null, color, null)
  });
  document.getElementById("delete Node").addEventListener("click", () => {
    let name = confirm('Are you sure you want to delete this node?');
    // updateJSON(document.getElementById('linker').class, true)
    // updateLINK(document.getElementById('linker').class, "null")
    var index = nodes.findIndex(obj => obj.id==document.getElementById('linker').class);
    nodes.splice(index, 1)
    // console.log(links)
    for(let i = links.length-1; i >= 0; i--)
      if(links[i].source == document.getElementById('linker').class || links[i].target == document.getElementById('linker').class)
        links.splice(i, 1)
    clearBar()
    updateNODE(document.getElementById('linker').class, null, null, null)
    refresh()
  });
  
  function refresh() { // initalizes the lines
  svg.html("")
  originalPos = JSON.parse(JSON.stringify(nodePosition));
  svg.selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('x1', d => getNodeX(d.source)*width+offsetX+totaloffsetX)
    .attr('y1', d => getNodeY(d.source)*height+offsetY+totaloffsetY)
    .attr('x2', d => getNodeX(d.target)*width+offsetX+totaloffsetX)
    .attr('y2', d => getNodeY(d.target)*height+offsetY+totaloffsetY)
    .attr('stroke-width', zoom)
    .attr('stroke', 'lightgray');

  // initalizes the nodes
  const nodesSelection = svg.selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr("transform", `scale(${zoom},${zoom})`)
    .call(d3.drag()
      .on('start', handleDragStart)
      .on('drag', handleDrag)
      .on('end', handleDragEnd)
    )
    .on('click', handleClick);

  nodesSelection.append('circle')
    .attr('id', d => d.id)
    .attr('cx', d => (getNodeX(d.id) * width+offsetX+totaloffsetX) * (1/zoom))
    .attr('cy', d => (getNodeY(d.id) * height+offsetY+totaloffsetY) * (1/zoom))
    .attr('r', d => 10+countAppearences(d.id, true, false)*1)
    .attr('fill', d => d.color);

  nodesSelection.append('text')
    .attr('class', 'label')
    .attr('x', d => (getNodeX(d.id) * width+offsetX+totaloffsetX)* (1/zoom))
    .attr('y', d => (getNodeY(d.id) * height+offsetY+totaloffsetY) * (1/zoom)+20) // Adjust the y position for the label
    .text(d => d.name);
}
console.log(nodes == null)
refresh()
    // helper function that takes a number, then keeps it within a min/max range
    // OLD HELPER FUNCTION
  
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
      // refresh()
      return .5
     }
    return nodePosition[index].x;
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
    //  refresh()
     return .5
    }
    return nodePosition[index].y;
    
  }
  
  function handleClick(event, d) {
    // console.log(event)
    // console.log(d)
    if(link != null && link != d.id) {
      console.log(`linking ${link} and ${d.id}`)
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
      updateLINK(link, d.id)
      refresh()
    } else {
      toggleNewNode(false)
      // document.getElementById("name").innerHTML = d.name;
      document.getElementById("descript").value = d.description;
      document.getElementById("linker").class = d.id;
      document.getElementById("Change Name").value = d.name;
      document.getElementById("Change Color").value = d.color;
    }
  }
  document.getElementById("newNode").addEventListener('click', () => {
    newNode2 = true
    document.getElementById("newNode").disabled = true
    document.getElementById("linker").disabled = true
    document.getElementById("CA").innerHTML = "Place Dot"
  });
  document.addEventListener('click', function(e) {
    const target = e.target;
    if (!target.matches('circle') && !target.matches('button') && !target.matches('input') && !target.matches('a')&& !target.matches('textarea')) {
      if(link == null){
        clearBar()
        if(newNode2){  
          newNode2 = false
          document.getElementById("newNode").disabled = false
          document.getElementById("linker").disabled = false
          document.getElementById("CA").innerHTML = "Edit Dots"
          let randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
          let id = ""+Math.floor(Math.random()*16777215)
          let name = generateName()
          nodes.push({
            id:id,
            name:name,
            color:randomColor, 
            description:"No description provided."
          });
          updateNODE(id,name,randomColor, "No description provided.")
          nodePosition.push({
            id:id,
            x:(e.clientX/width)-(totaloffsetX/width),
            y:(e.clientY/height)-(totaloffsetY/height)
          });
          refresh()
        }
      }
    }
  });
  document.addEventListener('mousedown', function(event) {
    const target = event.target;
    if (!target.matches('circle') && !target.matches('input') && !target.matches('a')&& !target.matches('textarea')) {
      startOffsetX=event.x
      startOffsetY=event.y
      mouseIsDown=true
      refresh()
    }
  });
  document.addEventListener('mousemove', function(event) {
    const target = event.target;
    
    if (mouseIsDown) {
      offsetX=-(startOffsetX-event.x) 
      offsetY=-(startOffsetY-event.y)
      refresh()
      // console.log(offsetX)
    }
  });
  document.addEventListener('mouseup', function(event) {
    if (mouseIsDown) {
      mouseIsDown = !mouseIsDown
      totaloffsetX+=offsetX
      totaloffsetY+=offsetY
      offsetX=0
      offsetY=0
      refresh()
    }
  });
  
  document.addEventListener('touchstart', function(event) {
    const target = event.target;
    // console.log(event)
    if (!target.matches('circle') && !target.matches('input') && !target.matches('a')&& !target.matches('textarea')) {
      startOffsetX=event.touches[0].clientX
      startOffsetY=event.touches[0].clientY
      mouseIsDown=true
      refresh()
    }
  });
  document.addEventListener('touchmove', function(event) {
    const target = event.target;
    
    if (mouseIsDown) {
      offsetX=-(startOffsetX-event.touches[0].clientX) 
      offsetY=-(startOffsetY-event.touches[0].clientY)
      refresh()
      // console.log(offsetX)
    }
  });
  document.addEventListener('touchend', function(event) {
    if (mouseIsDown) {
      mouseIsDown = !mouseIsDown
      totaloffsetX+=offsetX
      totaloffsetY+=offsetY
      offsetX=0
      offsetY=0
      refresh()
    }
  });
  function clearBar(){
    // document.getElementById("name").innerHTML = "None Selected";
    document.getElementById("descript").value = "";
    document.getElementById("linker").class = null;
    toggleNewNode(true)
  }

  function handleDragStart(event, d) {
    // currently unsed
    // console.log(linker2)
    if(linker2) {
      link = d.id;
      tempLink = svg
        .append('line')
        .attr('x1', getNodeX(d.id) * width + offsetX + totaloffsetX)
        .attr('y1', getNodeY(d.id) * height + offsetY + totaloffsetY)
        .attr('x2', getNodeX(d.id) * width + offsetX + totaloffsetX)
        .attr('y2', getNodeY(d.id) * height + offsetY + totaloffsetY)
        .attr('stroke', 'lightgray')
        .attr('stroke-width', 2 / zoom);

    }
  }
  // Drag function, AKA move the node to the mouse position
  function handleDrag(event, d) {
    const { x, y } = event;
    if(link == null){
      toggleNewNode(false)
      // document.getElementById("name").innerHTML = d.name;
      document.getElementById("descript").value = d.description;
      document.getElementById("linker").class = d.id;
      document.getElementById("Change Name").value = d.name;
      document.getElementById("Change Color").value = d.color;
      var index = nodePosition.findIndex(obj => obj.id==d.id);
      // console.log(nodePosition[index].x);
      nodePosition[index].x = (x-totaloffsetX)/width
      nodePosition[index].y = (y-totaloffsetY)/height
      const group = d3.select(this);
      // console.log(originalPos)
      group.attr('transform', `scale(${zoom},${zoom}), translate(${(-((originalPos[index].x * width) - (nodePosition[index].x * width)))* (1/zoom)},${(-((originalPos[index].y * height) - (nodePosition[index].y * height))* (1/zoom))})`);
      updateLinks();
    } else if(linker2) tempLink.attr('x2', event.x).attr('y2', event.y);
    
  }
  // at the end of the drag, update the global JSON
  function handleDragEnd(e, d) {
    const targetNode = findNodeAtCoordinates(e.x, e.y);
    if (targetNode && link) {
      endNode = targetNode.id;
      // Create the link between startNode and endNode
      if(link != endNode) {
        
        console.log(`linking ${link} and ${endNode}`)
        
        found = false
        for(let i = links.length-1; i >= 0; i--)
          if((links[i].source == link && links[i].target == endNode) || (links[i].target == link && links[i].source == endNode)){
            found = true;
            links.splice(i, 1)
          }
        if(!found)
          links.push({
            "source":link,
            "target":endNode
          });
        updateLINK(link, endNode)
        refresh()
        }
      } else updateJSON(d.id) 
      if (tempLink) {
        tempLink.remove();
        tempLink = null;
      }
      linker2 = false
      link = null;
      document.getElementById('linker').disabled = false
      document.getElementById("newNode").disabled = false
      document.getElementById("CA").innerHTML = "Edit Dots"
    
  }

  function findNodeAtCoordinates(x, y) {
    // Helper function to find the node at the given coordinates
    // Loop through the nodes and check if the coordinates are within the node's circle
    const node = nodes.find((node) => {
      const nodeX = getNodeX(node.id) * width + offsetX + totaloffsetX;
      const nodeY = getNodeY(node.id) * height + offsetY + totaloffsetY;
      const distanceSquared = (nodeX - x) ** 2 + (nodeY - y) ** 2;
      return distanceSquared <= (10 + countAppearences(node.id, true, false) * 1) ** 2;
    });
    return node;
  }
  
  // support code to find the amount of times a node appears
  function countAppearences(id, source, target){
    
    if(source === undefined) source = true;
    if(target === undefined) target = true;
    let count = 0;
    links.forEach(link => {
      if(link.source == id && source)
          count++;
        if(link.target == id && target)
          count++;
    });
    // console.log(count)
    return count
  }



  // ajusts the nodes if the page is resized
  // OUTDATED CODE aka no use for it now
  function updateNodes() {
    svg.selectAll('.node')
      .attr('cx', d => getNodeX(d.id)*width)
      .attr('cy', d => getNodeY(d.id)*height)
    }
  // ajusts the lines if the page is resized
  function updateLinks() {
    svg.selectAll('line')
      .attr('x1', d => getNodeX(d.source)*width+offsetX+totaloffsetX)
      .attr('y1', d => getNodeY(d.source)*height+offsetY+totaloffsetY)
      .attr('x2', d => getNodeX(d.target)*width+offsetX+totaloffsetX)
      .attr('y2', d => getNodeY(d.target)*height+offsetY+totaloffsetY);
  }

  // makes a php post request to fix.php which will update the global JSON
  function updateJSON(nodeID, deleted = false){
    // console.log("trying to update...")
    localStorage.setItem('X', totaloffsetX)
    localStorage.setItem('Y', totaloffsetY)
    localStorage.setItem('nodes', JSON.stringify(nodes))
    localStorage.setItem('links', JSON.stringify(links))
    localStorage.setItem('nodePosition', JSON.stringify(nodePosition))
    // var index = nodePosition.findIndex(obj => obj.id==nodeID);
    // if(deleted){
    //   nodePosition[index].x = "null"
    //   nodePosition[index].y = "null"
    // }
    // // console.log(nodePosition[index])
    // fetch('position.php', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(nodePosition[index])
    // })
    //   .then(response => console.log(response))
    //   .then(responseData => {
        
    //     return responseData
    //   })
    //   .catch(error => {
        
    //     throw error
    //   });
  }

  function updateLINK(originalNode, targetNode){
    // console.log("trying to update...")
    localStorage.setItem('X', totaloffsetX)
  localStorage.setItem('Y', totaloffsetY)
    localStorage.setItem('nodes', JSON.stringify(nodes))
    localStorage.setItem('links', JSON.stringify(links))
    localStorage.setItem('nodePosition', JSON.stringify(nodePosition))
  //   let data = {
  //     source:originalNode,
  //     target:targetNode
  //   }
  //   fetch('links.php', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   })
  //     .then(response => console.log(response))
  //     .then(responseData => {
        
  //       return responseData
  //     })
  //     .catch(error => {
        
  //       throw error
  //     });
  }

  