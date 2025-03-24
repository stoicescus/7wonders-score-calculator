(() => {
	const form = document.querySelector('form');
	const resetBtn = document.querySelector("button[name='resetBtn']");
	const playerTableBody = document.querySelector('table.player-score-table tbody');

	let formData = null;

	const allPlayersScores = [];

	const formManager = {
		init: function () {
			this.attachEvents();
		},

		attachEvents: function () {
			const _this = this;

			form.onsubmit = function (e) {
				e.preventDefault();
				_this.calculateScore();
			};

			resetBtn.addEventListener('click', () => form.reset());
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

			allPlayersScores.push({
				'Player Name': playerName,
				'Military Structures': military,
				'Treasury Contents': {
					Nr: coins,
					Points: treasuryPoints,
				},
				Wonder: wonder,
				'Civilian Structures': civilian,
				'Scientific Structures': {
					SymbolA: {
						Nr: symbolA,
						Points: symbolAPoints,
					},
					SymbolB: {
						Nr: symbolB,
						Points: symbolBPoints,
					},
					SymbolC: {
						Nr: symbolC,
						Points: symbolCPoints,
					},
					Suits: {
						Nr: suits,
						Points: suitsPoints,
					},
				},
				'Commercial Structures': commercial,
				Guilds: guilds,
			});

			this.renderPlayer(playerName, totalScore);

			console.log('allPlayersScores', allPlayersScores);

			this.reset();
		},

		calculateSum: (...points) => {
			return points.reduce((total, value) => (total += Number(value)), 0);
		},
	};

	formManager.init();
})();
