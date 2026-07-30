import { supabase } from '@/lib/supabase';

export interface Article {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  category: string;
  category_color?: string;
  categoryColor?: string;
  author_id?: string;
  author_name?: string;
  author_avatar?: string;
  author?: string;
  authorAvatar?: string;
  image_url?: string;
  image?: string;
  read_time?: string;
  readTime?: string;
  created_at?: string;
  date?: string;
  updated_at?: string;
}

/**
 * Fetches all public articles, ordered by created_at descending
 */
export const fetchPublicArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (
        full_name,
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch articles: ${error.message}`);
  }

  return (data || []).map((item: any) => {
    const profile = item.profiles;
    const authorName = item.author_name || profile?.full_name || profile?.username || 'محرر التقنية';
    const authorAvatar = item.author_avatar || profile?.avatar_url || 'https://i.pravatar.cc/150';

    const formattedDate = item.created_at
      ? new Date(item.created_at).toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'حديثاً';

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      content: item.content || '',
      category: item.category || 'عام',
      categoryColor: item.category_color || 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      category_color: item.category_color,
      author: authorName,
      author_name: authorName,
      authorAvatar,
      author_avatar: authorAvatar,
      image: item.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450',
      image_url: item.image_url,
      readTime: item.read_time || '5 دقائق',
      read_time: item.read_time,
      date: formattedDate,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  });
};

/**
 * Fetches articles authored by a specific user profile
 */
export const fetchArticlesByAuthor = async (authorId: string): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch articles for author ${authorId}: ${error.message}`);
  }

  return data || [];
};

/**
 * Creates a new article in Supabase
 */
export const createArticle = async (article: {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  category_color?: string;
  image_url?: string;
  read_time?: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
}): Promise<any> => {
  const { data, error } = await supabase
    .from('articles')
    .insert([
      {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        category_color: article.category_color || 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        image_url: article.image_url,
        read_time: article.read_time || '5 دقائق',
        author_id: article.author_id,
        author_name: article.author_name,
        author_avatar: article.author_avatar,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create article: ${error.message}`);
  }

  return data;
};

/**
 * Updates an existing article
 */
export const updateArticle = async (
  articleId: string,
  updates: Partial<Article>
): Promise<any> => {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', articleId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update article ${articleId}: ${error.message}`);
  }

  return data;
};

/**
 * Deletes an article
 */
export const deleteArticle = async (articleId: string): Promise<void> => {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', articleId);

  if (error) {
    throw new Error(`Failed to delete article ${articleId}: ${error.message}`);
  }
};
