呱呱爆品助手

批量下载改动：

- `downloads` 改成固定权限，不然会报 `This function must be called during a user gesture`（必须在用户手势期间调用函数错误）

- 点击首页的*批量下载*按钮需求让后台脚本记录一下当前首页的 `tabId`，用于后续发送下载完成的消息给首页

- 内容脚本进来时需要判断如果是批量下载进入不展示下载按钮直接下载图片，下载完毕后关闭tab