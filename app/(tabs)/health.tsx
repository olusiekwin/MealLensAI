import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, ChevronLeft, ChevronRight, Info, Award, Zap, Droplet, Flame } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock data for weekly nutrition
const weeklyData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  data: [1800, 2100, 1950, 2200, 1700, 2300, 2000],
};

// Mock data for macronutrients
const macroData = {
  labels: ["Protein", "Carbs", "Fat"],
  data: [25, 55, 20],
  colors: ['#4285F4', '#DB4437', '#F4B400']
};

// Mock data for daily meals
const dailyMeals = [
  {
    id: 1,
    name: "Breakfast",
    time: "8:30 AM",
    calories: 450,
    image: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    nutrients: {
      protein: 15,
      carbs: 55,
      fat: 12
    }
  },
  {
    id: 2,
    name: "Lunch",
    time: "1:00 PM",
    calories: 680,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    nutrients: {
      protein: 35,
      carbs: 65,
      fat: 18
    }
  },
  {
    id: 3,
    name: "Dinner",
    time: "7:30 PM",
    calories: 720,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    nutrients: {
      protein: 42,
      carbs: 48,
      fat: 22
    }
  }
];

// Mock data for health insights
const healthInsights = [
  {
    id: 1,
    title: "Protein Intake",
    description: "Your protein intake is optimal for muscle maintenance.",
    icon: "Award",
    color: "#4285F4"
  },
  {
    id: 2,
    title: "Hydration",
    description: "Try to increase your water intake by 500ml daily.",
    icon: "Droplet",
    color: "#0F9D58"
  },
  {
    id: 3,
    title: "Calorie Balance",
    description: "You're maintaining a good calorie balance this week.",
    icon: "Flame",
    color: "#F4B400"
  }
];

