// @ts-check
/// <reference types="jquery" name="$" />


var canvas = $("#signature_pad")[0];
console.log('canvas width '+ canvas.width);
const initWidth = canvas.width;
const initHeight = canvas.height;

var signaturePad = new SignaturePad(canvas, {
	// It's Necessary to use an opaque color when saving image as JPEG;
	// this option can be omitted if only saving as PNG or SVG
	minWidth: .75,
    maxWidth: 1.5,
	backgroundColor: 'rgba(255, 255, 255, 0)',
	penColor: 'black',
	dotSize: 1
});

var canvas2 = $("#signature_pad2")[0];
var signaturePadRec = new SignaturePad(canvas2, {
	// It's Necessary to use an opaque color when saving image as JPEG;
	// this option can be omitted if only saving as PNG or SVG
	minWidth: .5,
    maxWidth: 1,
	backgroundColor: 'rgba(255, 255, 255, 0)',
	penColor: 'blue',
	dotSize: 1
});

function clearButtonClicked()
{
	signaturePad.clear();
}

function saveSignature()
{
	//signaturePad.toData()
	var dataURL = signaturePad.toDataURL("image/png");
	// var data = signaturePad.toData();
	signaturePadRec.fromDataURL(dataURL)
	// console.log(data[0].toString());
	//$("#signature_img").attr('src', dataURL); 
}

/**
 * creates a new pdf file an save it
 * @returns void
 */
function saveToPDF()
{
	var idata = signaturePad.toData();
	var points = JSON.stringify(idata);

	// alert('button clicked...');
	$.ajax({
		url: 'http://localhost:8000/pdf',
		data: {"img": points},
		context: document.body
	  }).done(function(data) {
		console.log('result '+ data);
		if(data == 'done')
		{
			window.location.href = 'http://localhost:8000/view'; 
		}
	  });
}

function undoButtonClicked()
{
	var data = signaturePad.toData();
	if (data) {
		data.pop(); // remove the last dot or line
		// @ts-ignore
		signaturePad.fromData(data);
	}
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function updateCanvas()
{
	var query = getUrlVars();
	var data = [];
	if(query['img'] != null)
	{
		var dq = decodeURI(query['img']);
		
		dq = dq.replace(/%2C/g, ','); 
		dq = dq.replace(/%3A/g, ':');

		data = JSON.parse(dq);
		
		signaturePad.fromData(data);
	}
}

updateCanvas();


