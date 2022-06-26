let shimmers = document.querySelector('#shimmers')

function check() {
	if (shimmers.children.length == 0) return
	else {
		let shimmer = document.querySelectorAll('.shimmer')
		for (let item of shimmer) {
			item.click()
		}
	}
}

setInterval(check, 1000)


