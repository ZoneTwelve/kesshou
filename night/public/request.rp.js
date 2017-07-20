const xhttp = new XMLHttpRequest();
var data;

window.onload = function(){
    data = getdata();
}

function getdata(){
	xhttp.onreadystatechange = function() {
		if(this.status==200){
            document.getElementById('load').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            data = JSON.parse(this.responseText);
            setContent();
		}
	}
	xhttp.open("GET", location.origin+"/user?get=rewards_punishments", true);
	xhttp.send();
}

function setContent(){
    var table = document.getElementById("list");
    table.innerHTML = ''
    var rp = new Object();
    rp.type = ['大功', '小功', '嘉獎', '警告', '小過', '大過'];
    rp.count = [0,0,0,0,0,0];
    for(var c of data.list){
        var tr = createTag('tr');
        tr.appendChild(createTag('td', c.category.substr(0,4)))
        tr.appendChild(createTag('td', c.instructions.substr(0,4)))
        tr.appendChild(createTag('td', c.occur.substr(0,4)))
        tr.appendChild(createTag('td', c.handle.substr(0,4)))
        tr.appendChild(createTag('td', c.cause.substr(0,4), c.cause))
        tr.appendChild(createTag('td', c.writeoff.substr(0,4)))
        tr.appendChild(createTag('td', c.year.substr(0,4)))
        table.appendChild(tr);
        var index = rp.type.indexOf(c.handle.substr(0, 2));
        if(index!=-1){
            switch(true){
                case (/乙|一/g).test(c.handle):
                    rp.count[index]+=1;
                break;
                case (/陸|二|兩/g).test(c.handle):
                    rp.count[index]+=2;
                break;
                case (/參|三/g).test(c.handle):
                    rp.count[index]+=3;
                break;
                default:alert('Error: '+c.handle);
            }
        }
    }
    rp.count.map(function(val, i){
        document.getElementById('rp'+i).textContent = val
    })
}

const createTag = (tag, text, msg) => {
	var tmp = document.createElement(tag);
    if(text)
        tmp.textContent = text;
    if(msg&&msg!='事 由'){
        tmp.onclick = function(){
            alert(msg)
        }
        tmp.innerHTML = `<a href="javascipt:void(0);">${tmp.innerHTML}</a>`
    }
	return tmp;
}