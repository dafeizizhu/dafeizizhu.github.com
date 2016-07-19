---
layout: post
title: "Node获取网卡信息"
description: ""
category: 
tags: [node]
---

### 引用

1. [OS Node.js v6.3.0 Manual & Documentation](https://nodejs.org/api/os.html#os_os_networkinterfaces)

`os.networkInterfaces()`方法能返回机器上有绑定地址的网卡接口信息。

在返回的对象中，每一个键值就是那个网卡的名字，例如`lo`、`eth0`等。对应的值是一个数组，数组的每一项是这个网卡绑定地址的描述对象：

    {
      lo: [{
        address: '127.0.0.1',
        netmask: '255.0.0.0',
        family: 'IPv4',
        mac: '00:00:00:00:00:00',
        internal: true
      }, {
        address: '::1',
        netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
        family: 'IPv6',
        mac: ''00:00:00:00:00:00',
        internal: true
      }],
      etho0: [{
        address: '192.168.1.108',
        netmask: '255.255.255.0',
        family: 'IPv4',
        mac: '01:02:03:0a:0b:0c',
        internal: false
      }, {
        address: 'fe80::a00:27ff:fe4e:66a1',
        netmask: 'ffff:ffff:ffff:ffff::',
        family: 'IPv6',
        mac: '01:02:03:0a:0b:0c',
        internal: false
      }]
    }

其中每一个描述对象包括：

1. `address`：绑定的IPv4或者IPv6的地址。
2. `netmask`：IPv4或者IPv6的子网掩码。
3. `family`：IPv4或者IPv6。
4. `mac`：这个网卡的MAC地址。
5. `internal`：如果这个网卡是Loopback接口或者外部不能访问的接口，为`true`，否则为`false`。
6. `scopeid`：只有`family`是IPv6的时候才有效，声明IPv6的scope ID。

通过这个方法能获取到机器上所有网卡的相关地址信息，例如编写一个获取机器上一个外部IP地址的方法：

    exports.getAddress = () => {
      var address = '0.0.0.0'
      Object.keys(ifaces).forEach(ifname => {
        ifaces[ifname].forEach(iface => {
          if ('IPv4' != iface.family || iface.internal != false) return
          address = iface.address
          return false
        })
      })
      return address
    }
