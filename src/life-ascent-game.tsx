import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Clock, TrendingUp, Heart, Briefcase, Users, DollarSign, Brain, Star, Award, Target, Calendar, Sparkles } from 'lucide-react';

const LifeAscent = () => {
  const [gameState, setGameState] = useState({
    name: '',
    age: 18,
    day: 1,
    time: 8,
    energy: 100,
    money: 1000,
    stats: {
      health: { level: 1, xp: 0, xpNeeded: 100 },
      career: { level: 1, xp: 0, xpNeeded: 100 },
      social: { level: 1, xp: 0, xpNeeded: 100 },
      finance: { level: 1, xp: 0, xpNeeded: 100 },
      mental: { level: 1, xp: 0, xpNeeded: 100 },
      skills: { level: 1, xp: 0, xpNeeded: 100 },
      study: { level: 0, xp: 0, xpNeeded: 100 }
    },
    streak: 0,
    dailyQuests: [],
    career: 'Étudiant',
    careerPath: null,
    careerLevel: 0,
    salary: 0,
    university: null,
    studyProgress: 0,
    studyRequired: 1000,
    examsPassed: [],
    canStudy: true,
    examFailedToday: false
  });

  const [screen, setScreen] = useState('intro');
  const [notification, setNotification] = useState(null);
  const [particles, setParticles] = useState([]);
  const [event, setEvent] = useState(null);
  const [careerEvent, setCareerEvent] = useState(null);
  const [examModal, setExamModal] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examAnswers, setExamAnswers] = useState([]);
  const [progressExamModal, setProgressExamModal] = useState(null);
  const [miniGameModal, setMiniGameModal] = useState(null);
  const [miniGameState, setMiniGameState] = useState(null);
  const [shopModal, setShopModal] = useState(false);

  useEffect(() => {
    if (gameState.day > 1) {
      generateDailyQuests();
      checkCareerProgression();
      // Reset exam failed flag each new day
      setGameState(prev => ({ ...prev, examFailedToday: false, canStudy: true }));
    }
  }, [gameState.day]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  const generateDailyQuests = () => {
    const quests = [
      { id: 1, text: 'Faire de l\'exercice', reward: 50, stat: 'health', completed: false },
      { id: 2, text: 'Travailler sur votre carrière', reward: 50, stat: 'career', completed: false },
      { id: 3, text: 'Socialiser avec quelqu\'un', reward: 50, stat: 'social', completed: false }
    ];
    setGameState(prev => ({ ...prev, dailyQuests: quests }));
  };

  const startGame = (name) => {
    setGameState(prev => ({ 
      ...prev, 
      name
    }));
    setScreen('game');
    generateDailyQuests();
    showNotification(`Bienvenue ${name} ! Votre nouvelle vie commence ! 🎉`);
  };

  const addXP = (stat, amount) => {
    setGameState(prev => {
      const currentStat = prev.stats[stat];
      let newXp = currentStat.xp + amount;
      let newLevel = currentStat.level;
      let newXpNeeded = currentStat.xpNeeded;

      while (newXp >= newXpNeeded) {
        newXp -= newXpNeeded;
        newLevel += 1;
        newXpNeeded = Math.floor(newXpNeeded * 1.5);
        createParticles();
        showNotification(`🎊 LEVEL UP! ${stat.toUpperCase()} est maintenant niveau ${newLevel}!`, 'levelup');
      }

      return {
        ...prev,
        stats: {
          ...prev.stats,
          [stat]: { level: newLevel, xp: newXp, xpNeeded: newXpNeeded }
        }
      };
    });
  };

  const careerPaths = {
    tech: {
      name: 'Tech',
      icon: '💻',
      levels: [
        { title: 'Stagiaire Dev', salary: 800, requiredLevel: 1 },
        { title: 'Développeur Junior', salary: 2000, requiredLevel: 3 },
        { title: 'Développeur', salary: 3500, requiredLevel: 5 },
        { title: 'Senior Developer', salary: 5500, requiredLevel: 8 },
        { title: 'Tech Lead', salary: 7500, requiredLevel: 12 },
        { title: 'CTO', salary: 12000, requiredLevel: 15 }
      ],
      events: [
        {
          title: '🚀 Lancement Réussi',
          description: 'Votre projet a été un succès retentissant!',
          effects: { money: 1500 },
          xpGain: { career: 100, skills: 80 }
        }
      ]
    },
    business: {
      name: 'Business',
      icon: '💼',
      levels: [
        { title: 'Assistant', salary: 1000, requiredLevel: 1 },
        { title: 'Analyste', salary: 2500, requiredLevel: 3 },
        { title: 'Manager', salary: 4000, requiredLevel: 5 },
        { title: 'Senior Manager', salary: 6000, requiredLevel: 8 },
        { title: 'Directeur', salary: 9000, requiredLevel: 12 },
        { title: 'CEO', salary: 15000, requiredLevel: 15 }
      ],
      events: [
        {
          title: '📈 Deal Signé',
          description: 'Vous concluez un contrat majeur!',
          effects: { money: 3000 },
          xpGain: { career: 100, finance: 70 }
        }
      ]
    },
    creative: {
      name: 'Créatif',
      icon: '🎨',
      levels: [
        { title: 'Freelance Débutant', salary: 600, requiredLevel: 1 },
        { title: 'Designer Junior', salary: 1800, requiredLevel: 3 },
        { title: 'Designer', salary: 3000, requiredLevel: 5 },
        { title: 'Senior Designer', salary: 5000, requiredLevel: 8 },
        { title: 'Directeur Artistique', salary: 7000, requiredLevel: 12 },
        { title: 'Creative Director', salary: 10000, requiredLevel: 15 }
      ],
      events: [
        {
          title: '🏆 Prix Gagné',
          description: 'Votre travail remporte un prix prestigieux!',
          effects: { money: 2500 },
          xpGain: { career: 150, mental: 50 }
        }
      ]
    },
    medical: {
      name: 'Médical',
      icon: '⚕️',
      levels: [
        { title: 'Étudiant Médecine', salary: 500, requiredLevel: 1 },
        { title: 'Interne', salary: 2200, requiredLevel: 3 },
        { title: 'Médecin', salary: 5000, requiredLevel: 5 },
        { title: 'Médecin Spécialiste', salary: 7500, requiredLevel: 8 },
        { title: 'Chef de Service', salary: 10000, requiredLevel: 12 },
        { title: 'Professeur', salary: 13000, requiredLevel: 15 }
      ],
      events: [
        {
          title: '💖 Vie Sauvée',
          description: 'Vous sauvez la vie d\'un patient!',
          effects: {},
          xpGain: { career: 200, mental: 80 }
        }
      ]
    },
    finance: {
      name: 'Finance',
      icon: '💰',
      levels: [
        { title: 'Stagiaire Finance', salary: 900, requiredLevel: 1 },
        { title: 'Analyste Financier', salary: 2800, requiredLevel: 3 },
        { title: 'Trader', salary: 5500, requiredLevel: 5 },
        { title: 'Senior Trader', salary: 8500, requiredLevel: 8 },
        { title: 'Portfolio Manager', salary: 12000, requiredLevel: 12 },
        { title: 'CFO', salary: 18000, requiredLevel: 15 }
      ],
      events: [
        {
          title: '📊 Trade Parfait',
          description: 'Votre intuition était parfaite!',
          effects: { money: 5000 },
          xpGain: { finance: 150, career: 80 }
        }
      ]
    }
  };

  const universities = {
    tech: {
      name: 'École d\'Ingénierie',
      icon: '💻',
      hasExam: true,
      tuition: 5000,
      careerPath: 'tech',
      questions: [
        {
          q: 'Quel langage est principalement utilisé pour le web frontend?',
          options: ['Python', 'JavaScript', 'C++', 'Ruby'],
          correct: 1
        },
        {
          q: 'Que signifie HTML?',
          options: ['High Tech Markup Language', 'HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks Text Markup'],
          correct: 1
        },
        {
          q: 'Quelle est la complexité d\'une recherche binaire?',
          options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
          correct: 1
        },
        {
          q: 'Qu\'est-ce qu\'une API?',
          options: ['Un langage', 'Une interface de programmation', 'Une base de données', 'Un OS'],
          correct: 1
        },
        {
          q: 'Quel protocole pour le web sécurisé?',
          options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
          correct: 2
        }
      ],
      progressExams: [
        {
          threshold: 250,
          name: 'Examen Mi-Parcours',
          questions: [
            { q: 'Qu\'est-ce que le Git?', options: ['Un langage', 'Un système de contrôle de version', 'Un IDE', 'Un framework'], correct: 1 },
            { q: 'Que signifie CSS?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Code Style Sheets'], correct: 1 },
            { q: 'Qu\'est-ce qu\'un algorithme?', options: ['Un bug', 'Une séquence d\'instructions', 'Un langage', 'Un serveur'], correct: 1 },
            { q: 'Que fait la méthode push()?', options: ['Supprime', 'Ajoute à la fin', 'Trie', 'Recherche'], correct: 1 },
            { q: 'SQL est utilisé pour?', options: ['Styliser', 'Gérer des bases de données', 'Programmer', 'Débugger'], correct: 1 }
          ]
        },
        {
          threshold: 500,
          name: 'Examen Intermédiaire',
          questions: [
            { q: 'Qu\'est-ce que le polymorphisme?', options: ['Un bug', 'Un concept POO', 'Un langage', 'Un serveur'], correct: 1 },
            { q: 'REST API utilise quel protocole?', options: ['FTP', 'HTTP', 'SMTP', 'SSH'], correct: 1 },
            { q: 'Que fait async/await?', options: ['Accélère le code', 'Gère l\'asynchrone', 'Compile', 'Débugge'], correct: 1 },
            { q: 'Qu\'est-ce qu\'un framework?', options: ['Un bug', 'Une structure de développement', 'Un langage', 'Un OS'], correct: 1 },
            { q: 'MVC signifie?', options: ['Model View Controller', 'Main Visual Code', 'Modern View Concept', 'Multiple View Control'], correct: 0 }
          ]
        },
        {
          threshold: 750,
          name: 'Examen Pré-Final',
          questions: [
            { q: 'Qu\'est-ce que Docker?', options: ['Un langage', 'Une plateforme de conteneurisation', 'Un IDE', 'Un framework'], correct: 1 },
            { q: 'Design pattern Singleton fait quoi?', options: ['Plusieurs instances', 'Une seule instance', 'Aucune instance', 'Instances infinies'], correct: 1 },
            { q: 'CI/CD signifie?', options: ['Code Integration/Deployment', 'Continuous Integration/Deployment', 'Computer Install/Debug', 'Create Import/Delete'], correct: 1 },
            { q: 'Qu\'est-ce que Redux?', options: ['Un langage', 'Un gestionnaire d\'état', 'Un serveur', 'Un framework CSS'], correct: 1 },
            { q: 'WebSocket permet?', options: ['Communication unidirectionnelle', 'Communication bidirectionnelle en temps réel', 'Stockage', 'Compilation'], correct: 1 }
          ]
        }
      ]
    },
    business: {
      name: 'École de Commerce',
      icon: '💼',
      hasExam: true,
      tuition: 6000,
      careerPath: 'business',
      questions: [
        {
          q: 'Que signifie ROI?',
          options: ['Return on Investment', 'Rate of Interest', 'Revenue of Income', 'Risk of Investment'],
          correct: 0
        },
        {
          q: 'Matrice d\'analyse stratégique BCG?',
          options: ['SWOT', 'PESTEL', 'Matrice BCG', 'Porter 5 Forces'],
          correct: 2
        },
        {
          q: 'Le Marketing Mix c\'est?',
          options: ['2P', '4P', '6P', '8P'],
          correct: 1
        },
        {
          q: 'Analyse de l\'environnement externe?',
          options: ['SWOT', 'PESTEL', 'BCG', 'Balanced Scorecard'],
          correct: 1
        },
        {
          q: 'Le taux de marge mesure?',
          options: ['Liquidité', 'Rentabilité', 'Solvabilité', 'Productivité'],
          correct: 1
        }
      ],
      progressExams: [
        {
          threshold: 250,
          name: 'Examen Mi-Parcours',
          questions: [
            { q: 'Qu\'est-ce que le SWOT?', options: ['Un ratio', 'Une analyse Forces/Faiblesses', 'Un produit', 'Un marché'], correct: 1 },
            { q: 'KPI signifie?', options: ['Key Performance Indicator', 'Keep Product Innovative', 'Know Price Index', 'Key Product Information'], correct: 0 },
            { q: 'B2B signifie?', options: ['Business to Business', 'Brand to Brand', 'Buy to Buy', 'Back to Back'], correct: 0 },
            { q: 'Qu\'est-ce que le benchmarking?', options: ['Vendre', 'Comparer avec concurrents', 'Produire', 'Investir'], correct: 1 },
            { q: 'Le cash flow c\'est?', options: ['Le stock', 'Le flux de trésorerie', 'Le profit', 'La dette'], correct: 1 }
          ]
        },
        {
          threshold: 500,
          name: 'Examen Intermédiaire',
          questions: [
            { q: 'Blue Ocean Strategy?', options: ['Océan bleu = nouveaux marchés', 'Stratégie maritime', 'Écologie', 'Export'], correct: 0 },
            { q: 'Qu\'est-ce que le churn rate?', options: ['Taux de profit', 'Taux d\'attrition clients', 'Taux de croissance', 'Taux d\'intérêt'], correct: 1 },
            { q: 'MVP signifie?', options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Market Value Price'], correct: 1 },
            { q: 'Lean Startup c\'est?', options: ['Startup pauvre', 'Méthodologie de développement agile', 'Type de financement', 'Secteur d\'activité'], correct: 1 },
            { q: 'CAC signifie?', options: ['Customer Acquisition Cost', 'Company Annual Cost', 'Client Account Code', 'Corporate Asset Capital'], correct: 0 }
          ]
        },
        {
          threshold: 750,
          name: 'Examen Pré-Final',
          questions: [
            { q: 'Qu\'est-ce que le LBO?', options: ['Un prêt', 'Leveraged Buy-Out', 'Un bonus', 'Un indicateur'], correct: 1 },
            { q: 'Due diligence c\'est?', options: ['Audit approfondi', 'Diligence des employés', 'Processus de vente', 'Formation'], correct: 0 },
            { q: 'Scalabilité signifie?', options: ['Capacité à croître sans proportionnalité des coûts', 'Capacité à vendre', 'Capacité à produire', 'Capacité à investir'], correct: 0 },
            { q: 'Burn rate c\'est?', options: ['Taux de profit', 'Vitesse de consommation de trésorerie', 'Taux de croissance', 'Taux d\'inflation'], correct: 1 },
            { q: 'Pivot en startup?', options: ['Croissance rapide', 'Changement stratégique majeur', 'Levée de fonds', 'Acquisition'], correct: 1 }
          ]
        }
      ]
    },
    creative: {
      name: 'École d\'Arts et Design',
      icon: '🎨',
      hasExam: false,
      tuition: 4000,
      careerPath: 'creative',
      progressExams: [
        {
          threshold: 250,
          name: 'Revue Mi-Parcours',
          questions: [
            { q: 'RGB signifie?', options: ['Red Green Blue', 'Real Good Beauty', 'Random Graphics Base', 'Rich Graphic Background'], correct: 0 },
            { q: 'Typographie sans-serif?', options: ['Avec empattements', 'Sans empattements', 'Manuscrite', 'Décorative'], correct: 1 },
            { q: 'Règle des tiers en photo?', options: ['Diviser en 3 parties égales', 'Grille 3x3', 'Trois couleurs', 'Trois sujets'], correct: 1 },
            { q: 'Qu\'est-ce que le kerning?', options: ['Espace entre lettres', 'Taille police', 'Couleur texte', 'Style police'], correct: 0 },
            { q: 'CMYK pour?', options: ['Web', 'Impression', 'Vidéo', 'Animation'], correct: 1 }
          ]
        },
        {
          threshold: 500,
          name: 'Revue Intermédiaire',
          questions: [
            { q: 'Nombre d\'or en design?', options: ['1.414', '1.618', '2.0', '3.14'], correct: 1 },
            { q: 'Flat design c\'est?', options: ['Design 3D', 'Design minimaliste 2D', 'Design texturé', 'Design baroque'], correct: 1 },
            { q: 'UI signifie?', options: ['User Interface', 'Unique Idea', 'Universal Image', 'Updated Item'], correct: 0 },
            { q: 'Wireframe c\'est?', options: ['Maquette finale', 'Schéma de structure', 'Photo', 'Logo'], correct: 1 },
            { q: 'DPI pour impression?', options: ['72', '150', '300', '600'], correct: 2 }
          ]
        },
        {
          threshold: 750,
          name: 'Revue Pré-Finale',
          questions: [
            { q: 'Design thinking phase 1?', options: ['Prototyper', 'Empathie', 'Tester', 'Définir'], correct: 1 },
            { q: 'Gestalt principles?', options: ['Principes de perception visuelle', 'Techniques de peinture', 'Styles typographiques', 'Formats d\'image'], correct: 0 },
            { q: 'A/B testing c\'est?', options: ['Test de couleurs', 'Comparaison de deux versions', 'Test utilisateur', 'Test technique'], correct: 1 },
            { q: 'Responsive design pour?', options: ['Répondre vite', 'Adapter à différents écrans', 'Design rapide', 'Design simple'], correct: 1 },
            { q: 'Affordance en UX?', options: ['Prix du design', 'Capacité perçue d\'un objet', 'Vitesse de chargement', 'Qualité visuelle'], correct: 1 }
          ]
        }
      ]
    },
    medical: {
      name: 'Faculté de Médecine',
      icon: '⚕️',
      hasExam: true,
      tuition: 8000,
      careerPath: 'medical',
      questions: [
        {
          q: 'Quel organe pompe le sang?',
          options: ['Les poumons', 'Le foie', 'Le cœur', 'Les reins'],
          correct: 2
        },
        {
          q: 'Combien d\'os dans le corps adulte?',
          options: ['186', '206', '226', '246'],
          correct: 1
        },
        {
          q: 'Vitamine produite par le soleil?',
          options: ['Vitamine A', 'Vitamine C', 'Vitamine D', 'Vitamine E'],
          correct: 2
        },
        {
          q: 'Cellule qui transporte l\'oxygène?',
          options: ['Globules blancs', 'Plaquettes', 'Globules rouges', 'Plasma'],
          correct: 2
        },
        {
          q: 'Plus grand organe du corps?',
          options: ['Le foie', 'Le cerveau', 'La peau', 'L\'estomac'],
          correct: 2
        }
      ],
      progressExams: [
        {
          threshold: 250,
          name: 'Examen Anatomie',
          questions: [
            { q: 'Combien de chambres dans le cœur?', options: ['2', '3', '4', '5'], correct: 2 },
            { q: 'Artère principale du corps?', options: ['Artère pulmonaire', 'Aorte', 'Carotide', 'Fémorale'], correct: 1 },
            { q: 'Fonction des poumons?', options: ['Filtrer le sang', 'Échanger O2/CO2', 'Digérer', 'Pomper le sang'], correct: 1 },
            { q: 'Où se trouve le pancréas?', options: ['Thorax', 'Abdomen', 'Pelvis', 'Crâne'], correct: 1 },
            { q: 'Plus petit os du corps?', options: ['Étrier (oreille)', 'Phalange', 'Rotule', 'Clavicule'], correct: 0 }
          ]
        },
        {
          threshold: 500,
          name: 'Examen Physiologie',
          questions: [
            { q: 'pH sanguin normal?', options: ['6.4', '7.4', '8.4', '9.4'], correct: 1 },
            { q: 'Rôle de l\'hémoglobine?', options: ['Coagulation', 'Transport O2', 'Immunité', 'Digestion'], correct: 1 },
            { q: 'Fonction des reins?', options: ['Produire bile', 'Filtrer sang/déchets', 'Digérer', 'Respirer'], correct: 1 },
            { q: 'Neurotransmetteur du bonheur?', options: ['Adrénaline', 'Dopamine', 'Cortisol', 'Insuline'], correct: 1 },
            { q: 'Fréquence cardiaque normale (bpm)?', options: ['40-60', '60-100', '100-140', '140-180'], correct: 1 }
          ]
        },
        {
          threshold: 750,
          name: 'Examen Pathologie',
          questions: [
            { q: 'Diabète type 1?', options: ['Résistance insuline', 'Manque production insuline', 'Excès insuline', 'Pas lié insuline'], correct: 1 },
            { q: 'Signe d\'AVC?', options: ['Toux', 'Asymétrie faciale', 'Fièvre', 'Éternuement'], correct: 1 },
            { q: 'Cancer le plus mortel?', options: ['Sein', 'Poumon', 'Prostate', 'Côlon'], correct: 1 },
            { q: 'Hypertension artérielle?', options: ['< 120/80', '> 140/90', '< 90/60', '> 200/120'], correct: 1 },
            { q: 'Anémie c\'est?', options: ['Excès globules rouges', 'Manque globules rouges', 'Excès globules blancs', 'Manque plaquettes'], correct: 1 }
          ]
        }
      ]
    },
    finance: {
      name: 'École de Finance',
      icon: '💰',
      hasExam: true,
      tuition: 7000,
      careerPath: 'finance',
      questions: [
        {
          q: 'Diversification en investissement?',
          options: ['Tout dans une action', 'Répartir ses investissements', 'Vendre rapidement', 'Acheter actions'],
          correct: 1
        },
        {
          q: 'Qu\'est-ce qu\'une obligation?',
          options: ['Part d\'entreprise', 'Prêt à une entité', 'Une devise', 'Fonds investissement'],
          correct: 1
        },
        {
          q: 'Le P/E ratio représente?',
          options: ['Prix/Émission', 'Prix/Bénéfice', 'Profit/Équité', 'Performance/Évaluation'],
          correct: 1
        },
        {
          q: 'Qu\'est-ce que l\'inflation?',
          options: ['Baisse prix', 'Hausse générale prix', 'Stabilité prix', 'Variation taux'],
          correct: 1
        },
        {
          q: 'Liquidité d\'un actif?',
          options: ['Sa valeur', 'Facilité conversion cash', 'Son risque', 'Son rendement'],
          correct: 1
        }
      ],
      progressExams: [
        {
          threshold: 250,
          name: 'Examen Marchés Financiers',
          questions: [
            { q: 'Bourse c\'est?', options: ['Marché de devises', 'Marché d\'actions', 'Marché immobilier', 'Marché de l\'or'], correct: 1 },
            { q: 'Bull market?', options: ['Marché baissier', 'Marché haussier', 'Marché stable', 'Marché fermé'], correct: 1 },
            { q: 'IPO signifie?', options: ['Initial Public Offering', 'International Price Order', 'Investment Profit Option', 'Index Price Organization'], correct: 0 },
            { q: 'Dividende c\'est?', options: ['Part de profit distribuée', 'Frais de transaction', 'Impôt', 'Dette'], correct: 0 },
            { q: 'ETF c\'est?', options: ['Fonds négocié en bourse', 'Action individuelle', 'Obligation', 'Devise'], correct: 0 }
          ]
        },
        {
          threshold: 500,
          name: 'Examen Analyse Financière',
          questions: [
            { q: 'ROE mesure?', options: ['Rentabilité capitaux propres', 'Rentabilité actifs', 'Liquidité', 'Solvabilité'], correct: 0 },
            { q: 'EBITDA c\'est?', options: ['Bénéfice avant intérêts/impôts/amortissement', 'Chiffre d\'affaires', 'Dette totale', 'Capital social'], correct: 0 },
            { q: 'Ratio de solvabilité?', options: ['Actifs/Passifs', 'Dettes/Capitaux propres', 'Profit/CA', 'CA/Actifs'], correct: 1 },
            { q: 'Free cash flow?', options: ['Cash disponible après investissements', 'Cash total', 'Cash des ventes', 'Cash emprunté'], correct: 0 },
            { q: 'Working capital?', options: ['Actifs circulants - Passifs circulants', 'Total actifs', 'Total passifs', 'Capital social'], correct: 0 }
          ]
        },
        {
          threshold: 750,
          name: 'Examen Produits Dérivés',
          questions: [
            { q: 'Option call?', options: ['Droit d\'acheter', 'Droit de vendre', 'Obligation d\'acheter', 'Obligation de vendre'], correct: 0 },
            { q: 'Hedging c\'est?', options: ['Spéculer', 'Se couvrir contre risque', 'Maximiser profit', 'Éviter impôts'], correct: 1 },
            { q: 'Future contract?', options: ['Contrat au comptant', 'Contrat à terme standardisé', 'Option', 'Swap'], correct: 1 },
            { q: 'VaR (Value at Risk)?', options: ['Valeur actuelle', 'Perte potentielle maximale', 'Gain espéré', 'Prix moyen'], correct: 1 },
            { q: 'Arbitrage c\'est?', options: ['Médiation', 'Profiter écarts de prix', 'Spéculation', 'Investissement long terme'], correct: 1 }
          ]
        }
      ]
    }
  };

  const startExam = (universityKey) => {
    const uni = universities[universityKey];
    if (!uni.hasExam) {
      enrollInUniversity(universityKey);
      return;
    }
    
    setExamModal({
      university: universityKey,
      questions: uni.questions
    });
    setCurrentQuestion(0);
    setExamAnswers([]);
  };

  const answerQuestion = (answerIndex) => {
    const newAnswers = [...examAnswers, answerIndex];
    setExamAnswers(newAnswers);
    
    if (currentQuestion < examModal.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = newAnswers.reduce((acc, answer, idx) => {
        return acc + (answer === examModal.questions[idx].correct ? 1 : 0);
      }, 0);
      
      const passed = score >= 3;
      
      if (passed) {
        enrollInUniversity(examModal.university);
        createParticles();
        showNotification(`🎉 Réussi! Examen: ${score}/5!`, 'levelup');
      } else {
        showNotification(`😔 Échec: ${score}/5. Réessayez demain!`, 'error');
      }
      
      setExamModal(null);
      setCurrentQuestion(0);
      setExamAnswers([]);
    }
  };

  const enrollInUniversity = (universityKey) => {
    const uni = universities[universityKey];
    setGameState(prev => ({
      ...prev,
      university: universityKey,
      money: prev.money - uni.tuition
    }));
    showNotification(`🎓 Inscrit à ${uni.name}!`, 'success');
  };

  const graduateFromUniversity = () => {
    const uni = universities[gameState.university];
    const career = careerPaths[uni.careerPath];
    
    setGameState(prev => ({
      ...prev,
      career: career.levels[0].title,
      careerPath: uni.careerPath,
      careerLevel: 0,
      salary: career.levels[0].salary,
      university: null,
      studyProgress: 0
    }));
    
    createParticles();
    showNotification(`🎓 DIPLÔMÉ! Vous êtes ${career.levels[0].title}!`, 'levelup');
  };

  const studyActivity = (intensity) => {
    if (!gameState.canStudy) {
      showNotification('❌ Vous devez passer l\'examen de progression avant de continuer!', 'error');
      return;
    }

    const intensities = {
      lazy: { 
        name: 'Étude Fainéante', 
        duration: 2, 
        energy: 15, 
        studyXp: 30, 
        otherXp: 10,
        icon: '😴'
      },
      normal: { 
        name: 'Étude Normale', 
        duration: 3, 
        energy: 25, 
        studyXp: 60, 
        otherXp: 20,
        icon: '📚'
      },
      diligent: { 
        name: 'Étude Assidue', 
        duration: 4, 
        energy: 40, 
        studyXp: 100, 
        otherXp: 30,
        icon: '🔥'
      }
    };
    
    const study = intensities[intensity];
    
    if (gameState.time + study.duration > 24) {
      showNotification('Pas assez de temps!', 'error');
      return;
    }
    if (gameState.energy < study.energy) {
      showNotification('Pas assez d\'énergie!', 'error');
      return;
    }
    
    const newProgress = gameState.studyProgress + study.studyXp;
    const graduated = newProgress >= gameState.studyRequired;
    
    // Vérifier si on atteint un seuil d'examen
    const uni = universities[gameState.university];
    const nextExam = uni.progressExams?.find(exam => 
      newProgress >= exam.threshold && !gameState.examsPassed.includes(exam.threshold)
    );
    
    setGameState(prev => ({
      ...prev,
      time: prev.time + study.duration,
      energy: Math.max(0, prev.energy - study.energy),
      studyProgress: graduated ? prev.studyRequired : newProgress
    }));
    
    addXP('study', study.studyXp);
    addXP('skills', study.otherXp);
    addXP('mental', study.otherXp);
    
    if (graduated) {
      setTimeout(() => graduateFromUniversity(), 1000);
    } else if (nextExam) {
      setGameState(prev => ({ ...prev, canStudy: false }));
      setTimeout(() => {
        setProgressExamModal({
          exam: nextExam,
          university: gameState.university
        });
        setCurrentQuestion(0);
        setExamAnswers([]);
      }, 1000);
      showNotification(`⚠️ Examen de progression requis: ${nextExam.name}!`, 'levelup');
    } else {
      showNotification(`${study.icon} ${study.name}! ${Math.round((newProgress/gameState.studyRequired)*100)}%`);
    }
    
    // Déclencher un événement aléatoire après l'étude
    setTimeout(() => {
      if (Math.random() < 0.3) {
        triggerRandomEvent();
      }
    }, 1000);
  };

  const answerProgressExam = (answerIndex) => {
    const newAnswers = [...examAnswers, answerIndex];
    setExamAnswers(newAnswers);
    
    if (currentQuestion < progressExamModal.exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = newAnswers.reduce((acc, answer, idx) => {
        return acc + (answer === progressExamModal.exam.questions[idx].correct ? 1 : 0);
      }, 0);
      
      const passed = score >= 3;
      
      if (passed) {
        setGameState(prev => ({
          ...prev,
          examsPassed: [...prev.examsPassed, progressExamModal.exam.threshold],
          canStudy: true,
          examFailedToday: false
        }));
        createParticles();
        showNotification(`✅ ${progressExamModal.exam.name} réussi! (${score}/5) Vous pouvez continuer vos études!`, 'levelup');
      } else {
        setGameState(prev => ({
          ...prev,
          canStudy: false,
          examFailedToday: true,
          energy: Math.max(0, prev.energy - 30),
          studyProgress: Math.max(0, prev.studyProgress - 50)
        }));
        showNotification(`❌ Échec: ${score}/5. -30 énergie, -50 progression. Réessayez demain!`, 'error');
      }
      
      setProgressExamModal(null);
      setCurrentQuestion(0);
      setExamAnswers([]);
    }
  };

  const randomEvents = {
    good: [
      {
        title: '🎁 Bonus Surprise!',
        description: 'Prime exceptionnelle!',
        effects: { money: 500 },
        xpGain: { career: 30 }
      },
      {
        title: '💝 Rencontre Inspirante',
        description: 'Quelqu\'un vous motive!',
        effects: { energy: 20 },
        xpGain: { social: 40, mental: 30 }
      },
      {
        title: '🎰 Investissement Payant',
        description: 'Vos investissements rapportent!',
        effects: { money: 800 },
        xpGain: { finance: 60 }
      },
      {
        title: '⚡ Regain d\'Énergie',
        description: 'Pleine forme aujourd\'hui!',
        effects: { energy: 30 },
        xpGain: { health: 25, mental: 25 }
      }
    ],
    bad: [
      {
        title: '💸 Dépense Imprévue',
        description: 'Panne d\'ordinateur...',
        effects: { money: -400 },
        xpGain: {}
      },
      {
        title: '😷 Petit Rhume',
        description: 'Vous êtes malade...',
        effects: { energy: -30 },
        xpGain: {}
      },
      {
        title: '📉 Perte Financière',
        description: 'Investissement raté...',
        effects: { money: -300 },
        xpGain: {}
      },
      {
        title: '😴 Mauvaise Nuit',
        description: 'Mal dormi...',
        effects: { energy: -20 },
        xpGain: {}
      }
    ]
  };

  const triggerRandomEvent = () => {
    if (Math.random() < 0.4) {
      const isGoodEvent = Math.random() < 0.5;
      const eventList = isGoodEvent ? randomEvents.good : randomEvents.bad;
      const selectedEvent = eventList[Math.floor(Math.random() * eventList.length)];
      
      setEvent({
        ...selectedEvent,
        type: isGoodEvent ? 'good' : 'bad'
      });
    }
  };

  const handleEventChoice = () => {
    if (!event) return;

    setGameState(prev => {
      let newState = { ...prev };
      
      if (event.effects.money) {
        newState.money = Math.max(0, prev.money + event.effects.money);
      }
      if (event.effects.energy) {
        newState.energy = Math.max(0, Math.min(100, prev.energy + event.effects.energy));
      }
      
      return newState;
    });

    Object.entries(event.xpGain).forEach(([stat, xp]) => {
      addXP(stat, xp);
    });

    if (event.type === 'good') {
      createParticles();
    }

    setEvent(null);
  };

  const checkCareerProgression = () => {
    if (!gameState.careerPath) return;

    const careerPath = careerPaths[gameState.careerPath];
    const currentCareerLevel = gameState.careerLevel;
    const nextLevel = careerPath.levels[currentCareerLevel + 1];

    if (nextLevel && gameState.stats.career.level >= nextLevel.requiredLevel) {
      setCareerEvent({
        type: 'promotion',
        currentTitle: careerPath.levels[currentCareerLevel].title,
        newTitle: nextLevel.title,
        oldSalary: careerPath.levels[currentCareerLevel].salary,
        newSalary: nextLevel.salary
      });
    } else if (Math.random() < 0.15 && careerPath.events.length > 0) {
      const randomEvent = careerPath.events[Math.floor(Math.random() * careerPath.events.length)];
      setCareerEvent({
        type: 'event',
        ...randomEvent
      });
    }
  };

  const handleCareerEvent = () => {
    if (!careerEvent) return;

    if (careerEvent.type === 'promotion') {
      setGameState(prev => ({
        ...prev,
        career: careerEvent.newTitle,
        careerLevel: prev.careerLevel + 1,
        salary: careerEvent.newSalary
      }));
      createParticles();
      showNotification(`🎊 PROMOTION! ${careerEvent.newTitle}!`, 'levelup');
    } else {
      setGameState(prev => {
        let newState = { ...prev };
        
        if (careerEvent.effects && careerEvent.effects.money) {
          newState.money = Math.max(0, prev.money + careerEvent.effects.money);
        }
        if (careerEvent.effects && careerEvent.effects.energy) {
          newState.energy = Math.max(0, Math.min(100, prev.energy + careerEvent.effects.energy));
        }
        
        return newState;
      });

      if (careerEvent.xpGain) {
        Object.entries(careerEvent.xpGain).forEach(([stat, xp]) => {
          addXP(stat, xp);
        });
      }
    }

    setCareerEvent(null);
  };

  const performActivity = (activity) => {
    if (gameState.time + activity.duration > 24) {
      showNotification('Pas assez de temps!', 'error');
      return;
    }
    if (gameState.energy < activity.energyCost) {
      showNotification('Pas assez d\'énergie!', 'error');
      return;
    }

    setGameState(prev => ({
      ...prev,
      time: prev.time + activity.duration,
      energy: Math.max(0, prev.energy - activity.energyCost),
      money: prev.money + (activity.moneyGain || 0)
    }));

    Object.entries(activity.xpGain).forEach(([stat, xp]) => {
      addXP(stat, xp);
    });

    if (activity.questType) {
      setGameState(prev => ({
        ...prev,
        dailyQuests: prev.dailyQuests.map(q => 
          q.stat === activity.questType && !q.completed 
            ? { ...q, completed: true } 
            : q
        )
      }));
    }

    showNotification(activity.successMessage);
    
    // 20% chance de déclencher un mini-jeu après certaines activités
    if (activity.miniGameChance && Math.random() < 0.2) {
      setTimeout(() => {
        startMiniGame(activity.miniGameType);
      }, 1500);
    } else {
      // Déclencher un événement aléatoire après l'activité
      setTimeout(() => {
        if (Math.random() < 0.3) {
          triggerRandomEvent();
        }
      }, 1000);
    }
  };

  const startMiniGame = (type) => {
    if (type === 'memory') {
      // Jeu de mémoire pour Mental/Skills
      const symbols = ['🎯', '⚡', '🌟', '💎', '🔥', '💫'];
      const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
      setMiniGameModal('memory');
      setMiniGameState({
        cards,
        flipped: [],
        matched: [],
        attempts: 0,
        maxAttempts: 15
      });
    } else if (type === 'reflex') {
      // Jeu de réflexes pour Health
      setMiniGameModal('reflex');
      setMiniGameState({
        score: 0,
        timeLeft: 10,
        targetPosition: { x: 50, y: 50 },
        clicks: 0
      });
      
      // Démarrer le timer
      const interval = setInterval(() => {
        setMiniGameState(prev => {
          if (!prev || prev.timeLeft <= 0) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, timeLeft: prev.timeLeft - 0.1 };
        });
      }, 100);
    } else if (type === 'pattern') {
      // Jeu de pattern pour Skills/Mental
      const sequence = Array.from({ length: 5 }, () => Math.floor(Math.random() * 4));
      setMiniGameModal('pattern');
      setMiniGameState({
        sequence,
        userSequence: [],
        showSequence: true,
        level: 1
      });
      
      // Montrer la séquence
      setTimeout(() => {
        setMiniGameState(prev => ({ ...prev, showSequence: false }));
      }, 3000);
    } else if (type === 'typing') {
      // Jeu de typing pour Career/Skills
      const words = ['function', 'algorithm', 'database', 'interface', 'development', 'programming', 'software', 'application'];
      const targetWord = words[Math.floor(Math.random() * words.length)];
      setMiniGameModal('typing');
      setMiniGameState({
        targetWord,
        currentInput: '',
        timeLeft: 10,
        wordsCompleted: 0
      });
      
      const interval = setInterval(() => {
        setMiniGameState(prev => {
          if (!prev || prev.timeLeft <= 0) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, timeLeft: prev.timeLeft - 0.1 };
        });
      }, 100);
    } else if (type === 'math') {
      // Jeu de calcul mental pour Finance/Mental
      const generateProblem = () => {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 50) + 10;
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let answer;
        if (op === '+') answer = a + b;
        else if (op === '-') answer = a - b;
        else answer = a * b;
        return { question: `${a} ${op} ${b}`, answer };
      };
      
      setMiniGameModal('math');
      setMiniGameState({
        ...generateProblem(),
        userAnswer: '',
        score: 0,
        timeLeft: 15
      });
      
      const interval = setInterval(() => {
        setMiniGameState(prev => {
          if (!prev || prev.timeLeft <= 0) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, timeLeft: prev.timeLeft - 0.1 };
        });
      }, 100);
    }
  };

  const handleMemoryClick = (index) => {
    if (!miniGameState || miniGameState.flipped.length >= 2 || 
        miniGameState.flipped.includes(index) || 
        miniGameState.matched.includes(index)) return;
    
    const newFlipped = [...miniGameState.flipped, index];
    setMiniGameState(prev => ({ ...prev, flipped: newFlipped }));
    
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (miniGameState.cards[first] === miniGameState.cards[second]) {
        setTimeout(() => {
          setMiniGameState(prev => ({
            ...prev,
            matched: [...prev.matched, first, second],
            flipped: [],
            attempts: prev.attempts + 1
          }));
          
          if (miniGameState.matched.length + 2 === miniGameState.cards.length) {
            endMiniGame(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setMiniGameState(prev => ({
            ...prev,
            flipped: [],
            attempts: prev.attempts + 1
          }));
          
          if (miniGameState.attempts + 1 >= miniGameState.maxAttempts) {
            endMiniGame(false);
          }
        }, 1000);
      }
    }
  };

  const handleReflexClick = (e) => {
    if (!miniGameState) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const distance = Math.sqrt(
      Math.pow(x - miniGameState.targetPosition.x, 2) + 
      Math.pow(y - miniGameState.targetPosition.y, 2)
    );
    
    if (distance < 10) {
      setMiniGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        clicks: prev.clicks + 1,
        targetPosition: {
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        }
      }));
    } else {
      setMiniGameState(prev => ({ ...prev, clicks: prev.clicks + 1 }));
    }
    
    if (miniGameState.timeLeft <= 0) {
      endMiniGame(miniGameState.score >= 5);
    }
  };

  const handlePatternClick = (num) => {
    if (!miniGameState || miniGameState.showSequence) return;
    
    const newUserSequence = [...miniGameState.userSequence, num];
    setMiniGameState(prev => ({ ...prev, userSequence: newUserSequence }));
    
    if (newUserSequence.length === miniGameState.sequence.length) {
      const correct = newUserSequence.every((n, i) => n === miniGameState.sequence[i]);
      setTimeout(() => endMiniGame(correct), 500);
    }
  };

  const handleTypingInput = (e) => {
    const value = e.target.value;
    setMiniGameState(prev => ({ ...prev, currentInput: value }));
    
    if (value === miniGameState.targetWord) {
      const words = ['function', 'algorithm', 'database', 'interface', 'development', 'programming', 'software', 'application'];
      const newWord = words[Math.floor(Math.random() * words.length)];
      setMiniGameState(prev => ({
        ...prev,
        targetWord: newWord,
        currentInput: '',
        wordsCompleted: prev.wordsCompleted + 1
      }));
    }
    
    if (miniGameState.timeLeft <= 0) {
      endMiniGame(miniGameState.wordsCompleted >= 3);
    }
  };

  const handleMathSubmit = () => {
    if (!miniGameState) return;
    
    const correct = parseInt(miniGameState.userAnswer) === miniGameState.answer;
    
    if (correct) {
      const generateProblem = () => {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 50) + 10;
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let answer;
        if (op === '+') answer = a + b;
        else if (op === '-') answer = a - b;
        else answer = a * b;
        return { question: `${a} ${op} ${b}`, answer };
      };
      
      const newProblem = generateProblem();
      setMiniGameState(prev => ({
        ...prev,
        ...newProblem,
        userAnswer: '',
        score: prev.score + 1
      }));
    }
    
    if (miniGameState.timeLeft <= 0) {
      endMiniGame(miniGameState.score >= 5);
    }
  };

  const shopItems = [
    {
      id: 'energy_drink',
      name: '☕ Boisson Énergisante',
      description: 'Boost instantané d\'énergie',
      cost: 50,
      effects: { energy: 30 },
      consequences: { health: -5 },
      icon: '☕'
    },
    {
      id: 'junk_food',
      name: '🍔 Fast Food',
      description: 'Rapide et satisfaisant',
      cost: 30,
      effects: { energy: 20 },
      consequences: { health: -10 },
      icon: '🍔'
    },
    {
      id: 'gym_membership',
      name: '🏋️ Abonnement Gym',
      description: 'Améliore la santé',
      cost: 200,
      effects: { health: 40, energy: -20 },
      consequences: { time: 2 },
      icon: '🏋️'
    },
    {
      id: 'online_course',
      name: '📚 Cours en Ligne',
      description: 'Développe les compétences',
      cost: 300,
      effects: { skills: 60, career: 30 },
      consequences: { energy: -30, time: 3 },
      icon: '📚'
    },
    {
      id: 'party_night',
      name: '🎉 Soirée Festive',
      description: 'Boost le social',
      cost: 150,
      effects: { social: 50, mental: 20 },
      consequences: { energy: -40, money: -50 },
      icon: '🎉'
    },
    {
      id: 'massage',
      name: '💆 Massage Relaxant',
      description: 'Réduit le stress',
      cost: 120,
      effects: { mental: 50, health: 20 },
      consequences: { time: 2 },
      icon: '💆'
    },
    {
      id: 'video_games',
      name: '🎮 Session Gaming',
      description: 'Divertissement',
      cost: 60,
      effects: { mental: 30 },
      consequences: { time: 3, career: -10 },
      icon: '🎮'
    },
    {
      id: 'luxury_item',
      name: '💎 Article de Luxe',
      description: 'Boost de confiance',
      cost: 500,
      effects: { mental: 40, social: 30 },
      consequences: { finance: -20 },
      icon: '💎'
    },
    {
      id: 'tutoring',
      name: '👨‍🏫 Tutorat Privé',
      description: 'Aide aux études',
      cost: 250,
      effects: { study: 80 },
      consequences: { time: 3, energy: -25 },
      icon: '👨‍🏫',
      requiresUniversity: true
    },
    {
      id: 'networking_event',
      name: '🤝 Événement Networking',
      description: 'Développe le réseau',
      cost: 180,
      effects: { social: 40, career: 35 },
      consequences: { energy: -30, time: 3 },
      icon: '🤝'
    },
    {
      id: 'stocks',
      name: '📈 Actions Risquées',
      description: 'Investissement à risque',
      cost: 400,
      effects: { finance: 70 },
      consequences: { mental: -20 },
      icon: '📈'
    },
    {
      id: 'coffee_addiction',
      name: '☕ Café Premium',
      description: 'Productivité maximale',
      cost: 80,
      effects: { energy: 25, career: 20 },
      consequences: { health: -15, mental: -10 },
      icon: '☕'
    }
  ];

  const endMiniGame = (won) => {
    if (won) {
      const bonuses = {
        memory: { xp: { mental: 50, skills: 30 }, money: 100 },
        reflex: { xp: { health: 50, mental: 20 }, money: 80 },
        pattern: { xp: { skills: 50, mental: 40 }, money: 100 },
        typing: { xp: { career: 50, skills: 40 }, money: 120 },
        math: { xp: { finance: 50, mental: 40 }, money: 150 }
      };
      
      const bonus = bonuses[miniGameModal];
      Object.entries(bonus.xp).forEach(([stat, xp]) => addXP(stat, xp));
      setGameState(prev => ({ ...prev, money: prev.money + bonus.money }));
      
      createParticles();
      showNotification(`🎮 Mini-jeu réussi! +${bonus.money}€ et bonus XP!`, 'levelup');
    } else {
      showNotification('🎮 Mini-jeu échoué. Réessayez plus tard!', 'error');
    }
    
    setMiniGameModal(null);
    setMiniGameState(null);
  };

  const sleep = () => {
    const completedQuests = gameState.dailyQuests.filter(q => q.completed).length;
    const bonus = completedQuests * 50;
    const salaryIncome = gameState.salary;
    
    setGameState(prev => ({
      ...prev,
      day: prev.day + 1,
      time: 8,
      energy: 100,
      money: prev.money + bonus + salaryIncome,
      streak: completedQuests === prev.dailyQuests.length ? prev.streak + 1 : 0
    }));
    
    if (salaryIncome > 0) {
      showNotification(`Jour ${gameState.day + 1}! +${salaryIncome}€`, 'success');
    } else {
      showNotification(`Jour ${gameState.day + 1}!`, 'success');
    }
  };

  const activities = [
    {
      name: 'Course Matinale',
      icon: Heart,
      duration: 1,
      energyCost: 20,
      xpGain: { health: 30, mental: 10 },
      questType: 'health',
      successMessage: '💪 Excellente course!',
      gradient: 'from-red-500 to-pink-500',
      miniGameChance: true,
      miniGameType: 'reflex'
    },
    {
      name: 'Musculation',
      icon: Zap,
      duration: 2,
      energyCost: 30,
      xpGain: { health: 50 },
      questType: 'health',
      successMessage: '🏋️ Plus fort!',
      gradient: 'from-orange-500 to-red-500',
      miniGameChance: true,
      miniGameType: 'reflex'
    },
    {
      name: 'Travail Freelance',
      icon: Briefcase,
      duration: 4,
      energyCost: 40,
      xpGain: { career: 60, skills: 20 },
      moneyGain: 50,
      questType: 'career',
      successMessage: '📚 Session productive!',
      gradient: 'from-blue-500 to-cyan-500',
      hideWhenUniversity: true,
      miniGameChance: true,
      miniGameType: 'typing'
    },
    {
      name: 'Projet Personnel',
      icon: Target,
      duration: 3,
      energyCost: 35,
      xpGain: { career: 40, skills: 40 },
      questType: 'career',
      successMessage: '🎯 Excellent progrès!',
      gradient: 'from-purple-500 to-blue-500',
      miniGameChance: true,
      miniGameType: 'pattern'
    },
    {
      name: 'Sortie Amis',
      icon: Users,
      duration: 3,
      energyCost: 25,
      xpGain: { social: 60, mental: 20 },
      questType: 'social',
      successMessage: '🎉 Moment mémorable!',
      gradient: 'from-green-500 to-teal-500',
      miniGameChance: true,
      miniGameType: 'memory'
    },
    {
      name: 'Méditation',
      icon: Brain,
      duration: 1,
      energyCost: 10,
      xpGain: { mental: 40, health: 10 },
      successMessage: '🧘 Esprit apaisé!',
      gradient: 'from-purple-500 to-pink-500',
      miniGameChance: true,
      miniGameType: 'memory'
    },
    {
      name: 'Side Hustle',
      icon: DollarSign,
      duration: 3,
      energyCost: 35,
      xpGain: { finance: 50, skills: 30 },
      moneyGain: 150,
      successMessage: '💰 Argent gagné!',
      gradient: 'from-yellow-500 to-green-500',
      miniGameChance: true,
      miniGameType: 'math'
    },
    {
      name: 'Investir',
      icon: TrendingUp,
      duration: 1,
      energyCost: 15,
      xpGain: { finance: 40 },
      successMessage: '📈 Investissement fait!',
      gradient: 'from-emerald-500 to-cyan-500',
      miniGameChance: true,
      miniGameType: 'math'
    }
  ];

  const StatCard = ({ stat, data, icon: Icon }) => {
    const percentage = (data.xp / data.xpNeeded) * 100;
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:scale-105">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-semibold text-slate-200 capitalize">{stat}</span>
          </div>
          <span className="text-lg font-bold text-white">Niv.{data.level}</span>
        </div>
        <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-2">{data.xp} / {data.xpNeeded} XP</div>
      </div>
    );
  };

  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mb-4">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Life Ascent
              </h1>
              <p className="text-slate-400">Votre simulation de vie commence</p>
            </div>
            
            <input
              type="text"
              placeholder="Entrez votre nom..."
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all mb-6"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  startGame(e.target.value.trim());
                }
              }}
            />
            
            <button
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                if (input.value.trim()) startGame(input.value.trim());
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
            >
              Commencer l'Aventure
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Shop Modal */}
      {shopModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-4xl w-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-yellow-500/50 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                🛒 Boutique
              </h3>
              <button
                onClick={() => setShopModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-yellow-400 text-sm text-center">
                ⚠️ Chaque achat a des effets positifs et des conséquences!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
              {shopItems.filter(item => !item.requiresUniversity || gameState.university).map(item => (
                <div key={item.id} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-4 border border-slate-600/50 hover:border-yellow-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.name}</h4>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                    <span className="text-2xl">{item.icon}</span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="text-xs">
                      <span className="text-green-400 font-semibold">✓ Effets:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.effects).map(([key, val]) => (
                          <span key={key} className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                            {key === 'energy' ? `+${val} énergie` : 
                             key === 'study' ? `+${val} étude` :
                             `+${val} ${key}`}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs">
                      <span className="text-red-400 font-semibold">✗ Conséquences:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.consequences).map(([key, val]) => (
                          <span key={key} className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                            {key === 'time' ? `${val}h` :
                             key === 'energy' ? `${val} énergie` :
                             key === 'money' ? `${val}€` :
                             `${val} ${key}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => purchaseItem(item)}
                    disabled={gameState.money < item.cost}
                    className={`w-full py-2 rounded-xl font-semibold transition-all ${
                      gameState.money < item.cost
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                    }`}
                  >
                    Acheter - {item.cost}€
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mini-Game Modals */}
      {miniGameModal === 'memory' && miniGameState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500/50">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">🧠 Jeu de Mémoire</h3>
            <p className="text-slate-300 text-center mb-4">Trouvez les paires! Tentatives: {miniGameState.attempts}/{miniGameState.maxAttempts}</p>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {miniGameState.cards.map((symbol, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMemoryClick(idx)}
                  className={`aspect-square text-4xl rounded-xl transition-all ${
                    miniGameState.flipped.includes(idx) || miniGameState.matched.includes(idx)
                      ? 'bg-purple-500 rotate-0'
                      : 'bg-slate-700 rotate-180'
                  }`}
                >
                  {(miniGameState.flipped.includes(idx) || miniGameState.matched.includes(idx)) && symbol}
                </button>
              ))}
            </div>
            <button onClick={() => endMiniGame(false)} className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl">
              Abandonner
            </button>
          </div>
        </div>
      )}

      {miniGameModal === 'reflex' && miniGameState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-red-500/50">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">⚡ Test de Réflexes</h3>
            <p className="text-slate-300 text-center mb-4">Score: {miniGameState.score} | Temps: {miniGameState.timeLeft.toFixed(1)}s</p>
            <div 
              onClick={handleReflexClick}
              className="relative w-full h-96 bg-slate-800 rounded-xl cursor-crosshair overflow-hidden"
            >
              <div 
                className="absolute w-12 h-12 bg-red-500 rounded-full transition-all duration-200"
                style={{ 
                  left: `${miniGameState.targetPosition.x}%`, 
                  top: `${miniGameState.targetPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {miniGameModal === 'pattern' && miniGameState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-blue-500/50">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">🎯 Mémorisez le Pattern</h3>
            {miniGameState.showSequence ? (
              <div>
                <p className="text-slate-300 text-center mb-4">Mémorisez la séquence!</p>
                <div className="flex justify-center gap-4 mb-8">
                  {miniGameState.sequence.map((num, idx) => (
                    <div key={idx} className="w-16 h-16 bg-cyan-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-slate-300 text-center mb-4">Reproduisez la séquence!</p>
                <div className="flex justify-center gap-4 mb-4">
                  {miniGameState.userSequence.map((num, idx) => (
                    <div key={idx} className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white">
                      {num}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map(num => (
                    <button
                      key={num}
                      onClick={() => handlePatternClick(num)}
                      className="aspect-square bg-slate-700 hover:bg-blue-600 rounded-xl text-2xl font-bold text-white transition-all"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {miniGameModal === 'typing' && miniGameState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-green-500/50">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">⌨️ Test de Frappe</h3>
            <p className="text-slate-300 text-center mb-4">Mots: {miniGameState.wordsCompleted} | Temps: {miniGameState.timeLeft.toFixed(1)}s</p>
            <div className="mb-4 p-6 bg-slate-800 rounded-xl text-center">
              <p className="text-3xl font-bold text-white mb-4">{miniGameState.targetWord}</p>
              <input
                type="text"
                value={miniGameState.currentInput}
                onChange={handleTypingInput}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-center text-xl focus:outline-none focus:border-green-500"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {miniGameModal === 'math' && miniGameState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-yellow-500/50">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">🧮 Calcul Mental</h3>
            <p className="text-slate-300 text-center mb-4">Score: {miniGameState.score} | Temps: {miniGameState.timeLeft.toFixed(1)}s</p>
            <div className="mb-4 p-6 bg-slate-800 rounded-xl text-center">
              <p className="text-4xl font-bold text-white mb-4">{miniGameState.question} = ?</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={miniGameState.userAnswer}
                  onChange={(e) => setMiniGameState(prev => ({ ...prev, userAnswer: e.target.value }))}
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white text-center text-xl focus:outline-none focus:border-yellow-500"
                  autoFocus
                />
                <button 
                  onClick={handleMathSubmit}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl"
                >
                  ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Exam Modal */}
      {progressExamModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-orange-500/50 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{progressExamModal.exam.name}</h3>
              <p className="text-slate-300">{universities[progressExamModal.university].name}</p>
              <div className="text-sm text-orange-300 mt-2">⚠️ Vous devez réussir (3/5) pour continuer vos études!</div>
              <div className="text-sm text-slate-400 mt-1">Question {currentQuestion + 1} / {progressExamModal.exam.questions.length}</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                {progressExamModal.exam.questions[currentQuestion].q}
              </h4>
              <div className="space-y-3">
                {progressExamModal.exam.questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => answerProgressExam(idx)}
                    className="w-full p-4 bg-slate-700/50 hover:bg-orange-600 rounded-xl text-left text-white transition-all border border-slate-600 hover:border-orange-500"
                  >
                    {String.fromCharCode(65 + idx)}. {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / progressExamModal.exam.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Exam Modal */}
      {examModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-indigo-500/50 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Examen d'Admission</h3>
              <p className="text-slate-300">{universities[examModal.university].name}</p>
              <div className="text-sm text-slate-400 mt-2">Question {currentQuestion + 1} / {examModal.questions.length}</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                {examModal.questions[currentQuestion].q}
              </h4>
              <div className="space-y-3">
                {examModal.questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => answerQuestion(idx)}
                    className="w-full p-4 bg-slate-700/50 hover:bg-indigo-600 rounded-xl text-left text-white transition-all border border-slate-600 hover:border-indigo-500"
                  >
                    {String.fromCharCode(65 + idx)}. {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / examModal.questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Career Event Modal */}
      {careerEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full bg-gradient-to-br ${
            careerEvent.type === 'promotion' 
              ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
              : careerEvent.effects?.money && careerEvent.effects.money > 0
              ? 'from-emerald-500/20 to-cyan-500/20 border-emerald-500/50'
              : 'from-red-500/20 to-orange-500/20 border-red-500/50'
          } backdrop-blur-xl rounded-3xl p-6 border-2 shadow-2xl`}>
            <div className="text-center mb-6">
              <div className={`inline-block p-4 rounded-2xl mb-4 ${
                careerEvent.type === 'promotion' 
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                  : careerEvent.effects?.money && careerEvent.effects.money > 0
                  ? 'bg-gradient-to-br from-emerald-500 to-cyan-500'
                  : 'bg-gradient-to-br from-red-500 to-orange-500'
              }`}>
                {careerEvent.type === 'promotion' ? (
                  <Trophy className="w-12 h-12 text-white" />
                ) : (
                  <Briefcase className="w-12 h-12 text-white" />
                )}
              </div>
              
              {careerEvent.type === 'promotion' ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">🎊 PROMOTION!</h3>
                  <p className="text-slate-300 mb-4">Félicitations!</p>
                  <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                    <div className="text-sm text-slate-400 mb-2">{careerEvent.currentTitle}</div>
                    <div className="text-2xl mb-2">⬇️</div>
                    <div className="text-xl font-bold text-cyan-400 mb-2">{careerEvent.newTitle}</div>
                    <div className="text-sm">
                      <span className="text-slate-400">{careerEvent.oldSalary}€/jour → </span>
                      <span className="text-green-400 font-bold">{careerEvent.newSalary}€/jour</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">{careerEvent.title}</h3>
                  <p className="text-slate-300">{careerEvent.description}</p>
                </>
              )}
            </div>

            {careerEvent.type !== 'promotion' && careerEvent.effects && (
              <div className="space-y-2 mb-6 text-sm">
                {careerEvent.effects.money && (
                  <div className={`flex items-center justify-center gap-2 ${
                    careerEvent.effects.money > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">
                      {careerEvent.effects.money > 0 ? '+' : ''}{careerEvent.effects.money}€
                    </span>
                  </div>
                )}
                {careerEvent.effects.energy && (
                  <div className={`flex items-center justify-center gap-2 ${
                    careerEvent.effects.energy > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold">
                      {careerEvent.effects.energy > 0 ? '+' : ''}{careerEvent.effects.energy} énergie
                    </span>
                  </div>
                )}
                {careerEvent.xpGain && Object.entries(careerEvent.xpGain).map(([stat, xp]) => (
                  <div key={stat} className="flex items-center justify-center gap-2 text-cyan-400">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">+{xp} XP {stat}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleCareerEvent}
              className={`w-full py-3 font-semibold rounded-xl transition-all ${
                careerEvent.type === 'promotion'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                  : careerEvent.effects?.money && careerEvent.effects.money > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600'
                  : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
              } text-white`}
            >
              OK, Compris! 👍
            </button>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {event && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full bg-gradient-to-br ${
            event.type === 'good' 
              ? 'from-emerald-500/20 to-cyan-500/20 border-emerald-500/50' 
              : 'from-red-500/20 to-orange-500/20 border-red-500/50'
          } backdrop-blur-xl rounded-3xl p-6 border-2 shadow-2xl`}>
            <div className="text-center mb-6">
              <div className={`inline-block p-4 rounded-2xl mb-4 ${
                event.type === 'good' 
                  ? 'bg-gradient-to-br from-emerald-500 to-cyan-500' 
                  : 'bg-gradient-to-br from-red-500 to-orange-500'
              }`}>
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-slate-300">{event.description}</p>
            </div>

            <div className="space-y-2 mb-6 text-sm">
              {event.effects.money && (
                <div className={`flex items-center justify-center gap-2 ${
                  event.effects.money > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">
                    {event.effects.money > 0 ? '+' : ''}{event.effects.money}€
                  </span>
                </div>
              )}
              {event.effects.energy && (
                <div className={`flex items-center justify-center gap-2 ${
                  event.effects.energy > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold">
                    {event.effects.energy > 0 ? '+' : ''}{event.effects.energy} énergie
                  </span>
                </div>
              )}
              {Object.entries(event.xpGain).map(([stat, xp]) => (
                <div key={stat} className="flex items-center justify-center gap-2 text-cyan-400">
                  <Star className="w-4 h-4" />
                  <span className="font-semibold">+{xp} XP {stat}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleEventChoice}
              className={`w-full py-3 font-semibold rounded-xl transition-all ${
                event.type === 'good'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600'
                  : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
              } text-white`}
            >
              OK, Compris! 👍
            </button>
          </div>
        </div>
      )}

      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed w-2 h-2 bg-yellow-400 rounded-full animate-ping pointer-events-none z-50"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        />
      ))}

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm ${
          notification.type === 'error' ? 'bg-red-500/90' : 
          notification.type === 'levelup' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
          'bg-gradient-to-r from-green-500 to-emerald-500'
        } text-white font-semibold`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{gameState.name}</h2>
              <p className="text-slate-400">{gameState.career} · {gameState.age} ans {gameState.salary > 0 && `· ${gameState.salary}€/jour`}</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-semibold">Jour {gameState.day}</span>
                </div>
              </div>
              
              <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold">{gameState.time}:00</span>
                </div>
              </div>
              
              <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">{gameState.energy}%</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-xl border border-green-500/50">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-white font-semibold">{gameState.money}€</span>
                </div>
              </div>
              
              <button
                onClick={() => setShopModal(true)}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-xl border border-yellow-500/50 hover:border-yellow-400 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🛒</span>
                  <span className="text-white font-semibold">Boutique</span>
                </div>
              </button>
            </div>
          </div>

          {gameState.streak > 0 && (
            <div className="mt-4 flex items-center gap-2 text-orange-400">
              <Award className="w-5 h-5" />
              <span className="font-semibold">Streak de {gameState.streak} jours! 🔥</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Stats & Quests (40%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Panel */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Statistiques
            </h3>
            <div className="space-y-3">
              <StatCard stat="santé" data={gameState.stats.health} icon={Heart} />
              <StatCard stat="carrière" data={gameState.stats.career} icon={Briefcase} />
              <StatCard stat="social" data={gameState.stats.social} icon={Users} />
              <StatCard stat="finance" data={gameState.stats.finance} icon={DollarSign} />
              <StatCard stat="mental" data={gameState.stats.mental} icon={Brain} />
              <StatCard stat="compétences" data={gameState.stats.skills} icon={Star} />
              {gameState.university && (
                <StatCard stat="étude" data={gameState.stats.study} icon={Award} />
              )}
            </div>
            
            {gameState.university && (
              <div className="mt-4 p-4 bg-indigo-500/20 border border-indigo-500/50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-indigo-300">
                    {universities[gameState.university].icon} {universities[gameState.university].name}
                  </span>
                  <span className="text-xs text-indigo-400">
                    {Math.round((gameState.studyProgress / gameState.studyRequired) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${(gameState.studyProgress / gameState.studyRequired) * 100}%` }}
                  />
                </div>
                {!gameState.canStudy && (
                  <div className="text-xs text-orange-400 mt-2 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Examen de progression requis!
                  </div>
                )}
                <div className="text-xs text-slate-400 mt-1">
                  Examens réussis: {gameState.examsPassed.length}/3
                </div>
              </div>
            )}
          </div>

          {/* Daily Quests */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Quêtes Quotidiennes
            </h3>
            <div className="space-y-2">
              {gameState.dailyQuests.map(quest => (
                <div key={quest.id} className={`p-3 rounded-xl border transition-all ${
                  quest.completed 
                    ? 'bg-green-500/20 border-green-500/50' 
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${quest.completed ? 'text-green-400 line-through' : 'text-slate-300'}`}>
                      {quest.text}
                    </span>
                    <span className="text-xs text-yellow-400">+{quest.reward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Activities (60%) */}
        <div className="lg:col-span-3">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Activités Disponibles</h3>
            
            {!gameState.university && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-cyan-400 mb-3">🎓 Universités</h4>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(universities).map(([key, uni]) => (
                    <button
                      key={key}
                      onClick={() => startExam(key)}
                      disabled={gameState.money < uni.tuition}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        gameState.money < uni.tuition
                          ? 'bg-slate-800/30 border-slate-700/30 opacity-50'
                          : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50 hover:border-indigo-400 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{uni.icon}</span>
                          <div>
                            <div className="font-semibold text-white">{uni.name}</div>
                            <div className="text-xs text-slate-400">
                              {uni.hasExam ? '✍️ Examen requis (3/5)' : '✅ Admission directe'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-yellow-400">{uni.tuition}€</div>
                          <div className="text-xs text-slate-400">Frais</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gameState.university && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-indigo-400 mb-3">📚 Activités d'Étude</h4>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => studyActivity('lazy')}
                    disabled={gameState.energy < 15 || gameState.time + 2 > 24 || !gameState.canStudy}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      gameState.energy < 15 || gameState.time + 2 > 24 || !gameState.canStudy
                        ? 'bg-slate-800/30 border-slate-700/30 opacity-50'
                        : 'bg-gradient-to-r from-slate-600 to-slate-700 border-slate-600 hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          😴 Étude Fainéante
                          {!gameState.canStudy && <span className="text-xs text-orange-400">(Examen requis)</span>}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          2h · -15 énergie · +30 XP étude
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => studyActivity('normal')}
                    disabled={gameState.energy < 25 || gameState.time + 3 > 24 || !gameState.canStudy}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      gameState.energy < 25 || gameState.time + 3 > 24 || !gameState.canStudy
                        ? 'bg-slate-800/30 border-slate-700/30 opacity-50'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-600 hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          📚 Étude Normale
                          {!gameState.canStudy && <span className="text-xs text-orange-400">(Examen requis)</span>}
                        </div>
                        <div className="text-xs text-slate-200 mt-1">
                          3h · -25 énergie · +60 XP étude
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => studyActivity('diligent')}
                    disabled={gameState.energy < 40 || gameState.time + 4 > 24 || !gameState.canStudy}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      gameState.energy < 40 || gameState.time + 4 > 24 || !gameState.canStudy
                        ? 'bg-slate-800/30 border-slate-700/30 opacity-50'
                        : 'bg-gradient-to-r from-orange-600 to-red-600 border-orange-600 hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          🔥 Étude Assidue
                          {!gameState.canStudy && <span className="text-xs text-orange-400">(Examen requis)</span>}
                        </div>
                        <div className="text-xs text-slate-200 mt-1">
                          4h · -40 énergie · +100 XP étude
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            <h4 className="text-lg font-semibold text-slate-300 mb-3">Autres Activités</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.filter(a => !a.hideWhenUniversity || !gameState.university).map((activity, idx) => (
                <button
                  key={idx}
                  onClick={() => performActivity(activity)}
                  disabled={gameState.energy < activity.energyCost || gameState.time + activity.duration > 24}
                  className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                    gameState.energy < activity.energyCost || gameState.time + activity.duration > 24
                      ? 'bg-slate-800/30 border-slate-700/30'
                      : `bg-gradient-to-br ${activity.gradient} border-slate-600/50 hover:shadow-lg`
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <activity.icon className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white">{activity.name}</span>
                    </div>
                    {activity.moneyGain && (
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                        +{activity.moneyGain}€
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 text-xs text-white/80 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {activity.duration}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" /> -{activity.energyCost}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(activity.xpGain).map(([stat, xp]) => (
                      <span key={stat} className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                        +{xp} {stat}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sleep Button */}
          <button
            onClick={sleep}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl flex items-center justify-center gap-2"
          >
            <span>😴 Dormir et passer au jour suivant</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LifeAscent;