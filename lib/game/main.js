ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'plugins.director',
	'plugins.box2d.game',

	//Entities
	'game.entities.clickable',
	'game.entities.player',
	'game.entities.enemy',

	//Levels
	'game.levels.intro',
	'game.levels.level1'	
)
.defines(function(){

MyGame = ig.Box2DGame.extend({
	
	drop: 50,
	gravity: 20, // All entities are affected by this
	titleImageX:-30,
	logoStopped:false,
	faded: false,
	fadedOut: false,
	soundPlayed: false,
	timer: new ig.Timer(),
	logoStopSound: new ig.Sound( 'media/sounds/logostop.ogg' ),
	startButton: {},
	musicPlaying: false,

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// Initialize your game here; bind keys etc.

		//WASD cos obv
		ig.input.bind( ig.KEY.W, 'up');
		ig.input.bind( ig.KEY.S, 'down');
		ig.input.bind( ig.KEY.A, 'left');
		ig.input.bind( ig.KEY.D, 'right');

		//Shoot
		ig.input.bind( ig.KEY.SPACE, 'shoot');

		//Mouse
		ig.input.bind( ig.KEY.MOUSE1, 'click' );

		this.director = new ig.Director(this, [LevelIntro, LevelLevel1]);

		//If we're on the menu
		if(this.director.currentLevel == 0) {
			//Spawn the pointer
			ig.game.spawnEntity( EntityPointer, 0, 0 );

			//Load the title image
			this.titleImage = new ig.Image( 'media/logo.png' );
			this.startButton = ig.game.getEntitiesByType( EntityClickable )[0];
			this.startButton.hide();
		}



	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		// Add your own, additional update code here
		if(this.titleImageX < this.drop) {
			this.titleImageX  += 5;
		} else {
			this.logoStopped = true;
			if(!this.soundPlayed) {
				// this.logoStopSound.play();
				this.soundPlayed = true;
			}
		}
		if(ig.game.getEntitiesByType( EntityClickable )[0]){ 
		
			this.startButton = ig.game.getEntitiesByType( EntityClickable )[0];

			if(this.startButton.clickStatus) {
				this.faded = false;
				this.fadeToBlack();
				if(this.timer.delta() < 0) {
					this.director.nextLevel();
					this.titleImageX = -999999999;
				}
			}

		}

		/***
			
			Level 1 Code

		**/

		if ( this.director.currentLevel == 1 ) {

			// screen follows the player
			var player = this.getEntitiesByType( EntityPlayer )[0];
			if( player ) {
				// this.screen.x = player.pos.x - ig.system.width/2;
				this.screen.y = player.pos.y - ig.system.height/2 - 100;
			}

			//set music
			if ( !this.musicPlaying ) {
				ig.music.add( 'media/music/chibirobo.mp3' );
				ig.music.volume = 0.5;
				ig.music.play();
				this.musicPlaying = true;
			}

		}


	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		if(this.director.currentLevel == 0) {
			if(this.logoStopped && !this.faded) {
				this.fadeToBlack();
			} else if(this.faded && !this.fadedOut) {
				this.fadeOut();
				this.startButton = ig.game.getEntitiesByType( EntityClickable )[0];
				this.startButton.show();
			}
		} else if ( this.director.currentLevel == 1 ) {
			var player = this.getEntitiesByType( EntityPlayer )[0];
			if(player) {
				var score = player.score;
			}
			this.drawScore(score);
		} 

		this.titleImage.draw(ig.system.width / 3.1,this.titleImageX);
	},

	drawScore: function(score) {
		this.font.draw( 'Score: ' + score, 2, 2 );	
	},

	fadeToWhite: function() {
		ig.system.clear( 'rgba(255, 255, 255, ' + this.timer.delta() + ')' );
		if(this.timer.delta() > 1) {
			this.faded = true;
			this.timer.set(1);
		}
	},

	fadeToBlack: function() {
		ig.system.clear( 'rgba(0, 0, 0, ' + this.timer.delta() + ')' );
		if(this.timer.delta() > 1) {
			this.faded = true;
			this.timer.set(1);
		}
	},

	fadeOut: function() {
		ig.system.clear( 'rgba(255, 255, 255, ' + Math.abs(this.timer.delta()) + ')' );
		if(this.timer.delta() > -0.1) {
			this.fadedOut = true;
		}
	}

});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 287, 320, 2 );

});
