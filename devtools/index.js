
let listData = '';

chrome.devtools.network.onRequestFinished.addListener((request) => {
  request.getContent((content) => {
    if (request?.request?.url === 'https://api.guaguayoupin.com/ggyp/ranking/item') {
      listData = content;
    }
  })
});




// 监听事件
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { type } = request;
    // 内容脚本的发送数据按钮点击
    if (type === 'send-data') {
      sendResponse({ haveData: !!listData });
      // 使用 chrome.runtime.id 判断扩展上下文是否有效
      chrome.runtime?.id && chrome.runtime.sendMessage({
        type: "devtools-send-data",
        payload: listData,
      });
    }
  }
);