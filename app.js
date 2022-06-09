let upgrades = [
	[100, 'CLICKER'],
	[1000, 'ROCK', 1],
	[10000, 'MOUNTAIN', 10],
	[1000000, 'PLANET', 1000],
]

const ratio = 1.095
let scoreIndex = 1
let speed = 0
let newInterval = 0
let cheat = 0


// create upgrade menu
let menu = document.createElement('div')
menu.classList = 'menu'
container.append(menu)
menu.append(document.createElement('div'))
menu.children[0].textContent = 'UPGRADES'

// create upgrades
for (let x = 0; x < upgrades.length; x++) {
	let upgrade = document.createElement('button')
	upgrade.setAttribute('id', x)
	upgrade.classList = 'upgrade'
	upgrade.textContent = upgrades[x][1] + ' (' + upgrades[x][0] + ')'
	let upgradeCounter = document.createElement('div')
	upgradeCounter.classList = 'upgradecounter'
	upgradeCounter.textContent = 0
	menu.append(document.createElement('div'))
	menu.children[x + 1].append(upgrade, upgradeCounter)
}

let upgradesList = document.querySelectorAll('.upgrade')
let upgradeCountersList = document.querySelectorAll('.upgradecounter')

// create player with .player class
let player = document.createElement('div')
player.classList = 'player'
container.append(player)

// create score counter with .score class
let scoreText = document.createElement('div')
scoreText.classList = 'score'
scoreText.textContent = ''
container.append(scoreText)

// create speed metric
let speedText = document.createElement('div')
speedText.classList = 'speed'
speedText.textContent = ''
container.append(speedText)

let score = +scoreText.textContent;


// functions
function newScore() {
	scoreText.textContent = score
}

function newSpeed() {
	speedText.innerHTML = 'current speed: <strong>' + speed.toFixed(3) + '</strong> or ' + scoreIndex + ' points per ' + (newInterval / 1000).toFixed(2) + ' seconds'
}

function addScorePopOut() {
	let popOut = document.createElement('div')
	popOut.classList = 'popout'
	popOut.textContent = '+' + (scoreIndex + cheat)
	container.append(popOut)
	setInterval(() => popOut.remove(), 1000)
}

function doUpgrade(x) {
	if (score >= upgrades[x][0]) {
		score -= upgrades[x][0]
		newScore()

		// change count of upgrade x
		let count = +upgradeCountersList[x].textContent + 1
		upgradeCountersList[x].textContent = count

		// change scoreIndex
		scoreIndex += upgrades[x][2]
		speed = 1000 * scoreIndex / newInterval
		if (speed != Infinity) newSpeed()

		// change value of upgrade x
		upgrades[x][0] = Math.floor(upgrades[x][0] * ratio)
		upgradesList[x].textContent = upgrades[x][1] + ' (' + upgrades[x][0] + ')'
	}
}


// auto-clicker
let autoClickInterval;
function startInterval(interval) {
	autoClickInterval = setInterval(() => {
		score += scoreIndex
		newScore()
	}, interval)
}



// click handler
document.addEventListener('click', function(event) {
	// if clicked on player
	if (event.target.className == 'player') {
		score += scoreIndex + cheat
		newScore()
		addScorePopOut()
	}

	// if clicked on upgrade 0
	else if (event.target.id == 0) {
		if (score >= upgrades[0][0]) {
			score -= upgrades[0][0]
			newScore()

			// change count of upgrade
			let count = +upgradeCountersList[0].textContent + 1
			upgradeCountersList[0].textContent = count

			// create new interval
			newInterval = 8000 / count
			speed = 1000 * scoreIndex / newInterval
			newSpeed()
			clearInterval(autoClickInterval)
			startInterval(newInterval)

			// change value of upgrade 1
			upgrades[0][0] = Math.floor(upgrades[0][0] * ratio)
			upgradesList[0].textContent = upgrades[0][1] + ' (' + upgrades[0][0] + ')'
		}
	}

	// if clicked on upgrade 1
	else if (event.target.id == 1) doUpgrade(1)

	// if clicked on upgrade 2
	else if (event.target.id == 2) doUpgrade(2)

	// if clicked on upgrade 3
	else if (event.target.id == 3) doUpgrade(3)
})
