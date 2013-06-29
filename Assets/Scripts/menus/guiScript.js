#pragma strict


class CenterGUI {
	var width : int;
	var height : int;
	
	

}

class MovementGui {
	var height : int;
	var width : int;
	var style : GUISkin;
	
	var stopIcon : Texture2D;
	var upIcon : Texture2D;
	var downIcon : Texture2D;
	
	
	
	var buttonWidth : int = 48;
	var buttonHeight : int = 48;
	
	var buttonPadding : int = 2;
	
	var barBG : Texture2D;
	var barFG : Texture2D;
	
	var barWidth : int = 50;
	var barHeight : int = 206;
	
	var fgMode : ScaleMode;

}

class TacticalGui {
	var width : int;
	var height : int;

}

class TorpedoGui {
	var width : int;
	var height : int;
	
	//Background
	var bgImage : Texture2D;
	
	
	//Taskbar
	var taskImage : Texture2D;
	var taskX : int = 5;
	var taskY : int = 7;
	var taskWidth : int = 322;
	var taskHeight : int = 11;
	
	//Title Text
	var titleStyle : GUIStyle;
	var titleText : String = "Torpedo";
	var titleX : int;
	var titleY : int;
	var titleWidth : int;
	var titleHeight : int;
	
	//"Spread" Text
	var spreadStyle : GUIStyle;
	var spreadText = "Spread";
	var spreadX : int;
	var spreadY : int;
	var spreadWidth : int;
	var spreadHeight : int;
	
	//"Volley" Text
	var volleyStyle : GUIStyle;
	var volleyText = "Volley";
	var volleyX : int;
	var volleyY : int;
	var volleyWidth : int;
	var volleyHeight : int;
	
	//Buttons
	var style : GUISkin;
	var buttonWidth : int;
	var buttonHeight : int;
	
	//Button Spread "-"
	var minusSpreadX : int;
	var minusSpreadY : int;
	
	//Button Spread "+"
	var plusSpreadX : int;
	var plusSpreadY : int;
	
	//Button Volley "-"
	var minusVolleyX :int;
	var minusVolleyY : int;
	
	//Button Volley "+"
	var plusVolleyX :int;
	var plusVolleyY :int;
	
	//Displays
	var displayImg : Texture2D;
	var displayWidth : int = 28;
	var displayHeight : int = 28;
	
	//Display Spread
	var displaySpreadX : int;
	var displaySpreadY : int;
	
	//Display Volley
	var displayVolleyX : int;
	var displayVolleyY : int;
	
	
	

}

var centGUI : CenterGUI;
var MovGUI : MovementGui;
var tacGUI : TacticalGui;
var torpGUI : TorpedoGui;
var shipProps : shipProperties;
var shipMov : shipMovement;

function Start () {

	//get necessary scripts
	shipProps = gameObject.GetComponent(shipProperties);
	shipMov = gameObject.GetComponent(shipMovement);

}

function OnGUI () {
	//gets escape menu status
	var cam_go : GameObject = Camera.main.gameObject;
	var cam_sc : testReturn = cam_go.GetComponent(testReturn);
	var isPause : boolean = cam_sc.isPause;

	if(shipProps.playerProps.isPlayer && !isPause)
	{
		CenterGUI();
	
	}


}


function CenterGUI() {

	//Start by getting the x cood
	var XCood : int;
	XCood = Screen.width/2 - centGUI.width;
	
	//now get the y cood
	var YCood : int;
	YCood = Screen.height - centGUI.height;
	
	//now create area
	GUILayout.BeginArea(Rect(XCood, YCood, centGUI.width, centGUI.height));
		MovementGUI();
		TacticalGUI();
	GUILayout.EndArea();

}

