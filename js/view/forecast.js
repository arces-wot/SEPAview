function initForecasts(place_id,today) {
	var tomorrow = moment(today).add(1,'days');
	var dat = moment(today).add(2,'days');
	
//	tomorrow.setDate(today.getDate() + 1);
//	dat.setDate(today.getDate() + 2);
	
	$("#forecast_" + place_id).empty();

	$("#forecast_" + place_id).append("<div class='alert alert-danger mt-3' role='alert'>Forecast</div>");
	$("#forecast_" + place_id).append("<div class='alert alert-secondary mt-3' id='forecast_"+ place_id+ "_0' role='alert'><h6 class='alert-heading'>Today ("+ today.format("dddd, MMMM Do YYYY")+ ")</h6><hr></div>");
	$("#forecast_" + place_id).append("<div class='alert alert-secondary mt-3' id='forecast_"+ place_id+ "_1' role='alert'><h6 class='alert-heading'>Tomorrow ("+ tomorrow.format("dddd, MMMM Do YYYY")+ ")</h6><hr></div>");
	$("#forecast_" + place_id).append("<div class='alert alert-secondary mt-3' id='forecast_"+ place_id+ "_2' role='alert'><h6 class='alert-heading'>Day after tomorrow ("+ dat.format("dddd, MMMM Do YYYY") + ")</h6><hr></div>");	
}

function showWeatherTemperatureForecast(place_id, place, name, forecast,
		binding) {

	$("#forecast_" + place_id).show();
	
	$("#forecast_" + place_id + "_" + forecast)
			.append(
					"<div class='row flex-row-reverse align-items-center mt-3'>"
							+ "<form target='_blank' action='./forecast.html'>"
							+ "<input class='form-control form-control-sm' type='hidden' name='observedProperty' value=\""
							+ "arces-monitor:AirTemperature"
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='place' value=\""
							+ place
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='forecast' value=\""
							+ forecast
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='title' value='"
							+ escape(name + " - Temperature forecast")
							+ "' />"
							+ "<button class='btn btn-primary ml-3' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button></form>"
							+ "<button type='button'class='btn btn-success ml-3'>"
							+ "Min<span class='badge badge-light ml-3 mr-3'>"
							+ parseFloat(binding.min.value).toFixed(2)
							+ "</span>"
							+ "Avg<span class='badge badge-light ml-3 mr-3'>"
							+ parseFloat(binding.avg.value).toFixed(2)
							+ "</span>"
							+ "Max<span class='badge badge-light ml-3'>"
							+ parseFloat(binding.max.value).toFixed(2)
							+ "</span>"
							+ "</button>"
							+ "<span class='font-weight-bold align-items-center'>Air Temperature (degC)</span></div>");
}

function showWeatherPrecipitationForecast(place_id, place, name, forecast,
		binding) {

	$("#forecast_" + place_id).show();
	

	$("#forecast_" + place_id + "_" + forecast)
			.append(
					"<div class='row flex-row-reverse align-items-center mt-3'>"
							+ "<form target='_blank' action='./forecast.html'>"
							+ "<input class='form-control form-control-sm' type='hidden' name='observedProperty' value=\""
							+ "arces-monitor:Precipitation"
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='place' value=\""
							+ place
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='forecast' value=\""
							+ forecast
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='title' value='"
							+ escape(name + " - Precipitation forecast")
							+ "' />"
							+ "<button class='btn btn-primary ml-3' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button></form>"
							+ "<button type='button'class='btn btn-success ml-3'>"
							+ "<span class='badge badge-light'>"
							+ parseFloat(binding.sum.value).toFixed(1)
							+ "</span>"
							+ "</button>"
							+ "<span class='font-weight-bold'>Precipitation (mm)</span></div>");
}

function showLAIForecast(place_id, place, name, forecast, binding) {

	$("#forecast_" + place_id).show();

	$("#forecast_" + place_id + "_" + forecast)
			.append(
					"<div class='row flex-row-reverse align-items-center mt-3'>"
							+ "<form target='_blank' action='./forecast.html'>"
							+ "<input class='form-control form-control-sm' type='hidden' name='observedProperty' value=\""
							+ "swamp:LeafAreaIndex"
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='place' value=\""
							+ place
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='forecast' value=\""
							+ forecast
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='title' value='"
							+ escape(name + " - LAI forecast")
							+ "' />"
							+ "<button class='btn btn-primary ml-3' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button></form>"
							+ "<button type='button'class='btn btn-warning ml-3'>"
							+ "<span class='badge badge-light'>"
							+ parseFloat(binding.value.value).toFixed(2)
							+ "</span>"
							+ "</button>"
							+ "<span class='font-weight-bold'>LAI (#)</span></div>");
}

function showIrrigationForecast(place_id, place, name, forecast, binding) {

	$("#forecast_" + place_id).show();

	$("#forecast_" + place_id + "_" + forecast)
			.append(
					"<div class='row flex-row-reverse align-items-center mt-3'>"
							+ "<form target='_blank' action='./forecast.html'>"
							+ "<input class='form-control form-control-sm' type='hidden' name='observedProperty' value=\""
							+ "swamp:IrrigationNeeds"
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='place' value=\""
							+ place
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='forecast' value=\""
							+ forecast
							+ "\" />"
							+ "<input class='form-control form-control-sm' type='hidden' name='title' value='"
							+ escape(name + " - Irrrigation needs forecast")
							+ "' />"
							+ "<button class='btn btn-primary ml-3' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button></form>"
							+ "<button type='button'class='btn btn-info ml-3'>"
							+ "<span class='badge badge-light'>"
							+ parseFloat(binding.value.value).toFixed(2)
							+ "</span>"
							+ "</button>"
							+ "<span class='font-weight-bold'>Irrigation needs (mm)</span></div>");
}