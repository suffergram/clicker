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
	let fortune = document.querySelector('.fortune')
	if (!!fortune) fortune.click()
}

setInterval(check, 500)

setInterval(() => cookie.click(), 10)


