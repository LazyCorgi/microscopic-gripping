// 获取 HTML 元素
const textInput = document.getElementById('textInput');
const submitBtn = document.getElementById('submitBtn');
const output = document.getElementById('output');

// 按钮点击事件
submitBtn.addEventListener('click', () => {
    const userInput = textInput.value;            // 获取输入框的内容
    output.innerText = '你输入了: ' + userInput;  // 修改页面显示的文本
});
