	//数据模型模块
	var ModelModule = (function(){

		return {
			//玩家类
			Player: function (table){
				this.table = table;
				this.cardback = table.querySelector(".card-back");
				//this.infoBox = table.querySelector(".info-box");
				this.moneySpan = table.querySelector('.info-box .money');
				this.cardBox = table.querySelector(".card-box");
				this.cardGroup = [];
				var money = 1000;
				this.getMoney = function(){
					return money;
				};
				this.setMoney = function(value){
					money += parseInt(value);
				};
				
			},
			//庄家类
			/*Banker: function (table){
				this.table = table;
				this.cardback = table.querySelector(".card-back");
				//this.infoBox = table.querySelector(".info-box");
				this.moneySpan = table.querySelector('.info-box .money');
				this.cardBox = table.querySelector(".card-box");
				this.cardGroup = [];
				var money = 1000;
				this.getMoney = function(){
					return money;
				};
				this.setMoney = function(value){
					money += parseInt(value);
				};
			},*/
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
			Bet: function(){
				this.base = 1;
				this.times = 1;
				this.insurance = 0;
				this.bankerMoney = 0;
				this.playerMoney = 0;
				//this.moneyPool = 0;
				this.loser = undefined;
			}
		};

	})();

	//视图模块
	var ViewMudule = (function(){
		return {
			//添加一张牌
			addCard: function (){
				
				cardData = cards.getCard();

				if(cardData == undefined){         //新发一副牌
					cards = new ModelModule.Cards();
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
			//翻牌
			turnOver: function (front,back){
				front.style.display = 'none';
				back.style.display = 'inline-block';
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
			//重置游戏提示信息
			resetInfo: function(){
				resultPanel.style.display = 'none';
				infoSpans.baseSpan.style.display = 'none';
				infoSpans.insuranceSpan.style.display = 'none';
				infoSpans.tieSpan.style.display = 'none';
				infoSpans.burstSpan.style.display = 'none';
				infoSpans.winnerSpan.style.display = 'none';

				infoSpans.baseSpan.innerText = '';
				infoSpans.insuranceSpan.innerText = '';
				infoSpans.bankerGotSpan.innerText = '';
				infoSpans.playerGotSpan.innerText = '';
				infoSpans.winnerSpan.innerText = '';

				var baseBtns = baseGroup.querySelectorAll('button'),
					i,len = baseBtns.length;
				for(i=0; i<len; i++){
					baseBtns[i].style.display = 'inline';
				}
			},
			//设置游戏按钮出现状态
			setBtnStatus: function(btnArr){
				/*Object.keys(btnGroup).forEach(function(item){
					item.style.display = 'none';
				});*/
				infoSpans.insuranceSpan.style.display = 'none';
				baseGroup.style.display = 'none';

				btnGroup.roundBeginBtn.style.display = 'none';
				btnGroup.dealBtn.style.display = 'none';
				btnGroup.giveUpInsurance.style.display = 'none';
				btnGroup.buyInsurance.style.display = 'none';
				btnGroup.playerAskBtn.style.display = 'none';
				btnGroup.bankerAskBtn.style.display = 'none';
				btnGroup.playerStopBtn.style.display = 'none';
				btnGroup.bankerStopBtn.style.display = 'none';
				//btnGroup.roundEndBtn.style.display = 'none';

				btnArr.forEach(function(item){
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
		//判断是否黑杰克：A+10点牌
		var isBlackJack = function(cardGroup){
			if(cardGroup.length==2){
				if((cardGroup[0].content.text == 'A' && cardGroup[1].content.value =='10')
					||(cardGroup[0].content.value == '10' && cardGroup[1].content.text =='A')){
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
			//开局
			roundBegin: function(){
				ViewMudule.removeCard(banker);      //清除桌面上的牌
				ViewMudule.removeCard(player);
				ViewMudule.resetInfo();              //重设提示信息
				ViewMudule.setBtnStatus([baseGroup]);

				bet = new ModelModule.Bet();
				//设置可用倍数
				var baseBtns = baseGroup.querySelectorAll('button'), 
					i,len = baseBtns.length,
					min = Math.min(banker.getMoney(),player.getMoney());
				for(i=0; i<len; i++){
					if(min<baseBtns[i].value){
						baseBtns[i].style.display = 'none';
					}
				}
				if(min<10){
					alert('请充值!');
				}
			},
			//下注
			betOn: function(base){

				bet.base = base;
				bet.bankerMoney = bet.base;
				bet.playerMoney = bet.base;

				infoSpans.baseSpan.innerText = "赌金："+ bet.base + "倍";
				infoSpans.baseSpan.style.display = "inline";

				ViewMudule.setBtnStatus([btnGroup.dealBtn]);
			},
			//发牌 每人2张
			deal: function (){ 

				dealOne(banker);
				dealOne(banker);
				banker.cardback.style.display = 'inline-block'; //第一张牌暗牌处理
				banker.cardGroup[0].elem.style.display = 'none';
				banker.cardGroup[0].elem.onclick = function(){
					ViewMudule.turnOver(this,banker.cardback);
				};
				banker.cardback.onclick = function(){
					ViewMudule.turnOver(this,banker.cardGroup[0].elem);
				};

				dealOne(player);
				dealOne(player);
				player.cardback.style.display = 'inline-block'; //第一张牌暗牌处理
				player.cardGroup[0].elem.style.display = 'none';
				player.cardGroup[0].elem.onclick = function(){
					ViewMudule.turnOver(this,player.cardback);
				};
				player.cardback.onclick = function(){
					ViewMudule.turnOver(this,player.cardGroup[0].elem);
				};

				//测试保险
				/*banker.cardGroup[1].content.text = 'A';
				banker.cardGroup[1].content.value = 1;
				player.cardGroup[1].content.text = 'A';
				player.cardGroup[0].content.text = '10';
				player.cardGroup[0].content.value = 10;*/
				//end

				//庄家明牌是A时，玩家可选择买保险
				if(banker.cardGroup[1].content.text == 'A'    
					&& player.getMoney()>=bet.playerMoney/2){
					ViewMudule.setBtnStatus([btnGroup.buyInsurance,
						btnGroup.playerAskBtn,btnGroup.playerStopBtn]);
				} else {
					ViewMudule.setBtnStatus([btnGroup.playerAskBtn,btnGroup.playerStopBtn]);
				}
				//玩家有黑杰克
				if(isBlackJack(player.cardGroup)){ 

					alert("哈哈！黑杰克!");   

					if(isBlackJack(banker.cardGroup)){  //都是黑杰克

						if(banker.cardGroup[1].content.text == 'A'    
							&& player.getMoney()>=bet.playerMoney/2){  //是否买保险，不能再要牌
							ViewMudule.setBtnStatus([btnGroup.buyInsurance,btnGroup.giveUpInsurance]);

						} else{                           
							bet.loser = undefined;      //没买保险就平局
							ControlMudule.roundEnd();
						}
						
					} else {                            //庄没有黑杰克玩家赢2倍
						bet.loser = banker;
						
						ControlMudule.roundEnd();
					}
				}
				
			},
			//买保险
			buyInsurance: function(){
				bet.insurance = bet.playerMoney/2;
				player.moneySpan.innerText = player.getMoney();
				//开保险
				infoSpans.insuranceSpan.style.display = 'inline';
				if(isBlackJack(banker.cardGroup)){  //庄有黑杰克，庄输亮牌，玩家不出保险金
					infoSpans.insuranceSpan.innerText = '保险买对！';
					bet.loser = banker;
					ControlMudule.roundEnd();
				} else{                            //庄没有黑杰克，继续游戏，玩家输掉保险金
					infoSpans.insuranceSpan.innerText = '保险买错！';
					player.setMoney(-1*bet.insurance); 
					banker.setMoney(+1*bet.insurance);

					banker.moneySpan.innerText = banker.getMoney();  //显示剩余赌金
					player.moneySpan.innerText = player.getMoney();

					ViewMudule.setBtnStatus([btnGroup.playerAskBtn,
						btnGroup.playerStopBtn,infoSpans.insuranceSpan]);
				}
			},
			//要牌
			ask: function (xer){ 	
				dealOne(xer);
				var score = calculator(xer.cardGroup);
				if(score>21){
					//alert("爆掉了!");
					infoSpans.burstSpan.style.display = 'inline';
					bet.loser = xer;
					ControlMudule.roundEnd();
				}
			},
			//局末清算
			roundEnd: function(){

				player.cardback.click();                //亮牌
				banker.cardback.click();

				if(bet.loser == undefined){             //如果没人爆掉，算点数论输赢
					var bankerScore = calculator(banker.cardGroup);
					var playerScore = calculator(player.cardGroup);
					if(bankerScore > playerScore){
						bet.loser = player;  
					}else if(bankerScore < playerScore){
						bet.loser = banker; 
					} 
				}
				//结算赌金
				if(bet.loser == undefined){             //平局
					infoSpans.tieSpan.style.display = 'inline';
					infoSpans.winnerSpan.style.display = 'none';

					//显示赌金情况
					infoSpans.bankerGotSpan.innerText = 0; 
					infoSpans.playerGotSpan.innerText = 0;

				}else{
					//显示输赢结果
					infoSpans.tieSpan.style.display = 'none';
					infoSpans.winnerSpan.style.display = 'inline';
					
					if(bet.loser == player){              //庄家赢了
						infoSpans.winnerSpan.innerText = '庄家赢！'; 
						banker.setMoney(+1*bet.base*bet.times);
						player.setMoney(-1*bet.base*bet.times);    
						
						infoSpans.bankerGotSpan.innerText = '+' + bet.bankerMoney; 
						infoSpans.playerGotSpan.innerText = '-' + bet.playerMoney; 

					}else if(bet.loser == banker){        //玩家赢了
						infoSpans.winnerSpan.innerText = '玩家赢！';
						banker.setMoney(-1*bet.base*bet.times);
						player.setMoney(+1*bet.base)*bet.times;

						infoSpans.bankerGotSpan.innerText = '-' + bet.bankerMoney;
						infoSpans.playerGotSpan.innerText = '+' + bet.playerMoney;

					}else{
						console.log('出现错误：loser未指定！');
					}
				} 

				banker.moneySpan.innerText = banker.getMoney();  //显示剩余赌金
				player.moneySpan.innerText = player.getMoney();
				resultPanel.style.display = 'block';

				ViewMudule.setBtnStatus([btnGroup.roundBeginBtn]);
			}
			
		};
		
	})();


	//全局变量
	var resultPanel = document.querySelector('.result-panel');
	var baseGroup = document.querySelector('.base-group');

	var infoSpans = {
		baseSpan : document.querySelector('#baseSpan'),
		insuranceSpan: document.querySelector('#insuranceSpan'),
		bankerGotSpan : document.querySelector('#bankerGotSpan'),
		playerGotSpan : document.querySelector('#playerGotSpan'),
		winnerSpan : document.querySelector('#winnerSpan'),
		tieSpan : document.querySelector('#tieSpan'),
		burstSpan : document.querySelector('#burstSpan')
	};

	var btnGroup = {
		roundBeginBtn : document.querySelector('#roundBeginBtn'),
		dealBtn : document.querySelector('#dealBtn'),
		buyInsurance : document.querySelector('#buyInsurance'),
		giveUpInsurance : document.querySelector('#giveUpInsurance'),
		playerAskBtn : document.querySelector('#playerAskBtn'),
		playerStopBtn : document.querySelector('#playerStopBtn'),
		bankerStopBtn : document.querySelector('#bankerStopBtn'),
		bankerAskBtn : document.querySelector('#bankerAskBtn'),
		//roundEndBtn : document.querySelector('#roundEndBtn')
	};

	var cards = new ModelModule.Cards();
	var bet ; //= new ModelModule.Bet();
	var player = new ModelModule.Player(document.querySelector('#playerTable'));
	var banker = new ModelModule.Player(document.querySelector('#bankerTable'));

	var music = document.querySelector('audio');  //音效
		

	//自动初始化
	(function init(){

		//信息设置
		player.moneySpan.innerText = player.getMoney();
		banker.moneySpan.innerText = player.getMoney();
		
		//开局
		btnGroup.roundBeginBtn.onclick = function(){
			ControlMudule.roundBegin();
		};
		
		//玩家下注
		baseGroup.onclick = function(e){        //委托处理下注
			e = e || window.event;
			var tagE = e.target || e.srcElement;  
			if(tagE.tagName.toLowerCase()=='button'){
				ControlMudule.betOn(tagE.value);
			}
		};	

		//发牌
		btnGroup.dealBtn.onclick = function(){
			ControlMudule.deal();
		};
		
		//买保险
		btnGroup.buyInsurance.onclick = function(){
			ControlMudule.buyInsurance();
		};

		//放弃买保险
		btnGroup.giveUpInsurance.onclick = function(){ 
			ControlMudule.roundEnd();
		};

		//玩家要牌
		btnGroup.playerAskBtn.onclick = function(){
			ControlMudule.ask(player);
			btnGroup.buyInsurance.style.display = 'none';
		};


		//玩家停止要牌
		btnGroup.playerStopBtn.onclick =  function(){
			banker.cardback.click();   //庄家亮牌
			ViewMudule.setBtnStatus([bankerAskBtn,bankerStopBtn]);
			//去掉注册事件
		};

		//庄家要牌
		btnGroup.bankerAskBtn.onclick = function(){
			ControlMudule.ask(banker);

		};

		//庄家停止要牌
		btnGroup.bankerStopBtn.onclick =  function(){
			ControlMudule.roundEnd();
			//ViewMudule.setBtnStatus([roundEndBtn]);
		};

		//局末清算
		/*btnGroup.roundEndBtn.onclick = function(){			
			ControlMudule.roundEnd();
		};*/

		//设置游戏初始状态
		ViewMudule.setBtnStatus([roundBeginBtn]);

		//声音
		document.querySelector('.sound').onclick = function(){
			if(music.paused){
				music.play();
				this.innerText = '静音';
			} else{
				music.pause();
				this.innerText = '声音';
			}
		};

		//充值
		document.querySelector('.recharge').onclick = function(){
			alert("Sorry!充值功能有待完善。")
		};

		//游戏规则说明
		document.querySelector('.rules').onclick = function(){
			alert("Sorry!规则说明功能有待完善。")
		};

		music.play();

	})();
