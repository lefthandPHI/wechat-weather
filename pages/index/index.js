
// 格式化日期
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // 更新当前日期
      today:util.formatTime(new Date()).split(' ')[0]
    });
    var self = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res){
        wx.request({
          // 百度地图API
          url: 'http://api.map.baidu.com/geocoder/v2/' +
          '?ak=ASAT5N3tnHIa4APW0SNPeXN5&location=' +
          res.latitude + ',' + res.longitude + '&output=json&pois=0',
          data: {},
          header: {
            'Content-Type': 'application/json'
          },
          success: function(res){
            // 城市名称
            var city = res.data.result.addressComponent.city.replace('市','');
            // 查询指定城市的天气信息
            self.searchWeather(city);
          }
        })
      }
    })
  },

  // 根据城市名称查询天气预报信息
  searchWeather:function(cityName){
    var self = this;
    wx.request({
      //中华万年历天气预报查询接口
      url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + cityName,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res){
        //无此城市
        if(res.data.status == 1002){
          //显示错误信息
          wx.showModal({
            title: '提示',
            content: '输入的城市名称有误，请重新输入！',
            showCancel: false,
            success: function(res){
              self.setData({inputCity:''});
            }
          })
        }else{
          var weather = res.data.data; //获取天气数据
          for(var i = 0; i < weather.forecast.length; i++){
            var d = weather.forecast[i].date;
            //处理日期信息，添加空格
            weather.forecast[i].date = ' ' + d.replace('星期',' 星期');
          }
          self.setData({
            city:cityName,   //更新显示城市名称
            weather:weather, //更新天气信息 
            inputCity:''     //清空查询输入框
          })
        }  

      }
    })
  },

  //输入事件
  inputing:function(e){
    this.setData({inputCity:e.detail.value});
  },

  //搜索按钮
  bindSearch:function(){
    this.searchWeather(this.data.inputCity);
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