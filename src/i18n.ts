import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      navbar: {
        home: 'Accueil',
        formations: 'Formations',
        inscription: 'Inscription',
        paiement: 'Paiement',
        events: 'Événements',
        eventsSubtitle: 'Explorez les ateliers, séminaires et événements médicaux à venir',
        services: 'Services',
        about: 'À propos',
        articles: 'Articles',
        contact: 'Contact',
        login: 'Se Connecter / S\'inscrire',
        logout: 'Déconnexion',
        admin: 'Admin',
        dashboard: 'Tableau de bord'
      },
      dashboard: {
        badge: 'Espace Personnel',
        welcome: 'Bienvenue, {{name}}',
        desc: 'Accédez à vos formations et suivez votre progression.',
        loading: 'Chargement de vos cours...',
        noCourses: 'Aucune formation trouvée',
        noCoursesDesc: "Vous n'avez pas encore de formations actives. Explorez notre catalogue pour commencer votre apprentissage.",
        catalogButton: 'Voir le catalogue',
        continue: 'Continuer',
        lesson: 'leçon',
        completed: 'Complété'
      },
      home: {
        hero: {
          fallbackTitle: 'Plateforme De Formation Médicale Structurée & Pratique',
          fallbackBtn: "S'inscrire",
          registerBtn: "S'INSCRIRE",
          catalogueBtn: "CATALOGUE"
        },
        features: {
          courses: {
            title: 'Cours',
            desc: 'Cours structurés avec cas cliniques'
          },
          quiz: {
            title: 'Quiz',
            desc: 'Plus de 30 quiz corrigés inclus'
          },
          support: {
            title: 'Support',
            desc: 'Accès en ligne sécurisé 24h/24 & 7j/7'
          }
        },
        intro: {
          title: 'Maîtrisez le cœur fœtal avec des cours structurés et +30 quiz corrigés et perfectionnez votre Doppler grâce à des cours et des cas cliniques réels',
          cta: 'En savoir Plus'
        },
        upcoming: {
          title: 'Formations à venir',
          subtitle: 'Formation pratique destinée aux gynécologues',
          details: 'Plus de détail',
          colpo: {
            tag: 'Colposcopie',
            title: 'Formation En Colposcopie Niveau 1 & Niveau 2',
            desc: 'Formation pratique destinée aux gynécologues souhaitant approfondir leurs compétences en colposcopie diagnostique et thérapeutique..'
          },
          prolapsus: {
            tag: 'Prolapsus',
            title: 'FORMATION PRATIQUE EN CHIRURGIE VAGINALE PAR VOIE BASSE – PROLAPSUS',
            desc: 'Formation 100 % pratique, destinée aux gynécologues souhaitant maîtriser les techniques de prise en charge du prolapsus par voie vaginale.'
          },
          hystero: {
            tag: 'Hysteroscopie',
            title: 'FORMATION AVANCÉE EN HYSTÉROSCOPIE OPÉRATOIRE',
            desc: "Destinée aux gynécologues maîtrisant l'hystéroscopie diagnostique (biopsies, polypectomies simples), .."
          }
        }
      },
      instructors: {
        badge: 'Nos Experts & Formateurs',
        title: 'Apprenez avec les Meilleurs',
        desc: 'Découvrez notre équipe de professionnels de santé passionnés par la transmission du savoir.',
        searchPlaceholder: 'Rechercher par nom ou spécialité...',
        viewProfile: 'Voir le profil',
        noResults: 'Aucun formateur trouvé',
        notFound: 'Instructeur non trouvé',
        backToList: 'Retour aux instructeurs',
        expertTag: 'Formateur Expert',
        contact: 'Contacter',
        share: 'Partager',
        about: 'À propos de',
        coursesBy: 'Formations par',
        stats: {
          courses: 'Cours',
          students: 'Étudiants',
          rating: 'Note',
          experience: 'Expérience'
        }
      },
      events: {
        title: 'Événements à venir',
        desc: 'Inscrivez-vous à nos séminaires, webinaires et ateliers exclusifs.',
        free: 'Gratuit',
        paid: 'Payant',
        register: 'S\'inscrire',
        buy: 'Acheter maintenant',
        viewDetails: 'Voir les détails',
        upcoming: 'Événements à venir',
        past: 'Événements passés',
        noEvents: 'Aucun événement à venir pour le moment.',
        all: 'Tous',
        location: 'Lieu',
        date: 'Date & Heure',
        search: 'Rechercher un événement...',
        noEventsFound: 'Aucun événement trouvé',
        tryDifferentFilter: 'Essayez de modifier vos filtres ou votre recherche.',
        backToEvents: 'Retour aux événements',
        time: 'Heure',
        filter: {
          all: 'Tous',
          free: 'Gratuits',
          paid: 'Payants'
        },
        registration: 'Inscription',
        freeAdmission: 'Entrée Gratuite',
        registerNow: 'S\'inscrire maintenant',
        buyTicket: 'Acheter un billet',
        limitedSeats: 'Places limitées - Réservez vite !',
        followUpdate: 'Suivez nos actualités',
        socialPrompt: 'Rejoignez-nous sur Instagram pour ne rien manquer de nos prochains événements et formations en direct.',
        benefits: {
          access: 'Accès complet aux conférences',
          materials: 'Supports de formation inclus',
          certification: 'Attestation de participation',
          networking: 'Session de networking'
        },
        about: "À propos de l'événement",
        bookSeat: 'Réserver ma place',
        program: 'Programme'
      },
      footer: {
        desc: 'Expertise et formation médicale structurée pour les professionnels de santé. Excellence académique et pratique clinique.',
        navigation: 'Navigation',
        contact: 'Nous Contacter',
        newsletter: 'Abonnez-vous',
        newsletterSub: 'Recevez nos dernières mises à jour de formations.',
        emailPlaceholder: 'Votre email',
        subscribe: 'S\'abonner maintenant',
        privacy: 'Politique de Confidentialité',
        legal: 'CGU / CGV',
        rights: 'Tous droits réservés.'
      },
      blog: {
        badge: 'Blog & Actualités',
        title: 'Nos derniers',
        titleAccent: 'Articles',
        category: 'Médecine',
        readMore: 'Lire la suite',
        noArticles: 'Aucun article disponible pour le moment.',
        notFound: 'Article non trouvé',
        backToList: 'Retour aux articles',
        shareArticle: 'Partager cet article',
        shareDesc: 'Faites circuler l\'information dans votre réseau professionnel.',
        readyToLearn: 'Prêt à approfondir vos compétences ?',
        readyDesc: 'Découvrez nos formations certifiantes dispensées par des experts.',
        seeCourses: 'Voir nos formations'
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
        },
        order: {
          successTitle: 'Paiement Réussi !',
          successDesc: 'Merci pour votre achat. Votre numéro de commande est #{{orderId}}.',
          successEmail: 'Un email contenant les détails de votre commande vous a été envoyé.',
          backDashboard: 'Aller au Tableau de Bord'
        }
      },
      courseDetail: {
        notFound: 'Cours non trouvé',
        backToDashboard: 'Retour au tableau de bord',
        selectLesson: 'Sélectionnez une leçon',
        completed: 'Complété',
        noVideo: 'Aucune vidéo disponible',
        inProgress: 'En cours',
        markAsCompleted: 'Marquer comme terminé',
        aboutLesson: 'À propos de cette leçon',
        noDescription: 'Aucune description disponible',
        yourInstructor: 'Votre Formateur',
        curriculum: 'Sommaire du Cours'
      },
      aboutPage: {
        title: 'À propos',
        desc: 'Bienvenue sur notre plateforme. Nous nous engageons à vous offrir la meilleure expérience.'
      },
      auth: {
        login: {
          badge: 'Espace Membre',
          title: 'Bon Retour',
          desc: 'Accédez à vos formations exclusives',
          button: 'Se Connecter',
          loading: 'Connexion en cours...',
          noAccount: 'Pas encore de compte ?',
          registerLink: 'Créer un compte',
          emailPlaceholder: 'Email Professionnel',
          passwordPlaceholder: 'Mot de passe'
        },
        register: {
          badge: 'Inscription Membre',
          title: 'Devenez Membre',
          desc: "Rejoignez l'élite des praticiens et accédez à nos programmes exclusifs.",
          button: 'Créer mon compte',
          loading: 'Création de compte...',
          hasAccount: 'Vous avez déjà un compte ?',
          loginLink: 'Connectez-vous ici',
          form: {
            name: 'Nom Complet',
            namePlaceholder: 'Dr. Jean Dupont',
            email: 'Email',
            emailPlaceholder: 'contact@exemple.com',
            specialty: 'Spécialité',
            specialtyPlaceholder: 'Gynécologie, Cardiologie...',
            city: 'Ville',
            cityPlaceholder: 'Abidjan, Paris...',
            phone: 'Téléphone',
            phonePlaceholder: '+225...',
            password: 'Mot de passe',
            passwordPlaceholder: '••••••••',
          }
        }
      },
      course: {
        badge: 'Formation',
        unlimited: 'Accès illimité',
        instructor: 'Formateur',
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
      services_page: {
        title: 'Formations à venir',
        desc: 'Découvrez les détails de chaque cours avec une image dédiée pour mieux visualiser votre apprentissage.',
        courses: {
          colpo: {
            title: 'Formation en Colposcopie Niveau 1 & Niveau 2',
            desc: 'Formation pratique destinée aux gynécologues souhaitant approfondir leurs compétences en colposcopie diagnostique et thérapeutique. Animée par le Professeur Nawel Merrouche, chef de service et spécialiste renommée du dépistage cervicovaginal, cette formation couvre :',
            list: [
              'Diagnostic et prise en charge des lésions cervicales précancéreuses (CIN 1, 2, 3)',
              'Détection des condylomes et polypes cervicaux',
              'Techniques de biopsie ciblée et interprétation des anomalies',
              'Utilisation des solutions de contraste et suivi des lésions'
            ],
            locations: {
              l1: 'Alger Niveau 1 : 🗓️ 7-9 Mai 2026',
              l2: 'Alger Niveau 2 : 🗓️ 24-26 Septembre 2026'
            }
          },
          prolapsus: {
            title: 'FORMATION PRATIQUE EN CHIRURGIE VAGINALE – PROLAPSUS',
            desc: 'Ce programme de formation 100 % pratique est conçu pour les gynécologues qui souhaitent maîtriser les techniques de prise en charge du prolapsus par voie vaginale.',
            desc2: 'Animé par le Professeur Michel Cosson, expert renommé en chirurgie pelvienne, ce cours permet aux participants de pratiquer et d\'acquérir des techniques chirurgicales reproductibles dans des conditions réelles.',
            objectives: 'Objectifs :',
            list: [
              'Maîtrise des techniques de correction du prolapsus par voie vaginale',
              'Standardisation des procédures chirurgicales',
              'Optimisation des résultats fonctionnels'
            ]
          },
          hystero: {
            title: 'FORMATION AVANCÉE EN HYSTÉROSCOPIE OPÉRATOIRE',
            desc: 'Destiné aux gynécologues expérimentés en hystéroscopie diagnostique (biopsies, polypectomies simples), ce programme de formation permet de progresser vers une pratique chirurgicale plus affinée.',
            desc2: 'Animé par le Professeur Hervé Fernandez, expert en chirurgie hystéroscopique, il se concentre sur l\'acquisition de techniques chirurgicales précises et reproductibles.',
            indications: 'Les indications couvertes incluent :',
            list: 'Synéchies utérines - Isthmocèle - Septum utérin - Pathologies intracavitaires courantes'
          }
        },
        contact: {
          title: 'Contactez-nous',
          desc: 'Posez vos questions ou demandez des détails sur nos prochaines formations.',
          labels: {
            phone: 'Téléphone',
            email: 'Email'
          },
          hours: {
            title: 'Heures d\'Ouverture',
            desc: 'Notre bureau administratif est ouvert pour les demandes et le support du lundi au vendredi, de 09h00 à 18h00 (GMT+1). Nous répondons généralement aux emails dans les 24 heures.'
          },
          locations: {
            title: 'Lieux de Formation',
            desc: 'Nos sessions pratiques se déroulent dans des centres de formation médicale de pointe à Alger et dans des infrastructures CHU partenaires à travers l\'Algérie et à l\'international.'
          },
          commitment: {
            title: 'Engagement Support',
            desc: 'Nous nous engageons à fournir un accompagnement personnalisé à chaque professionnel de santé. Si vous avez des demandes spécifiques de curriculum ou besoin d\'aide pour la planification des sessions, n\'hésitez pas à nous contacter.'
          },
          form: {
            name: 'Votre nom',
            namePlaceholder: 'Entrez votre nom',
            email: 'Votre email*',
            emailPlaceholder: 'Entrez votre email',
            submit: 'Envoyer'
          }
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
          events: 'Événements',
          articles: 'Articles',
          backToSite: 'Retour au site',
          logout: 'Déconnexion'
        },
        orders: {
          filterClient: 'Filtrer par client...',
          allStatuses: 'Tous les statuts',
          status: {
            pending: 'En attente',
            approved: 'Approuvé',
            paid: 'Payé',
            completed: 'Complété',
            cancelled: 'Annulé'
          },
          reset: 'Réinitialiser',
          billingAddress: 'Adresse de Facturation',
          name: 'Nom',
          address: 'Adresse',
          city: 'Ville',
          postalCode: 'Code Postal',
          hideAddress: 'Masquer Adresse',
          showAddress: 'Voir Adresse',
          deleteOrder: 'Supprimer la commande'
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
          uploadLogo: 'Télécharger le logo',
          smtpConfig: 'Configuration SMTP (Contact)',
          smtpHost: 'Hôte SMTP',
          smtpPort: 'Port SMTP',
          smtpUser: 'Utilisateur SMTP',
          smtpPass: 'Mot de passe SMTP',
          smtpFrom: 'Expéditeur (From Email)',
          smtpAdmin: 'Email de destination (Admin)'
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
          totalOrders: 'Commandes Totales',
          recentOrders: 'Commandes Récentes'
        },
        courses: {
          title: 'Cours répertoriés',
          addCourse: 'Ajouter un cours',
          editCourse: 'Modifier le cours',
          newCourse: 'Ajouter un nouveau cours',
          contentRequired: 'Veuillez ajouter au moins un module et une leçon au contenu du cours.',
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
          defaultLessonTitle: 'Nouvelle Leçon',
          successCreate: 'Cours créé avec succès',
          successUpdate: 'Cours mis à jour',
          loadError: 'Format de cours non trouvé',
          settingsAndPricing: 'Paramètres et Tarification',
          freePreview: 'Aperçu gratuit',
          saveCourse: 'Enregistrer le Cours'
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
        articles: {
          title: 'Articles répertoriés',
          addArticle: 'Ajouter un article',
          editArticle: 'Modifier l\'article',
          newArticle: 'Ajouter un nouvel article',
          excerpt: 'Extrait',
          content: 'Contenu',
          status: 'Statut',
          author: 'Auteur',
          category: 'Catégorie',
          deleteConfirm: 'Supprimer cet article ?',
          successUpdate: 'Article mis à jour',
          successCreate: 'Article créé',
          errorSave: 'Erreur lors de l\'enregistrement',
          errorConn: 'Erreur de connexion',
          published: 'Publié',
          draft: 'Brouillon'
        },
        events: {
          title: 'Événements répertoriés',
          addEvent: 'Ajouter un événement',
          editEvent: 'Modifier l\'événement',
          newEvent: 'Ajouter un nouvel événement',
          date: 'Date',
          location: 'Lieu',
          price: 'Prix',
          category: 'Catégorie',
          deleteConfirm: 'Supprimer cet événement ?',
          successUpdate: 'Événement mis à jour',
          successCreate: 'Événement créé',
          errorSave: 'Erreur lors de l\'enregistrement',
          free: 'Gratuit',
          paid: 'Payant',
          type: 'Type d\'événement',
          banner: 'Image de bannière (URL)',
          status: 'Statut'
        },
        common: {
          client: 'Client',
          date: 'Date',
          amount: 'Montant',
          statusLabel: 'Statut',
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
          select: 'Sélectionner',
          saving: 'Enregistrement...',
          frContent: 'Contenu Français',
          enContent: 'Contenu Anglais',
          upload: 'TÉLÉCHARGER',
          uploadSuccess: 'Image téléchargée',
          uploadError: 'Erreur lors du téléchargement',
          networkError: 'Erreur réseau lors du téléchargement',
          status: {
            published: 'Publié',
            draft: 'Brouillon'
          }
        }
      }
    }
  },
  en: {
    translation: {
      navbar: {
        home: 'Home',
        formations: 'Courses',
        inscription: 'Registration',
        paiement: 'Payment',
        events: 'Events',
        eventsSubtitle: 'Explore upcoming workshops, seminars, and medical events',
        services: 'Services',
        about: 'About Us',
        articles: 'Articles',
        contact: 'Contact',
        login: 'Login / Register',
        logout: 'Logout',
        admin: 'Admin',
        dashboard: 'Dashboard'
      },
      dashboard: {
        badge: 'Member Area',
        welcome: 'Welcome, {{name}}',
        desc: 'Access your courses and track your progress.',
        loading: 'Loading your courses...',
        noCourses: 'No courses found',
        noCoursesDesc: "You don't have any active courses yet. Explore our catalogue to start your learning journey.",
        catalogButton: 'View catalogue',
        continue: 'Continue',
        lesson: 'lesson',
        completed: 'Completed'
      },
      home: {
        hero: {
          fallbackTitle: 'Structured & Practical Medical Training Platform',
          fallbackBtn: 'Join Now',
          registerBtn: 'REGISTER',
          catalogueBtn: 'CATALOGUE'
        },
        features: {
          courses: {
            title: 'Courses',
            desc: 'Structured courses with clinical cases'
          },
          quiz: {
            title: 'Quiz',
            desc: 'Over 30 corrected quizzes included'
          },
          support: {
            title: 'Support',
            desc: 'Secure 24/7 online access'
          }
        },
        intro: {
          title: 'Master the fetal heart with structured courses and +30 corrected quizzes, and perfect your Doppler with courses and real clinical cases',
          cta: 'Learn More'
        },
        upcoming: {
          title: 'Upcoming Courses',
          subtitle: 'Practical training for gynecologists',
          details: 'More details',
          colpo: {
            tag: 'Colposcopy',
            title: 'Colposcopy Training Level 1 & Level 2',
            desc: 'Practical training for gynecologists wishing to deepen their skills in diagnostic and therapeutic colposcopy.'
          },
          prolapsus: {
            tag: 'Prolapse',
            title: 'PRACTICAL TRAINING IN VAGINAL SURGERY – PROLAPSE',
            desc: '100% practical training for gynecologists wishing to master the techniques of managing prolapse by vaginal route.'
          },
          hystero: {
            tag: 'Hysteroscopy',
            title: 'ADVANCED TRAINING IN OPERATIVE HYSTEROSCOPY',
            desc: 'Intended for gynecologists mastering diagnostic hysteroscopy (biopsies, simple polypectomies).'
          }
        }
      },
      instructors: {
        badge: 'Our Experts & Instructors',
        title: 'Learn with the Best',
        desc: 'Meet our team of healthcare professionals passionate about knowledge transfer.',
        searchPlaceholder: 'Search by name or specialty...',
        viewProfile: 'View profile',
        noResults: 'No instructor found',
        notFound: 'Instructor not found',
        backToList: 'Back to instructors',
        expertTag: 'Expert Instructor',
        contact: 'Contact',
        share: 'Share',
        about: 'About',
        coursesBy: 'Courses by',
        stats: {
          courses: 'Courses',
          students: 'Students',
          rating: 'Rating',
          experience: 'Experience'
        }
      },
      events: {
        title: 'Upcoming Events',
        desc: 'Register for our exclusive seminars, webinars, and workshops.',
        free: 'Free',
        paid: 'Paid',
        register: 'Register',
        buy: 'Buy Now',
        viewDetails: 'View Details',
        upcoming: 'Upcoming Events',
        past: 'Past Events',
        noEvents: 'No upcoming events at the moment.',
        all: 'All',
        location: 'Location',
        date: 'Date & Time',
        search: 'Search for an event...',
        noEventsFound: 'No events found',
        tryDifferentFilter: 'Try changing your filters or your search.',
        backToEvents: 'Back to events',
        time: 'Time',
        filter: {
          all: 'All',
          free: 'Free',
          paid: 'Paid'
        },
        registration: 'Registration',
        freeAdmission: 'Free Admission',
        registerNow: 'Register Now',
        buyTicket: 'Buy Ticket',
        limitedSeats: 'Limited seats - Book fast!',
        followUpdate: 'Follow our updates',
        socialPrompt: 'Join us on Instagram so you don\'t miss any of our upcoming events and live training sessions.',
        benefits: {
          access: 'Full access to conferences',
          materials: 'Training materials included',
          certification: 'Certificate of participation',
          networking: 'Networking session'
        },
        about: "About the event",
        bookSeat: 'Book my seat',
        program: 'Program'
      },
      footer: {
        desc: 'Expertise and structured medical training for healthcare professionals. Academic excellence and clinical practice.',
        navigation: 'Navigation',
        contact: 'Contact Us',
        newsletter: 'Subscribe',
        newsletterSub: 'Receive our latest training updates.',
        emailPlaceholder: 'Your email',
        subscribe: 'Subscribe now',
        privacy: 'Privacy Policy',
        legal: 'Terms & Conditions',
        rights: 'All rights reserved.'
      },
      blog: {
        badge: 'Blog & News',
        title: 'Our latest',
        titleAccent: 'Articles',
        category: 'Medicine',
        readMore: 'Read more',
        noArticles: 'No articles available at the moment.',
        notFound: 'Article not found',
        backToList: 'Back to articles',
        shareArticle: 'Share this article',
        shareDesc: 'Share the information within your professional network.',
        readyToLearn: 'Ready to deepen your skills?',
        readyDesc: 'Discover our certified training courses delivered by experts.',
        seeCourses: 'See our courses'
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
        },
        order: {
          successTitle: 'Payment Successful!',
          successDesc: 'Thank you for your purchase. Your order ID is #{{orderId}}.',
          successEmail: 'An email with your order details has been sent to you.',
          backDashboard: 'Go to My Dashboard'
        }
      },
      courseDetail: {
        notFound: 'Course not found',
        backToDashboard: 'Back to dashboard',
        selectLesson: 'Select a lesson',
        completed: 'Completed',
        noVideo: 'No video available',
        inProgress: 'In progress',
        markAsCompleted: 'Mark as completed',
        aboutLesson: 'About this lesson',
        noDescription: 'No description available',
        yourInstructor: 'Your Instructor',
        curriculum: 'Course Curriculum'
      },
      aboutPage: {
        title: 'About Us',
        desc: 'Welcome to our platform. We are dedicated to providing the best experience.'
      },
      auth: {
        login: {
          badge: 'Member Area',
          title: 'Welcome Back',
          desc: 'Access your exclusive training sessions',
          button: 'Login',
          loading: 'Logging in...',
          noAccount: 'No account yet?',
          registerLink: 'Create an account',
          emailPlaceholder: 'Professional Email',
          passwordPlaceholder: 'Password'
        },
        register: {
          badge: 'Member Registration',
          title: 'Join Us',
          desc: 'Join the elite of practitioners and access our exclusive programs.',
          button: 'Create account',
          loading: 'Creating account...',
          hasAccount: 'Already have an account?',
          loginLink: 'Login here',
          form: {
            name: 'Full Name',
            namePlaceholder: 'Dr. John Doe',
            email: 'Email',
            emailPlaceholder: 'contact@example.com',
            specialty: 'Specialty',
            specialtyPlaceholder: 'Gynecology, Cardiology...',
            city: 'City',
            cityPlaceholder: 'Abidjan, Paris...',
            phone: 'Phone',
            phonePlaceholder: '+225...',
            password: 'Password',
            passwordPlaceholder: '••••••••',
          }
        }
      },
      course: {
        badge: 'Course',
        unlimited: 'Unlimited access',
        instructor: 'Instructor',
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
      services_page: {
        title: 'Upcoming training courses',
        desc: 'Discover the details of each course with a dedicated image to better visualize your learning.',
        courses: {
          colpo: {
            title: 'Colposcopy Training Level 1 & Level 2',
            desc: 'Practical training for gynecologists wishing to deepen their skills in diagnostic and therapeutic colposcopy. Led by Professor Nawel Merrouche, head of department and renowned specialist in cervicovaginal screening, this training covers:',
            list: [
              'Diagnosis and management of precancerous cervical lesions (CIN 1, 2, 3)',
              'Detection of cervical condylomas and polyps',
              'Targeted biopsy techniques and interpretation of abnormalities',
              'Use of contrast solutions and lesion monitoring.'
            ],
            locations: {
              l1: 'Algiers Level 1: 🗓️ May 7-9, 2026',
              l2: 'Algiers Level 2: 🗓️ September 24-26, 2026'
            }
          },
          prolapsus: {
            title: 'PRACTICAL TRAINING IN VAGINAL SURGERY – PROLAPSE',
            desc: 'This 100% hands-on training program is designed for gynecologists who wish to master the techniques for managing prolapse vaginally.',
            desc2: 'Led by Professor Michel Cosson, a renowned expert in pelvic surgery, this course allows participants to practice and acquire reproducible surgical techniques in real-world conditions.',
            objectives: 'Objectives:',
            list: [
              'Mastery of prolapse correction techniques via the vaginal approach',
              'Standardization of surgical procedures',
              'Optimization of functional outcomes'
            ]
          },
          hystero: {
            title: 'ADVANCED TRAINING IN OPERATIVE HYSTEROSCOPY',
            desc: 'Designed for gynecologists experienced in diagnostic hysteroscopy (biopsies, simple polypectomies), this training program allows them to progress towards a more refined surgical practice.',
            desc2: 'Led by Professor Hervé Fernandez, an expert in hysteroscopic surgery, it focuses on acquiring precise and reproducible surgical techniques.',
            indications: 'Indications covered include:',
            list: 'Uterine synechiae - Isthmocele - Uterine septum - Common intracavitary pathologies'
          }
        },
        contact: {
          title: 'Contact us',
          desc: 'Ask your questions or request details about our upcoming training courses.',
          labels: {
            phone: 'Phone',
            email: 'Email'
          },
          hours: {
            title: 'Hours of Operation',
            desc: 'Our administration office is open for inquiries and support Monday through Friday, 09:00 AM – 06:00 PM (GMT+1). We typically respond to emails within 24 hours.'
          },
          locations: {
            title: 'Training Locations',
            desc: 'Our practical sessions are held at state-of-the-art medical training centers in Algiers and partner CHU facilities across Algeria and internationally.'
          },
          commitment: {
            title: 'Support Commitment',
            desc: 'We are committed to providing personalized guidance for every medical professional. If you have specific curriculum requests or need assistance with session scheduling, please do not hesitate to reach out.'
          },
          form: {
            name: 'Your name',
            namePlaceholder: 'Enter your name',
            email: 'Your email*',
            emailPlaceholder: 'Enter your email',
            submit: 'Send'
          }
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
          events: 'Events',
          articles: 'Articles',
          backToSite: 'Back to site',
          logout: 'Logout'
        },
        orders: {
          filterClient: 'Filter by client...',
          allStatuses: 'All statuses',
          status: {
            pending: 'Pending',
            approved: 'Approved',
            paid: 'Paid',
            completed: 'Completed',
            cancelled: 'Cancelled'
          },
          reset: 'Reset',
          billingAddress: 'Billing Address',
          name: 'Name',
          address: 'Address',
          city: 'City',
          postalCode: 'Postal Code',
          hideAddress: 'Hide Address',
          showAddress: 'Show Address',
          deleteOrder: 'Delete Order'
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
          uploadLogo: 'Upload Logo',
          smtpConfig: 'SMTP Configuration (Contact)',
          smtpHost: 'SMTP Host',
          smtpPort: 'SMTP Port',
          smtpUser: 'SMTP User',
          smtpPass: 'SMTP Password',
          smtpFrom: 'Sender (From Email)',
          smtpAdmin: 'Destination Email (Admin)'
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
          totalOrders: 'Total Orders',
          recentOrders: 'Recent Orders'
        },
        courses: {
          title: 'courses listed',
          addCourse: 'Add a course',
          editCourse: 'Edit course',
          newCourse: 'Add a new course',
          contentRequired: 'Please add at least one module and one lesson to the course content.',
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
          defaultLessonTitle: 'New Lesson',
          successCreate: 'Course created successfully',
          successUpdate: 'Course updated',
          loadError: 'Course format not found',
          settingsAndPricing: 'Settings and Pricing',
          freePreview: 'Free Preview',
          saveCourse: 'Save Course'
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
        articles: {
          title: 'Articles listed',
          addArticle: 'Add an article',
          editArticle: 'Edit article',
          newArticle: 'Add a new article',
          excerpt: 'Excerpt',
          content: 'Content',
          status: 'Status',
          author: 'Author',
          category: 'Category',
          deleteConfirm: 'Delete this article?',
          successUpdate: 'Article updated',
          successCreate: 'Article created',
          errorSave: 'Error during saving',
          errorConn: 'Connection error',
          published: 'Published',
          draft: 'Draft'
        },
        events: {
          title: 'Events listed',
          addEvent: 'Add an event',
          editEvent: 'Edit event',
          newEvent: 'Add a new event',
          date: 'Date',
          location: 'Location',
          price: 'Price',
          category: 'Category',
          deleteConfirm: 'Delete this event?',
          successUpdate: 'Event updated',
          successCreate: 'Event created',
          errorSave: 'Error during saving',
          free: 'Free',
          paid: 'Paid',
          type: 'Event Type',
          banner: 'Banner Image (URL)',
          status: 'Status'
        },
        common: {
          client: 'Client',
          date: 'Date',
          amount: 'Amount',
          statusLabel: 'Status',
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
          select: 'Select',
          saving: 'Saving...',
          frContent: 'French Content',
          enContent: 'English Content',
          upload: 'UPLOAD',
          uploadSuccess: 'Image uploaded',
          uploadError: 'Upload error',
          networkError: 'Network error during upload',
          status: {
            published: 'Published',
            draft: 'Draft'
          }
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
