// Written (and designed) by Alec
// side note: this was written late at night so if theres redundant coding, oops.

// firebase data tree for refrence
// Teams/
// ├─ team/
// │  ├─ Team_Name
// │  ├─ driver
// │  ├─ auto
// │  ├─ notes
var teamArray = []
const TeamNumber = document.getElementById("TeamNum")
const AddButton = document.getElementById("teambutton")
const RemoveButton = document.getElementById("removebutton")
RemoveButton.disabled = true;
var database = firebase.database();
if (window.innerWidth > 1000) {
  document.getElementById("TeamNum").style.width = "15%"
  document.getElementById("TeamName").style.width = "15%"
  document.getElementById("TeamDriver").style.width = "15%"
  document.getElementById("TeamAuto").style.width = "15%"
  document.getElementById("TeamNotes").style.width = "15%"
  document.getElementById("background2").style.width = "10%"
}


//sets the data for each team
//VERY IMPORTANT NOTE: if adding more fields, use the same variable name that you use in storing in the database, otherwise the N/A replacer WILL BREAK
function writeTeamData(team, Team_Name, driver, auto, notes) {
  var ref = firebase.database().ref('teams/' + team)
  //if someone decided to press add team without filling in fields it wont delete previously filled in field
  ref.once('value', (snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach(function(data) {
        var key = data.key;
        var data = data.val();
        // I probably shouldn't be using eval...
        eval("yes = " + key + " == 'N/A'")
        if (yes)
          eval(key + " =  data")
      });
    }
  })
  firebase.database().ref('teams/' + team).set({
    //add more fields here
    Team_Name: Team_Name,
    driver: driver,
    auto: auto,
    notes: notes
  });
}

//sets the input fields
function setInput(num, name, auto, driver, notes) {
  document.getElementById("TeamNum").value = num
  document.getElementById("TeamName").value = name
  document.getElementById("TeamDriver").value = driver
  document.getElementById("TeamAuto").value = auto
  document.getElementById("TeamNotes").value = notes
  updateValue()
}

//gets the current team number and deletes them from the database
function removeTeam() {
  var num = document.getElementById("TeamNum").value
  setInput("", "", "", "", "")
  if (num == "") {
    alert("enter a team number")
    return
  }
  firebase.database().ref("teams/" + num).remove();
}


// makes sure they know what they're doing and confirm they didnt misclick
function removeAll() {
  if (confirm("WARNING! THIS WILL REMOVE ALL TEAMS FROM THE CURRENT LIST. PROCEED?")) {
    firebase.database().ref("teams").remove();
    setInput("", "", "", "", "")
  }
}

//sets all input to their values relative to each team
function handleTeam(the) {
  dataarray = []
  for (i = 1; i < the.childNodes.length; i++) {
    if (the.childNodes[i].text != null) {
      arrayd = the.childNodes[i].text.split(": ")
      dataarray.push(arrayd[1])
    }
  }
  for (i = 0; i < dataarray.length; i++) {
    if (dataarray[i] == "N/A") dataarray[i] = ""
  }

  setInput(the.id, dataarray[0], dataarray[1], dataarray[2], dataarray[3])
}

//Kinda messy but it effectively creates a new div with the team number and all data related to that team
function addElement(team, data) {
  const teamDiv = document.createElement("div");
  teamDiv.className = 'team';
  teamDiv.id = team;
  teamDiv.setAttribute('onclick', "handleTeam(this)");
  const title = document.createElement("a");
  const break1 = document.createElement("br");
  const TeamNum = document.createTextNode("Team " + team);
  title.className = 'teamNum';
  teamDiv.appendChild(title);
  title.appendChild(TeamNum);
  teamDiv.appendChild(break1);
  Object.entries(data).forEach(entry => {
    const entry2 = document.createElement("a");
    const [key, value] = entry;
    var type;
    //just for site clean up, not particularly necessary
    switch (key) {
      case "Team_Name":
        type = "Name"
        break;
      case "auto":
        type = "Auto"
        break;
      case "driver":
        type = "Driver"
        break;
      case "notes":
        type = "Notes"
        break;
      default:
        type = key;
        break;
    }
    const newContent = document.createTextNode(type + ": " + value);
    entry2.id = key
    entry2.appendChild(newContent);
    teamDiv.appendChild(entry2);
    const break1 = document.createElement("br");
    teamDiv.appendChild(break1);
  });
  //adds the team to the list
  document.getElementById("teamList").appendChild(teamDiv);
}

//gets the value of the inputs and if they are empty sets them to "N/A" due to firebase not able to handle empty strings
function createTeam() {
  var num = document.getElementById("TeamNum").value
  var name = document.getElementById("TeamName").value
  var driver = document.getElementById("TeamDriver").value
  var auto = document.getElementById("TeamAuto").value
  var notes = document.getElementById("TeamNotes").value
  if (num == "") {
    alert("enter a team number")
    return
  }
  setInput("", "", "", "", "")
  // I could've written this better... right?
  if (name == "") {
    name = "N/A"
  }
  if (driver == "") {
    driver = "N/A"
  }
  if (auto == "") {
    auto = "N/A"
  }
  if (notes == "") {
    notes = "N/A"
  }

  writeTeamData(num, name, driver, auto, notes);
}



// updates on database change allowing for all to see the data at the same time
var team = firebase.database().ref('teams');
team.on('value', (snapshot) => {
  //clearing the list so if it updates while on the website it doesnt create multiple list entries
  const list = document.getElementById("teamList");
  list.innerHTML = '';
  teamArray = []
  snapshot.forEach(function(data) {
    var key = data.key;
    var value = data.val();
    teamArray.push(key)
    addElement(key, value)
  });
  // document.getElementById("background").style.height = "100vh"
  updateValue()
})



//checks if the current team number is on the list and if true it
//enables the remove button and changes the add button to 'modify'
TeamNumber.addEventListener('change', updateValue);
function updateValue() {
  TeamExists = false
  
  for (i = 0; i < teamArray.length; i++) {
    if (document.getElementById("TeamNum").value == teamArray[i]) {
      TeamExists = true
      document.getElementById(teamArray[i]).className = "teamSelected"
      // ).id = "selected" 
    } else {
      document.getElementById(teamArray[i]).className = "team"
    }
  }
  if (TeamExists) {
    AddButton.innerText = "Modify Team"
    RemoveButton.disabled = false;
  } else {
    AddButton.innerText = "Add Team"
    RemoveButton.disabled = true;
  }
}