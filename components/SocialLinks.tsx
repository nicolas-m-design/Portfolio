import { AboutMe } from '@/types'

interface SocialLinksProps {
  aboutMe: AboutMe
}

export default function SocialLinks({ aboutMe }: SocialLinksProps) {
  const { metadata } = aboutMe

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/nicolasstanleymenard',
      showText: true,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Resume',
      url: metadata?.resume_cv?.url || metadata?.resume_cv?.imgix_url,
      showText: true,
      isDownload: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'Dribbble',
      url: metadata?.dribbble_url,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10c5.51 0 10-4.48 10-10S15.51 0 10 0zM6.29 7.38C7.53 6.07 9.18 5.3 10 5.3c.82 0 2.47.77 3.71 2.08A8.343 8.343 0 0110 6.09c-.82 0-2.47.77-3.71 2.09-.46.5-.85 1.05-1.17 1.64.17-.46.37-.9.61-1.33.24-.43.52-.84.85-1.21zm-2.11 5.73c-.46-.5-.85-1.05-1.17-1.64-.32-.59-.58-1.22-.76-1.87C2.84 10.17 3.2 11.18 3.79 12c.35.49.74.94 1.17 1.33.24-.43.52-.84.85-1.21.17-.19.36-.37.56-.53zm3.64 3.64c-.35-.49-.74-.94-1.17-1.33-.24.43-.52.84-.85 1.21-.24.43-.37.9-.61 1.33.32.59.58 1.22.76 1.87C6.69 18.16 7.53 17.38 7.82 16.75z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Behance',
      url: metadata?.behance_url,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.12 5.53h3.28v-.92h-3.28v.92zM15.84 8.91c.48 0 .89.17 1.23.5.34.34.51.75.51 1.23 0 .48-.17.89-.51 1.23-.34.34-.75.5-1.23.5-.48 0-.89-.17-1.23-.5-.34-.34-.5-.75-.5-1.23 0-.48.17-.89.5-1.23.34-.33.75-.5 1.23-.5z"/>
          <path d="M20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10 10-4.48 10-10zM8.84 13.54H4.25V6.46h4.59v1.29H5.71v1.24h2.72v1.29H5.71v1.97h3.13v1.29zm7.95-2.23c0 1.14-.39 2.06-1.18 2.76-.79.7-1.77 1.05-2.95 1.05s-2.16-.35-2.95-1.05c-.79-.7-1.18-1.62-1.18-2.76s.39-2.06 1.18-2.76c.79-.7 1.77-1.05 2.95-1.05s2.16.35 2.95 1.05c.79.7 1.18 1.62 1.18 2.76z"/>
        </svg>
      )
    },
    {
      name: 'Portfolio',
      url: metadata?.portfolio_website,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9a9 9 0 00-9 9m0 0a9 9 0 019-9" />
        </svg>
      )
    }
  ]

  return (
    <div className="flex flex-col md:flex-row md:flex-wrap items-center md:items-start gap-4" role="list" aria-label="Social media links">
      {socialLinks
        .filter(link => link.url)
        .map((link) => (
          <div key={link.name} role="listitem" className={link.showText ? 'w-full md:w-auto' : ''}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              {...(link.isDownload && { download: true })}
              className={`${
                link.showText 
                  ? 'w-full md:w-auto inline-flex items-center justify-center space-x-3 px-4 py-3 bg-gray-100 hover:bg-primary-600 text-gray-600 hover:text-white rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
                  : 'w-10 h-10 bg-gray-100 hover:bg-primary-600 text-gray-600 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
              }`}
              aria-label={`${link.isDownload ? 'Download' : 'Visit'} ${link.name} ${link.isDownload ? '' : 'profile'} (opens in new tab)`}
            >
              <span aria-hidden="true">
                {link.icon}
              </span>
              {link.showText && (
                <span className="font-medium">
                  {link.isDownload ? `Download ${link.name}` : `Connect on ${link.name}`}
                </span>
              )}
            </a>
          </div>
        ))}
    </div>
  )
}