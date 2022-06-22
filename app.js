// buildings
const buildings = [
	[15, 'GRAIN', 0.1],
	[100, 'DUST', 1],
	[1000, 'ROCK', 8],
	[12000, 'METEOROID', 47],
	[130000, 'ASTEROID', 260],
	[1400000, 'PLANET', 1400],
	[20000000, 'STAR', 7800],
	[330000000, 'STAR CLUSTER', 44000],
	[5100000000, 'NEBULA', 260000],
	[75000000000, 'GALAXY', 1600000],
]

const ratio = 1.15
let scoreIndex = 0
let newInterval = 0
let cheat = 0

// make building menu
let menu = document.createElement('div')
menu.classList = 'menu'
container.append(menu)
menu.append(document.createElement('div'))
menu.children[0].textContent = 'OBJECTS'

// make buildings
for (let x = 0; x < buildings.length; x++) {
	buildings[x][3] = buildings[x][0]
	menu.append(document.createElement('div'))

	let building = document.createElement('div')
	building.classList = 'building'
	building.textContent = buildings[x][1]

	let buildingCost = document.createElement('button')
	buildingCost.setAttribute('object', x)
	buildingCost.classList = 'cost'
	buildingCost.textContent = getNewValue(x)

	let buildingCounter = document.createElement('div')
	buildingCounter.classList = 'buildingcounter'
	buildingCounter.textContent = 0
	
	menu.children[x + 1].append(buildingCost, buildingCounter, building)
}

// make empty space after all buildings
let emptyDiv = document.createElement('div')
emptyDiv.classList = 'empty'
menu.append(emptyDiv)

let buildingsList = document.querySelectorAll('.cost')
let buildingCountersList = document.querySelectorAll('.buildingcounter')

// make info section
let info = document.createElement('div')
info.classList = 'info'
info.textContent = ''
info.hidden = true
container.append(info)

// make player with .player class
let player = document.createElement('div')
player.classList = 'player'
container.append(player)

// make score counter with .score class
let scoreText = document.createElement('div')
scoreText.classList = 'score'
scoreText.textContent = ''
container.append(scoreText)

// make speed metric
let speedText = document.createElement('div')
speedText.classList = 'speed'
speedText.textContent = ''
container.append(speedText)

let score = 0n


// functions
function newScore() {
	scoreText.textContent = formatValue(score)
}

function newSpeed() {
	speedText.innerHTML = '<strong>' + formatValue(scoreIndex) + '</strong> points per second'
}

function getNewValue(x, y = 3) {
	let value = buildings[x][y]
	value = formatValue(value)
	return value
}

function formatValue(x) {
	if (x > Number.MAX_SAFE_INTEGER) return x
		x = Number(x)
		 if (x >= 10 ** 21) x = (x / 10 ** 21).toFixed(3) + 'S'
	else if (x >= 10 ** 18) x = (x / 10 ** 18).toFixed(3) + 'Q'
	else if (x >= 10 ** 15) x = (x / 10 ** 15).toFixed(3) + 'q'
	else if (x >= 10 ** 12) x = (x / 10 ** 12).toFixed(3) + 'T'
	else if (x >= 10 ** 9 ) x = (x / 10 ** 9 ).toFixed(3) + 'B'
	else if (x >= 10 ** 6 ) x = (x / 10 ** 6 ).toFixed(3) + 'M'
	return x
}

function addScorePopOut() {
	let popOut = document.createElement('div')
	popOut.classList = 'popout'
	popOut.textContent = '+' + formatValue(1 + cheat)
	container.append(popOut)
	setInterval(() => popOut.remove(), 1000)
}

function addBuilding(x) {
	if (score >= BigInt(buildings[x][3])) {
		score -= BigInt(buildings[x][3])
		newScore()

		// change count of building x
		let count = +buildingCountersList[x].textContent + 1
		buildingCountersList[x].textContent = count

		// create new interval
		scoreIndex += buildings[x][2]
		scoreIndex = +scoreIndex.toFixed(1)
		newInterval = 10000 / scoreIndex / 10
		clearInterval(autoClickInterval)
		startInterval(scoreIndex)
		newSpeed()

		// change value of building x
		buildings[x][3] = Math.floor(buildings[x][0] * (ratio ** count))
		buildingsList[x].textContent = getNewValue(x)
	}
}

function getBuldingInfo(x) {
	let name = x.parentNode.querySelector('.building').innerHTML
	let perSecond = buildings[+x.getAttribute('object')][2]
	let amount = x.parentNode.querySelector('.buildingcounter').innerHTML
	let currentCost = getNewValue(+x.getAttribute('object'))
	let xCoord = x.getBoundingClientRect()

	info.style.top = xCoord.top + 'px'
	info.style.left = xCoord.right + 10 + 'px'

	info.innerHTML = '<p>' + name + '</p>\n'
	info.innerHTML += '<p>one <em>' + name.toLowerCase() + '</em> makes <em>' + formatValue(perSecond) + '</em> points per second</p>\n'
	info.innerHTML += '<p>and currently costs <em>' + currentCost + '</em></p>\n'

	if (amount > 1) {
		info.innerHTML += '<p>your <em>' + amount + '</em> ' + name.toLowerCase() + 's make <em>' + formatValue(+(amount * perSecond).toFixed(1)) + '</em> points per second</p>\n'
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
		score += BigInt(Math.round(x))
		newScore()
	}, interval)
}


// click handler
document.addEventListener('click', function(event) {
	// if clicked on player
	if (event.target.className == 'player') {
		score += BigInt(1 + cheat)
		newScore()
		addScorePopOut()
	}

	// if clicked on buldings
	else for (let i = 0; i < buildings.length; i++) {
		if (event.target.getAttribute('object') == i) {
			addBuilding(i)
			getBuldingInfo(event.target)
		}
	}
})

// mouseover handler
menu.addEventListener('mouseover', function(event) {
	if (event.target.className == 'cost') {
		getBuldingInfo(event.target)
		info.hidden = false
	}
})

menu.addEventListener('mouseout', function(event) {
	if (event.target.className == 'cost') {
		info.hidden = true
		info.innerHTML = ''
	}
})

