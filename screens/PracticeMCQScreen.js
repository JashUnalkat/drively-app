import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

/**
 * PracticeMCQScreen Component
 * A quiz application for Ontario driving knowledge (G1, G2, Full G).
 * Features: Exam selection, progressive question tracking, and detailed result analysis.
 */

const questionBank = {
  G1: [
    {
      question: 'What does a red traffic light mean?',
      options: ['Go if the road is clear', 'Stop completely', 'Slow down only', 'Turn right only'],
      correctAnswer: 1,
    },
    {
      question: 'What should you do at a stop sign?',
      options: ['Slow down and continue', 'Stop only if other cars are near', 'Come to a complete stop', 'Honk and continue'],
      correctAnswer: 2,
    },
    {
      question: 'What does a yellow traffic light mean?',
      options: ['Speed up', 'Stop if it is safe to do so', 'Always continue', 'Turn left only'],
      correctAnswer: 1,
    },
    {
      question: 'What is the legal blood alcohol limit for fully licensed drivers in Ontario for novice drivers?',
      options: ['0.08', '0.05', '0.00', '0.10'],
      correctAnswer: 2,
    },
    {
      question: 'What does a flashing red light mean?',
      options: ['Proceed with caution', 'Yield only', 'Stop completely and proceed when safe', 'School zone ahead'],
      correctAnswer: 2,
    },
    {
      question: 'When should you use your turn signal?',
      options: ['Only in heavy traffic', 'Before every turn or lane change', 'Only at night', 'Only on highways'],
      correctAnswer: 1,
    },
    {
      question: 'What does a solid yellow line usually mean?',
      options: ['Passing allowed anytime', 'No parking', 'Traffic moves in opposite directions', 'Bus lane'],
      correctAnswer: 2,
    },
    {
      question: 'What should you do when approaching a pedestrian crosswalk?',
      options: ['Speed up', 'Be prepared to stop', 'Ignore if no light is flashing', 'Honk first'],
      correctAnswer: 1,
    },
    {
      question: 'What is the purpose of road signs?',
      options: ['Decorate roads', 'Provide traffic information and warnings', 'Show advertisements', 'Only help police'],
      correctAnswer: 1,
    },
    {
      question: 'What should you do before backing up?',
      options: ['Only check mirrors', 'Look behind and around the vehicle', 'Honk and reverse fast', 'Open the door and reverse'],
      correctAnswer: 1,
    },
    {
      question: 'A school bus with flashing red lights means:',
      options: ['Pass carefully', 'Do not stop', 'Stop until lights stop flashing', 'Only trucks must stop'],
      correctAnswer: 2,
    },
    {
      question: 'What does a speed limit sign indicate?',
      options: ['Suggested speed only', 'Maximum legal speed under ideal conditions', 'Minimum speed', 'Night speed only'],
      correctAnswer: 1,
    },
    {
      question: 'Who has the right-of-way at a four-way stop if two cars arrive at the same time?',
      options: ['The larger vehicle', 'The vehicle on the right', 'The fastest vehicle', 'The one turning left'],
      correctAnswer: 1,
    },
    {
      question: 'What should you do if your vision is blocked at an intersection?',
      options: ['Accelerate quickly', 'Move ahead carefully until you can see clearly', 'Ignore cross traffic', 'Honk and go'],
      correctAnswer: 1,
    },
    {
      question: 'Why is distracted driving dangerous?',
      options: ['It improves confidence', 'It reduces attention and reaction time', 'It saves time', 'It only affects passengers'],
      correctAnswer: 1,
    },
  ],

  G2: [
    {
      question: 'What is the safest way to merge onto a highway?',
      options: ['Stop at the end of the ramp', 'Match the speed of traffic and signal', 'Drive much slower than traffic', 'Enter without checking mirrors'],
      correctAnswer: 1,
    },
    {
      question: 'When following another vehicle in normal conditions, you should maintain at least:',
      options: ['1 second', '2 seconds', '5 seconds', '10 seconds'],
      correctAnswer: 1,
    },
    {
      question: 'What should you do if your car begins to skid?',
      options: ['Brake hard', 'Steer in the direction you want to go', 'Accelerate sharply', 'Turn the wheel fully opposite'],
      correctAnswer: 1,
    },
    {
      question: 'When changing lanes, you should:',
      options: ['Only signal', 'Signal, check mirrors, and check blind spot', 'Only check blind spot', 'Speed up without checking'],
      correctAnswer: 1,
    },
    {
      question: 'What should you do when driving in heavy rain?',
      options: ['Increase speed', 'Use cruise control', 'Reduce speed and increase following distance', 'Turn off headlights'],
      correctAnswer: 2,
    },
    {
      question: 'What is black ice?',
      options: ['A type of snow', 'A nearly invisible thin layer of ice on the road', 'Oil on the road', 'Salt buildup'],
      correctAnswer: 1,
    },
    {
      question: 'Why should you avoid sudden braking in winter?',
      options: ['It warms the brakes', 'It may cause loss of control', 'It improves grip', 'It saves fuel'],
      correctAnswer: 1,
    },
    {
      question: 'When passing another vehicle, you should return to your lane when:',
      options: ['You feel safe', 'You can see the entire vehicle in your mirror', 'Immediately after passing', 'The other driver flashes lights'],
      correctAnswer: 1,
    },
    {
      question: 'What should you do if an emergency vehicle approaches with lights and siren?',
      options: ['Keep driving normally', 'Stop in your lane', 'Move to the right and stop safely', 'Race ahead of it'],
      correctAnswer: 2,
    },
    {
      question: 'What does checking your blind spot help prevent?',
      options: ['Engine damage', 'Collisions during lane changes', 'Flat tires', 'Running out of fuel'],
      correctAnswer: 1,
    },
    {
      question: 'When driving at night, you should:',
      options: ['Drive faster', 'Use high beams at all times', 'Reduce speed and watch farther ahead', 'Look only at the centre line'],
      correctAnswer: 2,
    },
    {
      question: 'Hydroplaning happens when:',
      options: ['Tires lose contact with the road because of water', 'Your brakes fail', 'Your engine overheats', 'Your headlights are off'],
      correctAnswer: 0,
    },
    {
      question: 'If another driver is tailgating you, the safest response is to:',
      options: ['Brake suddenly', 'Speed up aggressively', 'Allow them to pass when safe', 'Ignore completely'],
      correctAnswer: 2,
    },
    {
      question: 'Before turning left across traffic, you should:',
      options: ['Turn as fast as possible', 'Yield to oncoming traffic and pedestrians', 'Assume others will stop', 'Only watch vehicles behind you'],
      correctAnswer: 1,
    },
    {
      question: 'What is the main goal of defensive driving?',
      options: ['Arrive faster', 'Avoid hazards and reduce crash risk', 'Use less fuel only', 'Pass more vehicles'],
      correctAnswer: 1,
    },
  ],

  FullG: [
    {
      question: 'On a freeway, the left lane is mainly used for:',
      options: ['Parking', 'Passing', 'Slow vehicles', 'Emergency stops only'],
      correctAnswer: 1,
    },
    {
      question: 'What is the safest action when entering a curve too fast?',
      options: ['Brake hard in the middle of the curve', 'Steer smoothly and reduce speed carefully', 'Accelerate more', 'Turn sharply'],
      correctAnswer: 1,
    },
    {
      question: 'When driving long distance, fatigue can be reduced by:',
      options: ['Turning up music only', 'Taking regular breaks and resting', 'Driving faster to finish early', 'Using phone to stay awake'],
      correctAnswer: 1,
    },
    {
      question: 'A safe driver should scan the road ahead about:',
      options: ['2-3 seconds', '5-10 seconds', '12-15 seconds', '30 seconds'],
      correctAnswer: 2,
    },
    {
      question: 'If your tire blows out at highway speed, you should first:',
      options: ['Brake hard', 'Grip steering firmly and slow down gradually', 'Turn sharply to shoulder', 'Accelerate'],
      correctAnswer: 1,
    },
    {
      question: 'What is the best way to handle aggressive drivers?',
      options: ['Challenge them', 'Make eye contact and argue', 'Stay calm and avoid engagement', 'Block them'],
      correctAnswer: 2,
    },
    {
      question: 'When approaching a work zone, you should:',
      options: ['Maintain full speed', 'Slow down and follow posted signs', 'Ignore cones', 'Pass workers quickly'],
      correctAnswer: 1,
    },
    {
      question: 'The safest following distance in poor weather is:',
      options: ['Less than normal', 'The same as normal', 'Greater than normal', 'Not important'],
      correctAnswer: 2,
    },
    {
      question: 'If traffic lights are not working at an intersection, treat it as:',
      options: ['A yield sign', 'A green light', 'An all-way stop', 'A construction zone only'],
      correctAnswer: 2,
    },
    {
      question: 'Why is space management important while driving?',
      options: ['It helps avoid conflicts and gives time to react', 'It makes parking easier only', 'It reduces need for signals', 'It helps speeding'],
      correctAnswer: 0,
    },
    {
      question: 'When should you check mirrors while driving?',
      options: ['Only before parking', 'Regularly and before changing speed or direction', 'Only on highways', 'Only at stop signs'],
      correctAnswer: 1,
    },
    {
      question: 'What is the safest way to pass a cyclist?',
      options: ['Pass very closely', 'Give as much space as possible and pass when safe', 'Honk and pass immediately', 'Speed by before oncoming traffic'],
      correctAnswer: 1,
    },
    {
      question: 'If visibility is severely reduced by fog, you should:',
      options: ['Use high beams', 'Use low beams and reduce speed', 'Drive with hazards only', 'Stop in a live lane'],
      correctAnswer: 1,
    },
    {
      question: 'What should you do if you miss your highway exit?',
      options: ['Reverse on the shoulder', 'Stop and back up', 'Continue to the next exit', 'Make a U-turn immediately'],
      correctAnswer: 2,
    },
    {
      question: 'What does smooth acceleration and braking help with?',
      options: ['Better control and reduced risk', 'More tire wear', 'More distractions', 'Less visibility'],
      correctAnswer: 0,
    },
  ],
};

