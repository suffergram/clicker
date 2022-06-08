const CLICKER_VALUE = 100
const MAGNET_VALUE = 1000
const GRAVITY_VALUE = 10000
let scoreIndex = 1;


// create upgrade menu
let menu = document.createElement('div')
menu.classList = 'menu'
container.append(menu)
menu.append(document.createElement('div'))
menu.children[0].textContent = 'UPGRADES'


// create upgrade 1
let upgrade1 = document.createElement('button')
upgrade1.setAttribute('id', 'up1')
upgrade1.textContent = 'CLICKER (' + CLICKER_VALUE + ')'
upgrade1.setAttribute('count', '0')
upgrade1.setAttribute('value', '0')
let upgradeCounter1 = document.createElement('div')
upgradeCounter1.setAttribute('id', 'upcnt1')
upgradeCounter1.classList = 'upgradecounter'
upgradeCounter1.textContent = upgrade1.getAttribute('count')
menu.append(document.createElement('div'))
menu.children[1].append(upgrade1, upgradeCounter1)

// create upgrade 2
let upgrade2 = document.createElement('button')
upgrade2.setAttribute('id', 'up2')
upgrade2.textContent = 'MAGNET (' + MAGNET_VALUE / 1000 + 'K)'
upgrade2.setAttribute('count', '0')
upgrade2.setAttribute('value', '0')
let upgradeCounter2 = document.createElement('div')
upgradeCounter2.setAttribute('id', 'upcnt2')
upgradeCounter2.classList = 'upgradecounter'
upgradeCounter2.textContent = upgrade2.getAttribute('count')
menu.append(document.createElement('div'))
menu.children[2].append(upgrade2, upgradeCounter2)

// create upgrade 3
let upgrade3 = document.createElement('button')
upgrade3.setAttribute('id', 'up3')
upgrade3.textContent = 'GRAVITY (' + GRAVITY_VALUE / 1000 + 'K)'
upgrade3.setAttribute('count', '0')
upgrade3.setAttribute('value', '0')
let upgradeCounter3 = document.createElement('div')
upgradeCounter3.setAttribute('id', 'upcnt3')
upgradeCounter3.classList = 'upgradecounter'
upgradeCounter3.textContent = upgrade3.getAttribute('count')
menu.append(document.createElement('div'))
menu.children[3].append(upgrade3, upgradeCounter3)


// create player with .player class
let player = document.createElement('div')
player.classList = 'player'
container.append(player)

// create score counter with .score class
let scoreText = document.createElement('div')
scoreText.classList = 'score'
scoreText.textContent = ''
container.append(scoreText)

let score = +scoreText.textContent;


// functions
function newScore() {
	scoreText.textContent = score
}

function addScorePopOut() {
	let popOut = document.createElement('div')
	popOut.classList = 'popout'
	popOut.textContent = '+' + scoreIndex
	container.append(popOut)
	setInterval(() => popOut.remove(), 1000)
}

// auto-clicker
let autoClickInterval;
function startInterval(interval) {
	autoClickInterval = setInterval(() => {
		// score += +upgrade1.getAttribute('count')
		score += scoreIndex
		newScore()
	}, interval)
}



// click handler
document.addEventListener('click', function(event) {
	// if clicked on player
	if (event.target.className == 'player') {
		score += scoreIndex
		newScore()
		addScorePopOut()
	}

	// if clicked on upgrade 1
	else if (event.target.id == 'up1') {
		if (score >= CLICKER_VALUE) {
			console.log('cursor added')
			score -= CLICKER_VALUE
			newScore()

			// change count of upgrade
			let count = +upgrade1.getAttribute('count') + 1
			upgrade1.setAttribute('count', count)
			upgrade1.setAttribute('value', count * CLICKER_VALUE)
			upgradeCounter1.textContent = +upgradeCounter1.textContent + 1

			// create new interval
			let newInterval = 8000 / count
			clearInterval(autoClickInterval)
			startInterval(newInterval)
		}
	}

	// if clicked on upgrade 2
	else if (event.target.id == 'up2') {
		if (score >= MAGNET_VALUE) {
			console.log('magnet added')
			score -= MAGNET_VALUE
			newScore()

			// change count of upgrade
			let count = +upgrade2.getAttribute('count') + 1
			upgrade2.setAttribute('count', count)
			upgrade2.setAttribute('value', count * MAGNET_VALUE)
			upgradeCounter2.textContent = +upgradeCounter2.textContent + 1

			// change scoreIndex
			scoreIndex += 1
		}
	}

	// if clicked on upgrade 3
	else if (event.target.id == 'up3') {
		if (score >= GRAVITY_VALUE) {
			console.log('gravity added')
			score -= GRAVITY_VALUE
			newScore()

			// change count of upgrade
			let count = +upgrade3.getAttribute('count') + 1
			upgrade3.setAttribute('count', count)
			upgrade3.setAttribute('value', count * GRAVITY_VALUE)
			upgradeCounter3.textContent = +upgradeCounter3.textContent + 1

			// change scoreIndex
			scoreIndex += 10
		}
	}
})
