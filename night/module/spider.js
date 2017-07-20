const request = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')

const jarGenerator = (key, val) => {
        let cookieJar = request.jar()
        let cookies = request.cookie(`${key}=${val}`)
        cookieJar.setCookie(cookies, 'http://210.70.131.56')
        return cookieJar
}

function login(acc, pwd, callback){
	var jar = request.jar()
	var options = {
		url:'http://210.70.131.56/online/login.asp',
		jar:jar,
		encoding:null,
		form:{
			division:'senior',
			rdo:'1',
			Loginid:acc,
			LoginPwd:pwd,
			Uid:'',
			Enter:'LOGIN'
		},
	}
	request.post(options, function(e, r, d){
		let result = new Object()
		if(e||!d)return callback(setError(result, "Login Error", e, 404))

		var html = iconv.decode(d, "Big5")

		if(/線上系統查無您的帳號，請聯絡系統管理人員。/g.test(html))
			return callback(setError(result, "查無帳號", e, 401))
		else if(/帳號或密碼錯誤,請重新登入!/g.test(html))
			return callback(setError(result, "帳號或密碼錯誤", e, 401))
		else if(checkedLogin(html))
			return callback(setError(result, "登入失效", e, 401))

		result.jar = jar
		result = setResponse(result, "Login Done", 200)

		return callback(result)
	})
}

function fundamental(jar, callback){
    jar = jarGenerator(jar.key, jar.value);
	var options = {
		url:"http://210.70.131.56/online/selection_student/fundamental.asp",
		jar:jar,
		encoding:null,
	}
	request(options, function(e, r, d){
		let result = new Object()
		if(e||!d)return callback(setError(result, "GET fundamental error", e, 404))

		var html = iconv.decode(d, "Big5")

		if(checkedLogin(html))
			return callback(setError(result, "登入失效", e, 401))

		var $ = cheerio.load(html)
		var table = $("table tr td")

		result.data = {}
		result.data.no = table.eq(2).text()
		result.data.name = table.eq(4).text()
		result.data.englishName = table.eq(26).text()
		result.data.birthday = table.eq(6).text().replace(/\r|\n|\t/g, "")
		result.data.identity = table.eq(10).text().replace(/\r|\n|\t/g, "")
		result.data.sex = table.eq(12).text().replace(/\r|\n|\t/g, "")
		result.data.Class = table.eq(14).text().replace(/\r|\n|\t/g, "")
		result.data.imgSrc = "http://210.70.131.56/online/utility/file1.asp?"+$("img")[0].attribs.src.split("?")[1]

		result.all = result.data
		result = setResponse(result, "GET fundamental done", 200)
		return callback(result)
	})
}

function yearResult(jar, year, callback){
    jar = jarGenerator(jar.key, jar.value);
    var _year = ['http://210.70.131.56/online/selection_student/year_accomplishment.asp?action=selection_underside_year&year_class=%A4%40&number=1', 'http://210.70.131.56/online/selection_student/year_accomplishment.asp?action=selection_underside_year&year_class=%A4G&number=2', 'http://210.70.131.56/online/selection_student/year_accomplishment.asp?action=selection_underside_year&year_class=%A4T&number=3', 'http://210.70.131.56/online/selection_student/year_accomplishment.asp?action=selection_underside_year&year_class=%A5%7C&number=4']
    var opt = {
        url:_year[year-1],
        jar:jar,
        encoding:null
    }
    request(opt, function(e, r, d){
		if(e||!d)return callback(setError(result, "GET fundamental error", e, 404))
        else if(checkedLogin(d))return setError(new Object, '登入失效', '', 401)
        var read = cheerio.load(iconv.decode(d, 'big5'))("table tbody").eq(0).html().replace(/<table?[^>]+>[\S\s]+<\/table>/g, '')
        html = `<table>${read}</table>`;
        var $ = cheerio.load(html);
        var r = $("table tr td");
        r.length--
		var result = new Object();
        result.year = r.eq(1).text().match(/\d+/)[0];
		result.first = [{subject:r.eq(0).text(), e_r_course:r.eq(4).text(), credit:r.eq(5).text(), result:r.eq(6).text()}];
		result.last = [{subject:r.eq(0).text(), e_r_course:r.eq(4).text(), credit:r.eq(5).text(), result:r.eq(6).text(), overall:'總成績'}];
        for(var i=11;i<r.length;i+=8){
			result.first.push({
				subject:r.eq(i).text(), 
				e_r_course:r.eq(i+1).text(), 
				credit:r.eq(i+2).text(), 
				result:r.eq(i+3).text()
			});
			result.last.push({
				subject:r.eq(i).text(), 
				e_r_course:r.eq(i+4).text(), 
				credit:r.eq(i+5).text(), 
				result:r.eq(i+6).text(),
				overall:r.eq(i+7).text()
			});
        }
		result = setResponse(result, 'done', 200);
        return callback(result);
    })
}

function rewards_punishments(jar, callback){
    jar = jarGenerator(jar.key, jar.value);
    var opt = {
        url:'http://210.70.131.56/online/selection_student/moralculture_%20bonuspenalty.asp',
        encoding:null,
        jar:jar
    }
    request(opt, function(e, r, d){
        if(e||!d)
            return callback(setError(result, "GET rewards_punishments error", e, 404))
        else if(checkedLogin(d))
            return callback(setError(result, "登入失效", e, 401))
        var $ = cheerio.load(iconv.decode(d, 'big5'));
        var db = $(".t07 tr td");
        db.length-=2;
        var result = new Object();
        result.list = [];
        for(var i=1;i<db.length;i+=7){
            result.list.push({
                category:db.eq(i).text(), 
                occur:db.eq(i+1).text(), 
                instructions:db.eq(i+2).text(),
                cause:db.eq(i+3).text(),
                handle:db.eq(i+4).text(),
                writeoff:db.eq(i+5).text(),
                year:db.eq(i+6).text(),
            })
            // console.log(`${db.eq(i).text()} ${db.eq(i+1).text()} ${db.eq(i+2).text()} ${db.eq(i+3).text()} ${db.eq(i+4).text()} ${db.eq(i+5).text()} ${db.eq(i+6).text()}`);
        }
        // console.log()
        result = setResponse(result, 'done', 200);
        return callback(result);
    })
}

function setError(obj, msg, error, code){
	obj.msg = msg
	obj.error = error
	obj.errorCode = code
	return obj
}

function setResponse(obj, msg, code){
	obj.msg = msg
	obj.code = code
	return obj
}

function checkedLogin(html){
	return /您尚未登入系統，或者工作階段逾時，請重新登入/g.test(html);
}

exports.login = login;
exports.fundamental = fundamental;
exports.yearesult = yearResult;
exports.rewards_punishments = rewards_punishments;
// exports.headshot = headshot