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

const upgrades = []
const upgradeRates = [
	10, 
	50, 
	500, 
	50000, 
	5000000, 
	500000000, 
	500000000000, 
	500000000000000, 
	500000000000000000, 
	500000000000000000000
]
const upgradeBuffer = []

let upgradeId = 0
for (let item of buildings) {
	for (let rate of upgradeRates) {
		let upgrade = []
		upgrade.push(upgradeId)
		upgrade.push(item[0] * rate)
		upgrade.push(item[1])
		let description = item[1].slice(0, 1) + item[1].slice(1).toLowerCase() + 's are <em>twice</em> efficient.'
		if (item[1] == buildings[0][1]) {
			description += '<br>The mouse is <em>twice</em> efficient.'
		}
		upgrade.push(description)
		upgrades.push(upgrade)
		upgradeId ++
	}
}

const ratio = 1.15
let score = 0n
let scoreIndex = 0
let newInterval = 0
let currentUpgradeId
let currentUpgradeName
let mouseClick = 1
let cheat = 99999

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

// add upgrade rate to buildings
for (let item of buildings) {
	item.push(0)
}


let buildingsList = document.querySelectorAll('.cost')
let buildingCountersList = document.querySelectorAll('.buildingcounter')
let buildingNamesList = document.querySelectorAll('.building')
checkForAvailability()


// make upgrades section
let upgradeMenu = document.createElement('div')
upgradeMenu.classList = 'upgrademenu'
upgradeMenu.hidden = true
container.append(upgradeMenu)
let upgradeContainer = document.createElement('div')
upgradeContainer.classList = 'upgrades'
upgradeMenu.append(document.createElement('div'), upgradeContainer)
upgradeMenu.firstChild.innerHTML = 'UPGRADES'

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


// functions
function newScore() {
	scoreText.textContent = formatValue(score)
}

function newSpeed() {
	scoreIndex = 0
	for (let i = 0; i < buildings.length; i++) {
		scoreIndex += buildings[i][2] * +buildingCountersList[i].innerHTML
	}
	scoreIndex = +scoreIndex.toFixed(1)
	if (scoreIndex == 0) return
	speedText.innerHTML = '<strong>' + formatValue(scoreIndex) + '</strong> points per second'

	// create new interval
	newInterval = 10000 / scoreIndex / 10
	clearInterval(autoClickInterval)
	startInterval(scoreIndex)
}

function getNewValue(x, y = 3) {
	let value = buildings[x][y]
	value = formatValue(value)
	return value
}

function formatValue(x) {
	let format = {
		7:  'M',
		10: 'B',
		13: 'T',
		16: 'q',
		19: 'Q',
		22: 's',
		25: 'S',
		28: 'O',
		31: 'N',
		34: 'D',
		37: 'U',
	}
	let initial = String(x)
	let formated = ''
	if (initial.length <= 6) return initial
	while (initial.length > 0) {
		for (let item of Object.keys(format)) {
			if (initial.length == item) {
				formated += initial.slice(0, 1) + '.' + initial.slice(1, 4) + format[item]
				return formated
			}
		}
		formated += initial.slice(0, 1)
		initial = initial.slice(1)
	}
}

function addScorePopOut() {
	let popOut = document.createElement('div')
	popOut.classList = 'popout'
	popOut.textContent = '+' + formatValue(mouseClick + cheat)
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
	let rate = ''

	for (let item of buildings) {
		if (item[1] == name && item[4] != 0) rate = '+' + item[4]
	}

	info.style.top = xCoord.top + 'px'
	info.style.left = xCoord.right + 10 + 'px'
	info.style.right = null

	info.innerHTML = '<p>' + name + rate + '</p>\n'
	info.innerHTML += '<p>one <em>' + name.toLowerCase() + '</em> makes <em>' + formatValue(perSecond) + '</em> points per second</p>\n'
	info.innerHTML += '<p>and currently costs <em>' + currentCost + '</em></p>\n'

	if (amount > 1) {
		info.innerHTML += '<p>your <em>' + amount + '</em> ' + name.toLowerCase() + 's make <em>' + formatValue(+(amount * perSecond).toFixed(1)) + '</em> points per second</p>\n'
	}
}

function getUpgradeInfo(x) {
	let description = ''
	let xCoord = x.getBoundingClientRect()
	let xWidth = +window.getComputedStyle(upgradeMenu).width.slice(0, -2)

	for (item of upgradeBuffer) {
		if (item[0] == currentUpgradeId) {
			description = item[3]
			break
		}
	}

	info.style.top = xCoord.top + 'px'
	info.style.left = null
	info.style.right = xWidth + 10 + 'px'

	info.innerHTML = '<p>' + currentUpgradeName + '++</p>'
	info.innerHTML += '<p>' + description + '</p>'

	console.log(info.style.top + ' ' + info.style.right)
}

