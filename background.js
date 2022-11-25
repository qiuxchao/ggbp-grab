
// 监听事件
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(sender.tab ? "来自内容脚本: " : "来自扩展程序: ", request, sender?.tab?.url ?? '');
  const { type, payload } = request;
  // 内容脚本的下载事件
  if (type === "download") {
    // 请求下载权限
    chrome.permissions.request({
      permissions: ['downloads']
    }, (granted) => {
      if (granted) {
        // 授权成功
        payload.forEach(item => {
          const [extName] = item.url.match(/\.(png|jpg|gif|jpeg|webp)$/)
          chrome.downloads.download({
            url: item.url,
            filename: `呱呱爆品素材/${item.title}/${item.index}${extName}`,
            conflictAction: 'overwrite',  // 覆盖相同文件
          }, (downloadId) => {
            console.log('[ downloadId ] >', downloadId)
          })
        })
      }
    });
  } else if (type === 'devtools-send-data') {
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
  }
}
);
