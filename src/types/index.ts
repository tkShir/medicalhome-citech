export interface Facility {
  id: string
  slug: string
  name: string
  address: string
  status: 'open' | 'coming_soon'
  openDate?: string
  description?: string
  imageUrl?: string
  googleMapsUrl?: string
  minnanoKaigoUrl?: string
  jobMedleyUrl?: string
}

export interface JobListing {
  id: string
  facilityId: string
  facilityName: string
  title: string
  jobType: string
  employmentType: string
  salaryMin: number
  salaryMax: number
  description: string
  requirements?: string
}

export interface NewsPost {
  id: string
  title: string
  excerpt: string
  content: string
  publishedAt: string
  category: string
  imageUrl?: string
  slug: string
}

export interface ContactFormData {
  lastName: string
  firstName: string
  email: string
  jobTitle?: string
  company?: string
  message: string
  agreedToPrivacyPolicy: boolean
}

export interface RecruitFormData {
  lastName: string
  firstName: string
  email: string
  phone: string
  jobType: string
  facilityId: string
  message?: string
  agreedToPrivacyPolicy: boolean
}
