let shimmers = document.querySelector('#shimmers')
let cookie = document.querySelector('#bigCookie')

function check() {
	if (shimmers.children.length == 0) return
	else {
		let shimmer = document.querySelectorAll('.shimmer')
		for (let item of shimmer) {
			item.click()
		}
	}
}

function autoclick() {
	for (let ii = 0, ii < 50; ii++) {
		cookie.click()
	}
}

setInterval(check, 1000)

setInterval(autoclick, 10)


