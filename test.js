const randomPsw = () => {
  let char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += char.charAt(Math.floor(Math.random() * char.length))
  }
  return result
}

randomPsw()


// let char = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

// console.log(char.charAt(Math.floor(Math.random() * char.length)))
