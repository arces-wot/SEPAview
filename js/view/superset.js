function aspectRatio() {
	var w = window.outerWidth;
  	var h = window.outerHeight;	

	var ratio = w/h;
	
	if (ratio < 1) return "embed-responsive embed-responsive-1by1";
	if (ratio < 12/9) return "embed-responsive embed-responsive-4by3";
	if (ratio < 16/9) return "embed-responsive embed-responsive-16by9";
	return "embed-responsive embed-responsive-21by9";
}

function showAnalytics(foi) {
	dashid = foi.replaceAll(':','').replaceAll('.','');
	
	var iframe = document.createElement("iframe");
	iframe.setAttribute("class", "embed-responsive-item");
	iframe.setAttribute("src", "https://sepa.vaimee.it:8088/superset/dashboard/"+dashid+"/?standalone=true");
	iframe.setAttribute("style", "height: 100%; width: 100%");

	var title = document.createElement("div");
	title.setAttribute("class", "alert alert-primary");
	title.setAttribute("role", "alert");
	title.innerHTML = "Data analytics";

	var analytics = document.createElement("div");
	analytics.setAttribute("class",aspectRatio())
	analytics.innnerHTML = "";
	analytics.appendChild(iframe);
	
	var superset = document.getElementById("superset");
	superset.innerHTML = "";
	superset.appendChild(title);
	superset.appendChild(analytics);

	$("#superset").show();
}

function hideAnalytics(foi) {
	$("#superset").hide();
}