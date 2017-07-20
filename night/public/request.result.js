const xhttp = new XMLHttpRequest();
var all = [];

window.onload = function(){
	getAll(1);
}

function getAll(year){
	xhttp.onreadystatechange = function() {
		if(this.status==200){
			all.push(JSON.parse(this.responseText))
			if(year<3){
				getAll(year+1);
			}else{
                all.length = 3;
				setTimeout(setContent, 100)
			}
            document.getElementById("load").appendChild(createTag('p', all[year-1].year+' done', ''));
		}
	}
	xhttp.open("GET", location.origin+"/user?get=results&year="+year, true);
	xhttp.send();
}

function setContent(){
    var table;
	all.map(function(arr, index){
        table = createTag('table', '', 'yearesult');
		arr.first.map(function(obj, i){
            var tr = createTag('tr', '', '');
            tr.appendChild(createTag('td', obj.subject, ''))
            tr.appendChild(createTag('td', obj.e_r_course, ''))
            tr.appendChild(createTag('td', obj.credit, ''))
            tr.appendChild(createTag('td', obj.result, Number(obj.result)<60?'red':''))
            table.appendChild(tr);
            // (appendTag(tr, createTag('td', obj.subject, '')));
            // (appendTag(tr, createTag('td', obj.e_r_course, '')));
            // (appendTag(tr, createTag('td', obj.credit, '')));
            // (appendTag(tr, createTag('td', obj.result, '')));
		})
        document.getElementById(`${index+1}_${0}`).innerHTML = '';
        document.getElementById(`${index+1}_${0}`).appendChild(createTag('h1', `${arr.year} 上學期`));
        document.getElementById(`${index+1}_${0}`).appendChild(table);
        table = createTag('table', '', 'yearesult');
		arr.last.map(function(obj, i){
            var tr = createTag('tr', '', '');
            tr.appendChild(createTag('td', obj.subject, ''))
            tr.appendChild(createTag('td', obj.e_r_course, ''))
            tr.appendChild(createTag('td', obj.credit, ''))
            tr.appendChild(createTag('td', obj.result, Number(obj.result)<60?'red':''))
            tr.appendChild(createTag('td', obj.overall, Number(obj.overall)<60?'red':''))
            table.appendChild(tr);
		})
        document.getElementById(`${index+1}_${1}`).innerHTML = '';
        document.getElementById(`${index+1}_${1}`).appendChild(createTag('h1', `${arr.year} 下學期`));
        document.getElementById(`${index+1}_${1}`).appendChild(table);
	})
    document.getElementById('viewer').style.display = 'block'
    document.getElementById('load').style.display = 'none'
}

const createTag = (tag, text, Class) => {
	var tmp = document.createElement(tag);
	tmp.textContent = text;
	tmp.className = Class;
	return tmp;
}

