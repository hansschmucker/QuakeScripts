var map=snarf(scriptArgs[0]);

function TextNode(text){
	this.value=text;
}

TextNode.prototype.value="";

function WavyNode(){
	this.properties={};
}

WavyNode.prototype.childNodes=null;
WavyNode.prototype.properties=null;

var lights=[];

function parseToTree(src){
	var root=[];
	var find=/(?:([^{]+)|\{([^}]*)\})/g;
	var findProp=/(?:^|\r\n)\s*"([^"]*)"\s+"([^"]*)"/g;
	var m,m2;
	
	while(null!=(m=find.exec(src))){
		if(m[1])
			root.push(new TextNode(m[1]));
		else{
			var c=new WavyNode();
			c.childNodes=parseToTree(m[2]);
			
			for(var i=0;i<c.childNodes.length;i++){
				if(!(c.childNodes[i] instanceof TextNode))
					continue;
				
				while(null!=(m2=findProp.exec(c.childNodes[i].value))){
					c.properties[m2[1].toLowerCase().trim()]=m2[2];
				}
			}
			if(c.properties.classname=="light")
				lights.push(c.properties);
			root.push(c);
		}
	}
	return root;
}

parseToTree(map);


for(var i=0;i<lights.length;i++){
	print(lights[i].origin+" "+lights[i].light+" 1.0 1.0 1.0 "+(lights[i].style||0));
}