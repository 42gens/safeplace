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

//REGISTER
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const firstname = registerForm.elements['first-name'].value;
	const lastname = registerForm.elements['last-name'].value;
	const userType = registerForm.elements['user-type'].value;
	const city = registerForm.elements['city-register'].value;
	const state = registerForm.elements['state-register'].value;
	const cell = registerForm.elements['cell-register'].value;
	const email = registerForm.elements['email-register'].value;
	const password = registerForm.elements['password'].value;
	const verifyPassword = registerForm.elements['verify-password'].value;
	
	if (password !== verifyPassword) {
		alert('Passwords do not match');
		return;
	}
	const data = { firstname, lastname, userType, city, state, email, cell, password };
	const url = 'http://172.127.98.121:10000/register';
	fetch(url, {
		method: 'POST',
		//headers: {
		//	'Content-Type': 'application/json',
        //    'Access-Control-Allow-Origin':'*'
		//},
		body: JSON.stringify(data)
	})
	.then((response) => response.json())
	.then((data) => {
        //??Remove console.log(data) below after testing
		console.log(data)
        if (data.Code === '0') {
			// registration success
			alert('Registration successful');
			window.location.href = 'login.html';
		} else {
			// registration failed
			alert('Registration failed');
            
		}
	})
	.catch((error) => console.error(error));
});

