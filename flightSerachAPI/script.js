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

		// Showing the price of flight #1 with currency symbol
		if (response.Currencies[0].SymbolOnLeft)
			console.log("Price is " + response.Currencies[0].Symbol + response.Itineraries[0].PricingOptions[0].Price)
		else
			console.log("Price is " + response.Itineraries[0].PricingOptions[0].Price + response.Currencies[0].Symbol)
		
		// Get information of outbound flight (only the first option as of now)
		OutboundLegID = response.Itineraries[0].OutboundLegID
		for (var i = 0; i < response.Legs.length; i++){
			if (response.Legs[i].ID == OutboundLegID) {
				// Record the date and time of departure of outbound flight
				console.log("Departure date and time: " + response.Legs[i].Departure)
				console.log("Arrival date and time: " + response.Legs[i].Arrival)

				// Check if there is a transit
				var transitNumber = response.Legs[i].SegmentIds.length - 1
				// If there is/are transit(s), show the number and description of transit
				if (transitNumber > 0) {
					console.log("There will be " + transitNumber + " transits.")

					// Go over the segment information to check the details of each segment
					for (var seg = 0; seg < transitNumber + 1; seg++){
						var segmentInformation = response.Segments[response.Legs[i].SegmentIds[seg]]
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
							var nextSegmentInformation = response.Segments[response.Legs[i].SegmentIds[seg + 1]]
							logLayoverTime(segmentInformation.ArrivalDateTime, nextSegmentInformation.DepartureDateTime)
						}
					}
				}
				break
			}
		}
	})
})

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
