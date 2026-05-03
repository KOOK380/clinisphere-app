import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      navbar: {
        home: 'Accueil',
        formations: 'Formations',
        boutique: 'Boutique',
        services: 'Services',
        contact: 'Contact',
        instructors: 'Instructeurs',
        login: 'Se Connecter',
        register: "S'inscrire",
        logout: 'Déconnexion',
        admin: 'Admin'
      },
      home: {
        badge: 'Excellence en Formation Médicale',
        title: 'Plateforme De Formation',
        titleAccent: 'Structurée & Pratique',
        registerCta: "S'inscrire",
        catalogueCta: 'Catalogue',
        features: {
          video: {
            title: 'Cours Vidéo',
            desc: "Accédez à des centaines d'heures de contenu médical de haute qualité."
          },
          interactive: {
            title: 'Quiz Interactifs',
            desc: 'Testez vos connaissances après chaque module avec nos examens.'
          },
          support: {
            title: 'Support 24/7',
            desc: "Une équipe d'experts dédiée pour répondre à toutes vos questions."
          }
        },
        instructors: {
          badge: 'Nos Formateurs',
          title: 'Accompagnement par des',
          titleAccent: 'Experts Reconnus',
          desc: "Apprenez auprès de spécialistes qui pratiquent au quotidien. Nos formations sont le fruit de années d'expérience clinique et académique.",
          dr1: {
            name: 'Dr Nadine David',
            role: 'Spécialiste en Gynécologie-Obstétrique',
            focus: 'Échographie du Coeur Foetal'
          },
          dr2: {
            name: 'Pr Loïc Sentilhes',
            role: 'Professeur des Universités',
            focus: 'Doppler Foetal & Médecine Maternelle'
          }
        },
        stats: {
          instructors: 'Instructeurs',
          doctors: 'Médecins Formés',
          secure: 'Plateforme Sécurisée'
        },
        upcoming: {
          title: 'Formations à venir',
          desc: 'Inscrivez-vous dès maintenant pour nos prochaines sessions de formation immersive.',
          viewAll: 'Voir tout le catalogue'
        },
        cta: {
          title: 'Prêt à transformer votre pratique ?',
          desc: 'Rejoignez des centaines de praticiens qui ont déjà amélioré leur expertise avec Clinisphere.',
          button: 'Créer un compte gratuitement'
        }
      },
      footer: {
        desc: 'Votre partenaire de confiance pour la formation médicale continue et la pratique clinique avancée.',
        links: 'Exploration',
        contact: 'Nous Contacter',
        newsletter: 'Newsletter',
        newsletterDesc: 'Rejoignez 15,000+ praticiens informés.',
        subscribe: "S'abonner",
        privacy: 'Confidentialité',
        legal: 'Mentions Légales'
      },
      formations: {
        badge: 'Catalogue Complet',
        title: 'Nos Formations',
        desc: 'Des programmes complets élaborés par les meilleurs experts pour perfectionner vos compétences cliniques.',
        custom: {
          title: 'Formation sur mesure ?',
          desc: 'Nous collaborons avec des institutions pour créer des programmes adaptés à des besoins spécifiques. Contactez notre équipe pédagogique.',
          button: 'Contactez-nous'
        }
      },
      boutique: {
        badge: 'Investissement Carrière',
        title: 'Boutique Clinisphere',
        desc: 'Découvrez nos formations premium et certifiantes.',
        cart: {
          title: 'Mon Panier',
          empty: 'Votre panier est actuellement vide',
          items: 'Articles',
          total: 'Montant Total',
          subtotal: 'Sous-total',
          checkout: 'Procéder au Paiement',
          secure: 'Transaction 100% Sécurisée',
          badge: 'Votre Sélection',
          backToStore: 'Retour à la boutique'
        }
      },
      auth: {
        login: {
          badge: 'Espace Membre',
          title: 'Bon Retour',
          desc: 'Accédez à vos formations exclusives',
          button: 'Se Connecter',
          loading: 'Connexion en cours...',
          noAccount: 'Pas encore de compte ?',
          registerLink: 'Créer un compte'
        },
        register: {
          badge: 'Inscription Membre',
          title: 'Devenez Membre',
          desc: "Rejoignez l'élite des praticiens et accédez à nos programmes exclusifs.",
          button: 'Créer mon compte',
          loading: 'Création de compte...',
          hasAccount: 'Vous avez déjà un compte ?',
          loginLink: 'Connectez-vous ici'
        }
      },
      course: {
        badge: 'Formation',
        unlimited: 'Accès illimité',
        enroll: "S'inscrire",
        addToCart: 'Ajouter au panier',
        items: {
          'Coeur foetal': {
            title: 'Cœur fœtal',
            desc: "Formation approfondie sur l'échographie du cœur fœtal, dépistage des malformations congénitales."
          },
          'Doppler foetal': {
            title: 'Doppler fœtal',
            desc: 'Maîtriser les techniques de Doppler fœtal pour le suivi des grossesses à haut risque.'
          },
          'Echo Doppler Obstétrical': {
            title: 'Écho Doppler Obstétrical',
            desc: "L'essentiel de l'échographie Doppler en obstétrique : pratique et interprétation."
          },
          'Pack Coeur Foetal + Doppler': {
            title: 'Pack Cœur Fœtal + Doppler',
            desc: 'Une formation complète regroupant le cœur fœtal et le Doppler fœtal à prix réduit.'
          }
        }
      },
      services: {
        badge: 'Support & FAQ',
        title: 'Services Clinisphere',
        desc: 'Tout ce que vous devez savoir pour démarrer votre apprentissage dans les meilleures conditions.',
        faq: {
          title: 'Questions Fréquentes',
          q1: "Comment s'inscrire à une formation ?",
          a1: "Il suffit de créer un compte GRATUIT sur notre plateforme, de choisir la formation dans notre catalogue et de procéder au paiement sécurisé.",
          q2: "Les formations sont-elles reconnues ?",
          a2: "Oui, nos formations sont élaborées par des experts universitaires et cliniciens renommés. Une attestation de réussite est délivrée après validation du quiz final.",
          q3: "Puis-je accéder aux vidéos après la formation ?",
          a3: "Absolument. Une fois inscrit, vous disposez d'un accès illimité aux modules vidéos pour revenir sur les points techniques à tout moment.",
          q4: "Quelles sont les modalités de paiement ?",
          a4: "Nous acceptons les paiements sécurisés par carte bancaire. Pour d'autres moyens de paiement (virement, espèces), veuillez contacter notre support."
        },
        terms: {
          title: 'Conditions Générales',
          s1: {
            title: '1. Utilisation du Service',
            desc: 'Nos formations sont strictement destinées aux professionnels de santé. Les accès sont personnels et non transférables. Toute reproduction du contenu est formellement interdite.'
          },
          s2: {
            title: '2. Politique de Remboursement',
            desc: 'En raison de la nature numérique des contenus, aucun remboursement ne sera effectué une fois les modules de formation consultés.'
          },
          s3: {
            title: '3. Confidentialité',
            desc: "Clinisphere s'engage à protéger vos données personnelles conformément à la réglementation en vigueur. Vos informations ne sont jamais partagées avec des tiers à des fins marketing."
          },
          certified: 'Plateforme Certifiée & Sécurisée'
        }
      },
      contact: {
        badge: 'Contactez-nous',
        title: 'Parlons de vos',
        titleAccent: 'objectifs',
        titleSuffix: 'de formation.',
        desc: 'Notre équipe est à votre disposition pour toute question concernant nos programmes, les inscriptions ou les opportunités de partenariat.',
        labels: {
          phone: 'Téléphone',
          email: 'Email',
          address: 'Adresse',
          social: 'Réseaux Sociaux'
        },
        form: {
          name: 'Nom Complet',
          namePlaceholder: 'Dr. Votre Nom',
          email: 'Email Professionnel',
          emailPlaceholder: 'email@professionnel.com',
          message: 'Votre Message',
          messagePlaceholder: 'Comment pouvons-nous vous aider ?',
          submit: 'Envoyer le message',
          submitting: 'Envoi en cours...',
          success: 'Message Envoyé !',
          successDesc: 'Merci de nous avoir contacté. Notre équipe vous répondra dans les plus brefs délais.',
          another: 'Envoyer un autre message'
        }
      },
      admin: {
        panelTitle: 'Panel Admin',
        panelSubtitle: 'Plateforme de Gestion',
        sidebar: {
          dashboard: 'Tableau de bord',
          courses: 'Gestion des cours',
          orders: 'Commandes',
          contacts: 'Messages',
          users: 'Utilisateurs',
          instructors: 'Instructeurs',
          settings: 'Paramètres',
          backToSite: 'Retour au site',
          logout: 'Déconnexion'
        },
        settings: {
          title: 'Paramètres du site',
          currency: 'Configuration de la devise',
          currencyCode: 'Code Devise (ex: DZD, MAD)',
          currencySymbol: 'Symbole (ex: DH, DA)',
          currencyPosition: 'Position du symbole',
          logos: 'Gestion des logos',
          headerLogo: 'Logo En-tête',
          footerLogo: 'Logo Pied de page',
          logoLink: 'Lien du logo (redirection)',
          saveSuccess: 'Paramètres enregistrés avec succès',
          uploadLogo: 'Télécharger le logo'
        },
        slider: {
          title: 'Gestion du Slider Accueil',
          addItem: 'Ajouter un élément',
          type: 'Type',
          image: 'Image',
          video: 'Vidéo',
          url: 'URL du média',
          btnText: 'Texte Bouton',
          btnLink: 'Lien Bouton',
          subtitle: 'Description / Sous-titre',
          isActive: 'Actif',
          order: 'Ordre',
          deleteConfirm: 'Supprimer cet élément du slider ?'
        },
        header: {
          welcome: 'Bienvenue dans votre espace de gestion.'
        },
        dashboard: {
          totalRevenue: 'Revenu Total',
          activeCourses: 'Cours Actifs',
          users: 'Utilisateurs',
          messages: 'Messages',
          recentOrders: 'Commandes Récentes'
        },
        courses: {
          title: 'Cours répertoriés',
          addCourse: 'Ajouter un cours',
          editCourse: 'Modifier le cours',
          newCourse: 'Ajouter un nouveau cours',
          shortDescription: 'Résumé (Short Description)',
          fullDescription: 'Description Complète',
          discountPrice: 'Prix Promo (Optionnel)',
          category: 'Catégorie',
          level: 'Niveau',
          duration: 'Durée (ex: 5 heures)',
          contentStructure: 'Contenu du Cours (Modules & Leçons)',
          addModule: 'Ajouter un Module',
          moduleTitle: 'Titre du Module',
          addLesson: 'Ajouter une Leçon',
          lessonTitle: 'Titre de la leçon',
          videoUrl: 'URL Vidéo',
          beginner: 'Débutant',
          intermediate: 'Intermédiaire',
          advanced: 'Avancé',
          defaultModuleTitle: 'Nouveau Module',
          defaultLessonTitle: 'Nouvelle Leçon'
        },
        instructors: {
          title: 'Instructeurs répertoriés',
          addInstructor: 'Ajouter un instructeur',
          editInstructor: 'Modifier l\'instructeur',
          newInstructor: 'Ajouter un nouvel instructeur',
          listed: 'instructeurs répertoriés',
          name: 'Nom Complet',
          specialty: 'Spécialité',
          bio: 'Biographie',
          imageUrl: "URL de l'image",
          dateAdded: 'Date Ajout'
        },
        common: {
          client: 'Client',
          date: 'Date',
          amount: 'Montant',
          status: 'Statut',
          completed: 'Complété',
          actions: 'Actions',
          instructor: 'Instructeur',
          price: 'Prix',
          priceDh: 'Prix (DH)',
          deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce cours ?',
          deleteInstructorConfirm: 'Êtes-vous sûr de vouloir supprimer cet instructeur ?',
          save: 'Enregistrer',
          delete: 'Supprimer',
          cancel: 'Annuler',
          title: 'Titre',
          description: 'Description',
          imageUrl: "URL de l'image",
          city: 'Ville',
          specialty: 'Spécialité',
          role: 'Rôle',
          registration: 'Inscription',
          notSpecified: 'Non spécifié',
          select: 'Sélectionner'
        }
      }
    }
  },
  en: {
    translation: {
      navbar: {
        home: 'Home',
        formations: 'Courses',
        boutique: 'Shop',
        services: 'Services',
        contact: 'Contact',
        instructors: 'Instructors',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        admin: 'Admin'
      },
      home: {
        badge: 'Medical Training Excellence',
        title: 'Medical Training',
        titleAccent: 'Structured & Practical',
        registerCta: 'Join Now',
        catalogueCta: 'Catalogue',
        features: {
          video: {
            title: 'Video Courses',
            desc: 'Access hundreds of hours of high-quality medical content.'
          },
          interactive: {
            title: 'Interactive Quizzes',
            desc: 'Test your knowledge after each module with our exams.'
          },
          support: {
            title: '24/7 Support',
            desc: 'A dedicated team of experts to answer all your questions.'
          }
        },
        instructors: {
          badge: 'Our Instructors',
          title: 'Guidance from',
          titleAccent: 'Recognized Experts',
          desc: 'Learn from specialists who practice daily. Our courses are the result of years of clinical and academic experience.',
          dr1: {
            name: 'Dr Nadine David',
            role: 'Gynecology-Obstetrics Specialist',
            focus: 'Fetal Heart Ultrasound'
          },
          dr2: {
            name: 'Pr Loïc Sentilhes',
            role: 'University Professor',
            focus: 'Fetal Doppler & Maternal Medicine'
          }
        },
        stats: {
          instructors: 'Instructors',
          doctors: 'Trained Doctors',
          secure: 'Secure Platform'
        },
        upcoming: {
          title: 'Upcoming Courses',
          desc: 'Register now for our next immersive training sessions.',
          viewAll: 'View full catalogue'
        },
        cta: {
          title: 'Ready to transform your practice?',
          desc: 'Join hundreds of practitioners who have already improved their expertise with Clinisphere.',
          button: 'Create a free account'
        }
      },
      footer: {
        desc: 'Your trusted partner for continuing medical education and advanced clinical practice.',
        links: 'Explore',
        contact: 'Contact Us',
        newsletter: 'Newsletter',
        newsletterDesc: 'Join 15,000+ informed clinicians.',
        subscribe: 'Subscribe',
        privacy: 'Privacy Policy',
        legal: 'Legal Mentions'
      },
      formations: {
        badge: 'Full Catalogue',
        title: 'Our Courses',
        desc: 'Comprehensive programs developed by top experts to perfect your clinical skills.',
        custom: {
          title: 'Custom Training?',
          desc: 'We collaborate with institutions to create programs adapted to specific needs. Contact our pedagogical team.',
          button: 'Contact us'
        }
      },
      boutique: {
        badge: 'Career Investment',
        title: 'Clinisphere Shop',
        desc: 'Discover our premium and certified courses.',
        cart: {
          title: 'My Cart',
          empty: 'Your cart is currently empty',
          items: 'Items',
          total: 'Total Amount',
          subtotal: 'Subtotal',
          checkout: 'Proceed to Payment',
          secure: '100% Secure Transaction',
          badge: 'Your Selection',
          backToStore: 'Back to shop'
        }
      },
      auth: {
        login: {
          badge: 'Member Area',
          title: 'Welcome Back',
          desc: 'Access your exclusive training sessions',
          button: 'Login',
          loading: 'Logging in...',
          noAccount: 'No account yet?',
          registerLink: 'Create an account'
        },
        register: {
          badge: 'Member Registration',
          title: 'Join Us',
          desc: 'Join the elite of practitioners and access our exclusive programs.',
          button: 'Create account',
          loading: 'Creating account...',
          hasAccount: 'Already have an account?',
          loginLink: 'Login here'
        }
      },
      course: {
        badge: 'Course',
        unlimited: 'Unlimited access',
        enroll: 'Join Now',
        addToCart: 'Add to cart',
        items: {
          'Coeur foetal': {
            title: 'Fetal Heart',
            desc: 'In-depth training on fetal heart ultrasound, screening for congenital malformations.'
          },
          'Doppler foetal': {
            title: 'Fetal Doppler',
            desc: 'Master fetal Doppler techniques for monitoring high-risk pregnancies.'
          },
          'Echo Doppler Obstétrical': {
            title: 'Obstetrical Doppler Echo',
            desc: 'The essentials of Doppler ultrasound in obstetrics: practice and interpretation.'
          },
          'Pack Coeur Foetal + Doppler': {
            title: 'Fetal Heart + Doppler Pack',
            desc: 'A complete training session grouping fetal heart and fetal Doppler at a reduced price.'
          }
        }
      },
      services: {
        badge: 'Support & FAQ',
        title: 'Clinisphere Services',
        desc: 'Everything you need to know to start your learning in the best conditions.',
        faq: {
          title: 'Frequently Asked Questions',
          q1: 'How to register for a course?',
          a1: 'Simply create a FREE account on our platform, choose the course from our catalogue and proceed to secure payment.',
          q2: 'Are the courses recognized?',
          a2: 'Yes, our courses are developed by university experts and renowned clinicians. A certificate of achievement is issued after validation of the final quiz.',
          q3: 'Can I access the videos after the course?',
          a3: 'Absolutely. Once registered, you have unlimited access to the video modules to review technical points at any time.',
          q4: 'What are the payment methods?',
          a4: 'We accept secure payments by credit card. For other payment methods (transfer, cash), please contact our support.'
        },
        terms: {
          title: 'General Terms',
          s1: {
            title: '1. Service Use',
            desc: 'Our training courses are strictly intended for healthcare professionals. Access is personal and non-transferable. Any reproduction of the content is strictly prohibited.'
          },
          s2: {
            title: '2. Refund Policy',
            desc: 'Due to the digital nature of the content, no refunds will be made once the training modules have been viewed.'
          },
          s3: {
            title: '3. Privacy',
            desc: 'Clinisphere is committed to protecting your personal data in accordance with current regulations. Your information is never shared with third parties for marketing purposes.'
          },
          certified: 'Certified & Secure Platform'
        }
      },
      contact: {
        badge: 'Contact Us',
        title: 'Talk about your',
        titleAccent: 'goals',
        titleSuffix: 'training.',
        desc: 'Our team is at your disposal for any questions concerning our programs, registrations or partnership opportunities.',
        labels: {
          phone: 'Phone',
          email: 'Email',
          address: 'Address',
          social: 'Social Media'
        },
        form: {
          name: 'Full Name',
          namePlaceholder: 'Dr. Your Name',
          email: 'Professional Email',
          emailPlaceholder: 'email@professional.com',
          message: 'Your Message',
          messagePlaceholder: 'How can we help you?',
          submit: 'Send Message',
          submitting: 'Sending...',
          success: 'Message Sent!',
          successDesc: 'Thank you for contacting us. Our team will answer you as soon as possible.',
          another: 'Send another message'
        }
      },
      admin: {
        panelTitle: 'Admin Panel',
        panelSubtitle: 'Management Platform',
        sidebar: {
          dashboard: 'Dashboard',
          courses: 'Course Management',
          orders: 'Orders',
          contacts: 'Messages',
          users: 'Users',
          instructors: 'Instructors',
          settings: 'Settings',
          backToSite: 'Back to site',
          logout: 'Logout'
        },
        settings: {
          title: 'Site Settings',
          currency: 'Currency Configuration',
          currencyCode: 'Currency Code (e.g. USD, MAD)',
          currencySymbol: 'Symbol (e.g. $, DH)',
          currencyPosition: 'Symbol Position',
          logos: 'Logo Management',
          headerLogo: 'Header Logo',
          footerLogo: 'Footer Logo',
          logoLink: 'Logo Link (redirect)',
          saveSuccess: 'Settings saved successfully',
          uploadLogo: 'Upload Logo'
        },
        slider: {
          title: 'Home Slider Management',
          addItem: 'Add Slide',
          type: 'Type',
          image: 'Image',
          video: 'Video',
          url: 'Media URL',
          btnText: 'Button Text',
          btnLink: 'Button Link',
          subtitle: 'Description / Subtitle',
          isActive: 'Active',
          order: 'Order',
          deleteConfirm: 'Delete this slider item?'
        },
        header: {
          welcome: 'Welcome to your management area.'
        },
        dashboard: {
          totalRevenue: 'Total Revenue',
          activeCourses: 'Active Courses',
          users: 'Users',
          messages: 'Messages',
          recentOrders: 'Recent Orders'
        },
        courses: {
          title: 'courses listed',
          addCourse: 'Add a course',
          editCourse: 'Edit course',
          newCourse: 'Add a new course',
          shortDescription: 'Short Description',
          fullDescription: 'Full Description',
          discountPrice: 'Discount Price (Optional)',
          category: 'Category',
          level: 'Level',
          duration: 'Duration (e.g. 5 hours)',
          contentStructure: 'Course Content (Modules & Lessons)',
          addModule: 'Add Module',
          moduleTitle: 'Module Title',
          addLesson: 'Add Lesson',
          lessonTitle: 'Lesson Title',
          videoUrl: 'Video URL',
          beginner: 'Beginner',
          intermediate: 'Intermediate',
          advanced: 'Advanced',
          defaultModuleTitle: 'New Module',
          defaultLessonTitle: 'New Lesson'
        },
        instructors: {
          title: 'Instructors listed',
          addInstructor: 'Add an instructor',
          editInstructor: 'Edit instructor',
          newInstructor: 'Add a new instructor',
          listed: 'instructors listed',
          name: 'Full Name',
          specialty: 'Specialty',
          bio: 'Biography',
          imageUrl: 'Image URL',
          dateAdded: 'Date Added'
        },
        common: {
          client: 'Client',
          date: 'Date',
          amount: 'Amount',
          status: 'Status',
          completed: 'Completed',
          actions: 'Actions',
          instructor: 'Instructor',
          price: 'Price',
          priceDh: 'Price (DH)',
          deleteConfirm: 'Are you sure you want to delete this course?',
          deleteInstructorConfirm: 'Are you sure you want to delete this instructor?',
          save: 'Save',
          delete: 'Delete',
          cancel: 'Cancel',
          title: 'Title',
          description: 'Description',
          imageUrl: 'Image URL',
          city: 'City',
          specialty: 'Specialty',
          role: 'Role',
          registration: 'Registration',
          notSpecified: 'Not specified',
          select: 'Select'
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
