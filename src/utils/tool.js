const checkMoney = (rule, value, callback) => {
  var myreg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
  if (!myreg.test(value)) {
    callback(new Error('请输入正确金额,保留两位小数'))
  } else {
    callback()
  }
}
const checkMoney99 = (rule, value, callback) => {
  if (Number(value) > 99) {
    callback(new Error('输入金额不得大于99'))
  } else {
    callback()
  }
}
const checkMoney999 = (rule, value, callback) => {
  if (Number(value) > 999) {
    callback(new Error('输入金额不得大于999'))
  } else {
    callback()
  }
}

/**
 * [fileLengthFormat 格式化文件大小]
 * @param  {[int]} total [文件大小]
 * @param  {[int]} n     [total参数的原始单位如果为Byte，则n设为1，如果为kb，则n设为2，如果为mb，则n设为3，以此类推]
 * @return {[string]}       [带单位的文件大小的字符串]
 */
const fileLengthFormat = (total, n) => {
    var format;
    var len = total / (1024.0);
    if (len > 1000) {
        return arguments.callee(len, ++n);
    } else {
        switch (n) {
            case 1:
                format = len.toFixed(2) + "KB";
                break;
            case 2:
                format = len.toFixed(2) + "MB";
                break;
            case 3:
                format = len.toFixed(2) + "GB";
                break;
            case 4:
                format = len.toFixed(2) + "TB";
                break;
        }
        return format;
    }
}

export {
  checkMoney,
  checkMoney99,
  checkMoney999,
  fileLengthFormat
}
// ...其他的规则