export default function PracticeMCQScreen() {
  const [selectedExam, setSelectedExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  /**
   * Memoized question set based on selected exam type to prevent unnecessary recalculation.
   */
  const questions = useMemo(() => {
    if (!selectedExam) return [];
    return questionBank[selectedExam];
  }, [selectedExam]);

  const handleChooseExam = (examType) => {
    setSelectedExam(examType);
    setCurrentQuestion(0);
    setSelectedIndex(null);
    setAnswers([]);
    setShowResult(false);
  };

  const handleSelectAnswer = (index) => {
    setSelectedIndex(index);
  };

  /**
   * Stores the current answer and moves to the next question or shows result view.
   */
  const handleNext = () => {
    const updatedAnswers = [
      ...answers,
      {
        question: questions[currentQuestion].question,
        selectedAnswer: selectedIndex,
        correctAnswer: questions[currentQuestion].correctAnswer,
        options: questions[currentQuestion].options,
      },
    ];

    if (currentQuestion < questions.length - 1) {
      setAnswers(updatedAnswers);
      setCurrentQuestion(currentQuestion + 1);
      setSelectedIndex(null);
    } else {
      setAnswers(updatedAnswers);
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setSelectedExam(null);
    setCurrentQuestion(0);
    setSelectedIndex(null);
    setAnswers([]);
    setShowResult(false);
  };

  // --- RESULT CALCULATIONS ---
  const score = answers.filter(
    (item) => item.selectedAnswer === item.correctAnswer
  ).length;

  const wrongAnswers = answers.filter(
    (item) => item.selectedAnswer !== item.correctAnswer
  );

  // --- VIEW 1: EXAM SELECTION ---
  if (!selectedExam) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Practice MCQ</Text>
        <Text style={styles.subtitle}>
          Choose an exam version to practice your driving knowledge.
        </Text>

        <TouchableOpacity
          style={styles.examCard}
          onPress={() => handleChooseExam('G1')}
        >
          <Text style={styles.examTitle}>G1 Test</Text>
          <Text style={styles.examDesc}>
            15 beginner-level road signs, rules, and traffic law questions.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.examCard}
          onPress={() => handleChooseExam('G2')}
        >
          <Text style={styles.examTitle}>G2 Test</Text>
          <Text style={styles.examDesc}>
            15 intermediate questions focused on real driving situations.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.examCard}
          onPress={() => handleChooseExam('FullG')}
        >
          <Text style={styles.examTitle}>Full G Test</Text>
          <Text style={styles.examDesc}>
            15 advanced questions on highway, defensive, and full-license driving.
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- VIEW 2: FINAL RESULTS ---
  if (showResult) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{selectedExam} Result</Text>
        <Text style={styles.resultScore}>
          You scored {score} / {questions.length}
        </Text>

        <Text style={styles.resultStatus}>
          {score >= 12 ? 'Great job!' : score >= 9 ? 'Good effort!' : 'Keep practicing!'}
        </Text>

        <Text style={styles.sectionTitle}>Wrong Answers</Text>

        {wrongAnswers.length === 0 ? (
          <Text style={styles.perfectText}>Perfect score — no wrong answers.</Text>
        ) : (
          wrongAnswers.map((item, index) => (
            <View key={index} style={styles.resultCard}>
              <Text style={styles.resultQuestion}>{item.question}</Text>
              <Text style={styles.wrongText}>
                Your answer: {item.options[item.selectedAnswer]}
              </Text>
              <Text style={styles.correctText}>
                Correct answer: {item.options[item.correctAnswer]}
              </Text>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.nextButton} onPress={handleRestart}>
          <Text style={styles.nextButtonText}>Back to Exam Selection</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // --- VIEW 3: ACTIVE TEST ---
  const question = questions[currentQuestion];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedExam} Practice Test</Text>
      <Text style={styles.progress}>
        Question {currentQuestion + 1} of {questions.length}
      </Text>

      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedIndex === index && styles.selectedOption,
          ]}
          onPress={() => handleSelectAnswer(index)}
        >
          <Text
            style={[
              styles.optionText,
              selectedIndex === index && styles.selectedOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedIndex === null && styles.disabledButton,
        ]}
        onPress={handleNext}
        disabled={selectedIndex === null}
      >
        <Text style={styles.nextButtonText}>
          {currentQuestion === questions.length - 1 ? 'Submit Test' : 'Next Question'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0057b7',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
    lineHeight: 20,
  },
  examCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  examTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  examDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    lineHeight: 20,
  },
  progress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  questionText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 24,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#0057b7',
    borderColor: '#0057b7',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#0057b7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9bb7d4',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0057b7',
    marginBottom: 10,
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  resultQuestion: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  wrongText: {
    fontSize: 14,
    color: '#c62828',
    marginBottom: 4,
  },
  correctText: {
    fontSize: 14,
    color: '#2e7d32',
  },
  perfectText: {
    fontSize: 15,
    color: '#2e7d32',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});