//this function build the movement gui section
function MovementGUI () {
	//Create Movement GUI Area
	GUILayout.BeginArea(Rect(0, centGUI.height - MovGUI.height, MovGUI.width, MovGUI.height));
		//Create button area	
		GUILayout.BeginVertical();
			//Stop Button
			GUILayout.BeginHorizontal();
				if(GUI.Button(Rect(0,50,MovGUI.buttonWidth, MovGUI.buttonHeight), MovGUI.stopIcon, MovGUI.style.button))
				{
					//here comes the button action
					shipMov.speedTarget = 0;
					shipMov.speedChanged = true;
					
				}
			GUILayout.EndHorizontal();
			//Up Button
			GUILayout.BeginHorizontal();
				//calculate diference from before
				var upHeight : int = 50 + MovGUI.buttonHeight + MovGUI.buttonPadding;
				if(GUI.Button(Rect(0,upHeight,MovGUI.buttonWidth, MovGUI.buttonHeight), MovGUI.upIcon, MovGUI.style.button))
				{
					//here cames the button action
					var lastUp : float = shipMov.keys.SpeedIncreaseKey;
					var updelay : float = shipMov.keys.KeyDelay;
					if(Time.time >= lastUp + updelay)
					{
						shipMov.keys.SpeedIncreaseKey = Time.time;
						//get movement max
						var uptarget : float = shipMov.speedTarget;
						var upmax : float = shipMov.movProps.maxStatus;
						if(uptarget < upmax)
						{
							//change speed
							var upstep : float = shipMov.speedStep;
							shipMov.speedTarget += upstep;
							shipMov.speedChanged = true;
							
						}
						
						
					}
					
					
				
				
				}
			GUILayout.EndHorizontal();
			//Down Button
			GUILayout.BeginHorizontal();
				//calculate diference from before
				var downHeight : int = upHeight + MovGUI.buttonHeight + MovGUI.buttonPadding;
				if(GUI.Button(Rect(0,downHeight,MovGUI.buttonWidth, MovGUI.buttonHeight), MovGUI.downIcon, MovGUI.style.button))
				{
					//here comes the button action
					var lastDown : float = shipMov.keys.SpeedDecreaseKey;
					var downdelay : float = shipMov.keys.KeyDelay;
					if(Time.time >= lastDown + downdelay)
					{
						shipMov.keys.SpeedDecreaseKey = Time.time;
						//get movement min
						var downtarget : float = shipMov.speedTarget;
						var downmin : float = shipMov.movProps.minStatus;
						if (uptarget > downmin)
						{
							//change speed
							var downstep : float = shipMov.speedStep;
							shipMov.speedTarget -= downstep;
							shipMov.speedChanged = true;
						}
						
					}
					
					
				}
			GUILayout.EndHorizontal();
		GUILayout.EndVertical();
		
		//Create graphic area
		GUILayout.BeginVertical();
		
			GUILayout.BeginHorizontal();
				//here goes the speed graphic code
				//first draw bg bar
				GUI.DrawTexture(Rect(50,0, MovGUI.barWidth, MovGUI.barHeight), MovGUI.barBG);
				
				//now the fg bar
				//but first lets get the speed values
				var curSpeed = Mathf.Sqrt(Mathf.Pow(shipMov.speedStatus, 2)); //get the module value
				var maxSpeed = shipMov.movProps.maxStatus;
				
				//now we convert the speed value to pixels
				var fgheight : int = ValueToPixels(maxSpeed, MovGUI.barHeight, curSpeed);
				
				//now we set the place where the bar shall be
				var yCood : int = MovGUI.barHeight - fgheight;
				
				//now we draw the bar
				GUI.DrawTexture(Rect(50, yCood, MovGUI.barWidth, fgheight), MovGUI.barFG, MovGUI.fgMode);
				
								
				
				
			GUILayout.EndHorizontal();;
		
		GUILayout.EndVertical();
		
		
	GUILayout.EndArea();
	
	

}

function TacticalGUI (){

	//get position of the area
	var XCood : int = centGUI.width - tacGUI.width;
	var YCood : int = centGUI.height - tacGUI.height;
	
	//Start by drawing area
	GUILayout.BeginArea(Rect(XCood, YCood, tacGUI.width, tacGUI.height));
		TorpedoGUI();
	
	GUILayout.EndArea();
	


}

function TorpedoGUI () {
	//get position of the area
	var XCood : int = tacGUI.width - torpGUI.width;
	
	//Draw Area
	GUILayout.BeginArea(Rect(XCood, 0, torpGUI.width, torpGUI.height));
		//Load background
		GUI.DrawTexture(Rect(0,0,torpGUI.width, torpGUI.height), torpGUI.bgImage);
		
		//draw taskbar
		GUI.DrawTexture(Rect(torpGUI.taskX, torpGUI.taskY, torpGUI.taskWidth, torpGUI.taskHeight), torpGUI.taskImage);
		
		//write title
		GUI.Label(Rect(torpGUI.titleX, torpGUI.titleY, torpGUI.titleWidth, torpGUI.titleHeight), torpGUI.titleText, torpGUI.titleStyle);
		
		//Do Spread
		//write "Spread"
		GUI.Label(Rect(torpGUI.spreadX, torpGUI.spreadY, torpGUI.spreadWidth, torpGUI.spreadHeight), torpGUI.spreadText, torpGUI.spreadStyle);
		//minus button
		if(GUI.Button(Rect(torpGUI.minusSpreadX, torpGUI.minusSpreadY, torpGUI.buttonWidth, torpGUI.buttonHeight), "-", torpGUI.style.button)) {
			//put code here
		}
		//plus button
		if(GUI.Button(Rect(torpGUI.plusSpreadX, torpGUI.plusSpreadY, torpGUI.buttonWidth, torpGUI.buttonHeight), "+", torpGUI.style.button)) {
			//put code here
		}
		//spread display
		//place the display background
		GUI.DrawTexture(Rect(torpGUI.displaySpreadX, torpGUI.displaySpreadY, torpGUI.displayWidth, torpGUI.displayHeight), torpGUI.displayImg);
		
		//Do volley	
		//write "Volley"
		GUI.Label(Rect(torpGUI.volleyX, torpGUI.volleyY, torpGUI.volleyWidth, torpGUI.volleyHeight), torpGUI.volleyText, torpGUI.volleyStyle);
		
		//minus button
		if(GUI.Button(Rect(torpGUI.minusVolleyX, torpGUI.minusVolleyY, torpGUI.buttonWidth, torpGUI.buttonHeight), "-", torpGUI.style.button)) {
			//put code here
		}
		
		//plus button
		if(GUI.Button(Rect(torpGUI.plusVolleyX, torpGUI.plusVolleyY, torpGUI.buttonWidth, torpGUI.buttonHeight), "+", torpGUI.style.button)) {
			//put code here
		}
		
		//volley display
		GUI.DrawTexture(Rect(torpGUI.displayVolleyX, torpGUI.displayVolleyY, torpGUI.displayWidth, torpGUI.displayHeight), torpGUI.displayImg);
		
	
	GUILayout.EndArea();


}

function ValueToPixels(baseValue : float, basePixels : int, desiredValue : float) : int {
	
	var result : int;
	result = (basePixels * desiredValue)/baseValue;
	
	return result;


}