// Simple custom bar chart component
const SimpleBarChart = ({ data, labels, colors }: { data: number[], labels: string[], colors?: string[] }) => {
  const maxValue = Math.max(...data);
  
  return (
    <View style={chartStyles.container}>
      <View style={chartStyles.barsContainer}>
        {data.map((value, index) => (
          <View key={index} style={chartStyles.barWrapper}>
            <Text style={chartStyles.barValue}>{value}</Text>
            <View style={chartStyles.barContainer}>
              <View 
                style={[
                  chartStyles.bar, 
                  { 
                    height: `${(value / maxValue) * 100}%`,
                    backgroundColor: colors ? colors[index % colors.length] : '#FF6A00'
                  }
                ]} 
              />
            </View>
            <Text style={chartStyles.barLabel}>{labels[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function HealthScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('daily');
  
  // Format date for display
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };
  
  // Calculate total daily calories
  const totalCalories = dailyMeals.reduce((sum, meal) => sum + meal.calories, 0);
  
  // Calculate total nutrients
  const totalNutrients = dailyMeals.reduce(
    (sum, meal) => {
      return {
        protein: sum.protein + meal.nutrients.protein,
        carbs: sum.carbs + meal.nutrients.carbs,
        fat: sum.fat + meal.nutrients.fat
      };
    },
    { protein: 0, carbs: 0, fat: 0 }
  );
  
  // Calculate nutrient percentages
  const totalNutrientGrams = totalNutrients.protein + totalNutrients.carbs + totalNutrients.fat;
  const proteinPercentage = Math.round((totalNutrients.protein / totalNutrientGrams) * 100);
  const carbsPercentage = Math.round((totalNutrients.carbs / totalNutrientGrams) * 100);
  const fatPercentage = Math.round((totalNutrients.fat / totalNutrientGrams) * 100);
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#FF6A00', '#FF8F47']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Health & Nutrition</Text>
          
          <View style={styles.dateSelector}>
            <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.dateContainer}>
              <Calendar size={18} color="#FFFFFF" />
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            </View>
            
            <TouchableOpacity onPress={goToNextDay} style={styles.dateNavButton}>
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
              onPress={() => setActiveTab('daily')}
            >
              <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>Daily</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
              onPress={() => setActiveTab('weekly')}
            >
              <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>Weekly</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
              onPress={() => setActiveTab('insights')}
            >
              <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>Insights</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'daily' && (
            <>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Daily Summary</Text>
                
                <View style={styles.calorieContainer}>
                  <View style={styles.calorieCircle}>
                    <Text style={styles.calorieValue}>{totalCalories}</Text>
                    <Text style={styles.calorieLabel}>calories</Text>
                  </View>
                  
                  <View style={styles.nutrientBars}>
                    <View style={styles.nutrientBar}>
                      <View style={styles.nutrientLabelContainer}>
                        <View style={[styles.nutrientDot, { backgroundColor: '#4285F4' }]} />
                        <Text style={styles.nutrientLabel}>Protein</Text>
                        <Text style={styles.nutrientValue}>{totalNutrients.protein}g</Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { width: `${proteinPercentage}%`, backgroundColor: '#4285F4' }
                          ]} 
                        />
                      </View>
                    </View>
                    
                    <View style={styles.nutrientBar}>
                      <View style={styles.nutrientLabelContainer}>
                        <View style={[styles.nutrientDot, { backgroundColor: '#DB4437' }]} />
                        <Text style={styles.nutrientLabel}>Carbs</Text>
                        <Text style={styles.nutrientValue}>{totalNutrients.carbs}g</Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { width: `${carbsPercentage}%`, backgroundColor: '#DB4437' }
                          ]} 
                        />
                      </View>
                    </View>
                    
                    <View style={styles.nutrientBar}>
                      <View style={styles.nutrientLabelContainer}>
                        <View style={[styles.nutrientDot, { backgroundColor: '#F4B400' }]} />
                        <Text style={styles.nutrientLabel}>Fat</Text>
                        <Text style={styles.nutrientValue}>{totalNutrients.fat}g</Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { width: `${fatPercentage}%`, backgroundColor: '#F4B400' }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>Today's Meals</Text>
              
              {dailyMeals.map(meal => (
                <View key={meal.id} style={styles.mealCard}>
                  <Image source={{ uri: meal.image }} style={styles.mealImage} />
                  
                  <View style={styles.mealInfo}>
                    <View style={styles.mealHeader}>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>
                    
                    <View style={styles.mealNutrients}>
                      <View style={styles.nutrientItem}>
                        <Flame size={16} color="#FF6A00" />
                        <Text style={styles.nutrientText}>{meal.calories} cal</Text>
                      </View>
                      
                      <View style={styles.nutrientItem}>
                        <Award size={16} color="#4285F4" />
                        <Text style={styles.nutrientText}>{meal.nutrients.protein}g protein</Text>
                      </View>
                      
                      <View style={styles.nutrientItem}>
                        <Zap size={16} color="#DB4437" />
                        <Text style={styles.nutrientText}>{meal.nutrients.carbs}g carbs</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              
              <TouchableOpacity style={styles.addMealButton}>
                <Text style={styles.addMealButtonText}>Add Meal</Text>
              </TouchableOpacity>
            </>
          )}
          
          {activeTab === 'weekly' && (
            <>
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Weekly Calorie Intake</Text>
                <Text style={styles.chartSubtitle}>Average: 2,007 calories/day</Text>
                
                <SimpleBarChart 
                  data={weeklyData.data}
                  labels={weeklyData.labels}
                />
              </View>
              
              <View style={styles.weeklyStatsCard}>
                <Text style={styles.weeklyStatsTitle}>Weekly Nutrition Overview</Text>
                
                <View style={styles.weeklyStatRow}>
                  <View style={styles.weeklyStat}>
                    <Text style={styles.weeklyStatLabel}>Avg. Protein</Text>
                    <Text style={styles.weeklyStatValue}>92g</Text>
                    <Text style={styles.weeklyStatChange}>+5% from last week</Text>
                  </View>
                  
                  <View style={styles.weeklyStat}>
                    <Text style={styles.weeklyStatLabel}>Avg. Carbs</Text>
                    <Text style={styles.weeklyStatValue}>168g</Text>
                    <Text style={styles.weeklyStatChange}>-2% from last week</Text>
                  </View>
                </View>
                
                <View style={styles.weeklyStatRow}>
                  <View style={styles.weeklyStat}>
                    <Text style={styles.weeklyStatLabel}>Avg. Fat</Text>
                    <Text style={styles.weeklyStatValue}>52g</Text>
                    <Text style={styles.weeklyStatChange}>+1% from last week</Text>
                  </View>
                  
                  <View style={styles.weeklyStat}>
                    <Text style={styles.weeklyStatLabel}>Water Intake</Text>
                    <Text style={styles.weeklyStatValue}>1.8L</Text>
                    <Text style={styles.weeklyStatChange}>-0.2L from target</Text>
                  </View>
                </View>
              </View>
            </>
          )}
          
          {activeTab === 'insights' && (
            <>
              <View style={styles.insightsCard}>
                <View style={styles.insightHeader}>
                  <Text style={styles.insightsTitle}>Health Insights</Text>
                  <Info size={20} color="#6A6A6A" />
                </View>
                
                <Text style={styles.insightsDescription}>
                  Based on your eating patterns, here are some personalized insights to help improve your nutrition.
                </Text>
                
                {healthInsights.map(insight => (
                  <View key={insight.id} style={styles.insightItem}>
                    <View style={[styles.insightIconContainer, { backgroundColor: insight.color }]}>
                      {insight.icon === 'Award' && <Award size={24} color="#FFFFFF" />}
                      {insight.icon === 'Droplet' && <Droplet size={24} color="#FFFFFF" />}
                      {insight.icon === 'Flame' && <Flame size={24} color="#FFFFFF" />}
                    </View>
                    
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                      <Text style={styles.insightDescription}>{insight.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
              
              <View style={styles.recommendationsCard}>
                <Text style={styles.recommendationsTitle}>Recommendations</Text>
                
                <View style={styles.recommendationItem}>
                  <View style={styles.recommendationHeader}>
                    <Text style={styles.recommendationCategory}>Meal Balance</Text>
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>View Recipes</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.recommendationText}>
                    Try to include more leafy greens in your lunch meals to increase your fiber intake.
                  </Text>
                </View>
                
                <View style={styles.recommendationItem}>
                  <View style={styles.recommendationHeader}>
                    <Text style={styles.recommendationCategory}>Nutrient Timing</Text>
                    <TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>Learn More</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.recommendationText}>
                    Consider having your protein-rich meals within 2 hours after exercise for optimal recovery.
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.fullReportButton}>
                <Text style={styles.fullReportButtonText}>Generate Full Health Report</Text>
              </TouchableOpacity>
            </>
          )}
          
          <View style={styles.upgradeCard}>
            <LinearGradient
              colors={['#FF6A00', '#FF8F47']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.upgradeGradient}
            >
              <Text style={styles.upgradeTitle}>Unlock Premium Health Insights</Text>
              <Text style={styles.upgradeDescription}>
                Get personalized nutrition plans, detailed macro tracking, and AI-powered recommendations.
              </Text>
              <TouchableOpacity style={styles.upgradeButton}>
                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

// Styles for the custom chart component
const chartStyles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 220,
    marginVertical: 8,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    paddingHorizontal: 5,
  },
  barValue: {
    fontSize: 12,
    color: '#6A6A6A',
    marginBottom: 5,
  },
  barContainer: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '80%',
    minHeight: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  barLabel: {
    fontSize: 12,
    color: '#6A6A6A',
    marginTop: 5,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeTabText: {
    color: '#FF6A00',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 16,
  },
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calorieCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF0E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6A00',
  },
  calorieLabel: {
    fontSize: 14,
    color: '#6A6A6A',
  },
  nutrientBars: {
    flex: 1,
  },
  nutrientBar: {
    marginBottom: 12,
  },
  nutrientLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nutrientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  nutrientLabel: {
    fontSize: 14,
    color: '#6A6A6A',
    flex: 1,
  },
  nutrientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202026',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealImage: {
    width: '100%',
    height: 120,
  },
  mealInfo: {
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
  },
  mealTime: {
    fontSize: 14,
    color: '#6A6A6A',
  },
  mealNutrients: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrientItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutrientText: {
    fontSize: 14,
    color: '#6A6A6A',
    marginLeft: 4,
  },
  addMealButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF6A00',
    borderStyle: 'dashed',
  },
  addMealButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6A00',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#6A6A6A',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  weeklyStatsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  weeklyStatsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 16,
  },
  weeklyStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weeklyStat: {
    width: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
  },
  weeklyStatLabel: {
    fontSize: 14,
    color: '#6A6A6A',
    marginBottom: 4,
  },
  weeklyStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202026',
    marginBottom: 4,
  },
  weeklyStatChange: {
    fontSize: 12,
    color: '#4CAF50',
  },
  insightsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
  },
  insightsDescription: {
    fontSize: 14,
    color: '#6A6A6A',
    marginBottom: 16,
    lineHeight: 20,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6A6A6A',
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202026',
    marginBottom: 16,
  },
  recommendationItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF0E6',
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6A00',
  },
  recommendationText: {
    fontSize: 14,
    color: '#6A6A6A',
    lineHeight: 20,
  },
  fullReportButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#202026',
  },
  fullReportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202026',
  },
  upgradeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  upgradeGradient: {
    padding: 20,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6A00',
  },
});