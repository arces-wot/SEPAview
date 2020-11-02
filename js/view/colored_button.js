thresholds = {
	"abc" : {
		"freeze" : 0,
		"fan_on": 100,
		"pre_alarm" : 150,
		"alarm" : 200	
	},
	"d" : {
		"freeze" : 0,
		"fan_on": 120,
		"pre_alarm" : 170,
		"alarm" : 220
	}
}

freeze_color = "btn-secondary";
normal_color = "btn-success";
fan_on_color = "btn-primary";
warning_color = "btn-warning";
alarm_color = "btn-danger";

ProbeDTemperature = "https://vaimee.it/monas#ProbeDTemperature"

// "<button type='button' class='btn btn-success' id='value_+"+ obs_id+ "'>"
function setColor(obs_id,color) {
	$('#'+obs_id).attr("class", 'btn '+color);
}

function updateButtonColor(obs_id,prop,value) {
	th = {};
	if (prop === ProbeDTemperature) {
		th = thresholds.d;
	} else {
		th = thresholds.abc;
	}
	
	if (value < th.freeze) setColor(obs_id,freeze_color);
	else if (value < th.fan_on) setColor(obs_id,normal_color);
	else if (value < th.pre_alarm) setColor(obs_id,fan_on_color);
	else if (value < th.alarm) setColor(obs_id,warning_color);
	else setColor(obs_id,alarm_color);
}