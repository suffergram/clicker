let upgrades = [
	[15, 'CLICKER', 0.1],
	[100, 'ROCK', 1],
	[1000, 'MOUNTAIN', 8],
	[12000, 'CONTINENT', 47],
	[130000, 'PLANET', 260],
	[1400000, 'STAR', 1400],
]

const ratio = 1.22
let scoreIndex = 0
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
	upgrade.textContent = upgrades[x][1] + ' (' + upgrades[x][0] + ') +' + upgrades[x][2]
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
	scoreText.textContent = score ^ 0
}

function newSpeed() {
	speedText.innerHTML = 'current speed: ' + scoreIndex + ' points per ' + 1 + ' second'
}

function newDescription() {
	upgrade.textContent = upgrades[x][1] + ' (' + upgrades[x][0] + ') +' + upgrades[x][2]
}

function addScorePopOut() {
	let popOut = document.createElement('div')
	popOut.classList = 'popout'
	popOut.textContent = '+' + (1 + cheat)
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

		// create new interval
		scoreIndex += upgrades[x][2]
		scoreIndex = +scoreIndex.toFixed(1)
		newInterval = 10000 / scoreIndex / 10
		clearInterval(autoClickInterval)
		startInterval(scoreIndex)
		newSpeed()

		// change value of upgrade x
		upgrades[x][0] = Math.floor(upgrades[x][0] * ratio)
		upgradesList[x].textContent = upgrades[x][1] + ' (' + upgrades[x][0] + ') +' + upgrades[x][2]
	}
}


// auto-clicker
let autoClickInterval;
function startInterval(x) {
	let interval = 1000
	if (x > 10) {
		interval = 100
		x = x / 10 ^ 0
	} else if (x < 1) {
		interval = 1000 / x ^ 0
		x = 1
	}

	autoClickInterval = setInterval(() => {
		score += x
		newScore()
	}, interval)
}


// click handler
document.addEventListener('click', function(event) {
	// if clicked on player
	if (event.target.className == 'player') {
		score += 1 + cheat
		newScore()
		addScorePopOut()
	}

	else for (let i = 0; i < upgrades.length; i++) {
		if (event.target.id == i) doUpgrade(i)
	}
})
