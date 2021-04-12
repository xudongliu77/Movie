// pages/profile/profile.js
const app = getApp();
const db = wx.cloud.database(); // 初始化数据库

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    hasUserInfo: false,
    isLogin: false, //登录状态
    // openid: '',
  },

  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          isLogin: true,
        });
        app.globalData.logged = true;
        // console.log(app.globalData.logged);
        console.log(res.userInfo);
        // this.getOpenId();
      }
    })
  },

  // 获取用户openid
  getOpenId: function () {
    wx.cloud.callFunction({
        name: 'login',
        data: {}
      })
      .then(res => {
        // console.log(res);
        this.setData({
          openid: res.result.openid,
        });
        // console.log(this.data.openid);
      }).catch(err => {
        console.error(err);
      });
  },

  // 跳转 我的收藏 页面
  gotoCollection: function () {
    wx.navigateTo({
      url: `../collection/collection`,
    });
  },

  // 跳转 我的评价 页面
  gotoComment: function () {
    wx.navigateTo({
      url: `../comment/comment`,
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})