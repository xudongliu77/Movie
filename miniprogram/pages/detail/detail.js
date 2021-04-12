// pages/comment/comment.js
const db = wx.cloud.database(); // 初始化数据库

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}, // 电影详情
    content: '', // 评价的内容
    score: 5, // 评价的分数
    images: [], // 上传的图片
    fileIds: [],
    movieId: -1,
    movie: '', // 电影名称
    active: 0, // 标签页
    isFolded: false,
    isHide: false,
    recordid: '', // 记录_id
    isCollect: false, // 收藏状态
    activeNames: [],
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

  submit: function () {
    wx.showLoading({
      title: '提交中',
    })
    console.log(this.data.content, this.data.score);

    // 上传图片到云存储
    let promiseArr = [];
    for (let i = 0; i < this.data.images.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            this.setData({
              fileIds: this.data.fileIds.concat(res.fileID)
            });
            reslove();
          },
          fail: console.error
        })
      }));
    }

    Promise.all(promiseArr).then(res => {
      // 插入数据
      db.collection('comment').add({
        data: {
          content: this.data.content,
          score: this.data.score,
          movieid: this.data.movieId,
          movie: this.data.movie,
          fileIds: this.data.fileIds
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
        })
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '提交失败',
        })
      })

    });

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

  uploadImg: function () {
    // 选择图片
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        this.setData({
          images: this.data.images.concat(tempFilePaths)
        });
      }
    })
  },

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

  // 查询数据库记录
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
      this.setData({
        isCollect: true
      })
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
            title: '取消收藏成功',
          })
          this.setData({
            isCollect: false
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '取消收藏失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
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

    wx.showLoading({
      title: '加载中',
    })

    wx.cloud.callFunction({
        name: 'getDetail',
        data: {
          movieid: options.movieid
        }
      })
      .then(res => {
        //console.log(res);
        this.setData({
          detail: res.result,
          movie: res.result.title,
        });
        this.onFold();
        wx.hideLoading();
      }).catch(err => {
        console.error(err);
        wx.hideLoading();
      });
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