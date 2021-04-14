// pages/history/history.js
const app = getApp();
const db = wx.cloud.database(); // 初始化数据库


Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [], // 浏览过的电影
    isLogin: false, //登录状态
  },

  // 获取用户浏览记录
  getHistory: function () {
    let that = this;
    db.collection('history').get({
      success(res) {
        console.log("用户浏览记录请求成功", res.data);
        let movieList = res.data;
        that.setData({
          historyList: movieList
        })
        console.log("用户浏览记录：", that.data.historyList);
      },
      fail(res) {
        console.log("用户浏览记录请求失败", res);
      }
    })
  },

  // 跳转详情页
  gotodetail: function (event) {
    wx.navigateTo({
      url: `../detail/detail?movieid=${event.currentTarget.dataset.movieid}`,
    });
  },

  // 删除浏览记录
  deleteHistory: function (event) {
    // for (let i = 0; i < this.data.recordid.length; i++) {
    // }
    db.collection('history')
      .doc(event.currentTarget.dataset.recordid)
      .remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          });
          this.getHistory();
        },
        fail: err => {
          wx.showToast({
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
  },

  // 返回登录页面
  getBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.logged) {
      this.setData({
        isLogin: true,
      })
      this.getHistory();
    }
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