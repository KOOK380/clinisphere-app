export interface Instructor {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  image: string;
  createdAt?: string;
  courses?: Course[];
}

export interface Course {
  id: number;
  title_en: string;
  title_fr: string;
  title: string; // Keep for backward compatibility or simple use cases
  slug: string;
  shortDescription_en: string;
  shortDescription_fr: string;
  shortDescription: string;
  fullDescription_en: string;
  fullDescription_fr: string;
  fullDescription: string;
  price: number;
  discountPrice?: number;
  currency?: string;
  thumbnail: string;
  previewVideo?: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructorId: number;
  instructorName?: string;
  instructorImage?: string;
  instructorSpecialty?: string;
  duration?: string;
  totalLessons?: number;
  language?: string;
  tags?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  modules?: Module[];
}

export interface Module {
  id: number;
  courseId: number;
  title: string;
  title_en?: string;
  title_fr?: string;
  order: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  title_en?: string;
  title_fr?: string;
  description?: string;
  description_en?: string;
  description_fr?: string;
  videoUrl?: string;
  content?: string;
  duration?: string;
  isFreePreview?: boolean;
  order: number;
}

export interface AppSettings {
  currencyCode: string;
  currencySymbol: string;
  currencyPosition: "left" | "right";
  headerLogo: string;
  footerLogo: string;
  logoLink: string;
  sliderButton1Text: string;
  sliderButton1Link: string;
  sliderButton1Enabled: boolean;
  sliderButton2Text: string;
  sliderButton2Link: string;
  sliderButton2Enabled: boolean;
  // Storage settings
  storage_provider?: 'supabase' | 's3' | 'bunny' | 'gcs' | 'backblaze';
  s3_access_key?: string;
  s3_secret_key?: string;
  s3_region?: string;
  s3_bucket?: string;
  s3_endpoint?: string;
  s3_custom_url?: string;
  b2_key_id?: string;
  b2_application_key?: string;
  b2_bucket?: string;
  b2_endpoint?: string;
  bunny_storage_zone?: string;
  bunny_api_key?: string;
  bunny_pull_zone_url?: string;
  gcs_bucket?: string;
  gcs_project_id?: string;
  gcs_credentials?: string;
  // API details
  supabase_url?: string;
  supabase_anon_key?: string;
  jwt_secret?: string;
  gemini_api_key?: string;
  // Social Media
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  // SMTP settings
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  smtp_secure?: boolean;
  smtp_from?: string;
  smtp_admin?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  footer_desc?: string;
  footer_copyright?: string;
  privacy_url?: string;
  terms_url?: string;
  privacy_html?: string;
  terms_html?: string;
  floating_chat_enabled?: boolean;
  floating_chat_icon?: 'whatsapp' | 'messenger' | 'telegram' | 'custom';
  floating_chat_url?: string;
  floating_chat_custom_icon?: string;
  _envStatus?: {
    supabase_url: boolean;
    supabase_anon_key: boolean;
    jwt_secret: boolean;
    gemini_api_key: boolean;
    s3_access: boolean;
    gcs_project: boolean;
    bunny_key: boolean;
    b2_access: boolean;
    chargily_test_secret_key?: boolean;
    chargily_test_public_key?: boolean;
    chargily_live_secret_key?: boolean;
    chargily_live_public_key?: boolean;
  };
  chargilySecretKey?: string;
  chargilyPublicKey?: string;
  chargily_mode?: 'test' | 'live';
  chargily_test_secret_key?: string;
  chargily_test_public_key?: string;
  chargily_live_secret_key?: string;
  chargily_live_public_key?: string;
}

export interface SliderItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  isActive: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Event {
  id: number;
  title_en: string;
  title_fr: string;
  title?: string;
  description_en: string;
  description_fr: string;
  description?: string;
  eventDate: string;
  location: string;
  type: 'free' | 'paid';
  price: number;
  banner: string;
  status: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

export interface Article {
  id: number;
  title_en: string;
  title_fr: string;
  title: string;
  slug: string;
  excerpt_en: string;
  excerpt_fr: string;
  excerpt: string;
  content_en: string;
  content_fr: string;
  content: string;
  image: string;
  author: string;
  category: string;
  status: 'draft' | 'published';
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Course {
  quantity: number;
}
