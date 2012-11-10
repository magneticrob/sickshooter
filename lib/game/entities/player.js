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
	facing: 'down',
	friction: {x: 600, y: 0},
	turnAngle:0,

	init: function( x, y, settings) {
		this.parent( x, y, settings);

		this.addAnim('idle', 0.1, [0]);
		this.addAnim('down', 0.1, [0,1,2,3]);		
		this.addAnim('left', 0.1, [4,5,6,7]);						
		this.addAnim('right', 0.1, [8,9,10,11]);	
		this.addAnim('up', 0.1, [12,13,14,15]);	

		console.log(this.body);		
	},
	
	rotateTo: function (degrees)
	{
    	this.anims.idle.angle += degrees.toRad();
    	this.body.SetXForm(this.body.GetPosition(), degrees.toRad());
	},

	update: function() {


		if( ig.input.state('up')) {
			
			// if(this.turnAngle)
			if(this.turnAngle > -90 && this.turnAngle < 90) {
				//Facing up
				this.body.ApplyForce( new b2.Vec2(this.turnAngle * 2,-200), this.body.GetPosition() );		
				console.log('up');
			} else {
				//Facing down
				console.log('down');
				this.body.ApplyForce( new b2.Vec2(this.turnAngle * 2,200), this.body.GetPosition() );	
			}
			
			
		}
		console.log(this.body.m_force);

		if( ig.input.state('down')) {
			if(this.turnAngle > -90 && this.turnAngle < 90) {
				//Facing up
				this.body.ApplyForce( new b2.Vec2(-this.turnAngle * 2,200), this.body.GetPosition() );		
				console.log('up');
			} else {
				//Facing down
				console.log('down');
				this.body.ApplyForce( new b2.Vec2(-this.turnAngle * 2,-200), this.body.GetPosition() );	
			}

		}

		if( ig.input.state('left')) {
			this.turnAngle -= 2;
			this.rotateTo(this.turnAngle);
		}

		if( ig.input.state('right')) {
			this.turnAngle += 2;
			this.rotateTo(this.turnAngle);
		}	

		if( this.turnAngle > 359 || this.turnAngle < -359) {
			this.turnAngle = 0;
		}

		// shoot
		if( ig.input.pressed('shoot') ) {
			
			//Two bullets niggas

			ig.game.spawnEntity( EntityShot, this.pos.x + 25, this.pos.y + 20,  {flip:this.flip, facing:this.facing, playSound:true} );
			ig.game.spawnEntity( EntityShot, this.pos.x, this.pos.y + 20,  {flip:this.flip, facing:this.facing} );
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
	type:ig.Entity.TYPE.NONE,
	checkAgainst:ig.Entity.TYPE.B,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet( 'media/shot.png', 5, 8 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.shotTimer = new ig.Timer();
		this.vel.y = -700;
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
		other.receiveDamage( 1, this );
		this.kill();
	}	



})

});