ig.module (
	'game.entities.player'
)
.requires (
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function() {

EntityPlayer = ig.Box2DEntity.extend({
	
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
	lastDirection:0,

	init: function( x, y, settings) {
		this.parent( x, y, settings);

		this.addAnim('idle', 0.1, [0]);
		this.addAnim('up', 0.1, [1]);	
	},
	
	rotateTo: function (degrees)
	{
    	this.anims.idle.angle += degrees.toRad();
    	this.body.SetXForm(this.body.GetPosition(), degrees.toRad());
	},

	update: function() {
		
		// move left or right
		if( ig.input.state('left') ) {
			this.body.ApplyForce( new b2.Vec2(-200,0), this.body.GetPosition() );
			this.shotDirection = 'left';
			// this.rotateTo(this.turnAngle = this.turnAngle - 4);
		}
		else if( ig.input.state('right') ) {
			this.body.ApplyForce( new b2.Vec2(200,0), this.body.GetPosition() );
			this.shotDirection = 'right';
			// this.rotateTo(this.turnAngle = this.turnAngle + 4);
		}
		
		// power
		if( ig.input.state('up') ) {
			this.body.ApplyForce( new b2.Vec2(0,-200), this.body.GetPosition() );
			this.shotDirection = 'up';
			this.currentAnim = this.anims.up;
		} else {
			this.currentAnim = this.anims.idle;
		}
		
		if( ig.input.state('down') ) {
			this.body.ApplyForce( new b2.Vec2(0,200), this.body.GetPosition() );
			this.shotDirection = 'down';
		}

		// This sets the position and angle. We use the position the object
		// currently has, but always set the angle to 0 so it does not rotate
		this.body.SetXForm(this.body.GetPosition(), 0);

		// shoot
		if( ig.input.pressed('shoot') ) {
			
			//Two bullets niggas

			ig.game.spawnEntity( EntityShot, this.pos.x + 25, this.pos.y + 20,  {shotDirection:this.shotDirection, flip:this.flip, facing:this.facing, playSound:true} );
			ig.game.spawnEntity( EntityShot, this.pos.x, this.pos.y + 20,  {shotDirection:this.shotDirection, flip:this.flip, facing:this.facing} );

				
		}

		var pp = this.pos.x - ig.game.screen.x;

       if( pp > ig.system.width ){
            
            console.log("knocked out of range.")
        }

		this.parent();
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

	animSheet: new ig.AnimationSheet( 'media/shot.png', 5, 8 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.shotTimer = new ig.Timer();

		switch(this.shotDirection) {
			case 'up':
				this.vel.y = -700;
				break;
			case 'down':
				this.vel.y = 700;
				break;				
			case 'left':
				this.vel.x = -700;
				break;				
			case 'right':
				this.vel.x = 700;
				break;				
			case 'default':
				this.vel.y = -700;
				break;				
		}
		
		if(this.playSound) {
			this.pew.play();	
		}
		// this.body.ApplyImpulse( new b2.Vec2(-200,0), this.body.GetPosition() );
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
		other.receiveDamage( 1, this );
		this.kill();
	}	



})

});