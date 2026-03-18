import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHelmet from '../../components/SEOHelmet';
import { blogArticles, hindiBlogArticles } from './BlogData';
import { ChevronRight } from 'lucide-react';

export default function BlogArticleTemplate() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Search both English and Hindi arrays for the matching slug
    const foundArticle = 
      blogArticles.find(a => a.slug === slug) || 
      hindiBlogArticles.find(a => a.slug === slug);
    
    setArticle(foundArticle);
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen pt-[120px] flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <h1 className="text-2xl font-display text-[#1a1a1a]">Article Not Found</h1>
          <Link to="/blog" className="text-[#385040] hover:underline mt-4 inline-block">Return to Blog</Link>
        </div>
      </div>
    );
  }

  // Parse markdown-style content to basic HTML for rendering while maintaining strict design rules
  const renderContent = (content) => {
    return content.split('\\n').map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={index} />;
      
      if (trimmed.startsWith('# ')) {
        return <h1 key={index} className="text-3xl md:text-4xl lg:text-5xl font-display text-[#1a1a1a] mb-8">{trimmed.replace('# ', '')}</h1>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={index} className="text-2xl lg:text-3xl font-display text-[#1a1a1a] mt-12 mb-6">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-display text-[#1a1a1a] mt-8 mb-4">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('- ')) {
        // Strip out the strong tags for purely text parsing, relying on the base class system
        return <li key={index} className="text-[#4A4A4A] leading-relaxed ml-6 list-disc mb-2" dangerouslySetInnerHTML={{__html: trimmed.replace('- ', '').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')}} />;
      }
      if (trimmed.match(/^[0-9]+\\. /)) {
        return <li key={index} className="text-[#4A4A4A] leading-relaxed ml-6 list-decimal mb-2" dangerouslySetInnerHTML={{__html: trimmed.replace(/^[0-9]+\\. /, '').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')}} />;
      }
      
      return (
        <p key={index} className="text-lg text-[#4A4A4A] leading-relaxed mb-6" dangerouslySetInnerHTML={{__html: trimmed.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>').replace(/\\*(.*?)\\*/g, '<em>$1</em>')}} />
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <SEOHelmet 
        title={article.metaTitle}
        description={article.metaDescription}
        url={`https://www.chaiadda.co.in/blog/${article.slug}`}
        keywords={article.primaryKeyword}
        lang={article.lang}
        breadcrumbs={[
            { name: "Home", url: "https://www.chaiadda.co.in/" },
            { name: "Blog", url: "https://www.chaiadda.co.in/blog" },
            { name: article.title, url: `https://www.chaiadda.co.in/blog/${article.slug}` }
        ]}
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": article.title,
          "description": article.metaDescription,
          "author": {
            "@type": "Organization",
            "name": "Chai Adda",
            "url": "https://www.chaiadda.co.in"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Chai Adda",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.chaiadda.co.in/chailogo.png"
            }
          }
        }}
      />
      
      {/* Spacer to push content below standard fixed navbar */}
      <div className="pt-[140px] pb-12 max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Simple Breadcrumb to utilize existing brand colors */}
        <div className="flex items-center text-sm text-[#4A4A4A] mb-8 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-[#385040] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-[#C8A96E]" />
            <Link to="/blog" className="hover:text-[#385040] transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-[#C8A96E]" />
            <span className="text-[#385040] font-medium">{article.title}</span>
        </div>

        {/* Dynamic Content injected safely using exact existing Tailwind classes from base index.css definitions */}
        <article className="prose prose-lg max-w-none">
          {renderContent(article.content)}
        </article>
      </div>

    </div>
  );
}
