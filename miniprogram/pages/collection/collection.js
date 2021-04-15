// pages/collection/collection.js
const app = getApp();
const db = wx.cloud.database(); // 初始化数据库


Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList: [], // 收藏的电影列表
    // recordid: '', // 记录_id
    isLogin: false, // 登录状态
    aggregate: '', // 操作的集合
    openid: '',
  },

  // 获取用户收藏信息
  getCollection: function () {
    let that = this;
    db.collection('collection').get({
      success(res) {
        console.log("用户收藏信息请求成功", res.data);
        let movieList = res.data;
        that.setData({
          collectionList: movieList
        })
        console.log("收藏的电影列表 ", that.data.collectionList);
        /* let recordidArr = [];
        for (let i = 0; i < movieList.length; i++) {
          recordidArr.push(movieList[i]._id);
        }
        console.log(recordidArr);
        that.setData({
          recordid: recordidArr,
        }); */
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

  // 取消收藏
  cancelCollect: function (event) {
    // for (let i = 0; i < this.data.recordid.length; i++) {
    // }
    db.collection('collection')
      .doc(event.currentTarget.dataset.recordid)
      .remove({
        success: res => {
          wx.showToast({
            title: '取消成功',
          });
          this.getCollection();
        },
        fail: err => {
          wx.showToast({
            title: '取消失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
  },

  // 清空收藏记录
  batchDelete: function () {
    wx.cloud.callFunction({
        name: 'batchDelete',
        data: {
          aggregate: this.data.aggregate,
          openid: this.data.openid,
        }
      })
      .then(res => {
        console.log(res);
        wx.showToast({
          title: '已清空',
        })
        this.getCollection();
      }).catch(err => {
        console.error(err);
        wx.showToast({
          title: '清空失败',
        })
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
        aggregate: 'collection',
        openid: options.openid,
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
    this.getCollection();
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