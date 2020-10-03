var keycloak;

function login() {
	keycloak = new Keycloak();
	keycloak.init({
		onLoad: 'login-required', redirectUri: 'https://vaimee.it/sepaview/index.html'
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

function logOut() {
	keycloak.logout({ redirectUri: 'https://vaimee.it/sepaview/index.html' })
}