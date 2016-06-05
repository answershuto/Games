(function(){
	var canvas = document.getElementById('RetroSnakerCanvas')
	var context = canvas.getContext("2d");
	var self = Page['RetroSnaker'] = {
		init: function(){
			this.SnakeObj = new Snake();
			this.bindDoms();
			this.bindAsListener();
			this.render();
		},
		bindDoms: function(){
			this.doms = {};
			this.doms.RetroSnakerBeginGame = $('#RetroSnakerBeginGame');
			this.doms.RetroSnakerBeginAndStop = $('#RetroSnakerBeginAndStop');
			this.doms.RetroSnakerBackground = $('#RetroSnakerBackground');
			this.doms.RetroSnakerUp = $('#RetroSnakerUp');
			this.doms.RetroSnakerLeft = $('#RetroSnakerLeft');
			this.doms.RetroSnakerRight = $('#RetroSnakerRight');
			this.doms.RetroSnakerDown = $('#RetroSnakerDown');
			this.doms.canvas = $('#RetroSnakerCanvas');
		},
		bindAsListener: function(){
			this.doms.RetroSnakerBeginGame.click(function(){
				this.render();
				this.SnakeObj.start();
				this.doms.RetroSnakerBeginAndStop.removeAttr('disabled');
			}.bind(this));

			this.doms.RetroSnakerBeginAndStop.click(function(){
				if (this.doms.RetroSnakerBeginAndStop.html() == "暂停") {
					this.SnakeObj.stop();
					this.doms.RetroSnakerBeginAndStop.html('继续');
				}
				else{
					this.SnakeObj.start();
					this.doms.RetroSnakerBeginAndStop.html('暂停');
				}
				
			}.bind(this));

			this.doms.RetroSnakerUp.click(function(){
				this.SnakeObj.changeDirection('up');
			}.bind(this));

			this.doms.RetroSnakerLeft.click(function(){
				this.SnakeObj.changeDirection('left');
			}.bind(this));

			this.doms.RetroSnakerRight.click(function(){
				this.SnakeObj.changeDirection('right');
			}.bind(this));

			this.doms.RetroSnakerDown.click(function(){
				this.SnakeObj.changeDirection('down');
			}.bind(this));


		},
		render: function(){
            context.strokeStyle = "green";
        	context.fillStyle = "white";
			for(var i=0;i<300;i=i+10){
				for(var j=0;j<150;j=j+5){
					context.fillRect(i, j, 10, 5);
					context.strokeRect(i, j, 10, 5);
				}
			}
			
			this.SnakeObj.init();
			
		}
	}

	function Score(){
		this.score = 0;
	}

	Score.prototype.add = function(){
		this.score++;
		if (jQuery.type(this.func) == 'function') {
			this.func(this.score);
		};
	}

	Score.prototype.attach = function(func){
		this.func = func;
	}

	Score.prototype.get = function(){
		return this.score;
	}

	function food(){
		this.food = {x:0,y:0};
		this.Score = new Score();
		this.Score.attach(self.SnakeObj.isAccelerate.bind(self.SnakeObj));
		this.createFood();
	}

	food.prototype.createFood = function(){
		this.food = this.randomFood();
		while (this.isSnakeBody(this.food)) {
			this.food = this.randomFood();
		};
		Dom().renderFood(this.food);
	}

	food.prototype.randomFood = function(){
		var food = {};
		food.x = Random(29);
		food.y = Random(29);

		return food; 
	}

	food.prototype.isSnakeBody = function(data){
		var bRet = false;
		$.each(self.SnakeObj.getBody(),function(index,item){
			if (data.x == item.x && data.y == item.y) {
				bRet = true;
			};
		}.bind(this))

		return bRet;
	}

	food.prototype.isBeEat = function(data){
		if (data.x == this.food.x && data.y == this.food.y) {
			this.beLonger = true;
			this.Score.add();
			this.createFood();
		};
	}

	food.prototype.isLonger = function(data){
		if (this.beLonger) {
			this.beLonger = false;
			return true;
		}
		else{
			return false;
		}
	}

	function Random(n){
    	return Math.floor(Math.random()*n+1)
    }

	/*x:0-30  *10  ,y:0-30  *5 */
	function Snake(){
		this.body = new SnakeBody();
		this.speed = 1;
		this.direction = 'left';
		this.nextDirection = 'left';
	}

	Snake.prototype.init = function(){
		this.body = new SnakeBody();
		this.food = new food();
		this.body.push({x:13,y:15},{x:14,y:15},{x:15,y:15},{x:16,y:15},{x:17,y:15});
		this.speed = 1;
		this.direction = 'left';
		this.nextDirection = 'left';
		clearInterval(this.timer);
		this.body.attach('unshift',this.food.isBeEat.bind(this.food));
		this.body.attach('pop',this.food.isLonger.bind(this.food));
		this.render();
	}

	Snake.prototype.getBody = function(){
		return this.body.getBody();
	}

	Snake.prototype.render = function(){
		context.fillStyle = "red";
        $.each(this.body.getBody(),function(index,item){
        	context.fillRect(item.x * 10, item.y * 5, 10, 5);
        })
	}

	Snake.prototype.length = function(){
		return this.body.getBody().length;
	}

	Snake.prototype.isAccelerate = function(score){
		if (parseInt(score/3+1) != this.speed) {
			this.speed = parseInt(score/3+1);
		};

		this.stop();
		this.start();
	}

	Snake.prototype.changeDirection = function(direction){
		if (this.direction == 'up' && direction == 'down'
		|| this.direction == 'down' && direction == 'up'
		|| this.direction == 'left' && direction == 'right'
		|| this.direction == 'right' && direction == 'left') {
			return;
		};

		this.nextDirection = direction;
	}

	Snake.prototype.start = function(){
		this.timer = setInterval(this.move.bind(this),1000/this.speed);
	}

	Snake.prototype.stop = function(){
		clearInterval(this.timer);
	}

	Snake.prototype.move = function(){
		this.direction = this.nextDirection;
		var newNode = {};
		newNode.x = this.body.getBody()[0].x;
		newNode.y = this.body.getBody()[0].y;
		if (this.direction == 'up') {
			newNode.y -= 1;
		}
		else if (this.direction == 'down') {
			newNode.y += 1;
		}
		else if (this.direction == 'left') {
			newNode.x -= 1;
		}
		else if (this.direction == 'right') {
			newNode.x += 1;
		}
		
		/*判断是否游戏结束*/
		if (this.isOver(newNode)) {
			alert('游戏结束！\n您的得分:'+(this.length()-5));
			self.doms.RetroSnakerBeginAndStop.attr('disabled',true);
			this.stop();
			return;
		};

		
		this.body.unshift(newNode);
		this.body.pop();


	}

	Snake.prototype.isOver = function(newNode){
		if (newNode.x >= 30 || newNode.x < 0 || newNode.y >= 30 || newNode.y < 0) {
			/*撞到墙壁*/
			return true;
		}
		else{
			var bret = false;
			/*遍历节点是否撞到自己*/
			$.each(this.body.getBody(),function(index,item){
				if (newNode.x == item.x && newNode.y == item.y) {
					bret = true;
				};
			})

			return bret;
		}
	}

	function Dom(){
		return {
			renderNodeSnake: function(Node){
				context.fillStyle = "red";
		        context.fillRect(Node.x * 10, Node.y * 5, 10, 5);
			},
			renderNodeGround: function(Node){
				context.strokeStyle = "green";
		        context.fillStyle = "white";
				context.fillRect(Node.x * 10, Node.y * 5, 10, 5);
				context.strokeRect(Node.x * 10, Node.y * 5, 10, 5);
			},
			renderFood: function(Node){
				context.fillStyle = "blue";
		        context.fillRect(Node.x * 10, Node.y * 5, 10, 5);
			}
		}
	}


	function SnakeBody(){
		this.functions = {};
		this.body = [];
	}

	SnakeBody.prototype.attach = function(type,func){
		this.functions[type] = func;
	}

	SnakeBody.prototype.unshift = function(data){
		if (jQuery.type(this.functions['unshift']) == "function") {
			this.functions['unshift'](data);
		};
		Dom().renderNodeSnake(data);
		
		return this.body.unshift(data);
	}

	SnakeBody.prototype.pop = function(){
		var data = this.body.pop();

		if (jQuery.type(this.functions['pop']) == "function") {
			if (this.functions['pop'](data)) {
				this.body.push(data);
			}
			else{
				Dom().renderNodeGround(data);
			}
		};

		return data;
	}

	SnakeBody.prototype.getBody = function(){
		return this.body;
	}

	SnakeBody.prototype.push = function(){
		if (jQuery.type(this.functions['push']) == "function") {
			this.functions['push'](arguments);
		};

		$.each(arguments, function(index,item){
			this.body.push(item);
		}.bind(this));
	}

	self.init();
})();