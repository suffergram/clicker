let shimmers = document.querySelector('#shimmers')

function check() {
	if (shimmers.children.length == 0) console.log('there are no shimmers')
	else console.log('there ARE shimmer!!!')
}

setTimer(check, 100)


