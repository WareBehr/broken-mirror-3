#pragma strict

class ship_Health {

	var maxHealth : float;
	var health : float;
	var maxShields : float;
	var shields : float;

}

var shipHealth : ship_Health;
var properties : shipProperties;
var triggers : shipTriggers;
var explosion : GameObject;
var smokeTrails : GameObject[];
var plasmaParticles : GameObject[];
var shipModel : GameObject[];


function Start () {

	//get other scripts
	properties = gameObject.GetComponent(shipProperties);
	triggers = gameObject.GetComponent(shipTriggers);
	
	//get health stats
	shipHealth.maxHealth = properties.shipHealth.basicHealth;
	shipHealth.health = shipHealth.maxHealth;
	
	
	//get smoke trails
	var smokeGroup : Transform = gameObject.Find("trail_renderers/smoke_trails").transform;
	var trails = new Array();
	for (var trail : Transform in smokeGroup)
	{
	
		trails.Add(trail.gameObject);
	
	}
	
	
	smokeTrails = trails.ToBuiltin(GameObject);
	
	//Get plasma leaks
	var plasmas = new Array();
	var plasmaGroup : Transform = gameObject.Find("ParticleSystems/PlasmaParticles").transform;
	
	for (var plasma : Transform in plasmaGroup)
	{
		plasmas.Add(plasma.gameObject);
		plasma.gameObject.particleSystem.enableEmission = false;
	}
	plasmaParticles = plasmas.ToBuiltin(GameObject);

	

}

function Update () {

	updateHealth();
	Triggers();
	Die();
	Trails();
	PlasmaLeak();

}

function updateHealth () {

	shipHealth.maxHealth = properties.shipHealth.basicHealth;
	

}

function Die () {

	if (shipHealth.health <= 0)
	{
		
		for (var go : GameObject in shipModel)
		{
			go.transform.parent = null;
			go.AddComponent(Rigidbody);
		}
		
		Destroy(gameObject);
		
		
		
		Instantiate(explosion, transform.position, transform.rotation);
		
		
	}
	

}

function Triggers () {
	var isKill : boolean = triggers.triggerProps.isKill;
	
	if (isKill)
	{
		shipHealth.shields = 0;
		shipHealth.health = 0;
	}
	

}

function Trails () {
	var isTurbulence : boolean = triggers.triggerProps.isTurbulence;
	
	if (isTurbulence || shipHealth.health <= shipHealth.maxHealth*0.5)
	{
		for (var trail : GameObject in smokeTrails)
		{
			var rend : TrailRenderer = trail.GetComponent(TrailRenderer);
			rend.renderer.enabled = true;			
			
		}
	}
	else
	{
		for (var trail : GameObject in smokeTrails)
		{
			var rend1 : TrailRenderer = trail.GetComponent(TrailRenderer);
			rend1.renderer.enabled = false;			
			
		}
	}



}

function PlasmaLeak() {
	if (shipHealth.health <= shipHealth.maxHealth*0.15)
	{
		for (var plasma : GameObject in plasmaParticles)
		{
			plasma.particleSystem.enableEmission = true;
			plasma.particleSystem.Play();
			
		}
	}
	else
	{
		for (var plasma : GameObject in plasmaParticles)
		{
			plasma.particleSystem.enableEmission = false;
			plasma.particleSystem.Stop();
			
		}
	}

}