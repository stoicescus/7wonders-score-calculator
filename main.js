(() => {
	const form = document.querySelector('form');
	const resetBtn = document.querySelector("button[name='resetBtn']");
	const playerTableBody = document.querySelector('table.player-score-table tbody');
	const scoreDetailsBtn = document.querySelector("button[name='score-details-btn']");
	const closeDetailsBtn = document.querySelector("button[name='close-details-btn']");
	const scoreDetailsWrapper = document.querySelector('#score-details-wrapper');
	const cells = document.querySelectorAll('table.score-details-table tbody td.cell-value');
	const headers = document.querySelectorAll('table.score-details-table thead th.header-value');

	let formData = null;

	const allPlayersScores = [];

	// Map rowIndex to corresponding property in playerMap
	const propertyMap = {
		0: 'military',
		1: 'treasuryNr',
		2: 'treasuryPoints',
		3: 'wonder',
		4: 'civilian',
		5: 'symbolANr',
		6: 'symbolAPoints',
		7: 'symbolBNr',
		8: 'symbolBPoints',
		9: 'symbolCNr',
		10: 'symbolCPoints',
		11: 'commercial',
		12: 'guilds',
		13: 'totalScore',
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

				_this.calculateScore();
			};

			resetBtn.addEventListener('click', () => form.reset());

			scoreDetailsBtn.addEventListener('click', () => {
				if (allPlayersScores.length === 0) {
					return;
				}

				this.renderAllPlayers();
				scoreDetailsWrapper.classList.add('show');
			});

			closeDetailsBtn.addEventListener('click', () => {
				scoreDetailsWrapper.classList.remove('show');
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
			playerScoreMap.set('treasuryNr', coins);
			playerScoreMap.set('treasuryPoints', treasuryPoints);
			playerScoreMap.set('wonder', wonder);
			playerScoreMap.set('civilian', civilian);
			playerScoreMap.set('symbolANr', symbolA);
			playerScoreMap.set('symbolAPoints', symbolAPoints);
			playerScoreMap.set('symbolBNr', symbolB);
			playerScoreMap.set('symbolBPoints', symbolBPoints);
			playerScoreMap.set('symbolCNr', symbolC);
			playerScoreMap.set('symbolCPoints', symbolCPoints);
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
