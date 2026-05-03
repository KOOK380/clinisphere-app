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
  title: string;
  slug: string;
  shortDescription: string;
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
  order: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  videoUrl?: string;
  content?: string;
  duration?: string;
  isFreePreview: boolean;
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

export interface CartItem extends Course {
  quantity: number;
}
