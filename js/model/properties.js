propertyClassName = ["covid19","istat"];
			
observedProperties = [
	["http://covid19#IntensiveCare",
		"http://covid19#TotalHospitalised",
		"http://covid19#Death",
		"http://covid19#HospitalisedWithSymptoms",
		"http://covid19#TotalPositiveCases",
		"http://covid19#DailyPositiveCases",
		"http://covid19#DeltaTotalPositiveCases",
		"http://covid19#HomeConfinement",
		"http://covid19#Recovered",
		"http://covid19#TotalCases",
		"http://covid19#TestPerformed"],
	["http://istat/demographics/context/TotalPeople"]
];

function getPropertyClassName(prop) {
	for (index in observedProperties) {
		if (observedProperties[index].contains(prop)) return propertyClassName[index];
	}
	
	return null;
}


