// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movielist: [],
  },

  getMovielist: function () {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'movielist',
      data: {
        start: this.data.movielist.length,
        count: 10
      }
    }).then(res => {
      //  console.log(res);
      this.setData({
        movielist: this.data.movielist.concat(res.result.subject_collection_items)
      })
      wx.hideLoading();
    }).catch(err => {
      console.error(err);
      wx.hideLoading();
    });
  },
  gotodetail: function (event) {
    wx.navigateTo({
      url: `../detail/detail?movieid=${event.currentTarget.dataset.movieid}`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovielist();
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
    wx.showNavigationBarLoading();
    //要刷新请求服务器的方法
    this.getMovielist();
    //隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    //停止下拉事件
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMovielist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})