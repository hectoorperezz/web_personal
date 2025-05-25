import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";


export const DATA = {
  name: "Hector Perez",
  initials: "HR",
  url: "https://alpheclabs.com",
  location: "Madrid, ES",
  locationLink: "https://www.google.com/maps/place/madrid",
  description:
    "Graduado en Finanzas por la Universidad Carlos III. Cofundador de Alphec Labs.",
  summary:
    "Me considero una persona dedicada y proactiva, con una gran pasión por la economía y las nuevas tecnologías. Profesionalmente, soy perfeccionista, ambicioso y siempre estoy dispuesto a aprender nuevas habilidades. Mi actitud emprendedora es una de mis señas de identidad a nivel profesional, lo que me ha llevado a emprender múltiples proyectos. Dejando a un lado el mundo profesional, en lo personal soy un loco del deporte y un frikazo del ajedrez aunque mi nivel deja mucho que desear. ",
  avatarUrl: "/yo.jpeg",
  skills: [
    "Gestión financiera",
    "Fiscalidad",
    "Gestión de Riesgos Financieros",
    "Análisis Financiero",
    "Valoración de empresas",
    "Derivados Financieros",
    "Finanzas descentralizadas",
    "Python",
    "LLMs Fine Tuning",
    "Replit",
    "Google Ads",
    "Shopify",
    "Paquete Office",
    "Pensamiento Crítico",
    "Amplitud de Miras",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "hectorperezled02@gmail.com",
    tel: "+123456789",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/hectoorperezz",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/hectorperezledesma/",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/Hectooorperezz",
        icon: Icons.x,

        navbar: true,
      },
      
      Chess: {
        name: "Chess",
        url: "https://www.chess.com/member/hectoorperezz",
        icon: Icons.pawn,
        navbar: true,
      },

      email: {
        name: "Send Email",
        url: "#",
        icon: Icons.email,

        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Alphec Labs",
      href: "https://alpheclabs.com",
      badges: [],
      location: "Remote",
      title: "Co-Fundador",
      logoUrl: "/alphec.png",
      start: "Septiembre 2023",
      end: "Actualidad",
      description:
        "Alphec Labs es un laboratorio de investigación y desarrollo de negocios que se enfoca en la innovación y las nuevas tecnologías para la creación de éxitos empresariales. Invertimos en negocios ya existentes además de trabajar en nuestros propios proyectos.",
    },

    {
      company: "BDO ",
      href: "https://www.bdo.es/es-es/home",
      badges: [],
      location: "Madrid, ES",
      title: "Internship - Risk Advisory Services",
      logoUrl: "/bdo.png",
      start: "Enero 2024",
      end: "Julio 2024",
      description:
        "En mi experiencia en el departamento de Risk & Advisory Services en BDO, participé en numerosos proyectos relacionados con la gestión y control de riesgos empresariales, centrándome en auditoría interna, cumplimiento normativo y gobernanza corporativa. Colaboré en la implementación de sistemas de control eficientes, asegurando el cumplimiento regulatorio y mejorando la eficiencia operativa de las empresas.",
    },

  ],
  education: [
    {
      school: "Universidad Carlos III de Madrid",
      href: "https://www.uc3m.es/inicio",
      degree: "Finanzas y Contabiliad",
      logoUrl: "/uc3m.png",
      start: "2020",
      end: "2024",
    },
    {
      school: "WHU – Otto Beisheim School of Management",
      href: "https://www.whu.edu/en",
      degree: "Bachelor in International Business Administration, Exchange Student",
      logoUrl: "/whu.jpeg",
      start: "2024",
      end: "2024",
    },
    {
      school: "Colegio Ágora",
      href: "https://www.colegioagora.es/",
      degree: "Bachillerato de Ciencias Sociales",
      grade: "Bachillerato de Ciencias Sociales",
      logoUrl: "/agora.jpeg",
      start: "2018",
      end: "2020",
    },
  ],
  projects: [
    {
      title: "Trabajo de fin de grado",
      href: "/TFG_Hector_Perez_Ledesma.pdf",
      dates: "Julio 2024",
      active: true,
      description:
        "El auge de la gestión pasiva es un fenómeno sin precedentes en la industria de la gestión de activos y plantea muchas preguntas sobre su impacto en los mercados. Frente a este fenómeno, son muchas las voces críticas que se han alzado para advertir que la gestión pasiva podría comprometer la eficiencia del mercado. Este estudio se enfoca en analizar el impacto de la gestión pasiva en las valoraciones del S&P 500, con el objetivo de entender si representa una amenaza para la eficiencia de los mercados de renta variable.",
      technologies: [
        "Jupyter Notebooks",
        "Python",
        "Investigación Académica",
        "AlphaVantage API",
        "Pyfinace API",

      ],
      links: [
        
      ],
      image: "/tfg.jpeg",
      video: "",
    },
    {
      title: "FICO Capital Management",
      href: "https://ligadebolsa.com/ranking-liga-de-clubs-de-bolsa-universitaria-2021-2022/",
      dates: "2021 - 2022",
      active: true,
      description:
        "En mi segundo año de carrera participé junto con algunos compañeros de mi curso en la IX edición de la liga universitaria de bolsa. En esta competición participaban un gran número de fondos de inversión gestionados por universitarios de todo Madrid. Fue un año complicado en los mercados, lo cual me enseñó la dificultad que entraña invertir en bolsa y lo importante que es gestionar los riesgos correctamente. Nuestro fondo terminó en el puesto 23 de 45 participantes.",
      technologies: [
        "Gestión de Activos",
        "Operativa Bursátil",
        "Estrategias de inversión",
 
      ],
      links: [

      ],
      image: "/liga.png",
      video: "",
    },
    {
      title: "Validación Blockchain en Chia Network",
      href: "https://chia.net",
      dates: "Marzo 2021 - Octubre 2022",
      active: true,
      description:
        "Un proyecto basado en el empleo de plataformas de almacenamiento en la nube para validar transacciones en la red descentralizada Chia. Un ambicioso proyecto que apostaba por una revolución tecnológica en las redes blockchain, creando una red segura, escalable, económica, rápida y ecológica gracias al innovador algoritmo de validación y consenso PoST (proof of space-time), que utiliza el almacenamiento como recurso para validar y respaldar transacciones, en lugar de usar altas cantidades de energía (PoW, proof of work) o nodos de red y capital (PoS, proof of stake).",
      technologies: [
        "Microsoft Azure",
        "Bash",
        "Blockchain",
        "Cloud Computing",
        "Minería Blockchain",
 
      ],
      links: [
        {
          type: "Website",
          href: "https://chia.net",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/chia.jpeg",
      video:
        "",
    },
    {
      title: "Kronos Computers",
      href: "https://computerskronos.wixsite.com/kronos",
      dates: "Mayo 2015 - Enero 2017",
      active: true,
      description:
        "Este proyecto consistió en el desarrollo de un E-commerce de montaje y venta de ordenadores Low-Cost. Nuestra visión desde el inicio fue simple pero poderosa: hacer que los ordenadores asequibles estén al alcance de todos, sin comprometer la calidad ni el servicio. Nos esforzamos en brindar una experiencia de compra excepcional, asegurándonos de que cada cliente recibiera un producto de alta calidad y un servicio de atención al cliente personalizado.",
      technologies: [
        "Wix",
        "Montaje de Ordenadores",
        "Marketing",
        "Wallapop",
        "E-commerce",

      ],
      links: [
        {
          type: "Website",
          href: "https://computerskronos.wixsite.com/kronos",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/kronos.png",
      video: "",
    },

  ],
 
} as const;
