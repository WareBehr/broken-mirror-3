#pragma strict

class HUDBottom extends HUDElement {

	

	function getPlacementRect() : Rect {
		var origin : Rect = getOrigin();
		var x : float = (Screen.width/2 - origin.width/2) + origin.x;
		var y : float = Screen.height - origin.height + origin.y;
		return new Rect(x, y, origin.width, origin.height);
	}
	
	private function getOrigin() : Rect {
		if(isTest) {
			return super.getPosition();
		} else {
			return super.getResizedPosition();
		}
	}

}