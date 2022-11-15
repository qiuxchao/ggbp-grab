// 下载
function handleDownload(res) {
  console.log('下载图片');
  const title = $('#__next > section > main > div > div.my-15.flex.rounded-8.bg-white.p-24 > div.flex-1 > div.text-20.line-clamp-1')?.text() || '无标题';
  const imgList = $('#__next > section > main > div > div.mt-15.overflow-hidden.rounded-8.bg-white > div.p-24 > div.mb-30 > img').each(function (index) { 
    const url = $(this).attr('src')
    // 内容脚本无法请求权限，需要把数据发送给 service_worker 处理
    url && chrome.runtime.sendMessage({ type: "download", payload: {
      url,
      title,
      index: index + 1
    } }, function (response) {
      console.log(response);
    });
  })
}

$(document).ready(function () {
  // 添加下载按钮
  const addDownloadBtn = () => {
    $('body').append(`
      <div class="gg-helper-btn-wrap">
        <button id="gg-download-btn">下载图片</button>
      </div>
    `)

    $('#gg-download-btn').click(handleDownload)
  }

  // 初始化获取开关状态
  chrome.storage.sync.get(['on'], result => {
    // console.log('[ result ] >', result)
    result.on && addDownloadBtn();
  });

  // 监听storage变化
  chrome.storage.onChanged.addListener((changes, area) => {
    // console.log('storage变化：', changes, area);
    const btnEl = $('#gg-download-btn')
    if (changes.on.newValue && !btnEl.length) {
      addDownloadBtn();
    } else {
      changes.on.newValue ? btnEl.fadeIn() : btnEl.fadeOut();
    }
  });

});