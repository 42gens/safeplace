$(document).ready(function() {
	// Hide profile and landing pages initially
	$('#profile-page').hide();
	$('#landing-page').hide();

	// Switch to login page on load
	switchToPage('login-page');

	// Switch to registration page when register link clicked
	$('#register-link').click(function() {
		switchToPage('register-page');
	});

	// Switch
