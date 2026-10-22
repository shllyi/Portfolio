import resumePdf from '../assets/resume.pdf'

/* Everything editable lives here. An empty string means "not provided yet":
   the UI then shows a disabled button with a hint instead of a dead link. */

export const LINKS = {
  email: 'ericapeque98@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ma-erica-shelley-peque-84a62b445?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
  github: 'https://github.com/shllyi',
  instagram: 'https://www.instagram.com/shlly.i/',
  koFi: 'https://ko-fi.com/shell2fu',
  resumePdf,
}

export const STATUS = { show: false, label: 'Open to Internship Opportunities' } // show:false hides it

export const PERSON = {
  name: 'Ma. Erica Shelley M. Peque',
  identity: 'BSIT Student | Aspiring Frontend Developer | Illustrator & Graphic Artist | Freelance Creative',
  location: 'Taguig, Philippines',
  tagline: 'A dedicated BSIT student seeking opportunities to enhance technical competencies, gain practical experience, apply acquired knowledge, and contribute to organizational success through continuous learning and professional development.',
  details: [
    ['Degree', 'Bachelor of Science in Information Technology'],
    ['Campus', 'Taguig Campus (TUP-T)'],
    ['Year level', '4th Year'],
    ['Languages', 'Filipino and English'],
    ['Freelance', 'Illustrator, Website and Graphic Artist'],
    ['Career goal', 'To secure an internship where I can apply my IT knowledge, develop practical experience, and contribute to meaningful projects.'],
  ] as [string, string][],
  intro: [
    'I’m a fourth-year Bachelor of Science in Information Technology student at the Technological University of the Philippines – Taguig Campus. I enjoy building interactive and user-friendly applications, exploring web technologies, and bringing creative ideas to life through digital illustration and graphic design.',
    'My main focus is frontend development, but I also have experience with backend technologies, databases, and introductory machine learning. Outside programming, I work on character illustrations, game-inspired artwork, logos, posters, and other visual designs. I’m continuously learning, improving my technical abilities, and looking for an internship where I can contribute to real-world projects, collaborate with a team, and grow as a developer and creative professional.',
  ],
  objective:
    'I’m a fourth-year BSIT student seeking an internship where I can apply my frontend development skills, strengthen my backend knowledge, and contribute to practical software development projects. With additional experience in digital illustration and graphic design, I bring both technical problem-solving and creative thinking to the development process.',
  bring: [
    'A combination of technical and creative skills.',
    'An interest in building functional, user-friendly interfaces.',
    'A willingness to learn new tools and technologies.',
    'Attention to visual details and usability.',
    'An interest in collaborating on real-world projects.',
  ],
  exploring: ['Modern frontend development', 'Backend integration', 'UI/UX design', 'Machine learning', 'Game-related visual design'],
}

type Skill = { name: string; level?: string }
const L = (names: string[]): Skill[] => names.map((name) => ({ name }))

/* Levels only where confirmed. Overlap between categories is intentional. */
export const TECH: Record<string, Skill[]> = {
  'Tech Skills': [
    { name: 'Python', level: 'Intermediate' },
    { name: 'PHP', level: 'Intermediate' },
    { name: 'C++', level: 'Intermediate' },
    { name: 'JavaScript', level: 'Intermediate' },
    ...L(['Visual Basic', 'HTML5', 'CSS3', 'TypeScript', 'SQL', 'MySQL', 'Machine Learning', 'Web & app Development']),
  ],
}

/* Tools and software shown together in the skills section. */
export const SOFTWARE = [
  { name: 'GitHub', use: 'Version control and collaboration', icon: 'github' },
  { name: 'Visual Studio Code', use: 'Programming and web development', icon: 'vscode' },
  { name: 'Firebase', use: 'App development and authentication', icon: 'firebase' },
  { name: 'XAMPP', use: 'Local PHP and MySQL development', icon: 'xampp' },
  { name: 'MySQL Workbench', use: 'Database management', icon: 'mysql' },
  { name: 'MongoDB Compass', use: 'Visual database management', icon: 'mongodb' },
  { name: 'Figma', use: 'UI/UX and interface design', icon: 'figma' },
  { name: 'Canva', use: 'Posters and presentation graphics', icon: 'canva' },
  { name: 'ibis Paint X', use: 'Digital illustration and drawing', icon: 'ibispaint' },
  { name: 'Adobe Illustrator', use: 'Logo and vector design', icon: 'illustrator' },
  { name: 'Adobe Photoshop', use: 'Image editing and graphic design', icon: 'photoshop' },
  { name: 'Blender', use: '3D modeling and digital art', icon: 'blender' },
]

export const HARD = ['Frontend Development', 'Backend Development', 'Database Management', 'UI/UX Design', 'Digital Illustration']
export const SOFT = ['Creative Problem-Solving', 'Attention to Detail', 'Adaptability and Willingness to Learn', 'Team Collaboration', 'Communication']

