import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

class Example {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.textContent = '!!!hello, world!';
    console.log('ehu!');
  }
}

const a = () => {
  const element = document.createElement('div');
  const obj = new Example(element);
  obj.init();
};

a();
