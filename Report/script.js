let socket = io();
let number = document.getElementById('number');
let category = document.getElementById('type');
let btn = document.getElementById('btn');
let msg = document.getElementById('msg');
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

btn.addEventListener('click', function () {
  if (category.options[category.selectedIndex].text === 'Scam Category') {
    msg.innerHTML = `<div class="text-white font-sans font-bold">you didn't specify the scam category</div>`;
  } else {
    if (number.value.length === 10) {
      socket.emit(
        'report',
        number.value,
        category.options[category.selectedIndex].text
      );
      msg.innerHTML = `<div class="text-white font-sans font-bold">thanks for reporting!</div>`;
    } else {
      msg.innerHTML = `<div class="text-white font-sans font-bold">you didn't specify a vaild phone number</div>`;
    }
  }
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

  console.log(event.target);
});
window.addEventListener("click", function () {
  contextMenu.classList.remove("active");
});

// Context Menu Options
function copy() {
  number.select();
  document.execCommand("copy");
  msg.innerHTML = `<div class="text-white font-sans font-bold">Copied to Clipboard!</div>`;
}
function paste() {
  navigator.clipboard.readText().then(text => {
    number.value = text;
  }).catch(() => {
    msg.innerHTML = `<div class="text-white font-bold">Sorry, i am unable to paste the last thing you copied! Please ensure that you given us permission to "See text and images copied to the clipboard" by setting the "Clipboard" permission to Allowed on your browser site settings!</div>`;
  });
}
function check() {
  let currNumber = number.value;

  if (currNumber === "") {
    if (number.value.length === 10) {
      socket.emit('getNumber', number.value);
    } else {
      siteresults.innerHTML = `<div class="text-white font-sans font-bold">you didn't specify a vaild phone number</div>`;
    }
  }
  else {
    window.location.href = `/?number=${currNumber}`;
  }
}