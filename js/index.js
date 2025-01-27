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
	});
	if (state) {
		Blockly.serialization.workspaces.load(state, workspace);
	}

	// Save data automatically 
	workspace.addChangeListener(save);

	// Generate in realtime
	workspace.addChangeListener(generateCode);
}

function generateCode() {
	javascript.javascriptGenerator.addReservedWords('code');

	var code = javascript.javascriptGenerator.workspaceToCode(workspace);

	/* console.log(code); */
	generatedCode = code;

}

// Saving function
function save() {
	state = Blockly.serialization.workspaces.save(workspace);
	localStorage.setItem("workspace-state", JSON.stringify(state));
}

// Save workspace to file
function saveToFile() {
	var blob = new Blob([JSON.stringify(state)], {
		type: "text/plain;charset=utf-8"
	});

	saveAs(blob, "save.txt");
}

// Read workspace form file 
function fileInput() {
	document.getElementById('fileInput').addEventListener('change', function(event) {
		var file = event.target.files[0];
		if (file) {
			var reader = new FileReader();
			reader.onload = function(e) {
				content = e.target.result;
				var newState = JSON.parse(content);
				Blockly.serialization.workspaces.load(newState, workspace);
			};

			reader.onerror = function(e) {
				console.error("An error occurred while reading the file", e);
			};
			reader.readAsText(file);
		} else {
			console.error("No file selected");
		}
	});
}

// Load workspace
function loadFromFile() {
	var newState = JSON.parse(content);
	Blockly.serialization.workspaces.load(newState, workspace);

}

