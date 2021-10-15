/* Variables */
let socket = io();
let search = document.getElementById('search');
let number = document.getElementById('number');
let siteresults = document.getElementById('results');
let menu = document.getElementById("mobile-menu");
let contextMenu = document.getElementById("contextMenu");

function getQuery(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

if (getQuery('number')) {
  number.value = getQuery('number');
}

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

/* Search Number onEnter */
number.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    search.click();
  }
});

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

  if (currentClass === "hidden") {
    menu.className = "";
  }
  else {
    menu.className = "hidden";
  }
}

// Context Menu
window.addEventListener("contextmenu", function (event) {
  event.preventDefault();
  contextMenu.style.top = event.offsetY + "px";
  contextMenu.style.left = event.offsetX + "px";
  contextMenu.classList.add("active");
});
window.addEventListener("click", function () {
  contextMenu.classList.remove("active");
});

// Context Menu Options
function copy() {
  number.select();
  document.execCommand("copy");
  siteresults.innerHTML = `<div class="text-white font-sans font-bold">Copied to Clipboard!</div>`;
}
function paste() {
  navigator.clipboard.readText().then(text => {
    number.value = text;
  }).catch(() => {
    siteresults.innerHTML = `<div class="text-white font-bold">Sorry, i am unable to paste the last thing you copied! Please ensure that you given us permission to "See text and images copied to the clipboard" by setting the "Clipboard" permission to Allowed on your browser site settings!</div>`;
  });
}
function report() {
  let currNumber = number.value;

  if (currNumber === "") {
    if (number.value.length === 10) {
      socket.emit('getNumber', number.value);
    } else {
      siteresults.innerHTML = `<div class="text-white font-sans font-bold">you didn't specify a vaild phone number</div>`;
    }
  }
  else {
    window.location.href = `/report?number=${currNumber}`;
  }
}