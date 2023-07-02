// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Leo Site',
  tagline: '人间一趟，积极向上，不念过往，不惧未来',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://slshsl.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'personal', // Usually your GitHub org/user name.
  projectName: 'leo blog', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans','en'],
    localeConfigs: {
      en: {
        htmlLang: 'en-GB',
      }
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Leo Site',
        logo: {
          alt: 'Leo Site Logo',
          src: 'img/avatar.jpg',
          style: {borderRadius: '50%'},
        },
        items: [ 
          {
            type: 'docSidebar',
            sidebarId: 'informalEssay',
            position: 'left',
            label: '随笔',
          },         
          {to: '/blog', label: '文章', position: 'left'},         
          {
            href: 'https://github.com/slshsl',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '写作',
            items: [
              {
                label: '随笔',
                to: '/docs/a-front-end',
              },
              {
                label: '文章',
                to: '/blog',
              },
            ],
          },
          {
            title: '社区',
            items: [
              {
                label: '稀土掘金',
                href: 'https://juejin.cn/user/1878406966296791/posts',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/slshsl',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Leo Site, Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      mermaid: {
        theme: {light: 'neutral', dark: 'forest'},
      },
    }),
      
  markdown: {
    mermaid: true,
  },
  
  themes: ['@docusaurus/theme-mermaid'],
};

module.exports = config;
