/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.careerquill.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    ],
    additionalSitemaps: [],
  },
};
