## 项目介绍
该项目是一个电商后台管理系统,基于Vue+Ant design vue框架实现商品、订单、营销、权限四个模块的功能
## 项目演示截图
1.首页
![image](https://github.com/Mikyyz/vue_admin/blob/master/src/assets/images/WX20210413-174350%402x.png)
2.商品
![image](https://github.com/Mikyyz/vue_admin/blob/master/src/assets/images/WX20210413-174408%402x.png)
3.订单
![image](https://github.com/Mikyyz/vue_admin/blob/master/src/assets/images/WX20210413-174428%402x.png)
4.营销
![image](https://github.com/Mikyyz/vue_admin/blob/master/src/assets/images/WX20210413-174445%402x.png)
5.权限
![image](https://github.com/Mikyyz/vue_admin/blob/master/src/assets/images/WX20210413-174502%402x.png)
## 技术选型

<table>
  <tr>
    <th text-align="center" width="200px">技术</th>
    <th text-align="center" width="200px">说明</th>
    <th text-align="center" width="400px">官网地址</th>
  </tr>
  <tr text-align="center">
      <td>Vue</td>
      <td>前端框架</td>
      <td><a href="https://vuejs.org/">https://vuejs.org</a></td>
  </tr>
  <tr text-align="center">
      <td>Vue-router</td>
      <td>路由管理器</td>
      <td><a href="https://router.vuejs.org/">https://router.vuejs.org</a></td>
  </tr>
  <tr text-align="center">
      <td>Vuex</td>
      <td>全局状态管理库</td>
      <td><a href="https://vuex.vuejs.org/">https://vuex.vuejs.org</a></td>
  </tr>
    <tr text-align="center">
      <td>Ant Design Vue</td>
      <td>前端UI框架</td>
      <td><a href="https://antdv.com/">https://antdv.com</a></td>
  </tr>
  </tr>
    <tr text-align="center">
      <td>Axios</td>
      <td>HTTP请求库</td>
      <td><a href="https://github.com/axios/axios">https://github.com/axios/axios</a></td>
  </tr>
  </tr>
    <tr text-align="center">
      <td>viser-vue</td>
      <td>数据可视化图表框架</td>
      <td><a href="https://viserjs.github.io/">https://viserjs.github.io</a></td>
  </tr>
  </tr>
    <tr text-align="center">
      <td>vue-cli</td>
      <td>项目脚手架</td>
      <td><a href="https://cli.vuejs.org/zh/">https://cli.vuejs.org/zh</a></td>
  </tr>
</table>

## 项目布局
```
src -- 源码目录
├── api -- axios网络请求定义
├── assets -- 静态图片资源文件
├── components -- 通用组件封装
├── icons -- svg矢量图片文件
├── router -- vue-router路由配置
├── store -- vuex的状态管理
├── utils -- 工具类
└── views -- 前端页面
    ├── home -- 首页
    ├── layout -- 通用页面加载框架
    ├── user -- 登录页
    ├── oms -- 订单模块页面
    ├── pms -- 商品模块页面
    └── sms -- 营销模块页面
    └── ums -- 权限模块页面
```

