function pluralize(time, label) {
    if (time === 1) {
        return time + label;
    }
    return time + label + "s";
}
export function timeAgo(time) {
    const between = Date.now() / 1000 - Number(time);
    if (between < 3600) {
        return pluralize(~~(between / 60), " minute");
    } else if (between < 86400) {
        return pluralize(~~(between / 3600), " hour");
    } else {
        return pluralize(~~(between / 86400), " day");
    }
}

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }

    if ((time + "").length === 10) {
        time = +time * 1000;
    }

    const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
        date = time;
    } else {
        date = new Date(parseInt(time));
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === "a")
            return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
        if (result.length > 0 && value < 10) {
            value = "0" + value;
        }
        return value || 0;
    });
    return timeStr;
}

export function formatTime(time, option) {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return "刚刚";
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 2) {
        return "1天前";
    }
    if (option) {
        return parseTime(time, option);
    } else {
        return (
            d.getMonth() +
            1 +
            "月" +
            d.getDate() +
            "日" +
            d.getHours() +
            "时" +
            d.getMinutes() +
            "分"
        );
    }
}

/*  数字 格式化 */
export function nFormatter(num, digits) {
    const si = [
        { value: 1e18, symbol: "E" },
        { value: 1e15, symbol: "P" },
        { value: 1e12, symbol: "T" },
        { value: 1e9, symbol: "G" },
        { value: 1e6, symbol: "M" },
        { value: 1e3, symbol: "k" }
    ];
    for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
            return (
                (num / si[i].value + 0.1)
                    .toFixed(digits)
                    .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol
            );
        }
    }
    return num.toString();
}

export function html2Text(val) {
    const div = document.createElement("div");
    div.innerHTML = val;
    return div.textContent || div.innerText;
}

export function toThousandslsFilter(num) {
    return (+num || 0)
        .toString()
        .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

/**
 * 格式化文件大小
 * @param value
 * @returns {*}
 */
export function renderSize(value) {
    if (!value || value === null || value === "") {
        return "";
    }
    let unitArr = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let srcsize = parseFloat(value);
    let index = Math.floor(Math.log(srcsize) / Math.log(1024));
    let size = srcsize / Math.pow(1024, index);
    size = size.toFixed(0); // 保留的小数位数
    return size + unitArr[index];
}

export function friendlyDate(timestamp) {
	var formats = {
		'year': '%n% 年前',
		'month': '%n% 月前',
		'day': '%n% 天前',
		'hour': '%n% 小时前',
		'minute': '%n% 分钟前',
		'second': '%n% 秒前',
	};
	var now = Date.now();
	var seconds = Math.floor((now - parseInt(timestamp)) / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);

	var diffType = '';
	var diffValue = 0;
	if (years > 0) {
		diffType = 'year';
		diffValue = years;
	} else {
		if (months > 0) {
			diffType = 'month';
			diffValue = months;
		} else {
			if (days > 0) {
				diffType = 'day';
				diffValue = days;
			} else {
				if (hours > 0) {
					diffType = 'hour';
					diffValue = hours;
				} else {
					if (minutes > 0) {
						diffType = 'minute';
						diffValue = minutes;
					} else {
						diffType = 'second';
						diffValue = seconds === 0 ? (seconds = 1) : seconds;
					}
				}
			}
		}
	}
	return formats[diffType].replace('%n%', diffValue);
}

export function timeTodate(format,timestamp) {
	var myDate = new Date();
	myDate.getYear(); //获取当前年份(2位)
	myDate.getFullYear(); //获取完整的年份(4位,1970-????)
	myDate.getMonth(); //获取当前月份(0-11,0代表1月)         // 所以获取当前月份是myDate.getMonth()+1;
	myDate.getDate(); //获取当前日(1-31)
	myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
	myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
	myDate.getHours(); //获取当前小时数(0-23)
	myDate.getMinutes(); //获取当前分钟数(0-59)
	myDate.getSeconds(); //获取当前秒数(0-59)
	myDate.getMilliseconds(); //获取当前毫秒数(0-999)
	myDate.toLocaleDateString(); //获取当前日期
	var mytime=myDate.toLocaleTimeString(); //获取当前时间
	myDate.toLocaleString( ); //获取日期与时间

	// 2019-10-01 23:08:35
	var tmpDate = new Date(timestamp);
	var seconds = tmpDate.getSeconds();
	var minutes = ('0' + tmpDate.getMinutes()).substr(-2);
	var hours = tmpDate.getHours();
	var days = ('0' + tmpDate.getDate()).substr(-2);
	var months = ('0' + (tmpDate.getMonth() + 1)).substr(-2);
	var years = tmpDate.getFullYear();

	var value = '自定义替换值';
	// 输出格式为 .replace(被替换字符, 计算后值)

	return format.replace('Y', years).replace('m', months).replace('d', days).replace('H', hours).replace('i', minutes).replace('s', seconds).replace('index', value);
}