function doUpgrade(element) {
	for (let i = 0; i < upgradeBuffer.length; i++) {
		if (upgradeBuffer[i][0] == currentUpgradeId) {
			if (upgradeBuffer[i][1] <= score) {
				score -= BigInt(upgradeBuffer[i][1])
				newScore()

				for (let item of buildings) {
					if (item[1] == currentUpgradeName) {
						item[2] *=2 						// new speed
						item[4] +=1 						// new rate
					}
				}
				
				if (currentUpgradeName == buildings[0][1]) mouseClick *=2

				newSpeed()
				element.remove()
				info.hidden = true
				upgradeBuffer.splice(i, 1)
				break;
			}
		}
	}

	if (upgradeBuffer.length == 0) {
		setTimeout(() => upgradeMenu.hidden = !upgradeMenu.hidden, 1000)
	}
}

function showUpgrade(arr) {
	if (upgradeMenu.hidden) upgradeMenu.hidden = !upgradeMenu.hidden
	let newUpgrade = document.createElement('div')
	newUpgrade.classList = 'upgrade'
	newUpgrade.innerHTML = arr[2].slice(0, 3) + '++\n' + formatValue(arr[1])
	newUpgrade.setAttribute('upgradeid', arr[0])
	upgradeContainer.append(newUpgrade)
}

function updateUpgradeContainer() {
	upgradeContainer.innerHTML = ''
	for (item of upgradeBuffer) {
		showUpgrade(item)
	}
}

// check for available upgrades
function checkForUpgrade() {
	for (let i = 0; i < upgrades.length; i++) {
		if (score >= upgrades[i][1] / 1.5) {
			upgradeBuffer.push(upgrades[i])
			upgrades.splice(i, 1)
			updateUpgradeContainer()
		}
	}
	checkForAvailability()
}

function checkForAvailability() {
	let color = 'gray'
	for (let item of buildings) {
		if (item[3] > score) {
			for (let desired of buildingNamesList) {
				if (desired.innerHTML == item[1]) {
					desired.parentNode.style.color = color
					desired.parentNode.firstChild.style.color = color
				}
			}
		} else {
			for (let desired of buildingNamesList) {
				if (desired.innerHTML == item[1]) {
					desired.parentNode.style.color = null
					desired.parentNode.firstChild.style.color = null
				}
			}
		}
	}

	let currentUpgrades = document.querySelectorAll('.upgrade')
	for (let item of upgradeBuffer) {
		if (item[1] > score) {
			for (let desired of currentUpgrades) {
				if (desired.getAttribute('upgradeid') == item[0]) desired.style.color = color
			}
		} else {
			for (let desired of currentUpgrades) {
				if (desired.getAttribute('upgradeid') == item[0]) desired.style.color = null
			}
		}
	}
}

// interval for autocheck every .5s
setInterval(checkForUpgrade, 500)


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
		score += BigInt(mouseClick + cheat)
		newScore()
		addScorePopOut()
	}

	// if clicked on upgrades
	else if (event.target.className == 'upgrade') {
		doUpgrade(event.target)
		for (let item of buildingNamesList) {
			item.style.opacity = null
		}
	}

	// if clicked on buldings
	else for (let i = 0; i < buildings.length; i++) {
		if (event.target.getAttribute('object') == i) {
			addBuilding(i)
			getBuldingInfo(event.target)
		}
	}

	checkForAvailability()
})

// mouseover handler
document.addEventListener('mouseover', function(event) {
	if (event.target.className == 'cost') {
		getBuldingInfo(event.target)
		info.hidden = !info.hidden
	}

	if (event.target.className == 'upgrade') {
		currentUpgradeId = event.target.getAttribute('upgradeid')
		for (let item of upgradeBuffer) {
			if (item[0] == currentUpgradeId) {
				currentUpgradeName = item[2]
				break;
			}
		}

		for (let item of buildingNamesList) {
			if (item.innerHTML == currentUpgradeName) {
				item.style.opacity = 0.4
			}
		}

		getUpgradeInfo(event.target)
		info.hidden = !info.hidden
	}
})

document.addEventListener('mouseout', function(event) {
	if (event.target.className == 'cost') {
		info.hidden = !info.hidden
		info.innerHTML = ''
	}

	if (event.target.className == 'upgrade') {
		for (let item of buildingNamesList) {
			item.style.opacity = null
		}
		info.innerHTML = ''
		info.hidden = !info.hidden
	}
})