export const CREATIVE: Record<string, string[]> = {
  'Digital Illustration': ['Digital Drawing and Illustration', 'Character Design', 'Character Concept Art', 'Character Development', 'Visual Storytelling'],
  'Game Art and Environment Design': ['Game Character Design', 'Game Asset Design', 'Game Art', 'Background Illustration', 'Environment Design', 'Visual World-Building', 'Game Concept Design'],
  'Graphic Design and Branding': ['Logo Design', 'Brand Identity Design', 'Graphic Design', 'Poster Design', 'Promotional Graphics', 'Typography and Layout Design', 'Color Theory and Composition', 'Digital Marketing Materials'],
  'UI/UX and Visual Design': ['UI Design', 'Mobile App Interface Design', 'Wireframing and Prototyping', 'Visual Hierarchy', 'Design-to-Code Implementation', 'Basic Usability Testing'],
}

export const SERVICES = ['Digital Illustration', 'Character Design', 'Game Art and Background Design', 'Logo Design', 'Poster Design', 'Graphic Design', 'Branding and Promotional Graphics']

export const ARTWORK_FILTERS = ['All Works', 'Illustrations', 'Graphic Designs', 'Logo Design'] as const
export type Artwork = {
  id: string
  title: string
  category: Exclude<(typeof ARTWORK_FILTERS)[number], 'All Works'>
  description: string
  tools: string[]
  src: string // '/art/my-piece.png' (file in public/art/)
  alt: string
  imageOnly?: boolean
  galleryImages?: { src: string; alt: string }[]
  date?: string
  origin?: 'Personal' | 'School' | 'Freelance'
}

const graphicDesignImages = import.meta.glob<string>(
  '../assets/graphic designs/*.{png,jpg,jpeg,webp}',
  { eager: true, query: '?url', import: 'default' },
)
const illustrationImages = import.meta.glob<string>(
  '../assets/illustrations/*.{png,jpg,jpeg,webp}',
  { eager: true, query: '?url', import: 'default' },
)

function artworksFromImages(
  images: Record<string, string>,
  category: 'Graphic Designs' | 'Illustrations',
): Artwork[] {
  return Object.entries(images)
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(([path]) => !(category === 'Graphic Designs' && /\/(?:[1-6]\.png|Your paragraph text\.png)$/i.test(path)))
    .map(([path, src], index) => {
      const filename = path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''
      const readableName = filename
        .replace(/\s*\(\d+\)$/, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      const title = /^\d+$/.test(readableName)
        ? `${category === 'Illustrations' ? 'Illustration' : 'Graphic Design'} ${readableName.padStart(2, '0')}`
        : category === 'Illustrations'
          ? `Illustration ${String(index + 1).padStart(2, '0')}`
          : readableName || `Graphic Design ${String(index + 1).padStart(2, '0')}`

      return {
        id: `${category.toLowerCase().replace(/\s/g, '-')}-${index + 1}`,
        title,
        category,
        description: category === 'Illustrations'
          ? 'A digital illustration from my gallery.'
          : 'A graphic design piece from my gallery.',
        tools: [],
        src,
        alt: category === 'Graphic Designs' && /^\d+$/.test(readableName)
          ? `Graphic design artwork ${readableName}`
          : `${category === 'Illustrations' ? 'Illustration' : 'Graphic design'}: ${title}`,
        imageOnly: category === 'Graphic Designs' && /^\d+$/.test(readableName),
      }
    })
}

const graphicBundle = Object.entries(graphicDesignImages)
  .filter(([path]) => /\/[1-6]\.png$/i.test(path))
  .sort(([a], [b]) => Number(a.match(/\/(\d)\.png$/i)?.[1]) - Number(b.match(/\/(\d)\.png$/i)?.[1]))
  .map(([path, src]) => ({
    src,
    alt: `Graphic design bundle image ${path.match(/\/(\d)\.png$/i)?.[1]}`,
  }))
const logoDesign = Object.entries(graphicDesignImages).find(([path]) =>
  /\/Your paragraph text\.png$/i.test(path),
)

export const ARTWORKS: Artwork[] = [
  ...(graphicBundle.length > 0
    ? [{
        id: 'graphic-design-bundle-1-6',
        title: 'Graphic design bundle',
        category: 'Graphic Designs' as const,
        description: 'A set of six related graphic design pieces.',
        tools: [],
        src: graphicBundle[0].src,
        alt: 'Preview of a six-piece graphic design bundle',
        imageOnly: true,
        galleryImages: graphicBundle,
      }]
    : []),
  ...(logoDesign
      ? [{
          id: 'logo-design-your-paragraph-text',
          title: 'Logo Design',
          category: 'Logo Design' as const,
          description: 'A logo design from my gallery.',
          tools: [],
          src: logoDesign[1],
          alt: 'Logo design artwork',
          imageOnly: true,
        }]
      : []),
  ...artworksFromImages(graphicDesignImages, 'Graphic Designs'),
  ...artworksFromImages(illustrationImages, 'Illustrations'),
]

export type Cert = { title: string; issuer: string; date: string; url?: string; image?: string }
export const CERTS: Cert[] = [] // add real certificates, courses, workshops, seminars
export const EXPERIENCE: string[] = [] // add relevant experience only if you have it