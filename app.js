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
let cheat = 9999999999


// create building menu
let menu = document.createElement('div')
menu.classList = 'menu'
container.append(menu)
menu.append(document.createElement('div'))
menu.children[0].textContent = 'OBJECTS'
menu.children[0].id = 'none'

// create buildings
for (let x = 0; x < buildings.length; x++) {
	buildings[x][3] = buildings[x][0]
	menu.append(document.createElement('div'))

	let building = document.createElement('div')
	building.classList = 'building'
	building.textContent = buildings[x][1]

	let buildingCost = document.createElement('button')
	buildingCost.id = x
	buildingCost.classList = 'cost'
	buildingCost.textContent = getNewCost(x)

	let buildingCounter = document.createElement('div')
	buildingCounter.classList = 'buildingcounter'
	buildingCounter.textContent = 0
	
	menu.children[x + 1].append(buildingCost, buildingCounter, building)
}

let buildingsList = document.querySelectorAll('.cost')
let buildingCountersList = document.querySelectorAll('.buildingcounter')

//create info section
let info = document.createElement('div')
info.classList = 'info'
info.textContent = ''
info.hidden = true
container.append(info)

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

let score = BigInt(+scoreText.textContent);


// functions
function newScore() {
	scoreText.textContent = score
}

function newSpeed() {
	speedText.innerHTML = '<strong>' + scoreIndex + '</strong> points per ' + 1 + ' second'
}

function getNewCost(x) {
	let buildingPrice = buildings[x][3]
	if (buildingPrice >= 10 ** 12) buildingPrice = (buildingPrice / 10 ** 12).toFixed(3) + 'T'
	if (buildingPrice >= 10 ** 9) buildingPrice = (buildingPrice / 10 ** 9).toFixed(3) + 'B'
	if (buildingPrice >= 10 ** 6) buildingPrice = (buildingPrice / 10 ** 6).toFixed(3) + 'M'

	return '' + buildingPrice
}

function addScorePopOut() {
	let popOut = document.createElement('div')
	popOut.classList = 'popout'
	popOut.textContent = '+' + (1 + cheat)
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
		buildingsList[x].textContent = getNewCost(x)
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
		if (event.target.id == i) addBuilding(i)
	}
})

// mouseover handler
menu.addEventListener('mouseover', function(event) {
	if (event.target.className == 'cost') {
		// event.target.id
		info.innerHTML = '<p>' + event.target.parentNode.querySelector('.building').innerHTML + '</p>\n'
		info.innerHTML += '<p>makes ' + buildings[+event.target.id][2] + ' points per second</p>\n'
		info.innerHTML += '<p>amount: ' + event.target.parentNode.querySelector('.buildingcounter').innerHTML + '</p>\n'
		info.innerHTML += '<p>current cost: ' + buildings[+event.target.id][3] + '</p>\n'

		info.hidden = false
	}
})

// menu.addEventListener('mouseout', function(event) {
// 	if (event.target.className == 'cost') {
// 		info.hidden = true
// 	}
// })


