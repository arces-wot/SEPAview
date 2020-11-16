var csvData;

function downloadCSV(name) {
	let csvContent = "timestamp,data\n";
	
	csvData.forEach(function(rowArray) {
		let row = rowArray.join(",");
		csvContent += row + "\r\n";
	});

	var encodedUri = name.text.split(' ').join('_');
		
	var blob = new Blob([csvContent], { type: "text/plain;charset=utf-8" });
	saveAs(blob, encodedUri+`.csv`);
}

function clearCSVData() {
	csvData = [];
}

function addCSVData(timestamp, value) {
	csvData.push([ timestamp, value ]);
}