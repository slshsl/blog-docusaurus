---
sidebar_position: 1
---

# 介绍

## 概述

- 证书

- SSL/TSL（**TSL是SSL的后续版本，目前大部分浏览器不支持SSL**）

    TSL握手步骤（前提TCP已完成三次握手）

    1. **ClientHello：告知服务器客户端所支持的SSL/TSL协议版本及加密算法、压缩方法、客户端随机数（client-random）等等**

    2. **ServerHello：服务器收到客户端信息后，选定双方支持的SSL/TSL协议版本及加密算法、压缩方法等、服务端随机数（server-random)等，返回给客户端**

    3. SendCertificate（可选）：服务端发送服务端证书给客户端

    4. RequestCertificate（可选）：如果选择双向验证，服务器向客户端请求客户端证书（举例银行交易u盾等等）

    5. **ServerHelloDone：服务器通知客户端初始协商结束**

    6. ResponseCertificate（可选）：如果选择双向验证，客户端向服务器发送给客户端证书

    7. **ClientKeyExchange：客户端使用服务端的公钥，对客户端公钥和密钥种子（随机数：pre-master）进行加密，再发送给服务器**

    8. CertificateVerify（可选）：如果选择双向验证，客户端用本地私钥生成数字签名，并发送给服务端，让其通过收到的客户端公钥进行身份验证

    9. **CreateSecretKey：通讯双方基于密钥种子（client-random+server-random+pre-master）等信息生成通讯主密钥（master-key）**

    10. **ChangeCipherSpec：客户端通知服务器已将通讯方式切换到加密模式**

    11. **Finished：客户端做好加密通讯准备**

    12. **ChangeCipherSpec：服务器通知客户端已将通讯方式切换到加密模式**

    13. **Finished：服务器做好加密通讯准备**

    14. **Encrypted/DecryptedData：双方使用客户端密钥，通过对称加密算法通讯**

    15. **CloseConnection：通讯结束，任何一方发出断开SSL连接的消息**

- 简化为四次握手

    1. 客户端———-**ClientHello：TLS Version、Cipher Suites、Client Random**

    2. 服务端———-**ServerHello：TLS Version、Cipher Suites、Server Random、Certificate**

    3. 客户端———-**ClientKeyExchange、CreateSecretKey、ChangeCipherSpec、Finished：pre-master（采用证书中的公钥加密）、master-key（client-random+server-random+pre-master）**

    4. 服务端———-**CreateSecretKey、ChangeCipherSpec、Finished：master-key（client-random+server-random+pre-master）**

- 简述过程

    1. **客户端发出请求**

        - 支持的协议版本，比如TLS 1.0版

        - **一个客户端生成的随机数，稍后用于生成会话密钥**

        - **支持的密码套件（支持的加密方法）**

    2. **服务器回应**

        - 确认使用的加密通信协议版本，比如TLS 1.0版本。如果浏览器与服务器支持的版本不一致，服务器关闭加密通信。

        - **一个服务器生成的随机数，稍后用于生成”会话密钥“**

        - **确认使用的加密方法，比如RSA公钥加密**

        - 服务器证书

    3. **客户端回应**

        客户端收到服务器回应以后，开始走证书链逐级验证，确认证书的真实性
        
        如果证书不是可信机构颁布、或者证书中的域名与实际域名不一致、或者证书已经过期，就会向访问者显示一个警告，由其选择是否还要继续通信：

        如果证书真实有效，从证书中拿出服务器公钥，向服务器发送下面三项信息：

        - 一个用服务器公钥加密随机数（**pre-master key：预主密钥**），防止被窃听

        - 编码改变通知，表示随后的信息都将用双方商定的加密方法和密钥发送（Change Cipher Spec）

        - 客户端握手结束通知（Finished），表示客户端的握手阶段已经结束。这一项是把之前所有发送的数据做个摘要（hash值），再加密一下，供服务器校验

        上面第一项的随机数，是整个握手阶段出现的第三个随机数，又称"pre-master key"。有了它以后，客户端和服务器就同时有了三个随机数，接着双方就用事先商定的加密方法，各自生成本次会话所用的同一把”会话密钥“。
        
    4. **服务器的最后回应**
    
        服务器收到客户端的第三个随机数pre-master key之后，计算生成本次会话所用的“会话密钥”;然后，向客户端最后发送下面信息：

        - 编码改变通知，表示随后的信息都将用双方商定的加密方法和密钥发送（Change Cipher Spec）

        - 服务端握手结束通知（Finished），表示服务端的握手阶段已经结束。这一项是把之前所有发送的数据做个摘要（hash值），再加密一下，供客户端校验
    
    TLS握手结束后，双方开始使用对称会话密钥进行加密通信。
    
- HTTPS 中间人攻击
    
    针对 HTTPS 攻击主要有 **SSL 劫持攻击和 SSL 剥离攻击**两种
    
    - **SSL 劫持攻击**是指攻击者劫持了客户端和服务器之间的连接，将服务器的合法证书替换为伪造的证书，从而获取客户端和服务器之间传递的信息。这种方式一般容易被用户发现，浏览器会明确的提示证书错误，但某些用户安全意识不强，可能会点击继续浏览，从而达到攻击目的。

    - **SSL 剥离攻击**是指攻击者劫持了客户端和服务器之间的连接，攻击者保持自己和服务器之间的 HTTPS 连接，但发送给客户端普通的 HTTP 连接，由于 HTTP 连接是明文传输的，即可获取客户端传输的所有明文数据。