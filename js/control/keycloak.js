var keycloak;
var parameters;

function login(uri) {
	keycloak = new Keycloak();
	keycloak.init({
		onLoad: 'login-required', redirectUri: uri
	}).then(function(authenticated) {
		if (authenticated) {
			keycloak.loadUserProfile()
				.then(function(profile) {
					$("#userLogin").text('Logged is as ' + profile.username)
					onLoad();

				}).catch(function() {
					$("#userLogin").text('Failed to load user profile')
					alert('Failed to load user profile');
				});
		}
		else $("#userLogin").text('not authenticated')
	}).catch(function() {
		$("#userLogin").text('failed to initialize');
	});
}

function logOut(uri) {
	keycloak.logout({ redirectUri: uri })
}

function loginHistory() {	
	keycloak = new Keycloak();
	keycloak.init({
		onLoad: 'login-required', redirectUri: 'https://vaimee.it/sepaview/history.html?'+window.location.search.substring(1)
	}).then(function(authenticated) {
		if (authenticated) {
			keycloak.loadUserProfile()
				.then(function(profile) {
					$("#userLogin").text('Logged is as ' + profile.username)
					console.log("Parameters: "+window.location.search.substring(1))
					onLoadHistory();

				}).catch(function(e) {
					console.log(e)
				});
		}
		else $("#userLogin").text('not authenticated')
	}).catch(function() {
		$("#userLogin").text('failed to initialize');
	});
}

function logOutHistory() {
	keycloak.logout({ redirectUri: 'https://vaimee.it/sepaview/history.html' })
}