export default [
  {
    context: [
      '/leos-pilot/api',
      '/leos-pilot/js/editor/core/templates',
      '/leos-pilot-cn/api',
      '/leos-pilot-cn/js/editor/core/templates',
    ],
    target: 'http://localhost:8080',
    secure: false,
  },
  {
    context: ['/leos-pilot/api/ws', '/leos-pilot-cn/api/ws'],
    target: 'http://localhost:8080',
    secure: false,
    ws: true,
  },
];
