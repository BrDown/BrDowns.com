// main code




// TODO:remove the default diagram for.... obvious reasons. 





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

// code = 'foo'
var test;
var database = firebase.database();
// let current = database.ref(code);
var code;
function restartFB(code) {
  // if (typeof test !== 'undefined')
  //   test.off()
  code = code.replace(/^a-zA-Z0-9 ]/g, '')
  code = code.replace(/\s/g, '')
  if(code==""){
  document.getElementById('onGod').value = "ERROR: Blank";
    throw new Error("nice try fucknuts.")
}
  this.code = code
  parent.location.hash = code
  document.getElementById('onGod').value = code;
  if(typeof data !== 'undefined')
  data = []
  if(typeof dataArray !== 'undefined')
  dataArray = []
  test = firebase.database().ref(code).on('value',(ss) => {
    data = ss.val()
    if(data)
      dataArray = Object.entries(data);
    else
      dataArray = []
    originalPos = JSON.parse(JSON.stringify(data));
    refresh()
  })
  // refresh()
}
// var code2 = getParameterByName('code');
// console.log(parent.location.hash != "")
if(parent.location.hash != "") restartFB(parent.location.hash.slice(1));
else restartFB("foo")

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
  // document.getElementById("CA").innerHTML = "(Un)Link Dots"
  // console.log("e")
}
function updateNODE(nodeID, name, color, description,links, x1,y1){
  // console.log("trying to update...")
  // localStorage.setItem('X', totaloffsetX)
  // localStorage.setItem('Y', totaloffsetY)
  // localStorage.setItem('nodes', JSON.stringify(nodes))
  // localStorage.setItem('links', JSON.stringify(links))
  // localStorage.setItem('nodePosition', JSON.stringify(nodePosition))
  firebase.database().ref(code+'/' + nodeID).set({
    name: name?name:data[nodeID].name,
    color: color?color:data[nodeID].color,
    description : description?description:data[nodeID].description,
    links:links?links:(data[nodeID].links?data[nodeID].links:[]),
    x:x1?x1:data[nodeID].x,
    y:y1?y1:data[nodeID].y
  });
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
    // var index = nodes.findIndex(obj => obj.id==document.getElementById('linker').class);
    // if(index!=-1){
      // document.getElementById('name').innerText = name
      
      data[document.getElementById('linker').class].name=name;
      refresh()
    // }
  });
  document.getElementById("descript").addEventListener("keyup", () => {
    let description = document.getElementById("descript").value;
    updateNODE(document.getElementById('linker').class, null, null, description)
    // var index = nodes.findIndex(obj => obj.id==document.getElementById('linker').class);
    // if(index!=-1){
      data[document.getElementById('linker').class].description=description;
    // }
  });
  document.getElementById("Change Color").addEventListener("input", () => {
    let color = document.getElementById("Change Color").value;
    // var index = nodes.findIndex(obj => obj.id==document.getElementById('linker').class);
    // if(index!=-1){
      data[document.getElementById('linker').class].color=color;
    // }
    updateNODE(document.getElementById('linker').class, null, color, null)
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
    for (let i = 0; i < dataArray.length; i++) {
      const buh = dataArray[i][0];
      if(data[buh].links)index = data[buh].links.findIndex(obj => obj.id==document.getElementById('linker').class);
      else index = -1
      if(index!=-1){
        data[buh].links.splice(index,1)
        updateNODE(buh)
      }
    }
    firebase.database().ref(code + "/" +document.getElementById('linker').class).remove()

    // var index = nodes.findIndex(obj => obj.id==document.getElementById('linker').class);
    // nodes.splice(index, 1)
    // console.log(links)
    // for(let i = links.length-1; i >= 0; i--)
    //   if(links[i].source == document.getElementById('linker').class || links[i].target == document.getElementById('linker').class)
    //     links.splice(i, 1)
    clearBar()
    // updateNODE(document.getElementById('linker').class, null, null, null)
    refresh()
  });
  
  function refresh() { // initalizes the lines
  svg.html("")
  originalPos = JSON.parse(JSON.stringify(data));
  // svg.selectAll('line')
  //   .data(dataArray)
  //   .enter()
  //   .append('line')
  //   .attr('x1', d => getNodeX(d[0])*width+offsetX+totaloffsetX)
  //   .attr('y1', d => getNodeY(d[0])*height+offsetY+totaloffsetY)
  //   .attr('x2', d => getNodeX(d[1].links)*width+offsetX+totaloffsetX)
  //   .attr('y2', d => getNodeY(d.target)*height+offsetY+totaloffsetY)
  //   .attr('stroke-width', zoom)
  //   .attr('stroke', 'lightgray');

  // initalizes the nodes
  svg.append('g')
    .attr('id',"bottom");
  svg.append('g')
    .attr('id',"top");
  topLayer = d3.select('#top')
  bottomLayer = d3.select('#bottom')
  const nodesSelection = topLayer.selectAll('.node')
    .data(dataArray)
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
    .attr('id', d => d[0])
    .attr('cx', d => (getNodeX(d[0]) * width+offsetX+totaloffsetX) * (1/zoom))
    .attr('cy', d => (getNodeY(d[0]) * height+offsetY+totaloffsetY) * (1/zoom))
    .attr('r', d => 10+countLinks(d[0])*1)
    .attr('fill', d => d[1].color);

  nodesSelection.append('text')
    .attr('class', 'label')
    .attr('x', d => (getNodeX(d[0]) * width+offsetX+totaloffsetX)* (1/zoom))
    .attr('y', d => (getNodeY(d[0]) * height+offsetY+totaloffsetY) * (1/zoom)+20) // Adjust the y position for the label
    .text(d => d[1].name);

    nodesSelection.each(function (de) {
      let subArray = de[1].links; // Assuming each node has a subarray called 'subArray'
      // console.log(subArray)
      if(!subArray) subArray = []
      const subElements = d3.select(this)
      buh = bottomLayer.append('g').attr('id',de[0])
      buh.selectAll('line')
        .data(subArray, d => de[0])
        .enter()
        .append('line')
        .attr('class', de[0])
        .attr('x1', d => getNodeX(de[0])*width+offsetX+totaloffsetX)
        .attr('y1', d => getNodeY(de[0])*height+offsetY+totaloffsetY)
        .attr('x2', d => getNodeX(d)*width+offsetX+totaloffsetX)
        .attr('y2', d => getNodeY(d)*height+offsetY+totaloffsetY)
        .attr('stroke-width', zoom)
        .attr('stroke', 'lightgray');
    });
  }
