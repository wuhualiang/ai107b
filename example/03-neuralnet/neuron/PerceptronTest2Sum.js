const N = require('./neuron')

class Perceptron { // f(x,y,a,b,c) = sigmoid(ax+by+c)
  constructor (a, b, c, x, y) {
    // create input units
    this.a = new N.Variable(a, 0.0);
    this.b = new N.Variable(b, 0.0);
    this.c = new N.Variable(c, 0.0);
    this.x = new N.Variable(x, 0.0);
    this.y = new N.Variable(y, 0.0);
    // create the gates
    this.mulg0 = new N.Mul();
    this.mulg1 = new N.Mul();
    // this.addg0 = new N.Add();
    // this.addg1 = new N.Add();
    this.sumg0 = new N.Sum()
    this.sigg0 = new N.Sigmoid();
  }
  forward () {
    let ax = this.mulg0.forward(this.a, this.x); // a*x = -1
    let by = this.mulg1.forward(this.b, this.y); // b*y = 6
    let axpbypc = this.sumg0.forward([ax, by, this.c])
    console.log('axpbypc=%j', axpbypc)
    // let axpby = this.addg0.forward(ax, by); // a*x + b*y = 5
    // let axpbypc = this.addg1.forward(axpby, this.c); // a*x + b*y + c = 2
    let s = this.sigg0.forward(axpbypc); // sig(a*x + b*y + c) = 0.8808
    return s
  }
  backward () {
    this.sigg0.backward();   // writes gradient into axpbypc
    // this.addg1.backward(); // writes gradients into axpby and c
    // this.addg0.backward(); // writes gradients into ax and by
    this.sumg0.backward();
    this.mulg1.backward(); // writes gradients into b and y
    this.mulg0.backward(); // writes gradients into a and x
  }
  adjust (step) {
    this.a.value += step * this.a.grad; // a.grad is -0.105
    this.b.value += step * this.b.grad; // b.grad is 0.315
    this.c.value += step * this.c.grad; // c.grad is 0.105
    this.x.value += step * this.x.grad; // x.grad is 0.105
    this.y.value += step * this.y.grad; // y.grad is 0.210
  }
}

let p0 = new Perceptron(1, 2, -3, -1, 3)

for (let i=0; i<10; i++) {
  gradientDescendent(0.01)  
}

function gradientDescendent(step) {
  let out = p0.forward()
  console.log('circuit output: %j', out); // prints 0.8808
  out.grad = 1.0
  p0.backward()
  p0.adjust(step)
  // out = p0.forward();
  // console.log('circuit output after one backprop: ' + out.value); // prints 0.8825
}