// 设置开关状态
const setCheckbox = (on) => {
  $('input.checkbox').attr('checked', on)
  $('span.text').text(on ? '开启' : '关闭')
}

$(document).ready(function () {
  let on = false;

  // 初始化开关
  chrome.storage.sync.get(['on'], result => {
    on = result.on || false;
    setCheckbox(on)
    $('input.checkbox').change(function(e) { 
      on = e.target.checked;
      setCheckbox(on);
      chrome.storage.sync.set({ on });
    })
  });
  
  
})