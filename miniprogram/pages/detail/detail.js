// pages/comment/comment.js
const db = wx.cloud.database(); // 初始化数据库

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}, // 电影详情
    movieId: -1,
    movie: '', // 电影名称
    active: 0, // 标签页
    isFolded: false,
    isHide: false,
    recordid: '', // 记录_id
    isCollect: false, // 收藏状态
    activeNames: [],
    comments: [{
        url: '../../images/default.png',
        name: '匿名用户',
        rate: '4',
        comment: '这是一条评价！',
        date: '2021-01-20 17:55:46',
      },
      {
        url: '../../images/default.png',
        name: '匿名用户',
        rate: '4',
        comment: '这是一条评价！',
        date: '2021-01-20 17:55:46',
      },
      {
        url: '../../images/default.png',
        name: '匿名用户',
        rate: '4',
        comment: '这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！',
        date: '2021-01-20 17:55:46',
      },
      {
        url: '../../images/default.png',
        name: '匿名用户',
        rate: '4',
        comment: '这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！这是一条评价！',
        date: '2021-01-20 17:55:46',
      },
      {
        url: '../../images/default.png',
        name: '匿名用户',
        rate: '4',
        comment: '这是一条评价！',
        date: '2021-01-20 17:55:46',
      }
    ],
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  Fold: function (e) {
    this.setData({
      isFolded: !this.data.isFolded,
    })
    // console.log("click");
  },

  // 是否显示 展开 收起
  onFold: function (e) {
    var query = this.createSelectorQuery();
    query.select('#content').boundingClientRect(rect => {
      // let height = rect.height;
      // console.log('content.height = ' + height);
    });
    query.select('#frame').boundingClientRect(rect => {
      // let height = rect.height;
      // console.log('frame.height = ' + height);
    });
    query.exec(res => {
      // console.log(res[0].height);
      // console.log(res[1].height);
      if (res[0] && res[0].height) {
        if (res[0].height > res[1].height) {
          this.setData({
            isHide: true,
          });
          // console.log(this.data.isHide);
        } else {
          this.setData({
            isHide: false,
          });
          // console.log(this.data.isHide);
        }
      }
    })
  },

  // 复制按钮
  copyBtn: function () {
    wx.setClipboardData({
      data: this.data.detail.trailer.sharing_url,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log('复制成功') // data
          }
        })
      }
    })
  },

  // 查询收藏集合记录
  search: function () {
    db.collection('collection').where({
      movieid: this.data.movieId,
    }).get().then(res => {
      // console.log(res);
      if (res.data.length > 0) {
        this.setData({
          recordid: res.data[0]._id
        })
        // console.log(this.data.recordid);
        this.setData({
          isCollect: true
        })
      }
    }).catch(err => {
      console.log(err);
    })
  },

  // 历史记录
  onHistory: function () {
    db.collection('history').where({
      movieid: this.data.movieId,
    }).get().then(res => {
      // console.log(res);
      if (res.data.length > 0) {
        console.log("记录已插入,不重复添加");
      } else {
        db.collection('history').add({
          data: {
            movieid: this.data.movieId,
            movie: this.data.movie,
          }
        }).then(res => {
          console.log("添加浏览记录成功", res);
        }).catch(err => {
          console.log("添加浏览记录失败", err);
        })
      }
    }).catch(err => {
      console.log(err);
    })
  },

  // 收藏
  onCollect: function () {
    db.collection('collection').add({
      data: {
        movieid: this.data.movieId,
        movie: this.data.movie,
      }
    }).then(res => {
      wx.showToast({
        title: '收藏成功',
      })
      /* this.setData({
        isCollect: true
      }) */
      this.search();
    }).catch(err => {
      wx.showToast({
        title: '收藏失败',
      })
    })
  },

  // 取消收藏
  cancelCollect: function () {
    db.collection('collection')
      .doc(this.data.recordid)
      .remove({
        success: res => {
          wx.showToast({
            title: '已取消收藏',
          })
          this.setData({
            isCollect: false
          })
        },
        fail: err => {
          wx.showToast({
            title: '取消收藏失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
  },

  // 跳转 写评价 页面
  gotoRate: function () {
    wx.navigateTo({
      url: `../rate/rate?movieid=${this.data.movieId}&movie=${this.data.movie}`,
    });
  },

  // 获取电影详情
  getDetail: function () {
    wx.showLoading({
      title: '加载中',
    })

    wx.cloud.callFunction({
        name: 'getDetail',
        data: {
          movieid: this.data.movieId
        }
      })
      .then(res => {
        //console.log(res);
        this.setData({
          detail: res.result,
          movie: res.result.title,
        });
        this.onHistory();
        this.onFold();
        wx.hideLoading();
      }).catch(err => {
        console.error(err);
        wx.hideLoading();
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieId: options.movieid,
    });
    console.log(options);
    this.search();
    this.getDetail();
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