function showChart() {
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
	var afterCode = preCode + generatedCode;
	// Create regex
	let arrayInitializationRegex = /Array2 = \[.*?];/;
	// Matching
	let match = afterCode.match(arrayInitializationRegex);
	// Insert code by regex
	if (match) {
		let insertPosition = match.index + match[0].length;
		afterCode = afterCode.slice(0, insertPosition) +
			'\ninitialStateArray.push(...Array2);\nArray2 = createArrayLogger(Array2);' + afterCode.slice(
				insertPosition);
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
			if (currentStep % 2 != 0) {
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

function showSample() {
	var newState = JSON.parse(
		'{"blocks":{"languageVersion":0,"blocks":[{"type":"variables_set","id":"?^lgR~9UeVQsRhpiYJp+","x":-430,"y":-510,"fields":{"VAR":{"id":"w:!J?CdH;=:gfH/+Z{Je"}},"inputs":{"VALUE":{"block":{"type":"math_number","id":"]):?|^!VOLzQV%Q0b@X$","fields":{"NUM":1}}}},"next":{"block":{"type":"variables_set","id":"/ksLi%0!_S+/-6kEBkxY","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}},"inputs":{"VALUE":{"block":{"type":"math_number","id":";+`497n:^`m1hmim(ji0","fields":{"NUM":1}}}},"next":{"block":{"type":"variables_set","id":"n]nixK,xJ|.94N(Z#zDh","fields":{"VAR":{"id":"l]j%KhoxuCRx;:oW6uQ`"}},"inputs":{"VALUE":{"block":{"type":"lists_create_with","id":"]@V2,g`4{=[[R~#gK+(y","extraState":{"itemCount":8},"inputs":{"ADD0":{"block":{"type":"math_random_int","id":"4JLyy,+ov)8zLXmK~uT)","inputs":{"FROM":{"shadow":{"type":"math_number","id":"j0HYH@Clj(`APWl$Yc2H","fields":{"NUM":1}}},"TO":{"shadow":{"type":"math_number","id":"mHW=90Z`%E!mXt,e7PNP","fields":{"NUM":100}}}}}},"ADD1":{"block":{"type":"math_random_int","id":"4Qt$6V8O8Tw7;D-VgWCn","inputs":{"FROM":{"shadow":{"type":"math_number","id":"%ZaOG#Re1d)*9)#8V!84","fields":{"NUM":1}}},"TO":{"shadow":{"type":"math_number","id":"p86b}g6e!!d;U,60J?HP","fields":{"NUM":100}}}}}},"ADD2":{"block":{"type":"math_random_int","id":"6k8Kr+iG^RB:Luq`B6[$","inputs":{"FROM":{"shadow":{"type":"math_number","id":"pUn,!#{1C^TCfUZk8D^2","fields":{"NUM":1}}},"TO":{"shadow":{"type":"math_number","id":"`GUz3T5o,XaVaZxDuSM1","fields":{"NUM":100}}}}}},"ADD3":{"block":{"type":"math_random_int","id":"wNYa@m12bW4y@C`i}m.r","inputs":{"FROM":{"shadow":{"type":"math_number","id":"w|$wSWE%Q}6w~ch^tR2z","fields":{"NUM":1}}},"TO":{"shadow":{"type":"math_number","id":"Vz[Fi}uSp)Ma^f{Sd:1]","fields":{"NUM":100}}}}}},"ADD4":{"block":{"type":"math_random_int","id":"L@8n~!@H!)5vx:FJ`|A3","inputs":{"FROM":{"shadow":{"type":"math_number","id":"t3^,)=o3BKI[e_o@dIaA","fields":{"NUM":1}}},"TO":{"shadow":{"type":"math_number","id":"27x|;#2+Cg;/KM,^bj01","fields":{"NUM":100}}}}}},"ADD5":{"block":{"type":"math_random_int","id":"I_!MX_.MKCoW]W%B,kD$","inputs":{"FROM":{"shadow":{"type":"math_number","id":"`SdbQhDI`z2.SrOm*YCN","fields":{"NUM":1}}},"TO":{"shadow":{"type":"math_number","id":"xbR6}pu?%U{p6OE,c;=M","fields":{"NUM":100}}}}}},"ADD6":{"block":{"type":"math_random_int","id":"Zq=!lV[wlG2~%*Bpx7o:","inputs":{"FROM":{"shadow":{"type":"math_number","id":"yN6[`bAJ]oGrY.JQt*)@","fields":{"NUM":1}}},"TO":{"shadow":{"type":"math_number","id":"zC{Im=g#:a8~beSKJ:bZ","fields":{"NUM":100}}}}}},"ADD7":{"block":{"type":"math_random_int","id":"r3S([#=Yf]8Sw7Q)?RU_","inputs":{"FROM":{"shadow":{"type":"math_number","id":"@qogL;?N!)4;8AeQmnxD","fields":{"NUM":1}}},"TO":{"shadow":{"type":"math_number","id":":)`)p$B/Gu.y7IH(Ch1~","fields":{"NUM":100}}}}}}}}}},"next":{"block":{"type":"controls_whileUntil","id":"{9y4=q$xVYwE=!W7Lh0K","fields":{"MODE":"WHILE"},"inputs":{"BOOL":{"block":{"type":"logic_compare","id":"L{;tHbH7(I[ketp5|q#9","fields":{"OP":"LTE"},"inputs":{"A":{"block":{"type":"variables_get","id":":BT_%$rDF;cIwrHrm|c!","fields":{"VAR":{"id":"w:!J?CdH;=:gfH/+Z{Je"}}}},"B":{"block":{"type":"lists_length","id":"-PUbf1]rT0w..d8j#L56","inputs":{"VALUE":{"block":{"type":"variables_get","id":"7.gG:8Rm?YKs/UEIE-sB","fields":{"VAR":{"id":"l]j%KhoxuCRx;:oW6uQ`"}}}}}}}}}},"DO":{"block":{"type":"variables_set","id":"$hrs,n7Y9^;RK/6Nh},c","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}},"inputs":{"VALUE":{"block":{"type":"math_number","id":"tx=(3YM4.m[Ehx/1Dnak","fields":{"NUM":1}}}},"next":{"block":{"type":"controls_whileUntil","id":"vFig5l5em2hgHJ+3sdk:","fields":{"MODE":"WHILE"},"inputs":{"BOOL":{"block":{"type":"logic_compare","id":"Zcc@iDVqK$63^+bfC/!V","fields":{"OP":"LTE"},"inputs":{"A":{"block":{"type":"variables_get","id":"FlQLb|0.~=x}Bft4n7ac","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}}}},"B":{"block":{"type":"math_arithmetic","id":".x?Z|TQ!0hYqh=4x?Kh*","fields":{"OP":"MINUS"},"inputs":{"A":{"shadow":{"type":"math_number","id":"IiE^U;?[qOS1]Sig68+k","fields":{"NUM":1}},"block":{"type":"lists_length","id":"AB:a+Rjn~{6Z-Y[rYYNt","inputs":{"VALUE":{"block":{"type":"variables_get","id":"?fzMbTmpM9il@d$87UGg","fields":{"VAR":{"id":"l]j%KhoxuCRx;:oW6uQ`"}}}}}}},"B":{"shadow":{"type":"math_number","id":"qTKdAQbxe8gGP5[wu1Mv","fields":{"NUM":1}},"block":{"type":"variables_get","id":"k38lxi~CaRS-=1Ymcdm.","fields":{"VAR":{"id":"w:!J?CdH;=:gfH/+Z{Je"}}}}}}}}}},"DO":{"block":{"type":"controls_if","id":":iqb5+pcj@}FisHBzJ{]","inputs":{"IF0":{"block":{"type":"logic_compare","id":"ggdZn^v9BBcB/elV(h,~","fields":{"OP":"GT"},"inputs":{"A":{"block":{"type":"lists_getIndex","id":"5]_,;T_:ZjA*jnFAYxI0","fields":{"MODE":"GET","WHERE":"FROM_START"},"inputs":{"VALUE":{"block":{"type":"variables_get","id":"{8|xVwsC0j*OUhYvpyH1","fields":{"VAR":{"id":"l]j%KhoxuCRx;:oW6uQ`"}}}},"AT":{"block":{"type":"variables_get","id":"J@]r9A0@H?~2A=wJV(O-","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}}}}}}},"B":{"block":{"type":"lists_getIndex","id":"D{=GoOLniRUqjp_6_/U`","fields":{"MODE":"GET","WHERE":"FROM_START"},"inputs":{"VALUE":{"block":{"type":"variables_get","id":"q$zD/$[T[Uh@8wpZE`,0","fields":{"VAR":{"id":"l]j%KhoxuCRx;:oW6uQ`"}}}},"AT":{"block":{"type":"math_arithmetic","id":"TxAw9rqA-TY^ww5-=?md","fields":{"OP":"ADD"},"inputs":{"A":{"shadow":{"type":"math_number","id":"}PIR%j}NY*+5Nt?90wKV","fields":{"NUM":1}},"block":{"type":"variables_get","id":"gSCH21Tn7PL0H6Um94Xy","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}}}},"B":{"shadow":{"type":"math_number","id":"fKbs;Gc:{!1ZC!%sh[UN","fields":{"NUM":1}}}}}}}}}}}},"DO0":{"block":{"type":"variables_set","id":"PnQ{.SOIFz6L|l?6B+/r","fields":{"VAR":{"id":"PC;Lg~{PF6lvJU^6~?rJ"}},"inputs":{"VALUE":{"block":{"type":"lists_getIndex","id":"4J~JuVlqt];j-DLj;8YA","fields":{"MODE":"GET","WHERE":"FROM_START"},"inputs":{"VALUE":{"block":{"type":"variables_get","id":"stzW=}0KHtxM4An(L,Ub","fields":{"VAR":{"id":"l]j%KhoxuCRx;:oW6uQ`"}}}},"AT":{"block":{"type":"variables_get","id":"H+?,go:/j.[^/*jueCxw","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}}}}}}}},"next":{"block":{"type":"lists_setIndex","id":".xC_ff/^;)Hi?gtEo305","fields":{"MODE":"SET","WHERE":"FROM_START"},"inputs":{"LIST":{"block":{"type":"variables_get","id":"QQW;^.rM*$,hp=xvL+X$","fields":{"VAR":{"id":"l]j%KhoxuCRx;:oW6uQ`"}}}},"AT":{"block":{"type":"variables_get","id":"VE_isjt0ouh3xNcf=o0l","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}}}},"TO":{"block":{"type":"lists_getIndex","id":"iKt4Rzqb7kdB@gJs@L@B","fields":{"MODE":"GET","WHERE":"FROM_START"},"inputs":{"VALUE":{"block":{"type":"variables_get","id":"R-#hI^(#CqSHSB4|tJUN","fields":{"VAR":{"id":"l]j%KhoxuCRx;:oW6uQ`"}}}},"AT":{"block":{"type":"math_arithmetic","id":"x`uvh*#0h6W:Yy5*_8zY","fields":{"OP":"ADD"},"inputs":{"A":{"shadow":{"type":"math_number","id":"}PIR%j}NY*+5Nt?90wKV","fields":{"NUM":1}},"block":{"type":"variables_get","id":"Mw(H2=RO._gE|Y`dK]c^","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}}}},"B":{"shadow":{"type":"math_number","id":"QEoOQttOw*Ychgg+S@=K","fields":{"NUM":1}}}}}}}}}},"next":{"block":{"type":"lists_setIndex","id":"R)BP31E9?pa`Y,#oq:[`","fields":{"MODE":"SET","WHERE":"FROM_START"},"inputs":{"LIST":{"block":{"type":"variables_get","id":"?{Xyu6CoI.Z8eUhGV^t,","fields":{"VAR":{"id":"l]j%KhoxuCRx;:oW6uQ`"}}}},"AT":{"block":{"type":"math_arithmetic","id":"apM0oy^SeY8QagCH38;|","fields":{"OP":"ADD"},"inputs":{"A":{"shadow":{"type":"math_number","id":"}PIR%j}NY*+5Nt?90wKV","fields":{"NUM":1}},"block":{"type":"variables_get","id":"#OQl)SR]$@.iujB?x),B","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}}}},"B":{"shadow":{"type":"math_number","id":"UkzNFufW=(^O4hD8M)W*","fields":{"NUM":1}}}}}},"TO":{"block":{"type":"variables_get","id":"_~OOuoqxncU[gwBZpo9)","fields":{"VAR":{"id":"PC;Lg~{PF6lvJU^6~?rJ"}}}}}}}}}}}},"next":{"block":{"type":"variables_set","id":"KiNLWLjqEkTzqK-l%{]R","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}},"inputs":{"VALUE":{"block":{"type":"math_arithmetic","id":"WnTU@HC#!1;fdB8T.I-q","fields":{"OP":"ADD"},"inputs":{"A":{"shadow":{"type":"math_number","id":"JOdMZZA|16U;XT6$`I8P","fields":{"NUM":1}},"block":{"type":"variables_get","id":"z!C{dDxc5QyCZJ]AMHZE","fields":{"VAR":{"id":"KfDJ87VFY{:44#2YOqkV"}}}},"B":{"shadow":{"type":"math_number","id":"#dMfWEQ-Sw3HgsAR]0Q*","fields":{"NUM":1}}}}}}}}}}}},"next":{"block":{"type":"variables_set","id":"L!d9*CdI);9d8{Ne.ypw","fields":{"VAR":{"id":"w:!J?CdH;=:gfH/+Z{Je"}},"inputs":{"VALUE":{"block":{"type":"math_arithmetic","id":"S9/v6:(#opCYU#!tharD","fields":{"OP":"ADD"},"inputs":{"A":{"shadow":{"type":"math_number","id":"JOdMZZA|16U;XT6$`I8P","fields":{"NUM":1}},"block":{"type":"variables_get","id":"^vJQP?KU[mRL)Sx-Fe=9","fields":{"VAR":{"id":"w:!J?CdH;=:gfH/+Z{Je"}}}},"B":{"shadow":{"type":"math_number","id":"]Zf;}zp#/ks+_{_XL)L@","fields":{"NUM":1}}}}}}}}}}}}}}}}}}}}}]},"variables":[{"name":"i","id":"w:!J?CdH;=:gfH/+Z{Je"},{"name":"j","id":"KfDJ87VFY{:44#2YOqkV"},{"name":"Array","id":"l]j%KhoxuCRx;:oW6uQ`"},{"name":"list","id":"4TWB1ykcT1I#BHYh5}q?"},{"name":"Temp","id":"PC;Lg~{PF6lvJU^6~?rJ"}]}'
		);
	Blockly.serialization.workspaces.load(newState, workspace);
}