---
layout: post
title: "折腾自己的博客，HTTP2 & Github Webhook"
description: ""
category: 
tags: [http, Git, 前端]
---

这几天把原来的Github Page上的博客迁移到了自己的VPS和域名中，总结一下过程。新的地址来一发：[https://www.maizhiying.me](https://www.maizhiying.me)。

### 引用

1. [本博客 Nginx 配置之完整篇](https://imququ.com/post/my-nginx-conf.html)
2. [Let's Encrypt，免费好用的 HTTPS 证书](https://imququ.com/post/letsencrypt-certificate.html)
3. [使用Github的webhooks进行网站自动化部署](https://aotu.io/notes/2016/01/07/auto-deploy-website-by-webhooks-of-github/)

### 配置Http/2

首先安装依赖库和编译要用到的工具：

    sudo apt-get install build-essential libpcre3 libpcre3-dev zlib1g-dev unzip git

我的Ubuntu版本是15.10，安装的时候有个坑：

    Err http://archive.ubuntu.com/ubuntu/ wily-updates/main linux-libc-dev amd64 4.2.0-36.42
    404  Not Found [IP: 91.189.88.161 80]
    Err http://security.ubuntu.com/ubuntu/ wily-security/main linux-libc-dev amd64 4.2.0-36.42
    404  Not Found [IP: 91.189.91.26 80]
    E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/l/linux/linux-libc-dev_4.2.0-36.42_amd64.deb  404  Not Found [IP: 91.189.91.26 80]
    E: Unable to fetch some archives, maybe run apt-get update or try with --fix-missing?

这样填：

    $ echo 'deb http://cz.archive.ubuntu.com/ubuntu wily-updates main' | sudo tee -a /etc/apt/sources.list
    $ sudo apt-get update

然后获取 nginx-ct 源码，用于启用 Certificate Transparency 功能:

    wget -O nginx-ct.zip -c https://github.com/grahamedgecombe/nginx-ct/archive/v1.3.0.zip
    unzip nginx-ct.zip

使用 OpenSSL 1.1.0：

    wget -O openssl.tar.gz -c https://www.openssl.org/source/openssl-1.1.0.tar.gz
    tar zxf openssl.tar.gz
    mv openssl-1.1.0/ openssl

获取 Nginx 源码，开始编译：

    wget -c https://nginx.org/download/nginx-1.11.4.tar.gz
    tar zxf nginx-1.11.4.tar.gz

    cd nginx-1.11.4/

    ./configure --add-module=../ngx_brotli --add-module=../nginx-ct-1.3.0 --with-openssl=../openssl --with-http_v2_module --with-http_ssl_module --with-ipv6 --with-http_gzip_static_module

    make
    sudo make install

编译完成之后，创建一个管理脚本：

    sudo vim /etc/init.d/nginx

其中的内容记录在一个Gits里面：[https://gist.github.com/dafeizizhu/a5918c98e40b1d2c3c0606c7f2005e6f](https://gist.github.com/dafeizizhu/a5918c98e40b1d2c3c0606c7f2005e6f)。

然后为这个脚本增加执行权限：

    sudo chmod a+x /etc/init.d/nginx

最后配置开机启动：

    sudo update-rc.d -f nginx defaults

### 配置博客站点的Nginx配置文件

这样安装完的Nginx配置文件的目录在`/usr/local/nginx/conf/nginx.conf`。我们在`http`块的最后加上我们自己站点的配置，这样可以避免频繁修改这个默认的配置文件：

    http {
      ...
      include /home/blog/www/nginx_conf/blog.conf;
    }

然后编写对应的配置文件：

    server {
      listen 80;
      server_name maizhiying.me www.maizhiying.me;

      location / {
        root /home/blog/github/dafeizizhu.github.com/site;
        index index.html;
      }
    }

我们可以用`nginx -t`来校验一下我们编写的配置文件格式是否正确：

    /path/to/nginx -t

如果一切正常可以看到控制台输出：

    nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
    nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful

这样我们就可以reload一下Nginx让我们的配置生效：

    /path/to/nginx -s reload

### 使播客支持HTTP/2

要使用HTTP/2首先需要一个证书。证书可以购买，也可以用[Let's Encrypt](https://letsencrypt.org/)免费的证书。这里使用了这个免费的证书。

首先要创建帐号，创建一个RSA私钥用于Let's Encrypt识别你的身份：

    openssl genrsa 4096 > account.key

然后创建CSR文件：

    openssl genrsa 4096 > domain.key
    openssl ecparam -genkey -name secp256r1 | openssl ec -out domain.key
    openssl req -new -sha256 -key domain.key -subj "/" -reqexts SAN -config <(cat /etc/ssl/openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:yoursite.com,DNS:www.yoursite.com")) > domain.csr

> CA 在签发 DV（Domain Validation）证书时，需要验证域名所有权。传统 CA 的验证方式一般是往 admin@yoursite.com 发验证邮件，而 Let's Encrypt 是在你的服务器上生成一个随机验证文件，再通过创建 CSR 时指定的域名访问，如果可以访问则表明你对这个域名有控制权。

这时候我们需要配置一个验证服务：

    # /home/blog/www/nginx_conf/blog.conf
    server {
      listen 80;
      server_name maizhiying.me www.maizhiying.me;

      location ^~ /.well-known/acme-challenge/ {
        alias /home/blog/www/challenges/;
        try_files $uri =404;
      }

      location / {
        rewrite ^/(.*)$ https://www.maizhiying.me/$1 permanent;
      }
    }

这样我们就可以获取证书了。我们使用acme-tiny脚本来获取证书：

    wget https://raw.githubusercontent.com/diafygi/acme-tiny/master/acme_tiny.py

指定账户私钥、CSR以及刚才的验证目录（`/home/blog/www/challenges/`），执行脚本：

    python acme_tiny.py --account-key ./account.key --csr ./domain.csr --acme-dir ~/www/challenges/ > ./signed.crt

这个`signed.crt`就是申请好的证书文件。

在 Nginx 配置中，需要把中间证书和网站证书合在一起：

    wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > intermediate.pem
    cat signed.crt intermediate.pem > chained.pem

最后修改Nginx配置启用HTTP/2：

    # /home/blog/www/nginx_conf/blog.conf
    server {
      listen 80;
      ...
    }

    # for http/2
    server {
      listen 443 ssl http2 fastopen=3 reuseport;
      server_name maizhiying.me www.maizhiying.me;

      ssl_certificate     /home/blog/chained.pem;
      ssl_certificate_key /home/blog/domain.key;

      location / {
        root /home/blog/github/dafeizizhu.github.com/site;
        index index.html;
      }
    }

这个证书需要每90天更新一次，这里编写一个脚本来自动更新证书：

    cd /home/blog/www/
    python acme_tiny.py --account-key account.key --csr domain.csr --acme-dir /home/blog/www/challenges/ > signed.crt || exit
    wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > intermediate.pem
    cat signed.crt intermediate.pem > chained.pem
    service nginx reload

这样HTTP/2的配置工作就完成了，现在可以用[https://www.maizhiying.me](https://www.maizhiying.me)来访问博客。

### 自动更新博客

现在这个博客的源码是托管在Giithub的，之前的做法是：

1. 新建了一个仓库，里面放置构建出来的博客静态文件。
2. 在源码仓库中更新了内容，手动调用构建脚本，然后把构建出来的内容手动拷贝到目标仓库。
3. 分别在源码仓库和目标仓库commit和push。

这样的做法太麻烦了，显然不是一个程序猿应该有的做法。现在把博客迁移到了自己的VPS，可以实现一些自动化部署方案。例如那天看到的[Github Webhook](https://developer.github.com/webhooks/)这个东西，可以监听仓库的一些事件，例如有人push了代码、有人提了issue等，实现自定义的处理方式。利用这个东西，博客可以改成这样来达到自动部署的目的：

1. 在源码仓库中更新内容，触发Github Webhook的push事件。
2. 在VPS中部署一个服务，监听到这个push事件，然后从源码仓库中拉取代码，再执行构建脚本

这样就实现了自动发布的功能，也不需要原来的那个仓库了。

要使用Github Webhook，首先需要编写一个监听事件的服务，[这里](https://github.com/dafeizizhu/blog-builder)是我写的一个例子，主要是使用了[github-webhook-handler](https://github.com/rvagg/github-webhook-handler)：

    var http = require('http')
    var createHandler = require('github-webhook-handler')
    var handler = createHandler({ path: '/auto-build', secret: 'xxx' })

    http.createServer((req, res) => {
      handler(req, res, err => {
        res.statusCode = 404 
        res.end('no such location')
      })
    }).listen(6666)
    
    handler.on('push', evt => {
      console.log('Recieve a push event')
      runCommand('sh', ['./auto_build.sh'], txt => {
        console.log(txt)
      })
    })

启动服务后，然后在对应的仓库的Settings -> Webhooks -> add webhook中设置这个服务的URL、secret以及关心的事件（例如只关心push事件等），就可以使用这个服务来进行自动构建了。在激活了一个Webhook之后，Github会记录每次触发这个Webhook的事件，可以在日志中重新触发这个事件来调试我们自己编写的服务，非常方便。

### 总结

这样，这个博客就迁移到了新的域名上了。苹果现在审核APP的时候强制内容使用https，Chrome对http的传输越来越不友好（使用普通http的网站会提醒不是私密链接），国内外各大网站也全面使用https。另外，HTTP/2更是在并发和传输体积上远远胜过HTTP/1，对于不支持HTTP/2的浏览器，也能自动兼容到https。趁着这个机会，这个小博客也乘上了HTTP/2的大车，也当是对Nginx配置HTTP/2的熟悉吧，起飞！
