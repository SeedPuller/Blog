module.exports = {
  pathPrefix: '',
  siteUrl: 'https://seedpuller.ir',
  siteTitle: 'سیدپولر',
  siteDescription: 'بلاگ شخصی سیدپولر',
  author: 'سیدپولر',
  postsForArchivePage: 3,
  defaultLanguage: 'fa',
  keywords: [
    'برنامه نویسی',
    'سیدپولر',
    'سی++',
    'سی پلاس پلاس',
    'نرم‌افزار',
    'نرم افزار آزاد',
  ],
  pages: {
    home: '/',
    blog: 'blog',
    contact: 'contact',
    resume: 'resume',
    tag: 'tags',
  },
  social: {
    github: 'https://github.com/SeedPuller/',
    telegram: 'https://t.me/SeedPuller/',
    email: "mailto:SeedPuller@gmail.com",
    rss: '/rss.xml',
  },
  contactFormUrl: process.env.CONTACT_FORM_ENDPOINT || '',
  quotesUrl:
    'https://api-ap-northeast-1.graphcms.com/v2/ckqqqyrwm3gpd01xx4ndnh00q/master',
  quotesToken: process.env.QUOTES_TOKEN || '',
  tags: {
    cplusplus: {
      name: 'سی‌پلاس‌پلاس',
      description:
        'مطالب و نکاتی که راجع به برنامه‌نویسی سی++ یاد می‌گیرم',
      color: '#e97878',
    },
    society: {
      name: 'جامعه',
      description:
        'تفکرات و نظرات من در مورد مسائل اجتماعی و فردی',
      color: '#000000',
    },
    os: {
      name: 'معماری کامپیوتر و سیستم‌عامل',
      description:
      'هر چیزی که درباره معماری کامپیوتر و سیستم عامل می‌خونم',
      color: '#351f39',
    },
    notes: {
      name: 'یادداشت های بداهه',
      description:
       'یادداشت‌هایی که طی اونها چشم هام رو می‌بندم و فقط انگشتانم رو روی کیبورد حرکت می‌دم',
      color: '#ffc764',
    },
  },
}
