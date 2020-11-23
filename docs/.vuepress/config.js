module.exports = {
    host: '0.0.0.0',
    port: 8080,
    title: 'Iris',
    description: "An express boilerplate",
    themeConfig:{
      nav: [
        { text: 'Concepts', link: '/concepts/' },
        { text: 'App structure', link: '/anatomy/' }
      ],
      displayAllHeaders: true,
      sidebar: {
        '/concepts/': [
          {
            title: 'Configuration',
            path: '/concepts/configuration',
            collapsable: false,
            children: [
              '/concepts/configuration/environments',
              '/concepts/configuration/standard'
            ]
          }
        ],
        '/anatomy/': [
          {
            title: 'App Structure',
            path: '/anatomy/',
            collapsable: false,
            children: [
              {
                title: '📁 bin',
                path: '/anatomy/bin',
                children: ['/anatomy/bin/www']
              },
              {
                title: '📁 config',
                path: '/anatomy/config',
                children: [
                  '/anatomy/config/env',
                  '/anatomy/config/customs'
                ]
              },
              {
                title: '📁 docs',
                path: '/anatomy/docs'
              },
              {
                title: '📄 app.js',
                path: '/anatomy/app'
              },
              {
                title: '📄 package.json',
                path: '/anatomy/package'
              }
            ]
          }
        ]
      }
    },
    plugins: [
      '@vuepress/active-header-links', {
        sidebarLinkSelector: '.sidebar-link',
        headerAnchorSelector: '.header-anchor'
      },
      'vuepress-plugin-nprogress',
      'vuepress-plugin-reading-time', {
        excludes: []
      }
    ]
}
