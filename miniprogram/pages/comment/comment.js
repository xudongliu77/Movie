// pages/comment/comment.js
const app = getApp();
const db = wx.cloud.database(); // 初始化数据库

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleArr: [], // 评价过的电影名称
    isLogin: false,
  },

  getComment: function () {
    let that = this;
    let movieArr = [];
    db.collection('comment').get({
      success(res) {
        console.log("用户评论信息请求成功", res.data);
        let movieList = res.data;
        // console.log(movieList);
        for (let i = 0; i < movieList.length; i++) {
          movieArr.push(movieList[i].movie);
        }
        // console.log(movieArr);
        that.setData({
          titleArr: movieArr,
        });
        console.log(that.data.titleArr);
      },
      fail(res) {
        console.log("用户评论信息请求失败", res);
      }
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
      this.getComment();
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