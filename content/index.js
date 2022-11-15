// 下载
function handleDownload(res) {
  console.log('下载图片');
  const title = $('#__next > section > main > div > div.my-15.flex.rounded-8.bg-white.p-24 > div.flex-1 > div.text-20.line-clamp-1')?.text() || '无标题';
  const imgList = $('#__next > section > main > div > div.mt-15.overflow-hidden.rounded-8.bg-white > div.p-24 > div.mb-30 > img').each(function () { 
    const url = $(this).attr('src')
    url && chrome.downloads.download({
      url,
      filename: `呱呱爆品素材/${title}/`,
      method: 'GET',
    }, (downloadId) => {
      console.log('[ downloadId ] >', downloadId)
    })
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
    result.on && addDownloadBtn();
  });

  // 监听storage变化
  chrome.storage.onChanged.addListener((changes, area) => {
    console.log('storage变化：', changes, area);
    if (changes.on) {
      const btnEl = $('#gg-download-btn')
      btnEl.length ? btnEl.fadeIn() : addDownloadBtn();
    }
  });


  // const script = document.createElement('script');
  // script.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.js'
  // document.body.appendChild(script);

});