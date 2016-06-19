(function(){
	/*生成配置*/
	var config = {
		sensitivity:20,  		/*调整区块的灵敏度*/
		refreshFrequency:30,    /*刷新区块的频率*/
		attackerTimer:200,			/*攻击者再次渲染间隔的定时器事件*/
		attackerMovePX:2,			/*每次进入定时器攻击者总共移动的距离*/
		maxAttacker:70			/*攻击者的最大数目*/
	}

	/*陀螺仪事件*/
	var beta,gamma;
	if (window.DeviceOrientationEvent) {
		window.addEventListener("deviceorientation", function(event){
			beta = event.beta;
			gamma = event.gamma;
		}, false);
	}

	/*获取当前屏幕的长宽*/
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	function Player(){
		this.self = $(document.createElement('div'));
		this.self.attr('id','player');
		$('#gameBackground').append(this.self);
	}

	Player.prototype.start = function(){
		var timmer = setInterval(function(){
			if (gamma>0) {
				if (this.self.position().left < windowWidth-this.self.width()) {
					var left=this.self.position().left+Math.abs(gamma/config.sensitivity)+'px';
					this.self.css('left',left);
				};
			}
			else{
				if (this.self.position().left > 0) {
					var left=this.self.position().left-Math.abs(gamma/config.sensitivity)+'px';
					this.self.css('left',left);
				};
			}

			if (beta>0) {
				if (this.self.position().top < windowHeight-this.self.height()) {
					var top=this.self.position().top+Math.abs(beta/config.sensitivity)+'px';
					this.self.css('top',top);
				};
			}
			else{
				if (this.self.position().top > 0) {
					var top=this.self.position().top-Math.abs(beta/config.sensitivity)+'px';
					this.self.css('top',top);
				};
			}
		}.bind(this),config.refreshFrequency);
	}

	function Random(n){
    	return Math.floor(Math.random()*n+1);
    }

	function attacker(){
		var beginLocation={},endLocation={};

		this.self = $(document.createElement('div'));
		this.self.attr('data-identity','attacker');
		this.self.addClass('attacker');
		/*随机产生起点*/
		if (Random(4) == 1) {
			beginLocation.x = Random(windowWidth);
			beginLocation.y = 1;
		}
		else if (Random(4) == 2) {
			beginLocation.x = windowWidth-1;
			beginLocation.y = Random(windowHeight);
		}
		else if (Random(4) == 3) {
			beginLocation.x = Random(windowWidth);
			beginLocation.y = windowHeight-1;
		}
		else{
			beginLocation.x = 1;
			beginLocation.y = Random(windowHeight);
		}
		this.self.css('left',beginLocation.x+'px');
		this.self.css('top',beginLocation.y+'px');
		
		/*得到目标点，即需要攻击点点当前位置*/
		endLocation.x = $('#player').position().left-0;
		endLocation.y = $('#player').position().top-0;

		/*根据起始坐标以及目标坐标得到方向*/
		var directionXY = Math.abs(endLocation.y-beginLocation.y) / Math.abs(endLocation.x-beginLocation.x);
		var direction;
		if (endLocation.x>=beginLocation.x && endLocation.y>=beginLocation.y) {
			/*左上方*/
			direction = 0;
		}
		else if (endLocation.x<=beginLocation.x && endLocation.y>=beginLocation.y) {
			/*右上方*/
			direction = 1;
		}
		else if (endLocation.x>=beginLocation.x && endLocation.y<=beginLocation.y) {
			/*左下方*/
			direction = 2;
		}
		else{
			/*右下方*/
			direction = 3;
		}

		var left,top;
		this.timmer = setInterval(function(){
			if (direction == 0) {
				left=this.self.position().left+config.attackerMovePX/Math.sqrt(directionXY);
				top=(this.self.position().top+config.attackerMovePX*Math.sqrt(directionXY));
			}
			else if (direction == 1) {
				left=this.self.position().left-config.attackerMovePX/Math.sqrt(directionXY);
				top=(this.self.position().top+config.attackerMovePX*Math.sqrt(directionXY));
			}
			else if (direction == 2) {
				left=this.self.position().left+config.attackerMovePX/Math.sqrt(directionXY);
				top=(this.self.position().top-config.attackerMovePX*Math.sqrt(directionXY));
			}
			else {
				left=this.self.position().left-config.attackerMovePX/Math.sqrt(directionXY);
				top=(this.self.position().top-config.attackerMovePX*Math.sqrt(directionXY));
			}
			this.self.css('left',left+'px');
			this.self.css('top',top+'px');

			if (left<=0 || top<=0 || left >= windowWidth || top >= windowHeight) {
				/*达到边缘则销毁*/
				clearInterval(this.timmer);
				this.self.detach();
				return;
			};
		}.bind(this),config.attackerTimer)

		$('#gameBackground').append(this.self);
	}

	var player = new Player();
	player.start();

	setInterval(function(){
		if ($('#gameBackground').children().length > config.maxAttacker) return;
		
		console.log($('#gameBackground').children().length)
		for(var i=0;i<10;i++){
			new attacker();
		}
	},1000)
	
	
})();










