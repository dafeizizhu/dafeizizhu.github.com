$(function () {
  function success(position) {
    var str = '您当前的位置，纬度：' + position.coords.latitude + '，经度：' + position.coords.longitude
    $('#geoloc').html(str)

    // draw a google map
    var $mapCanvas = $('#map_canvas')
    $mapCanvas.height(400)
    $mapCanvas.width(560)

    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
    var options = {
      zoom: 15,
      center: latlng,
      mapTypeControl: false,
      navigationControlOptions: {
        style: google.maps.NavigationControlStyle.SMALL
      },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map($('#map_canvas')[0], options)
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: '您在这里！'
    })

    var baiduMap = new BMap.Map('baidu_map_canvas')
    baiduMap.centerAndZoom(new BMap.Point(position.coords.longitude, position.coords.latitude), 11)
    baiduMap.addControl(new BMap.MapTypeControl())
    baiduMap.setCurrentCity('广州')
    baiduMap.enableScrollWheelZoom(true)
    var baiduMarker = new BMap.Marker(new BMap.Point(position.coords.longitude, position.coords.latitude))
    baiduMap.addOverlay(baiduMarker)
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      success(position)
    }, function (err) {
      $('#geoloc').html(err.code + '<br/>' + err.message)
    })
  } else {
    $('#geoloc').html('您当前使用的浏览器不支持Geolocation服务')
  }
})
