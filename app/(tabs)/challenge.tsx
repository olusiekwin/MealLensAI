import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Trophy, Clock, Star, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { challengeStyles } from "@/styles/challenge.styles";

// Define Challenge type
interface Challenge {
  title: string;
  description?: string;
  time?: string;
  difficulty?: string;
  image: string;
  progress?: number;
}

export default function CookingChallengeScreen() {
  const router = useRouter();
  
  const handleChallengePress = (challenge: Challenge) => {
    router.push('/recipe-details');
  };
  
  return (
    <View style={challengeStyles.container}>
      <View style={challengeStyles.header}>
        <Text style={challengeStyles.headerTitle}>Cooking Challenges</Text>
      </View>
      
      {/* Active Challenge */}
      <View style={challengeStyles.activeChallengeContainer}>
        <Text style={challengeStyles.sectionTitle}>Active Challenge</Text>
        
        <TouchableOpacity 
          style={challengeStyles.activeChallenge}
          onPress={() => handleChallengePress(activeChallenge)}
        >
          <Image 
            source={{ uri: activeChallenge.image }} 
            style={challengeStyles.activeChallengeImage} 
          />
          
          <View style={challengeStyles.activeChallengeOverlay}>
            <View style={challengeStyles.activeChallengeContent}>
              <View style={challengeStyles.badgeContainer}>
                <Trophy size={14} color="#FFFFFF" />
                <Text style={challengeStyles.badgeText}>CHALLENGE</Text>
              </View>
              
              <Text style={challengeStyles.activeChallengeTitle}>{activeChallenge.title}</Text>
              
              <View style={challengeStyles.progressContainer}>
                <View style={challengeStyles.progressBar}>
                  <View style={[challengeStyles.progressFill, { width: `${activeChallenge.progress}%` }]} />
                </View>
                <Text style={challengeStyles.progressText}>{activeChallenge.progress}% Complete</Text>
              </View>
              
              <TouchableOpacity 
                style={challengeStyles.continueButton}
                onPress={() => handleChallengePress(activeChallenge)}
              >
                <Text style={challengeStyles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Weekly Challenges */}
      <View style={challengeStyles.weeklyChallengesContainer}>
        <Text style={challengeStyles.sectionTitle}>Weekly Challenges</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {weeklyChallenges.map((challenge, index) => (
            <TouchableOpacity 
              key={index} 
              style={challengeStyles.challengeCard}
              onPress={() => handleChallengePress(challenge)}
            >
              <Image source={{ uri: challenge.image }} style={challengeStyles.challengeImage} />
              
              <View style={challengeStyles.challengeContent}>
                <View style={challengeStyles.challengeBadge}>
                  <Trophy size={10} color="#FFFFFF" />
                  <Text style={challengeStyles.challengeBadgeText}>CHALLENGE</Text>
                </View>
                
                <Text style={challengeStyles.challengeTitle}>{challenge.title}</Text>
                <Text style={challengeStyles.challengeDescription}>{challenge.description}</Text>
                
                <View style={challengeStyles.challengeDetails}>
                  <View style={challengeStyles.detailItem}>
                    <Clock size={12} color="#202026" />
                    <Text style={challengeStyles.detailText}>{challenge.time}</Text>
                  </View>
                  <View style={challengeStyles.detailItem}>
                    <Star size={12} color="#FF6A00" />
                    <Text style={challengeStyles.detailText}>{challenge.difficulty}</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity style={challengeStyles.heartButton}>
                <Heart size={14} color="#FF5353" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const activeChallenge: Challenge = {
  title: "Master the Perfect Sourdough Bread",
  progress: 65,
  image: "https://images.unsplash.com/photo-1585478259715-2a896fda787f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
};

const weeklyChallenges: Challenge[] = [
  {
    title: "30-Minute Meals Challenge",
    description: "Create delicious meals in under 30 minutes with these quick recipes",
    time: "30 min",
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Plant-Based Week",
    description: "Try these amazing plant-based recipes for a full week of vegetarian meals",
    time: "45 min",
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Dessert Masterclass",
    description: "Learn to make restaurant-quality desserts at home with these recipes",
    time: "60 min",
    difficulty: "Hard",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
];