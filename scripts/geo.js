		// Retrieve the user's geolocation and update the page
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				document.getElementById("latitude").innerHTML = position.coords.latitude;
				document.getElementById("longitude").innerHTML = position.coords.longitude;

				// Create the JSON object with the session guid and timestamp
				var data = {
					"session_guid": generateGuid(),
					"timestamp": new Date().getTime(),
					"latitude": position.coords.latitude,
					"longitude": position.coords.longitude
				};

				// Post the JSON object to the remote server
				var xhr = new XMLHttpRequest();
				xhr.open("POST", "http://172.127.98.121:10000/event", true);
				//xhr.setRequestHeader("Content-Type", "application/json");
				//xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
				xhr.send(JSON.stringify(data));
			});
		} else {
			document.getElementById("latitude").innerHTML = "Geolocation is not supported by this browser.";
		}

		// Generate a unique session guid
		function generateGuid() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}