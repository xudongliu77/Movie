// pages/collection/collection.js
const app = getApp();
const db = wx.cloud.database(); // 初始化数据库

Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleArr: [], // 收藏的电影名称
    idArr: [], // 收藏的电影ID
    isLogin: false, //登录状态
  },

  // 获取用户收藏信息
  getCollection: function () {
    let that = this;
    let movieArr = [];
    let movieidArr = [];
    db.collection('collection').get({
      success(res) {
        console.log("用户收藏信息请求成功", res.data);
        let movieList = res.data;
        // console.log(movieList);
        for (let i = 0; i < movieList.length; i++) {
          movieArr.push(movieList[i].movie);
          movieidArr.push(movieList[i].movieid);
        }
        // console.log(movieArr);
        that.setData({
          titleArr: movieArr,
          idArr: movieidArr,
        });
        console.log(that.data.titleArr);
        console.log(that.data.idArr);
      },
      fail(res) {
        console.log("用户收藏信息请求失败", res);
      }
    })
  },

  // 跳转详情页
  gotodetail: function (event) {
    wx.navigateTo({
      url: `../detail/detail?movieid=${event.currentTarget.dataset.movieid}`,
    });
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
      this.getCollection();
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