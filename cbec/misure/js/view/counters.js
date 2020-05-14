function updateObservationsCount(count) {
	$("#odoObservations").html(count);	
}

function updatePlacesCount(count) {
	$("#odoPlaces").html(count);	
}

function updateForecastsCount(count) {
	$("#odoForecastsSize").html(count);	
}

function updateHistoryGraphSize(count) {
	$("#odoHistorySize").html(count);	
}

function updateLiveGraphSize(count) {
	$("#odoLiveSize").html(count);	
}

function updateNotifications() {
	nots++;
	$("#odoNotifications").html(nots);
}