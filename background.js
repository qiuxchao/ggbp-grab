
// 监听事件
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('[ request, sender ] >', request, sender)
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    const { type, payload } = request;
    // 内容脚本的下载事件
    if (type === "download")
      sendResponse({ receive: payload });
      // 请求下载权限
      chrome.permissions.request({
        permissions: ['downloads']
      }, (granted) => {
        if (granted) {
          // 授权成功
          const [extName] = payload.url.match(/\.(png|jpg|gif|jpeg|webp)$/)
          chrome.downloads.download({
            url: payload.url,
            filename: `呱呱爆品素材/${payload.title}/${payload.index}${extName}`,
            conflictAction: 'overwrite',  // 覆盖相同文件
          }, (downloadId) => {
            console.log('[ downloadId ] >', downloadId)
          })
        }
      });
  }
);
