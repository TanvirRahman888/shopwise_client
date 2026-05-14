export interface Slider {
  _id: string;
  title: string;
  subtitle?: string;
  offerText?: string;
  buttonText: string;
  link: string;
  image: string;
  mobileImage?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SlidersResponse {
  success: boolean;
  count: number;
  sliders: Slider[];
}