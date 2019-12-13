var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/v1.0",
	"method": "POST",
	"headers": {
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
		"x-rapidapi-key": "cfbfd40a4cmsh45eca6cbea8e9bfp15a74ejsnec9a244eb8f6",
		"content-type": "application/x-www-form-urlencoded"
	},
	// In the future, make a form such that the user will input and send these information below by themselves
	"data": {
		"inboundDate": "2020-01-10",
		"cabinClass": "business",
		"children": "0",
		"infants": "0",
		"country": "US",
		"currency": "USD",
		"locale": "en-US",
		"originPlace": "YVR-sky",
		"destinationPlace": "MRU-sky",
		"outboundDate": "2020-01-01",
		"adults": "1"
	}
}

$.ajax(settings).done(function (response, status, response_header) {
	var urlExtension = response_header.getResponseHeader('location')
	console.log(urlExtension)
	urlExtension = urlExtension.substring(64, 100)
	// alert(urlExtension)

	var settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/pricing/uk2/v1.0",
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
			"x-rapidapi-key": "cfbfd40a4cmsh45eca6cbea8e9bfp15a74ejsnec9a244eb8f6"
		}
	}
	
	settings.url = settings.url + "/" + urlExtension + "?pageIndex=0&pageSize=10"
	
	$.ajax(settings).done(function (response) {
		console.log(response)
		var flightID = 0

		// Showing the price of flight #1 with currency symbol
		logPrice(response, flightID)

		// Get information of outbound and inbound flight (only the first option as of now)
		logLegInformation(response, 0, "out")
		logLegInformation(response, 0, "in")
	})
})

function logPrice(response, flightChoice){
	// A function to show the price of the flight with the currency symbol
	// Input:
	//		response - the response body from Skyscanner API
	//		flightChoice - the index of itineraries (integer)
	// Return: none

	if (response.Currencies[0].SymbolOnLeft)
		console.log("Price is " + response.Currencies[0].Symbol + response.Itineraries[flightChoice].PricingOptions[flightChoice].Price)
	else
		console.log("Price is " + response.Itineraries[flightChoice].PricingOptions[flightChoice].Price + response.Currencies[0].Symbol)
}

function logLegInformation(response, flightID, pathChoice){
	// A function to show the information of the flight path regarding the specified direction (inbound or outbound)
	// Input:
	//		response - response body from Skyscanner API
	//		flightID - the index of flight option
	//		pathChoice - the direction of flight (inbound or outbout)
	// Return: none

	if (pathChoice == "out")
		var flightLegID = response.Itineraries[flightID].OutboundLegId
	else if (pathChoice == "in")
		var flightLegID = response.Itineraries[flightID].InboundLegId
	else{
		alert("ERROR: The pathChoice (direction of flight) must be either 'in' or 'out'!")
		return
	}

	for (var i = 0; i < response.Legs.length; i++){
		if (response.Legs[i].Id == flightLegID) {
			// Make a string to describe the direction of the path (inbound or outbound)
			var flightDirection = pathChoice + "bound"

			// Record the date and time of departure of the flight
			console.log("Departure date and time for " + flightDirection  + " flight: " + response.Legs[i].Departure)
			console.log("Arrival date and time for " + flightDirection  + " flight: " + response.Legs[i].Arrival)

			checkForTransit(response, i, 0)

			break
		}
	}
}

function checkForTransit(response, legIndex, minimumTransitNum){
	// A function to check if there is a required number of transit in the flight
	// Input:
	//		response - response body from Skyscanner API
	//		legIndex - the index of leg (integer)
	//		minimumTransitNum - the minimum required number of transits during the flight

	var transitNumber = response.Legs[legIndex].SegmentIds.length - 1
	// If there is/are transit(s), show the number and description of transit
	if (transitNumber <= 0)
		console.log("There will be no transits.")
	else
		console.log("There will be " + transitNumber + " transits.")
	
	if (transitNumber >= minimumTransitNum){
		// Go over the segment information to check the details of each segment
		for (var seg = 0; seg < transitNumber + 1; seg++){
			var segmentInformation = response.Segments[response.Legs[legIndex].SegmentIds[seg]]
			var OriginStation = segmentInformation.OriginStation
			var DestinationStation = segmentInformation.DestinationStation

			// Check the name of the departure/arrival airport for each segment
			for (var loc = 0; loc < response.Places.length; loc++){
				if (response.Places[loc].Id == OriginStation)
					var originPlace = response.Places[loc].Name + " " + response.Places[loc].Type
				
				if (response.Places[loc].Id == DestinationStation)
					var destinationPlace = response.Places[loc].Name + " " + response.Places[loc].Type
			}
			console.log("Segment #" + seg + " departs " + originPlace + " and arrives at " + destinationPlace)

			if (seg < transitNumber){
				var nextSegmentInformation = response.Segments[response.Legs[legIndex].SegmentIds[seg + 1]]
				logLayoverTime(segmentInformation.ArrivalDateTime, nextSegmentInformation.DepartureDateTime)
			}
		}
	}
}

function logLayoverTime(arrivalTime, departureTime){
	// A function to compute and show the layover time in hours and minutes.
	// Input: 
	// 		arrivalTime - arrival time of flight
	// 		departureTime - departure time of flight
	// Return: none

	var minutes = 1000 * 60
	var hours = minutes * 60

	var arrTime = stringToDate(arrivalTime)
	var depTime = stringToDate(departureTime)
	var diffTime = depTime - arrTime

	var diffHour = Math.floor(diffTime / hours)
	var diffMinute = Math.round(diffTime / minutes - diffHour * 60)

	console.log(diffHour + "hours and " + diffMinute + "minutes")
}

function stringToDate(stringTime){
	// A function to convert date and time in string from Skyscanner API to Date()
	//Input:
	//		stringTime - date/time from Skyscanner API
	//Return:
	// 		new Date() - the date/time in javascript Date() format

	var year = stringTime.charAt(0) + stringTime.charAt(1) + stringTime.charAt(2) + stringTime.charAt(3)
	var month = stringTime.charAt(5) + stringTime.charAt(6)
	var day = stringTime.charAt(8) + stringTime.charAt(9)
	var hour = stringTime.charAt(11) + stringTime.charAt(12)
	var minute = stringTime.charAt(14) + stringTime.charAt(15)
	var second = stringTime.charAt(17) + stringTime.charAt(18)

	return new Date(year, month, day, hour, minute, second)
}
