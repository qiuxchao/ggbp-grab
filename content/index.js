// 商品元素列表
let goodsElList = [];

// 监听事件
chrome.runtime.onMessage.addListener(async (request) => {
  console.log('[ request ] >', request)
  const { type } = request;
  if (type === 'send-data-success') {
    // 数据发送成功
    alert('发送成功！')
  } else if (type === 'one-detail-img-downloaded') {
    // 一个详情的图片下载完毕
    // 获取当前的下标
    let { detailIndex } = await chrome.storage.local.get(['detailIndex'])
    detailIndex++;
    if (detailIndex + 1 > goodsElList.length) {
      alert('图片全部下载完成！');
      // 删除缓存下标
      chrome.storage.local.remove(['detailIndex', 'tabId'])
    } else {
      handleOpenDetail(detailIndex);
    }
  }
}
)

// 批量下载图片
function handleBatchDownloadImg() {
  goodsElList = $('.five-box');
  if (goodsElList.length) {
    // 通知后台脚本记录当前tabId，内容脚本无权限
    chrome.runtime.sendMessage({
      type: "save-tab-id"
    }, function (success) {
      success && handleOpenDetail(0);
    });
  } else {
    alert('没有获取到商品列表！');
  }
}

// 打开详情页面
async function handleOpenDetail(index) {
  if (!goodsElList[index]) return;
  // 存储当前下标
  await chrome.storage.local.set({ detailIndex: index });
  goodsElList[index].click();

}

// 下载图片
function handleDownload(isBatch = false) {
  console.log('下载图片');
  const title = $('#__next > section > main > div > div.my-15.flex.rounded-8.bg-white.p-24 > div.flex-1 > div.text-20.line-clamp-1')?.text() || '无标题';
  const urlList = [];
  const imgList = $('#__next > section > main > div > div.mt-15.overflow-hidden.rounded-8.bg-white > div.p-24 > div.mb-30 > img').each(function (index) {
    const url = $(this).attr('src')
    urlList.push({
      url,
      title,
      index: index + 1
    });
  })
  chrome.runtime.sendMessage({
    type: "download", payload: { urlList, isBatch }
  });
  isBatch && setTimeout(window.close, 1000);
}

// 添加下载图片按钮
async function addDownloadBtn() {
  const { detailIndex } = await chrome.storage.local.get(['detailIndex'])
  if (detailIndex === undefined) {
    $('body').append(`
      <div class="gg-helper-btn-wrap">
        <button id="gg-download-btn" class="gg-helper-btn">下载图片</button>
      </div>
    `)
    $('#gg-download-btn').click(() => handleDownload())
  } else {
    // 批量下载进来的
    setTimeout(() => {
      handleDownload(true);
    }, 1000)
  }

}

// 发送请求
function handleFetchData() {
  chrome.runtime.sendMessage({
    type: "send-data"
  }, function (response) {
    console.log('内容脚本接收 devtools 返回数据：', response);
    if (!response?.haveData) {
      alert('没有获取到数据！');
    }
  });
}

// 添加发送数据&批量下载图片按钮
function addSendBtn() {
  $('body').append(`
      <div class="gg-helper-btn-wrap">
        <button id="gg-send-btn" class="gg-helper-btn">发送数据</button><br/>
        <button id="gg-batch-btn" class="gg-helper-btn">批量下载图片</button>
      </div>
    `)

  $('#gg-send-btn').click(handleFetchData)
  $('#gg-batch-btn').click(handleBatchDownloadImg)
}

$(document).ready(function () {
  const isDetail = /\.com\/detail/.test(document.location.href);

  // 初始化获取开关状态
  chrome.storage.sync.get(['on'], result => {
    console.log('[ popup 开关状态 ] >', result)
    if (result.on) {
      isDetail ? addDownloadBtn() : addSendBtn();
    }
  });

  // 监听storage变化
  chrome.storage.onChanged.addListener((changes, area) => {
    console.log('storage变化：', changes);
    if (changes.hasOwnProperty('on')) {
      const btnEl = $(isDetail ? '#gg-download-btn' : '#gg-send-btn');
      if (changes.on.newValue && !btnEl.length) {
        isDetail ? addDownloadBtn() : addSendBtn();
      } else {
        changes.on.newValue ? btnEl.fadeIn() : btnEl.fadeOut();
      }
    }

  });

});