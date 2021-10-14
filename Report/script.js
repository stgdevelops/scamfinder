let socket = io();
let number = document.getElementById('number');
let category = document.getElementById('type');
let btn = document.getElementById('btn');
let msg = document.getElementById('msg');
let menu = document.getElementById("mobile-menu");

btn.addEventListener('click', function() {
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

  if (currentClass === "hidden"){
    menu.className = "";
  }
  else {
    menu.className = "hidden";
  }
}