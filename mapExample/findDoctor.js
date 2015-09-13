var map;
var loc = {lat: 37.5466, lng: -77.4533};
var doctorLocs = [];
function findDoctors(range, limit, insureID, specID) {
	if(!(limit.length > 0))
		limit = '20';
	if(!(range.length > 0))
		range = '10';

	var baseURL = 'https://api.betterdoctor.com/2015-01-27/doctors';
	var request = {
		type: 'GET',
		url: 'https://api.betterdoctor.com/2015-01-27/doctors',
		data: {
			location: loc.lat + "," + loc.lng + "," + range,
			user_location: loc.lat + "," + loc.lng,
			limit: limit,
			user_key: "02d43d2040b26fd640f5963e44054d2f"
		}
	};
	if(insureID.length>0)
		request['insurance_uid'] = insureID;
	if(specID.length > 0)
		request['specialty_uid'] = specID;
	$.ajax(request).done(function (res) {
		parseDoctors(res.data);
		populateMap();
	});
}
function parseDoctors(doctors) {
	for(var i =0; i<doctors.length;i++){
		var practices = doctors[i].practices;
		for(var j = 0; j<practices.length; j++){
			doctorLocs.push({
				loc: {
					lat: practices[j].lat,
					lng: practices[j].lon
				},
				practice: doctors[i].practices[0].name,
				rating: doctors[i].ratings[0].rating,
				profile: doctors[i].profile //first_name, middle_name, last_name, title, image_url, gender, bio
			});			
		}
	}
}
function populateMap () {
	for(var i = 0; i<doctorLocs.length; i++){
		var marker = new google.maps.Marker({
		    map: map,
		    position: doctorLocs[i].loc,
		    title: doctorLocs[i].practice
		  });
		var infoContent = 
			"<div>"+
				"<h1>"+doctorLocs[i].practice+"</h1>"+
				"<h2>"+doctorLocs[i].profile.last_name + ", " + doctorLocs[i].profile.first_name + "</h2>"+
				"<img src='"+doctorLocs[i].profile.image_url+"' height=20px widith=20px />" +

			"</div>";
		map.panTo(loc);
	}
}
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: loc,
    zoom: 8
  });
}
