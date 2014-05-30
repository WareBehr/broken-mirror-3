
public class Upgrade implements IUpgrade {
	
	public var name : String;
	public var cost : int;
	public var description : String;
	public var image : Texture;
	
	function Upgrade(name : String, cost : int, description : String, image : Texture) {
		this.name = name;
		this.cost = cost;
		this.description = description;
		this.image = image;
	}
	
	public function getName() : String {
		return name;
	}
	
	public function getClass() {
	//TODO handle this
	
	}

	public function getCost() : int {
		return cost;
	}

	public function getDescription() : String {
		return description;
	}

	public function getImage() : Texture {
		return image;
	}

}