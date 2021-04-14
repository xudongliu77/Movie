// pages/modifyComment/modifyComment.js
const db = wx.cloud.database(); // 初始化数据库


Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '', // 评价的内容
    score: 5, // 评价的分数
    movieId: -1,
    movie: '', // 电影名称
    recordid: '', // 记录_id
  },

  // 获取评价记录
  getRecord: function () {
    let that = this;
    db.collection('comment').doc(this.data.recordid).get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log("用户评论信息请求成功", res.data);
        let recordArr = res.data;
        that.setData({
          content: recordArr.content, // 评价的内容
          score: recordArr.score, // 评价的分数
          movieId: recordArr.movieid,
          movie: recordArr.movie, // 电影名称
        })
      },
      fail(res) {
        console.log("用户评论信息请求失败", res);
      }
    })
  },

  // 修改评价
  modifyComment: function () {
    db.collection('comment').doc(this.data.recordid).update({
      data: {
        content: this.data.content, // 评价的内容
        score: this.data.score, // 评价的分数
      }
    }).then(res => {
      console.log(res);
      wx.showToast({
        title: '修改成功',
      })
    }).catch(err => {
      console.log(err);
      wx.showToast({
        title: '修改失败',
      })
    })
  },

  onContentChange: function (event) {
    this.setData({
      content: event.detail
    });
  },

  onScoreChange: function (event) {
    this.setData({
      score: event.detail
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      recordid: options.recordid
    });
    this.getRecord();
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