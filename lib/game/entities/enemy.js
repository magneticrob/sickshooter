ig.module (
	'game.entities.enemy'
)
.requires (
	'impact.game',
	'impact.entity',
	'game.entities.player',
	'game.entities.particle'
)
.defines(function() {

EntityEnemy = ig.Entity.extend({
	
	size: {x:32, y:32},

	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,
	animSheet: new ig.AnimationSheet( 'media/ships/8.png', 32, 32),
	timer: new ig.Timer(),
	player: {},
	
	// Entity specific shit

	health: 1,
	facing: 'down',
	movement: 'normal',
	timer: new ig.Timer(),
	initialXPos: 0,
	fireTimer: new ig.Timer(),

	init: function( x, y, settings) {
		this.parent( x, y, settings);

		this.addAnim('idle', 0.1, [0]);
		this.addAnim('down', 0.1, [0,1,2,3]);		
		this.addAnim('left', 0.1, [4,5,6,7]);						
		this.addAnim('right', 0.1, [8,9,10,11]);	
		this.addAnim('up', 0.1, [12,13,14,15]);

		this.timer.set( 1 );
		this.initialXPos = this.pos.x - 50;

		// this.player = ig.game.getEntitiesByType( EntityPlayer )[0];
	
	},

	update: function() {
		switch( this.movement ) {
			case 'normal':
				this.vel.y += 0.1;
				break;
			case 'swirly':
				this.vel.y += 0.1;

				if ( this.timer.delta() > 0 ) {
					this.pos.x--;
				} else {
					this.pos.x++;
				}

				if ( this.timer.delta() > 1 ) {
					this.timer.set( 1 );
				}

			default:
				break;
		}

		var pp = this.pos.x - ig.game.screen.x;

       if( pp > ig.system.width ){
            
            // console.log("knocked out of range.")
        }

        if( this.health < 0 ) {
        	this.kill();
        }

		this.parent();
	},

	handleMovementTrace: function( res ) {
		this.parent( res );
	},

	check: function( other ) {
		other.kill();
		// Use timer to spawn fireworks every second
		if ( this.fireTimer.delta() > 0 ){
		    for (var i = 0; i <= 100; i++){
		        ig.game.spawnEntity( FireGib, other.pos.x, other.pos.y );
		    }
		    if ( this.fireTimer.delta() > 30 ) {
		    	this.fireTimer.reset();	
		    }
		    
		}

	}	

});

EntityPowerUp = ig.Entity.extend({

	size:{x: 20, y: 13},
	offset:{x:0, y:0},
	type:ig.Entity.TYPE.NONE,
	checkAgainst:ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,
	powerUpSound: new ig.Sound( 'media/sounds/powerup.ogg' ),

	animSheet: new ig.AnimationSheet( 'media/powerup.png', 20, 13 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 0.1, [0,1,2] );
	},

	handleMovementTrace: function( res ) {
		this.parent( res );
	},

	check: function( other ) {
		this.powerUpSound.play();
		this.kill();
		other.powerUpLevel++;
	}	

})

});