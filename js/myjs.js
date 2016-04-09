	//数据模型模块
	var ModelModule = (function(){

		return {
			//玩家类
			Player: function (table){
				this.table = table;
				this.cardback = table.querySelector(".card-back");
				this.infoBox = table.querySelector(".info-box");
				this.cardBox = table.querySelector(".card-box");
				this.cardGroup = [];
				var money = 1000;
				this.getMoney = function(){
					return money;
				};
				this.setMoney = function(value){
					money = value;
				};
				
			},
			//庄家类
			Banker: function (table){
				this.table = table;
				this.cardback = table.querySelector(".card-back");
				this.infoBox = table.querySelector(".info-box");
				this.cardBox = table.querySelector(".card-box");
				this.cardGroup = [];
				var money = 1000;
				this.getMoney = function(){
					return money;
				};
				this.setMoney = function(value){
					money = value;
				};
			},
			//一副牌
			Cards: function (){
				var i,
					number = new Array(52),
					len = number.length;

				for(i=0; i<len; i++){  //标记每张牌是否发过
					number[i] = false;
				}	

				//一张牌
				var card = function(n){
					//var text = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']; //牌面内容
					//牌面内容
					var content = [
									{text: 'A',value: 1},
									{text: '2',value: 2},
									{text: '3',value: 3},
									{text: '4',value: 4},
									{text: '5',value: 5},
									{text: '6',value: 6},
									{text: '7',value: 7},
									{text: '8',value: 8},
									{text: '9',value: 9},
									{text: '10',value: 10},
									{text: 'J',value: 10},
									{text: 'Q',value: 10},
									{text: 'K',value: 10}
								];
					//牌面花色
					var type = [  
						{
							name: 'heart',
							url: 'img/heart.png'
						},
						{
							name: 'diamond',
							url: 'img/diamond.png'
						},
						{
							name: 'spade',
							url: 'img/spade.png'
						},
						{
							name: 'club',
							url: 'img/club.png'
						}
					]; 
					
					this.content = content[Math.floor(n/4)];
					this.type = type[n%4];
				};

				var dealOut = function(){   //是否整副牌都发完
					return number.every(function(item){
						return item == true;
					});
				};

				this.getCard = function(){  //取出一张未发过的牌
					if(!dealOut()){
						var n = Math.floor(Math.random()*52);
						while(number[n]==true){
							n = Math.floor(Math.random()*52);
						}
						number[n] = true;

						return new card(n);
					}
				};

			},
			//赌注
			Bet: {
				base: 1,
				times: 1,
				insurance: false,
				moneyPool: 0,
				loser: undefined
				//owner: undefined
			}
			//游戏状态
			/*Status: {
				bankerDeal: '庄家发牌',
				playerAsk: '玩家要牌',
				playerStop: '停止要牌'

			}*/
		};

	})();

	//视图模块
	var ViewMudule = (function(){
		return {
			//添加一张牌
			addCard: function (){
				
				cardData = cards.getCard();
				console.log(cardData);
				if(cardData == undefined){
					console.log("新发一副牌");
					cards = new Cards();
					cardData = cards.getCard();
				}

				var card = document.createElement('div');
				card.setAttribute('class','card');

				var spanTop = document.createElement('span');      //牌上内容
				spanTop.innerText = cardData.content.text;
				spanTop.setAttribute('class','card-tag-top-left');
				card.appendChild(spanTop);
				
				var spanBottom = document.createElement('span');   //牌上内容
				spanBottom.innerText = cardData.content.text;
				spanBottom.setAttribute('class','card-tag-bottom-right');
				card.appendChild(spanBottom);
				
				var imgTop = document.createElement('img');		   //牌上花色
				imgTop.setAttribute('class','card-tag-top-right');
				imgTop.setAttribute('src',cardData.type.url);
				card.appendChild(imgTop);

				var imgBottom = document.createElement('img');    //牌上花色
				imgBottom.setAttribute('class','card-tag-bottom-left');
				imgBottom.setAttribute('src',cardData.type.url);
				card.appendChild(imgBottom);

				var imgCenter = document.createElement('img');    //牌上花色
				imgCenter.setAttribute('class','card-tag-center');
				imgCenter.setAttribute('src',cardData.type.url);
				card.appendChild(imgCenter);

				return {
					elem: card,
					content: cardData.content
				}
			},
			//清除某人的一组牌
			removeCard: function(xer){
				var cardBox = xer.cardBox,
					cardGroup = xer.cardGroup;
				while(cardGroup.length>0){
					cardBox.removeChild(cardGroup.pop().elem);
				}
				xer.cardback.style.display = 'none';
			},
			//设置游戏状态
			setStatus: function(btngroup){
				betOn.style.display = 'none';
				dealBtn.style.display = 'none';
				playerAskBtn.style.display = 'none';
				bankerAskBtn.style.display = 'none';
				roundEndBtn.style.display = 'none';
				playerStopBtn.style.display = 'none';
				bankerStopBtn.style.display = 'none';

				//statusSpan.innerText = text;
				btngroup.forEach(function(item){
					item.style.display = 'inline';
				});
				
			}
		};
	})();

	//流程控制模块
	var ControlMudule = (function(){
		//发给某人一张牌 
		var dealOne = function (xer){
			var newCard = ViewMudule.addCard();
			xer.cardGroup.push(newCard);
			xer.cardBox.appendChild(newCard.elem);
		};
		//判断是否黑杰克
		var isBlackJack = function(cardGroup){
			if(cardGroup.length==2){
				if((cardGroup[0].content.text == 'A' && cardGroup[1].content.text =='10')
					||(cardGroup[0].content.text == '10' && cardGroup[1].content.text =='A')){
					return true;
				}
			}
			return false;
		};
		//分数计算器
		var calculator = function(cardGroup){
			var i,
				recordA = [],
				len = cardGroup.length,
				temp = 0,
				sum;
			for(i=0; i<len; i++){                      
				if(cardGroup[i].content.text == 'A'){
					recordA.push(11);
				} else {
					temp += cardGroup[i].content.value;
				}
			}
			/*
				计算点数策略：
				先将多个A都算作11点，若总点数超过21点则将一个A值变为1点，
				直道总点数不超过21点，或者所有A值都是1点。
			*/
			sum = temp;
			i = 0;
			recordA.forEach(function(item){
					sum += item;
			});
			while(sum>21 && i<recordA.length){
				recordA[i++] = 1;    //一个A值从11变成1
				sum = temp;
				recordA.forEach(function(item){
					sum += item;
				});
			}
			return sum;
		};

		return {
			//翻牌
			turnOver: function (front,back){
				front.style.display = 'none';
				back.style.display = 'inline-block';
			},
			//发牌 每人2张
			deal: function (){ 

				ViewMudule.removeCard(banker);   //清除桌面上的牌
				ViewMudule.removeCard(player);

				dealOne(banker);
				dealOne(banker);
				banker.cardback.style.display = 'inline-block'; //第一张牌暗牌处理
				banker.cardGroup[0].elem.style.display = 'none';
				banker.cardGroup[0].elem.onclick = function(){
					ControlMudule.turnOver(this,banker.cardback);
				};

				dealOne(player);
				dealOne(player);
				player.cardback.style.display = 'inline-block'; //第一张牌暗牌处理
				player.cardGroup[0].elem.style.display = 'none';
				player.cardGroup[0].elem.onclick = function(){
					ControlMudule.turnOver(this,player.cardback);
				};

				if(isBlackJack(player.cardGroup)){
					alert("BlackJack!");
					// 其他操作 买保险等
					ModelModule.Bet.insurance = true;
					//ModelModule.Bet.moneyPool += 
				}
			},
			//要牌
			ask: function (xer){ 	
				dealOne(xer);
				var score = calculator(xer.cardGroup);
				if(score>21){
					console.log("爆掉了!");
					//结算 xer输了
					ModelModule.Bet.loser = xer;
				}


			},
			//局末清算
			roundEnd: function(){

				if(ModelModule.Bet.loser == undefined){   //如果没人爆掉，算点数论输赢
					var bankerScore = calculator(banker.cardGroup);
					var playerScore = calculator(player.cardGroup);
					if(bankerScore > playerScore){
						ModelModule.Bet.loser = player;   //庄家赢了
					}else if(bankerScore < playerScore){
						ModelModule.Bet.loser = banker;   //玩家赢了
					} 
				}

				if(ModelModule.Bet.loser == banker){     //分配赌注金

				}else if(ModelModule.Bet.loser == player){

				}else if(ModelModule.Bet.loser == undefined){

				}else{
					console.log('出现错误：loser未指定！');
				}

			}
			
		};
		
	})();


	//全局变量
	var betOn = document.querySelector('#betOn');
	var dealBtn = document.querySelector('#dealBtn');
	var playerAskBtn = document.querySelector('#playerAskBtn');
	var playerStopBtn = document.querySelector('#playerStopBtn');
	var bankerStopBtn = document.querySelector('#bankerStopBtn');
	var bankerAskBtn = document.querySelector('#bankerAskBtn');
	var roundEndBtn = document.querySelector('#roundEndBtn');
	var statusSpan = document.querySelector('#statusSpan'); 

	var cards = new ModelModule.Cards();
	var player = new ModelModule.Player(document.querySelector('#playerTable'));
	var banker = new ModelModule.Banker(document.querySelector('#bankerTable'));

	

	//自动初始化
	(function init(){
		//事件注册
		player.cardback.onclick = function(){
			ControlMudule.turnOver(this,player.cardGroup[0].elem);
		};
		banker.cardback.onclick = function(){
			ControlMudule.turnOver(this,banker.cardGroup[0].elem);
		};

		//双方下注
		betOn.onclick = function(){
			
			ViewMudule.setStatus([dealBtn]);
		};

		//发牌
		dealBtn.onclick = function(){
			ControlMudule.deal();
			//ControlMudule.setStatus(ModelModule.Status.playerAsk,[playerAskBtn,playerStopBtn]);
			ViewMudule.setStatus([playerAskBtn,playerStopBtn]);
		};
		
		//玩家要牌
		playerAskBtn.onclick = function(){
			ControlMudule.ask(player);
		};
		//庄家要牌
		bankerAskBtn.onclick = function(){
			ControlMudule.ask(banker);

		};
		//玩家停止要牌
		playerStopBtn.onclick =  function(){
			//ControlMudule.setStatus(ModelModule.Status.playerStop,[bankerAskBtn,bankerStopBtn]);
			ViewMudule.setStatus([bankerAskBtn,bankerStopBtn]);
			banker.cardback.click();   //庄家亮牌
			//去掉注册事件
		};
		//庄家停止要牌
		bankerStopBtn.onclick =  function(){
			//ControlMudule.setStatus(ModelModule.Status.playerStop,[roundEndBtn]);
			ViewMudule.setStatus([roundEndBtn]);
		};
		//局末清算
		roundEndBtn.onclick = function(){
			ControlMudule.roundEnd();
			ViewMudule.setStatus([dealBtn]);
		};

		//设置游戏初始状态
		//ControlMudule.setStatus(ModelModule.Status.bankerDeal,[dealBtn]);
		ViewMudule.setStatus([betOn]);
	})();
