const xhttp = new XMLHttpRequest();
var data;

window.onload = function(){
    getdata();
}

function getdata(){
    if(data)return;
    xhttp.open("GET", location.origin+"/user?get=rewards_punishments", true);
    xhttp.send();
	xhttp.onreadystatechange = function() {
		if(this.status==200&&this.readyState==4){
            document.getElementById('load').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            data = JSON.parse(`[${this.responseText}]`)[0];
            setContent();
		}
	}
}

function setContent(){
    var table = document.getElementById("list");
    var rp = new Object();
    console.log(data);
    rp.type = ['大功', '小功', '嘉獎', '警告', '小過', '大過'];
    rp.count = [0,0,0,0,0,0];
    data.list.map(function(entry, index){
        rp.index = rp.type.indexOf(entry.handle.substr(0, 2));
        var tr = createTag('tr');
        if(index!=0){
            tr.appendChild(createTag('td', entry.category));
            tr.appendChild(createTag('td', entry.instructions));
            tr.appendChild(createTag('td', entry.handle, 'pad'));
            tr.appendChild(createTag('td', '查看細目', 'button', {title:entry.category, msg:`批示日期:${entry.instructions}｜發生日期:${entry.occur}\r\n${entry.cause}\r\n${entry.category!='獎勵'?'銷過日期:'+entry.writeoff:''}`, status:entry.category=='獎勵'?'success':'error'}));
            //{title:entry.category, content:entry.cause, 'success'}

            switch(true){
                case (/壹|一|乙/g).test(entry.handle):
                    rp.count[rp.index]+=1;
                break;
                case (/貳|二|兩/g).test(entry.handle):
                    rp.count[rp.index]+=2;
                break;
                case (/參|三/g).test(entry.handle):
                    rp.count[rp.index]+=3;
                break;
                case (/肆|四/g).test(entry.handle):
                    rp.count[rp.index]+=4;
                break;
                case (/伍|五/g).test(entry.handle):
                    rp.count[rp.index]+=5;
                break;
                case (/陸|六/g).test(entry.handle):
                    rp.count[rp.index]+=6;
                break;
                case (/柒|七/g).test(entry.handle):
                    rp.count[rp.index]+=7;
                break;
                case (/捌|八/g).test(entry.handle):
                    rp.count[rp.index]+=8;
                break;
                case (/玖|九/g).test(entry.handle):
                    rp.count[rp.index]+=9;
                break;
                case (/拾|十/g).test(entry.handle):
                    rp.count[rp.index]+=10;
                break;
                default:alert(`Error:無法辨識 ${entry.handle},請通知開發者`);
            }
            
        }else{
            tr.appendChild(createTag('td', entry.category));
            tr.appendChild(createTag('td', entry.instructions));
            tr.appendChild(createTag('td', entry.handle));
            tr.appendChild(createTag('td', "細目"));
        }
        table.appendChild(tr)
    })
    rp.count.map(function(val, i){
        document.getElementById('rp'+i).textContent = val
    })
}
const createTag = (tag, text, c, t) => {
    var tmp = document.createElement(tag);
    if(text)
        tmp.textContent = text;
    if(c)
        tmp.className = c;
    if(t)
        tmp.onclick = function(){
            swal(t.title, t.msg, t.status);
        }
    return tmp;
}
/*
const xhttp = new XMLHttpRequest();
var data;
// var reg = ["壹|一", "貳|二|兩", "參|三", "肆|四", "伍|五", "陸|六", "柒|七", "捌|八", "玖|九", "拾|十"];

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
        tr.appendChild(createTag('td', c.category))
        tr.appendChild(createTag('td', c.instructions))
        // tr.appendChild(createTag('td', c.occur.substr(0,4)))
        tr.appendChild(createTag('td', c.handle))
        // tr.appendChild(createTag('td', c.cause.substr(0,4), c.cause))
        // tr.appendChild(createTag('td', c.writeoff.substr(0,4)))
        // tr.appendChild(createTag('td', c.year.substr(0,4)))
        tr.appendChild(createTag('td', '查看', {title:c.category, content:c.cause}, 'sweet-alert'))
        table.appendChild(tr);
        var index = rp.type.indexOf(c.handle.substr(0, 2));
        if(index!=-1){
            // reg.map(function(r, i){
                // if(new RegExp(r, 'g').test(c.handle)){
                    // rp.count[rp.index]+=(i+1);
                // }
            // })
            switch(true){
                case (/乙|一/g).test(c.handle):
                    rp.count[rp.index]+=1;
                break;
                case (/陸|二|兩/g).test(c.handle):
                    rp.count[rp.index]+=2;
                break;
                case (/參|三/g).test(c.handle):
                    rp.count[rp.index]+=3;
                break;
                default:alert('Error: '+c.handle);
            }
        }
    }
    rp.count.map(function(val, i){
        document.getElementById('rp'+i).textContent = val
    })
}

const createTag = (tag, text, msg, Class) => {
	var tmp = document.createElement(tag);
    if(text)
        tmp.textContent = text;
    if(msg&&msg!='事 由'){
        tmp.innerHTML = `<button onclick='swal("${msg.title}", "${msg.content}", "${msg.title=='獎勵'?'success':'error'}")'>${tmp.innerHTML}</button>`;
    }
	return tmp;
}
*/