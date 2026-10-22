/*
 * Central list of projects. Add a new one by adding an object to PROJECTS.
 * Only fill in fields you can stand behind: anything left out is simply hidden,
 * and cards without an overview show "More details coming soon".
 */

export const PROJECT_CATEGORIES = ['All', 'Web Development', 'Applications'] as const

export type ProjectCategory = Exclude<(typeof PROJECT_CATEGORIES)[number], 'All'>

export type Project = {
  id: string
  name: string
  tagline?: string
  year?: number
  type: string
  category: ProjectCategory
  status?: 'Completed' | 'Work in progress'
  overview?: string
  problem?: string
  role?: string
  features?: string[]
  techs: string[]
  screenshots?: { src: string; alt: string }[]
  github?: string // repository URL, e.g. 'https://github.com/you/repo'
  demo?: string // live demo URL
}

export const PROJECTS: Project[] = [
  {
    id: 'furcare-hub',
    name: 'FurCare Hub',
    tagline: 'A Pet Boarding System for the Safety and Well-being of Cats and Dogs',
    year: 2025,
    type: 'Web-based system',
    category: 'Web Development',
    overview:
      'A web-based pet boarding management system designed to ensure the safety, well-being, and efficient accommodation of cats and dogs.',
    techs: ['HTML', 'CSS', 'PHP', 'MySQL'],
  },
  {
    id: 'sheemramen',
    name: 'SheemRamen',
    tagline: 'A Ramen Shop Order and Inventory Management System',
    year: 2025,
    type: 'Web-based system',
    category: 'Web Development',
    overview:
      'A web-based order and inventory management system designed to optimize operations in a ramen shop. It ensures efficient order processing, accurate stock tracking, and streamlined sales monitoring.',
    features: ['Order processing', 'Stock tracking', 'Sales monitoring'],
    techs: ['HTML', 'CSS', 'PHP', 'MySQL'],
  },
  {
    id: 'kwentong-kape',
    name: 'Kwentong Kape',
    tagline: 'A Coffee Shop Order and Inventory Management System',
    year: 2024,
    type: 'Web-based system',
    category: 'Web Development',
    overview:
      'A web-based order and inventory management system designed to streamline operations in a coffee shop, ensuring efficient order processing, stock tracking, and sales monitoring.',
    features: ['Order processing', 'Stock tracking', 'Sales monitoring'],
    techs: ['VB.Net', 'MySQL'],
  },

  {
    id: 'cocovision',
    name: 'CocoVision',
    tagline: 'Automated Maturity Indexing of Cocos nucifera Using Computer Vision and Acoustic Validation',
    year: 2026,
    type: 'Mobile app',
    category: 'Applications',
    overview:
      'An automated maturity indexing system for Cocos nucifera (coconut) using computer vision and acoustic validation.',
    techs: ['React Native', 'Expo', 'TypeScript', 'Expo Router', 'Python', 'FastAPI', 'Firebase Authentication', 'Axios', 'Machine Learning', 'Dataset Labelling'],
  },
  {
    id: 'pageturner',
    name: 'PageTurner',
    tagline: 'An Online Bookstore and Book Shopping System',
    year: 2026,
    type: 'Online shopping system',
    category: 'Applications',
    overview: 'An online bookstore and shopping system for browsing and purchasing books.',
    techs: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 'nendopop',
    name: 'NendoPop',
    tagline: 'A Nendoroid Collectibles Shopping System',
    year: 2025,
    type: 'Online shopping system',
    category: 'Applications',
    overview: 'An online shopping system for Nendoroid collectibles.',
    techs: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 'unitree',
    name: 'UniTree',
    tagline: 'A Gamified Online Shopping System for a Campus Community',
    year: 2024,
    type: 'Online shopping system',
    category: 'Applications',
    overview: 'A gamified online shopping system designed for a campus community.',
    techs: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 'lensheem',
    name: 'LenSheem',
    tagline: 'An Eyewear Shopping System',
    year: 2025,
    type: 'Online shopping system',
    category: 'Applications',
    overview: 'An online shopping system for eyewear.',
    techs: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 'popsheem',
    name: 'PopSheem',
    tagline: 'A Blind Box Collectibles Shopping System',
    year: 2025,
    type: 'Online shopping system',
    category: 'Applications',
    overview: 'An online shopping system for blind box collectibles.',
    techs: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS'],
  },
]