var state = JSON.parse(localStorage.getItem("workspace-state"));
var workspace = null;
var content = '';
var generatedCode = '';

// Initialization
function initialize() {
  start();

  generateCode();
}

function start() {
  /* const state = localStorage.getItem('workspace-state');
  Blockly.serialization.workspaces.load(state, workspace); */
  workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox-categories'),
    grid:
         {spacing: 20,
          length: 3,
          colour: '#ccc',
          snap: true},
     trashcan: true
  });
  if (state) {
    Blockly.serialization.workspaces.load(state, workspace);
  }

  // Save data automatically 
  workspace.addChangeListener(save);

  // Generate in realtime
  workspace.addChangeListener(generateCode);
}

function generateCode(){
  javascript.javascriptGenerator.addReservedWords('code');

  var code = javascript.javascriptGenerator.workspaceToCode(workspace);

  /* console.log(code); */
  generatedCode = code;
 
}

// Saving function
function save(){
  state = Blockly.serialization.workspaces.save(workspace);
  localStorage.setItem("workspace-state", JSON.stringify(state));
}

// Save workspace to file
function saveToFile() {
  var blob = new Blob([JSON.stringify(state)],
      { type: "text/plain;charset=utf-8" });

  saveAs(blob, "save.txt");
}

// Read workspace form file 
function fileInput(){
  document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            content = e.target.result;
        };
        
        reader.onerror = function(e) {
            console.error("An error occurred while reading the file", e);
        };
        reader.readAsText(file);
    } else {
        console.error("No file selected");
    }

    loadFromFile();
});
}

// Load workspace
function loadFromFile(){
  var newState = JSON.parse(content);
  Blockly.serialization.workspaces.load(newState, workspace);

}

function showChart(){
  var chartDom = document.getElementById('main');
  var myChart = echarts.init(chartDom);
  var option;
  var steps = [];
  var initialStateArray = [];
  
  // Creat Proxy  
  var preCode = `
    function createArrayLogger(array) {
      return new Proxy(array, {
        set(target, property, value) {
          target[property] = value;
          console.log(target);
          steps.push([...target])
          return true;
        }
     });
    }
`;
  // Combine the code
  var afterCode = preCode + generatedCode ;
  // Create regex
  let arrayInitializationRegex = /Array2 = \[.*?];/;
  // Matching
  let match = afterCode.match(arrayInitializationRegex);
  // Insert code by regex
  if (match) {
    let insertPosition = match.index + match[0].length;
    afterCode = afterCode.slice(0, insertPosition) + '\ninitialStateArray.push(...Array2);\nArray2 = createArrayLogger(Array2);' + afterCode.slice(insertPosition);
  }
  // For debug
  console.log(afterCode);
  
  eval(afterCode);  
  
  var xAxisLabels = steps[0].length;

  option = {
    title: {
      text: 'Array Visualization'
    },
    tooltip: {},
    xAxis: {
      data: initialStateArray
    },
    yAxis: {
      show: false
    },
    series: [{
      type: 'bar',
      data: initialStateArray
    }]
  };
  
  // Show chart
  myChart.setOption(option);
  
  // Update chart
  var currentStep = 1;

  function updateChart() {
    if (currentStep < steps.length) {
      if(currentStep % 2 != 0){
        myChart.setOption({
          xAxis: {
            data: steps[currentStep]
          },
          series: [{
            data: steps[currentStep]
          }]
        });
      }
      currentStep++;
      // Set timeout here
      setTimeout(updateChart, 200); 
    }
  }
  
  updateChart();
}




