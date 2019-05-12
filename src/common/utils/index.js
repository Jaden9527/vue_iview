export const setToken = (token) => {
	sessionStorage.setItem(TOKEN_KEY, token)
}

export const getToken = () => {
	const token = sessionStorage.getItem(TOKEN_KEY)
	if (token) return token
	else return false
}
export default {
	dateFtt: function (fmt, date) { //author: meizz
		var o = {
			"M+": date.getMonth() + 1, //月份   
			"d+": date.getDate(), //日   
			"h+": date.getHours(), //小时   
			"m+": date.getMinutes(), //分   
			"s+": date.getSeconds(), //秒   
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度   
			"S": date.getMilliseconds() //毫秒   
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
	/**字段是否为空检验函数**/
	testFn: function (objact) {
		if (objact && objact != null && objact.toString() != "" && objact != {}) {
			return false;
		} else {
			return true;
		}
	},
	/**
	 * 获取url链接上的参数
	 * */
	getQueryString: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg) || window.location.hash.split("?")[1].match(reg);
		if (r != null) return r[2];
		return "";
	},
	/**
	 * sessionStorage
	 * */
	sessionStorage: {
		setItem: function (key, value) {
			try {
				sessionStorage.setItem(key, value);
			} catch (error) { }
		},
		getItem: function (key) {
			try {
				return sessionStorage.getItem(key);
			} catch (error) { }
		},
		clear: function () {
			try {
				sessionStorage.clear();
			} catch (error) { }
		}
	},
}