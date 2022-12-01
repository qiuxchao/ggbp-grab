// 发送批量下载成功消息
const sendBatchSuccessMsg = async () => {
  const { tabId } = await chrome.storage.local.get(['tabId']);
  chrome.tabs.sendMessage(
    tabId,
    {
      type: "one-detail-img-downloaded",
    }
  );
}

// 监听事件
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ? "来自内容脚本: " : "来自扩展程序: ", request, sender?.tab?.url ?? '');
  const { type, payload } = request;
  if (type === "download") {
    // 内容脚本的下载事件
    const { urlList, isBatch } = payload;
    urlList.forEach(item => {
      const [extName] = item.url.match(/\.(png|jpg|gif|jpeg|webp)$/)
      const filename = `呱呱爆品素材/${item.title}/${item.index}${extName}`.replace(/\*/g, 'x');;
      chrome.downloads.download({
        url: item.url,
        filename,
        conflictAction: 'overwrite',  // 覆盖相同文件
      }, (downloadId) => {
        downloadId && console.log('[ 下载成功 ] >', filename)
      })
    })
    isBatch && sendBatchSuccessMsg();

  } else if (type === 'devtools-send-data') {
    // devtools 捕获到的商品列表数据
    const response = payload ? JSON.parse(payload) : null;
    console.log('[ devtools 请求信息 ] >', response)
    if (response?.data?.itemList) {
      // 发送数据
      fetch('http://localhost:3372/ggbp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(response.data.itemList)
      })
        .then(res => res.json())
        .then((data) => {
          console.log('[ data ] >', data)
          if (data?.success) {
            // 向内容脚本发消息要用 chrome.tabs.sendMessage
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(
                tabs[0].id,
                {
                  type: "send-data-success",
                }
              );
            })
          }
        })
    }

  } else if (type === 'save-tab-id') {
    // 批量下载图片，记录下首页 tabId
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      await chrome.storage.local.set({ tabId: tabs[0].id, });
      sendResponse(true)
    })
    // return true 以使用异步的 sendResponse
    return true;
  }
});
