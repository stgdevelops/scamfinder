/* Variables */
let socket = io();
let search = document.getElementById('search');
let number = document.getElementById('number');
let siteresults = document.getElementById('results');
let menu = document.getElementById("mobile-menu");

/* Load Service Worker (PWA)
if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('./js?folder=pwa&file=pwabuilder-sw').then(
			function (registration) {
				console.log(registration.scope);
			},
			function (err) {
				console.log(err);
			}
		);
	});
}*/

/* Search Number When "Search" Button Is Clicked */
search.addEventListener('click', function () {
	if (number.value.length === 10) {
		socket.emit('getNumber', number.value);
	} else {
		siteresults.innerHTML = `<div class="text-white font-sans font-bold">you didn't specify a vaild phone number</div>`;
	}
});

/* Result Socket */
socket.on('results', results => {
	siteresults.innerHTML = `<div class="text-white font-sans font-bold">${results}</div>`;
});

/* Open Menu Function */
function openMenu() {
  let currentClass = menu.className;

  if (currentClass === "hidden"){
    menu.className = "";
  }
  else {
    menu.className = "hidden";
  }
}