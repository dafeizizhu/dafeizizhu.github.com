var Logo = React.createClass({
  render: function () {
    var items = []
    var maskColor = this.props.maskColor || 'white'
    for (var i = 0, length = this.props.count; i < length; i++) {
      items.push(
        <div key={i} style={{
          height: this.props.itemWidth,
          width: this.props.width * 2,
          backgroundColor: this.props.itemColor,
          position: 'absolute',
          top: (this.props.width - this.props.itemWidth) / 2 + 'px',
          left: '-' + (this.props.width / 2) + 'px',
          boxSizing: 'border-box',
          border: '7px solid ' + maskColor,
          transform: 'rotate(' + (360 / this.props.count * i) + 'deg) translateY(-' + (this.props.width / 2) + 'px)'
        }}>
          {i}
        </div>
      )
    }
    var maskWidth = this.props.width
    return (
      <div style={{
        width: this.props.width,
        height: this.props.width,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: maskColor
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          border: maskWidth + 'px solid ' + maskColor,
          position: 'absolute',
          zIndex: '1',
          borderRadius: '50%',
          left: '-' + maskWidth + 'px',
          top: '-' + maskWidth + 'px'
        }}></div>
        {items}
      </div>
    )
  }
})
