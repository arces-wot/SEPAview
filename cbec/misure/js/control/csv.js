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

//function downloadCSV() {
//	for (const index in selection) {
//		if (selection.hasOwnProperty(index)) {
//			let dates = traces[index].x.map(date => date.toUTCString())
//			let csvData = zip(dates, traces[index].y)
//
//			let csvContent = "timestamp,data\n";
//
//			csvData.forEach(function (rowArray) {
//				let row = rowArray.join(",");
//				csvContent += row + "\r\n";
//			});
//			var blob = new Blob([csvContent], { type: "text/plain;charset=utf-8" });
//			saveAs(blob, `${selection[index].text}.csv`);
//			
//		}
//	}
//}
//
///*
// * Utility zip function
// */
//function zip(arr, ...arrs)  {
//return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]));
//}

function clearCSVData() {
	csvData = [];
}

function addCSVData(timestamp, value) {
	csvData.push([ timestamp, value ]);
}