const appendTag = (a, b) => {
	return a.appendChild(b);
}
/*
var all = []
var xhttp = new XMLHttpRequest()

window.onload = function () {
	getAll(1)
}

const getAll = (year, callback) => {
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			all.push(JSON.parse(this.responseText))
			if (year < 4) {
				getAll(year + 1)
				document.getElementById("load").appendChild(createTag('p', `Load year:${year} done`))
			} else {
				setViewer()
				// setNewViewer()
				document.getElementById('viewer').style.display = 'block'
				document.getElementById('load').style.display = 'none'
			}
		}
	}
	xhttp.open("GET", location.origin+"/user?get=results&year="+year, true);
	xhttp.send();
}

function setViewer() {
	var viewer = document.getElementById('viewer')
	var list = ['科目', '選/必 修', '學分', '成績', '總成績']
	var n=0
	for (var a = 0; a < all.length; a++){
		var div = document.getElementById(`${a+1}_${n%2}`)
		var data = all[a].data
		var table = createTag('table', '', 'yearesilt')
		var tr = createTag('tr')
		for (var l = 0; l < 4; l++)
			tr.append(createTag('td', list[l]))
		table.append(tr)
		if(data==undefined)return relogin()
		if (data.length > 0) {
			for (var d = 0; d < data.length; d++){
				tr = createTag('tr')
				for (var i = 0; i < 4; i++)
					tr.append(createTag('td', data[d][i], Number(data[d][i])<60&i>2?'red':''))
				table.append(tr)
			}
			table.append(tr)
			div.innerHTML = (`<h1>${a + 1}年級 ${n%2==0?'上':'下'}學期</h1>`)
			div.appendChild(table)

			n++
			div = document.getElementById(`${a + 1}_${n % 2}`)
			table = createTag('table', '', 'yearesilt')
			tr = createTag('tr')
			for (var l = 0; l < list.length; l++)
				tr.append(createTag('td', list[l]))
			table.append(tr)
			for (var d = 0; d < data.length; d++){
				tr = createTag('tr')
				tr.append(createTag('td', data[d][0]))
				for (var i = 4; i < data[d].length; i++)
					tr.append(createTag('td', data[d][i], Number(data[d][i])<60&&i>=6?'red':''))
				table.append(tr)
			}
			table.append(tr)
			div.innerHTML = (`<h1>${a + 1}年級 ${n%2==0?'上':'下'}學期</h1>`)
			div.appendChild(table)
		} else {
			div.innerHTML = (`<h1>${a + 1}年級 ${n % 2 == 0 ? '上' : '下'}學期 還沒有成績喔</h1>`)
			n++
			div = document.getElementById(`${a+1}_${n%2}`)
			div.innerHTML = (`<h1>${a + 1}年級 ${n % 2 == 0 ? '上' : '下'}學期 還沒有成績喔</h1>`)
		}
		n = 0
	}
}

function setNewViewer() {
	var viewer = document.getElementById('viewer')
	var list = ['科目', '選/必 修', '學分', '成績', '選/必 修', '學分', '成績', '總成績']
	for (var a = 0; a < all.length; a++){
		var main = createTag('div')
		var table = createTag('table')
		var tr = createTag('tr')
		var data = all[a].data
		if (data.length > 0) {
			for (var l = 0; l < list.length; l++)
				tr.append(createTag('td', list[l]))
			table.append(tr)
			for (var d = 0; d < data.length; d++){
				tr = createTag('tr')
				for (var i = 0; i < data[d].length; i++)
					tr.append(createTag('td', data[d][i]))
				table.append(tr)
			}
			console.log(table)
			main.append(table)
			viewer.append(main)
		}
	}
	console.log(viewer)
	$(document).on('ready', function () {
	$(".regular").slick({
		dots: true,
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 3
	});
	$(".center").slick({
		dots: true,
		infinite: true,
		centerMode: true,
		slidesToShow: 3,
		slidesToScroll: 3
	});
	$(".variable").slick({
		dots: true,
		infinite: true,
		variableWidth: true
	});
	});
}

function selectYear(){
	if(this.value=='')return false
	var tag = document.getElementById('view')
	tag.innerHTML = ''
	var data = all[this.value-1].data
	var list = ['科目', '選/必 修', '學分', '成績', '選/必 修', '學分', '成績', '總成績']
	var tr = createTag('tr', '', "list-inline")
	for(var i=0;i<list.length;i++){
		tr.append(createTag('td', list[i], 'list-inline-item'))
	}
	tag.append(tr)
	for(var i=0;i<data.length;i++){
		tr = createTag('tr', '', "list-inline")
		tr.append(createTag('td', data[i][0], 'list-inline-item'))
		tr.append(createTag('td', data[i][1], 'list-inline-item'))
		tr.append(createTag('td', data[i][2], 'list-inline-item'))
		tr.append(createTag('td', data[i][3], 'list-inline-item'))
		tr.append(createTag('td', data[i][4], 'list-inline-item'))
		tr.append(createTag('td', data[i][5], 'list-inline-item'))
		tr.append(createTag('td', data[i][6], 'list-inline-item'))
		tr.append(createTag('td', data[i][7], 'list-inline-item'))
		tag.append(tr)
	}
	
}

function createTag(tag, content, Class){
	var tmp = document.createElement(tag)
	if (content)
		tmp.append(document.createTextNode(content))
	if(Class)
		tmp.className = Class
	return tmp
}

function relogin() {
	alert("登入失效")
	location.href = '/'
}
*/