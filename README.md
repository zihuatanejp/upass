# upass（密码家）
密码家，一个记密码的工具 ( for encrypt to protect account&amp;password&amp;balabala important info )
之前一直苦于对记忆生活中的众多密码，账号，之类的信息头疼不已，而没有很好的办法，

（1.一个密码走天下很简单，但是太危险，有撞库的风险，而且不同网站密码的要求不同，有的不能设置一些特殊字符，有的必须纯数字比如支付密码，有的位数要多少位以上，千奇百怪。）

1号1密并且没有规律最安全但难以记忆，外部保存起来使用不方便，而且有意外遗失，泄露这类的风险。

所以用了数个周末着手写了这样一款小程序，用来保护这些重要的信息。
并将源代码开放在github上，供有兴趣的开发者参考借鉴，提供意见。
可以在微信上搜索小程序： "密码家" 体验使用，同时推荐有条件的开发者可以集成到自己的服务器上，作为一个自己的私服使用，这样安全强度更高。

或者微信扫码使用
![](http://default.buditem.com/img/qr.jpg)![](https://github.com/zihuatanejp/upass/raw/master/wxupass/res/img/wxxiaoqr.jpg)


本软件前后端包括加密算法皆使用纯js实现，
关于加密算法部分使用了同在github上的另一个js库crypto-js[项目主页](https://github.com/brix/crypto-js),主要使用了其中sha2的哈希算法和AES的对称加解密

至于js实现的非对称加密算法则使用了公认极高强度的2048位的rsa。这个轮子找了两天没找着合适的，参考了斯坦福的那个js的rsademo后又稍微改造了一下forge项目[项目主页](https://github.com/digitalbazaar/forge)

## 集成
服务器端：首先请确保服务器上有正常运行mongodb,并为其生成了数据库的用户和密码, 配置请参考http://mongodb.github.io/node-mongodb-native/2.2/

小程序端： 首先请确保已在微信公众平台上申请了相应的小程序开发者账户，申请请参考 https://mp.weixin.qq.com/

将本项目克隆下来到本地，
目录结构为：

* server
	* bin
	* public
    * css img js lib
  * routes
    * upassconf
      * conf.js
    * mon.js 
    * upass.js
  * views
  * app.js
  * package.json
* wxupass
	* lib
	* pages
	* res
	* app.js
	* app.json

ok
===
