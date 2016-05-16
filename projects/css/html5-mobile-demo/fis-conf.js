fis.config.set('project.fileType.image', [ 'eot', 'ttf', 'svg' ]);
fis.config.set('roadmap.path', [{
  reg: '*.eot',
  release: '/projects/css/html5-mobile-demo/output/$&'
}, {
  reg: '*.ttf',
  release: '/projects/css/html5-mobile-demo/output/$&'
}, {
  reg: '*.woff',
  release: '/projects/css/html5-mobile-demo/output/$&'
}])
