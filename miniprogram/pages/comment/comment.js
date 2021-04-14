// pages/comment/comment.js
const app = getApp();
const db = wx.cloud.database(); // 初始化数据库

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // titleArr: [], // 评价过的电影名称
    commentList: [], // 评价列表
    isLogin: false, // 登录状态
  },

  // 获取用户评价信息
  getComment: function () {
    let that = this;
    // let movieArr = [];
    db.collection('comment').get({
      success(res) {
        console.log("用户评论信息请求成功", res.data);
        let movieList = res.data;
        that.setData({
          commentList: movieList
        });
        console.log("评价列表", that.data.commentList);
        // console.log(movieList);
        /* for (let i = 0; i < movieList.length; i++) {
          movieArr.push(movieList[i].movie);
        } */
        // console.log(movieArr);
        /* that.setData({
          titleArr: movieArr,
        });
        console.log(that.data.titleArr); */
      },
      fail(res) {
        console.log("用户评论信息请求失败", res);
      }
    })
  },

  // 返回登录页面
  getBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  // 修改评价
  gotoCotent: function (event) {
    wx.navigateTo({
      url: `../modifyComment/modifyComment?recordid=${event.currentTarget.dataset.recordid}`,
    });
  },

  // 删除评价
  deleteComment: function (event) {
    // for (let i = 0; i < this.data.recordid.length; i++) {
    // }
    db.collection('comment')
      .doc(event.currentTarget.dataset.recordid)
      .remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          });
          this.getComment();
        },
        fail: err => {
          wx.showToast({
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
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
    this.getComment();
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