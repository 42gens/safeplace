const tabs = document.querySelectorAll('.tabs li');
const tabContents = document.querySelectorAll('.tab-content > div');

tabs.forEach((tab, index) => {
	tab.addEventListener('click', () => {
		tabs.forEach((tab) => tab.classList.remove('active'));
		tab.classList.add('active');
		tabContents.forEach((content) => content.classList.remove('active'));
		tabContents[index].classList.add('active');
	});
});

//LOGIN
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const email = loginForm.elements['email-login'].value;
	const password = loginForm.elements['password'].value;
	const data = { email, password };
	const url = 'https://safe-watcher.com:10000/login';
	fetch(url, {
		method: 'POST',
		body: JSON.stringify(data)
	})
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		if (data.Code ==='0') {
			// login success
			if (data.UserType === 'client') {
				// store the returned data in the userData variable
				const id=data.Id;
				let userData = data;
				userData.id = id;
				// save the data to the local storage with
				localStorage.setItem('userData', JSON.stringify(userData));

				// redirect to the client_v1.html page
				//window.location.href = 'client_v1.html';
				window.location.href = 'client_v1.html?id=' + id;
			} else {
				window.location.href = 'index.html';
			}
		} else {
			// login failed
			alert('Invalid email or password');
		}
	})
	.catch((error) => console.error(error));
});