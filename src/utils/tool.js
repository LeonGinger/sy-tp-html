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

export {
  checkMoney,
  checkMoney99,
  checkMoney999
}
// ...其他的规则
