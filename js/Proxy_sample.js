function createArrayLogger(array) {
  return new Proxy(array, {
    set(target, property, value) {
      target[property] = value;
      console.log(target);
      return true;
    }
  });
}

var i, j, Array2, Temp;

function mathRandomInt(a, b) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    var c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
}

i = 1;
j = 1;
Array2 = createArrayLogger([mathRandomInt(1, 100), mathRandomInt(1, 100), mathRandomInt(1, 100), mathRandomInt(1, 100), mathRandomInt(1, 100)]);
while (i <= Array2.length) {
  j = 1;
  while (j <= Array2.length - i) {
    if (Array2[(j - 1)] > Array2[((j + 1) - 1)]) {
      Temp = Array2[(j - 1)];
      Array2[(j - 1)] = Array2[((j + 1) - 1)];
      Array2[((j + 1) - 1)] = Temp;
    }
    j = j + 1;
  }
  i = i + 1;
}

