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
  const element = document.querySelector('.point');
  const obj = new Example(element);
  obj.init();
};

a();
