(() => {
	const form = document.querySelector('form');
	const resetBtn = document.querySelector("button[name='resetBtn']");
	const playerTableBody = document.querySelector('table.player-score-table tbody');
	const scoreDetailsBtn = document.querySelector("button[name='score-details-btn']");
	const closeDetailsBtn = document.querySelector("button[name='close-details-btn']");
	const scoreDetailsWrapper = document.querySelector('#score-details-wrapper');
	const cells = document.querySelectorAll('table.score-details-table tbody td.cell-value');
	const headers = document.querySelectorAll('table.score-details-table thead th.header-value');
	const main = document.querySelector('main');
	const winnerList = document.querySelector('.winner-list');
	const playerNameInput = document.querySelector('input[name="playerName"]');

	let formData = null;

	const allPlayersScores = [];

	// Map rowIndex to corresponding property in playerMap
	const propertyMap = {
		0: 'military',
		1: 'treasury',
		2: 'wonder',
		3: 'civilian',
		4: 'symbolA',
		5: 'symbolB',
		6: 'symbolC',
		7: 'suits',
		8: 'commercial',
		9: 'guilds',
		10: 'totalScore',
	};

	const formManager = {
		init: function () {
			this.attachEvents();
		},

		attachEvents: function () {
			const _this = this;

			form.onsubmit = function (e) {
				e.preventDefault();

				if (allPlayersScores.length >= 7) {
					alert('Maximum number of players was achieved.');
					return;
				}

				// check duplicate names
				const newPlayerName = playerNameInput.value;
				const existingPlayerNames = allPlayersScores.map((playerMap) => playerMap.get('playerName'));

				if (existingPlayerNames.includes(newPlayerName)) {
					alert('Player already exists');
					return;
				}

				_this.calculateScore();
				_this.calculateWinner();
			};

			resetBtn.addEventListener('click', () => form.reset());

			scoreDetailsBtn.addEventListener('click', () => {
				if (allPlayersScores.length === 0) {
					return;
				}

				this.renderAllPlayers();

				main.classList.add('hide');
				scoreDetailsWrapper.classList.add('show');
			});

			closeDetailsBtn.addEventListener('click', () => {
				scoreDetailsWrapper.classList.remove('show');
				main.classList.remove('hide');
			});
		},

		calculateWinner: () => {
			let maxScore = Math.max(...allPlayersScores.map((player) => player.get('totalScore')));
			const winners = allPlayersScores.filter((player) => player.get('totalScore') === maxScore);

			winnerList.innerHTML = '';

			winners.forEach((winner) => {
				const playerName = winner.get('playerName');
				winnerList.innerHTML += `<div>${playerName}</div>`;
			});
		},

		calculatePow: (value) => {
			return Math.pow(value, 2);
		},

		renderPlayer: (name, score) => {
			const playerFragment = new DocumentFragment();
			const tr = document.createElement('tr');
			const tdName = document.createElement('td');
			const tdScore = document.createElement('td');

			tdName.append(name);
			tdScore.append(score);
			tr.append(tdName);
			tr.append(tdScore);
			playerFragment.append(tr);

			playerTableBody.append(playerFragment);
		},

		clearPreviousTableData: () => {
			// clear the previous data
			for (const header of headers) {
				header.textContent = '';
			}

			for (const cell of cells) {
				cell.textContent = '';
			}
		},

		updateTableCell: (row, rowIndex, playerMap, index) => {
			const property = propertyMap[rowIndex];
			const cell = row.querySelectorAll('td.cell-value')[index];

			if (property && playerMap.has(property)) {
				cell.textContent = playerMap.get(property);
			}
		},

		renderAllPlayers: function () {
			this.clearPreviousTableData();

			const rows = document.querySelectorAll('table.score-details-table tbody tr');

			allPlayersScores.forEach((playerMap, index) => {
				// Update player name in the headers
				const playerName = playerMap.get('playerName');

				if (playerName) {
					headers[index].textContent = playerName;
				}

				// Update table cells for each row
				rows.forEach((row, rowIndex) => {
					this.updateTableCell(row, rowIndex, playerMap, index);
				});
			});
		},

		reset: () => {
			formData = null;
		},

		calculateScore: function () {
			formData = new FormData(form);

			const playerName = formData.get('playerName');
			const military = formData.get('military');
			const coins = formData.get('coins');
			const wonder = formData.get('wonder');
			const civilian = formData.get('civilian');

			const symbolA = formData.get('scientific_SymbolA');
			const symbolB = formData.get('scientific_SymbolB');
			const symbolC = formData.get('scientific_SymbolC');
			const symbolAPoints = this.calculatePow(symbolA);
			const symbolBPoints = this.calculatePow(symbolB);
			const symbolCPoints = this.calculatePow(symbolC);
			const suits = Math.min(symbolA, symbolB, symbolC);
			const suitsPoints = suits * 7;

			const commercial = formData.get('commercial');
			const guilds = formData.get('guilds');
			const treasuryPoints = Math.floor(coins / 3);

			const totalScore = this.calculateSum(
				military,
				wonder,
				civilian,
				symbolAPoints,
				symbolBPoints,
				symbolCPoints,
				suitsPoints,
				commercial,
				guilds,
				treasuryPoints
			);

			const playerScoreMap = new Map();

			playerScoreMap.set('playerName', playerName);
			playerScoreMap.set('military', military);
			playerScoreMap.set('treasury', `${treasuryPoints} (${coins})`);
			playerScoreMap.set('wonder', wonder);
			playerScoreMap.set('civilian', civilian);
			playerScoreMap.set('symbolA', `${symbolAPoints} (${symbolA})`);
			playerScoreMap.set('symbolB', `${symbolBPoints} (${symbolB})`);
			playerScoreMap.set('symbolC', `${symbolCPoints} (${symbolC})`);
			playerScoreMap.set('suits', suitsPoints);
			playerScoreMap.set('commercial', commercial);
			playerScoreMap.set('guilds', guilds);
			playerScoreMap.set('totalScore', totalScore);

			allPlayersScores.push(playerScoreMap);

			this.renderPlayer(playerName, totalScore);
			this.reset();
		},

		calculateSum: (...points) => {
			return points.reduce((total, value) => (total += Number(value)), 0);
		},
	};

	formManager.init();
})();
