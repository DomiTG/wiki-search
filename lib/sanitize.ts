// Sanitize and rewrite Wikipedia HTML for game use
export function rewriteArticleLinks(html: string): string {
  return html
    .replace(/<span[^>]*class="[^"]*mw-editsection[^"]*"[^>]*>.*?<\/span>/gs, '')
    .replace(/<span[^>]*class="[^"]*external[^"]*"[^>]*>.*?<\/span>/gs, '')
    .replace(/<sup[^>]*class="[^"]*noprint[^"]*"[^>]*>.*?<\/sup>/gs, '')
    .replace(/href="\/wiki\/([^"#]+)(?:#[^"]*)?"/g, (_match, article) => {
      if (
        article.startsWith('Special:') ||
        article.startsWith('File:') ||
        article.startsWith('Category:') ||
        article.startsWith('Talk:') ||
        article.startsWith('User:') ||
        article.startsWith('Wikipedia:') ||
        article.startsWith('Help:') ||
        article.startsWith('Portal:') ||
        article.startsWith('Template:') ||
        article.startsWith('MediaWiki:')
      ) {
        return 'href="#" data-blocked="true"';
      }
      return `href="#" data-wiki-article="${article}"`;
    })
    .replace(/href="(https?:\/\/[^"]*|\/\/[^"]*)"/g, 'href="#" data-external="true"');
}