console.log(nodes == null)
// refresh()
    // helper function that takes a number, then keeps it within a min/max range
    // OLD HELPER FUNCTION
  
  // another helper function that simply asks the position JSON for a X value of a node
  // also has a catch (the index being -1) incase it doesnt exist which creates a new position in the JSON
  function getNodeX(nodeId) {
    // var index = nodePosition.findIndex(obj => obj.id==nodeId);
    // if(index == -1){
    //   nodePosition.push({
    //    id:nodeId,
    //    x:.5,
    //    y:.5
    //   })
    //   // refresh()
    //   return .5
    //  }
    try{
      return data[nodeId].x;
    } catch {
      console.log(nodeId)
      return .5
    }
  }

  // same as above, but for Y
  function getNodeY(nodeId) {
    // var index = nodePosition.findIndex(obj => obj.id==nodeId);
    // if(index == -1){
    //  nodePosition.push({
    //   id:nodeId,
    //   x:.5,
    //   y:.5
    //  })
    // //  refresh()
    //  return .5
    // }
    try{
      return data[nodeId].y;
    } catch {
      console.log("ERROR:"+nodeId)

      return .5
    }
    
  }
  
  function handleClick(event, d) {
    // console.log(event)
    // console.log(d)
    if(link != null && link != d[0]) {
      console.log(`linking ${link} and ${d[0]}`)
      found = false
      for(let i = links.length-1; i >= 0; i--)
        // console.log(links[i])
        if((links[i].source == link && links[i].target == d[0]) || (links[i].target == link && links[i].source == d[0])){
          found = true;
          links.splice(i, 1)
        }
      if(!found)
        links.push({
          "source":link,
          "target":d[0]
        });
      link = null;
      updateLINK(link, d[0])
      refresh()
    } else {
      toggleNewNode(false)
      // document.getElementById("name").innerHTML = d[1].name;
      document.getElementById("descript").value = d[1].description;
      document.getElementById("linker").class = d[0];
      document.getElementById("Change Name").value = d[1].name;
      document.getElementById("Change Color").value = d[1].color;
    }
  }
  document.getElementById("newNode").addEventListener('click', () => {
    newNode2 = true
    document.getElementById("newNode").disabled = true
    document.getElementById("linker").disabled = true
    // document.getElementById("CA").innerHTML = "Place Dot"
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
          // document.getElementById("CA").innerHTML = "Edit Dots"
          let randomColor = "#"+Math.floor(Math.random()*16777215).toString(16);
          let id = newPostKey = firebase.database().ref().child(code).push().key;
          let name = generateName()
          firebase.database().ref(code+'/' + id).set({
            name: name,
            color: randomColor,
            description: "No description provided.",
            x:(e.clientX/width)-(totaloffsetX/width),
            y:(e.clientY/height)-(totaloffsetY/height)
          });
          // updateNODE(id,name,randomColor, "No description provided.")
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
      link = d[0];
      tempLink = svg
        .append('line')
        .attr('x1', getNodeX(d[0]) * width + offsetX + totaloffsetX)
        .attr('y1', getNodeY(d[0]) * height + offsetY + totaloffsetY)
        .attr('x2', getNodeX(d[0]) * width + offsetX + totaloffsetX)
        .attr('y2', getNodeY(d[0]) * height + offsetY + totaloffsetY)
        .attr('stroke', 'lightgray')
        .attr('stroke-width', 2 / zoom);

    }
  }
  // Drag function, AKA move the node to the mouse position
  function handleDrag(event, d) {
    const { x, y } = event;
    if(link == null){
      toggleNewNode(false)
      // document.getElementById("name").innerHTML = d[1].name;
      document.getElementById("descript").value = d[1].description;
      document.getElementById("linker").class = d[0];
      document.getElementById("Change Name").value = d[1].name;
      document.getElementById("Change Color").value = d[1].color;
      var index = nodePosition.findIndex(obj => obj.id==d[0]);
      // console.log(data[d[0]].x);
      data[d[0]].x = (x-totaloffsetX)/width
      data[d[0]].y = (y-totaloffsetY)/height
      const group = d3.select(this);
      // console.log(originalPos)
      group.attr('transform', `scale(${zoom},${zoom}), translate(${(-((originalPos[d[0]].x * width) - (data[d[0]].x * width)))* (1/zoom)},${(-((originalPos[d[0]].y * height) - (data[d[0]].y * height))* (1/zoom))})`);
      updateLinks();
    } else if(linker2) tempLink.attr('x2', event.x).attr('y2', event.y);
    
  }
  // at the end of the drag, update the global JSON
  function handleDragEnd(e, d) {
    const targetNode = findNodeAtCoordinates(e.x, e.y);
    // console.log(targetNode)
    if (targetNode && link) {
      endNode = targetNode;
      // Create the link between startNode and endNode
      if(link != targetNode) {
        
        // console.log(`linking ${link} and ${targetNode}`)
        
        found = false
        if(data[link].links)index = data[link].links.findIndex(obj => obj==targetNode);
        else index = -1
        if(data[targetNode].links)index2 = data[targetNode].links.findIndex(obj => obj==link);
        else index2 = -1
        if(index!=-1)
        {
          console.log(`unlinking ${link} and ${targetNode}`)
          data[link].links.splice(index,1)
          updateNODE(link)
        } else if(index2!=-1) {
          console.log(`unlinking ${link} and ${targetNode}`)
            data[targetNode].links.splice(index2,1)
            updateNODE(targetNode) 
        } else {
          console.log(`linking ${link} and ${targetNode}`)
          if(data[link].links)
            data[link].links.push(targetNode);
          else 
            data[link].links = [targetNode];
            updateNODE(link)
        }
        
        
        refresh()
        }
      } else updateNODE(d[0]) 
      if (tempLink) {
        tempLink.remove();
        tempLink = null;
      }
      linker2 = false
      link = null;
      document.getElementById('linker').disabled = false
      document.getElementById("newNode").disabled = false
      // document.getElementById("CA").innerHTML = "Edit Dots"
    
  }

  function findNodeAtCoordinates(x, y) {
    // Helper function to find the node at the given coordinates
    // Loop through the nodes and check if the coordinates are within the node's circle
    const node = dataArray.find((node) => {
      // console.log(node)
      const nodeX = getNodeX(node[0]) * width + offsetX + totaloffsetX;
      const nodeY = getNodeY(node[0]) * height + offsetY + totaloffsetY;
      const distanceSquared = (nodeX - x) ** 2 + (nodeY - y) ** 2;
      // console.log(distanceSquared <= (10 + countLinks(node[0]) * 1) ** 2)
      return distanceSquared <= (10 + countLinks(node[0]) * 1) ** 2;
    });
    // console.log(node[0])
    return node[0];
  }
  
  // support code to find the amount of times a node appears
  function countLinks(id) {
    // return 2;
    if(data[id].links) return data[id].links.length;
    else return 0;
  }



  // ! OUTDATED CODE
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
  //! OUTDATED CODE aka no use for it now
  function updateNodes() {
    svg.selectAll('.node')
      .attr('cx', d => getNodeX(d[0])*width)
      .attr('cy', d => getNodeY(d[0])*height)
    }
  // ajusts the lines if the page is resized
  function updateLinks() {
    svg.selectAll('line')
      .attr('x1', function(d) {
        // console.log(d3.select(this).attr('class'))

        const className = d3.select(this).attr('class');
        return getNodeX(className) * width + offsetX + totaloffsetX;
      })
      .attr('y1', function(d) {
        const className = d3.select(this).attr('class');
        return getNodeY(className) * height + offsetY + totaloffsetY;
      })
      .attr('x2', d => getNodeX(d) * width + offsetX + totaloffsetX)
      .attr('y2', d => getNodeY(d) * height + offsetY + totaloffsetY);
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
    //   data[d[0]].x = "null"
    //   data[d[0]].y = "null"
    // }
    // // console.log(data[d[0]])
    // fetch('position.php', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(data[d[0]])
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

  