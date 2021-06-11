
function buildProbe(obs_id,css) {
	var span = document.createElement("span");
	span.setAttribute("class","badge badge-light");
	span.setAttribute("id", "trafo_value_"+obs_id);
	span.innerHTML="XYZ";
		
	var button = document.createElement("button");
	button.setAttribute("type","button");
	button.setAttribute("class","btn btn-success");
	button.setAttribute("id", "trafo_button_"+obs_id);
	button.appendChild(span);
	//button.innerHTML="°C";
	
	var div = document.createElement("div");
	div.setAttribute("class",css);
	div.appendChild(button);
	
	return div;
}

function buildTrafo(foi) {
	let a = sensorData[foi]["https://vaimee.it/monas#ProbeATemperature"]["div_id"];
	let b = sensorData[foi]["https://vaimee.it/monas#ProbeBTemperature"]["div_id"];
	let c = sensorData[foi]["https://vaimee.it/monas#ProbeCTemperature"]["div_id"];
	let d = sensorData[foi]["https://vaimee.it/monas#ProbeDTemperature"]["div_id"];
	
	var div = document.createElement("div");
	div.setAttribute("class", "trafo");
	
	var img = document.createElement("img");
	img.setAttribute("class", "img-fluid");
	img.setAttribute("src", "img/TrafoAndProbes.png");
	img.setAttribute("alt", "trafo");
	
	var ts = document.createElement("div");
	ts.setAttribute("class","trafo-timestamp");
	ts.setAttribute("id", "trafo_timestamp");
	
	div.appendChild(img);
	div.appendChild(buildProbe(a,"probeA"));
	div.appendChild(buildProbe(b,"probeB"));
	div.appendChild(buildProbe(c,"probeC"));
	div.appendChild(buildProbe(d,"probeD"));
	div.appendChild(ts);
	
	return div;
}