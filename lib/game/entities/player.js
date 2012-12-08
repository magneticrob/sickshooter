ig.module (
	'game.entities.player'
)
.requires (
	'impact.entity',
	'plugins.box2d.entity',
	'game.entities.particle'
)
.defines(function() {

EntityPlayer = ig.Entity.extend({
	
	size: {x:32, y:32},

	//Offsetting the hitbox... not sure if this is doing it properly
	offset: {x: 2, y: -4},
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	animSheet: new ig.AnimationSheet( 'media/ships/2.png', 32, 32),
	
	// Entity specific shit

	health: 50,
	shotDirection: 'up',
	turnAngle:0,
	score:0,
	lastDirection:0,
	speed: -50,
	powerUpLevel: 0,
	deathSound: new ig.Sound( 'media/sounds/die.ogg' ),
	fireTimer: new ig.Timer(),

	init: function( x, y, settings) {
		this.parent( x, y, settings);

		this.addAnim('idle', 0.1, [0]);
		this.addAnim('up', 0.1, [1]);	
	},
	
	rotateTo: function (degrees) {
    	this.anims.idle.angle += degrees.toRad();
	},

	update: function() {
		
		// power always on
		this.vel.y = this.speed;

		// move left or right
		if( ig.input.state('left') ) {
			this.pos.x -= 5;
		} else if( ig.input.state('right') ) {
			this.pos.x += 5;
		} else {
			this.vel.x = 0;
		}

		if( ig.input.state('up') ) {
			this.pos.y--;
		}
		if( ig.input.state('down') ) {
			this.pos.y++;
		}

		// shoot
		if( ig.input.pressed('shoot') ) {

			if(this.score > 0) {
				this.score--;
			}

			//Two bullets niggas
			switch ( this.powerUpLevel ) {
				case 0:
					// Single
					ig.game.spawnEntity( EntityShot, this.pos.x + 13, this.pos.y,  {shotDirection:this.shotDirection, flip:this.flip, facing:this.facing, playSound:true} );
					break;
				case 1:
					// Double
					ig.game.spawnEntity( EntityShot, this.pos.x + 25, this.pos.y + 20,  {shotDirection:this.shotDirection, flip:this.flip, facing:this.facing, playSound:true} );
					ig.game.spawnEntity( EntityShot, this.pos.x, this.pos.y + 20,  {shotDirection:this.shotDirection, flip:this.flip, facing:this.facing} );
					break;
				case 2:
					// Triple Spray
					ig.game.spawnEntity( EntityShot, this.pos.x + 13, this.pos.y,  {shotDirection:this.shotDirection, flip:this.flip, facing:this.facing, diagonal:'left'} );
					ig.game.spawnEntity( EntityShot, this.pos.x + 13, this.pos.y,  {shotDirection:this.shotDirection, flip:this.flip, facing:this.facing, diagonal:'right'} );
					ig.game.spawnEntity( EntityShot, this.pos.x + 13, this.pos.y,  {shotDirection:this.shotDirection, flip:this.flip, facing:this.facing, playSound:true} );
					break;					
				default:
					break;
			}

				
		}

		var pp = this.pos.x - ig.game.screen.x;

       if( pp > ig.system.width ){
            
            console.log("knocked out of range.")
        }

		this.parent();
	},

	handleMovementTrace: function( res ) {
		if ( res.collision.y ) {

			// Use timer to spawn fireworks every second
			if ( this.fireTimer.delta() > 0 ){
			    for (var i = 0; i <= 300; i++){
			        ig.game.spawnEntity( FireGib, this.pos.x, this.pos.y );
			    }
			    if ( this.fireTimer.delta() > 30 ) {
			    	this.fireTimer.reset();	
			    }
			    this.deathSound.play();
			    this.kill();
			}

		}

		this.parent(res);
	}

});

EntityShot = ig.Entity.extend({

	size:{x: 5, y: 8},
	offset:{x:0, y:0},
	maxVel: {x: 700, y: 700},
	shotLifetime:1,
	bounciness:0.6,
	pew: new ig.Sound( 'media/sounds/pew.ogg'),
	hit: new ig.Sound( 'media/sounds/hit.ogg' ),
	deathSound: new ig.Sound( 'media/sounds/die.ogg' ),
	type:ig.Entity.TYPE.NONE,
	checkAgainst:ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,
	fireTimer: new ig.Timer(),

	animSheet: new ig.AnimationSheet( 'media/shot.png', 5, 8 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.shotTimer = new ig.Timer();

		this.vel.y = -300;

		if(this.diagonal == 'left') {
			this.vel.x = -50;
		} 
		if(this.diagonal == 'right') {
			this.vel.x = 50;
		} 
		
		if(this.playSound) {
			this.pew.play();	
		}

		this.addAnim( 'idle', 2, [0] );
	},

	handleMovementTrace: function( res ) {
		this.parent( res );

		if(this.shotTimer.delta() > this.shotLifetime) {
			this.kill();
		}

	},

	check: function( other ) {
		if(other.health == 1) {
			this.deathSound.play();
		} else {
			this.hit.play();
		}


		// Spawn powerup
		if ( other.dropPowerUp ) {
			ig.game.spawnEntity( EntityPowerUp, this.pos.x, this.pos.y );
		}

		// Use timer to spawn fireworks every second
		if ( this.fireTimer.delta() > 0 ){
		    for (var i = 0; i <= 50; i++){
		        ig.game.spawnEntity( FireGib, other.pos.x, other.pos.y );
		    }
		    if ( this.fireTimer.delta() > 30 ) {
		    	this.fireTimer.reset();	
		    }
		    
		}

		other.receiveDamage( 1, this );
		this.kill();
	}	



})

});