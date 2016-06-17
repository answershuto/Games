(function(){
	var beta,gamma;
	if (window.DeviceOrientationEvent) {
		window.addEventListener("deviceorientation", function(event){
			beta = event.beta;
			gamma = event.gamma;
		}, false);
	}

	function Player(){
		this.self = $(document.createElement('div'));
		this.self.attr('id','player');
		$('#gameBackground').append(this.self);
	}

	Player.prototype.start = function(){
		var timmer = setInterval(function(){
			if (gamma>0) {
				var left=this.self.position().left+Math.abs(gamma/30)+'px';
				this.self.css('left',left);
			}
			else{
				var left=this.self.position().left-Math.abs(gamma/30)+'px';
				this.self.css('left',left);
			}

			if (beta>0) {
				var top=this.self.position().top+Math.abs(beta/30)+'px';
				this.self.css('top',top);
			}
			else{
				var top=this.self.position().top-Math.abs(beta/30)+'px';
				this.self.css('top',top);
			}
		}.bind(this),20);
	}

	var player = new Player();
	player.start();
	
})();