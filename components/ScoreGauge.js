import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { getDrivingGrade } from '../services/gradeService';

export default function ScoreGauge({ score = 82 }) {
  // Gauge dimensions and geometry constants
  const size = 220;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  // Ensure score stays between 0-100 and fetch corresponding grade data
  const clampedScore = Math.max(0, Math.min(score, 100));
  const grade = getDrivingGrade(clampedScore);

  // Calculate needle rotation 
  const needleAngle = 180 - (clampedScore / 100) * 180;

  // Helper to convert angular coordinates to SVG XY coordinates
  const polarToCartesian = (angleDeg, r = radius) => {
    const rad = (Math.PI / 180) * angleDeg;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  };

  // Generates SVG path string for the gauge arcs
  const describeArc = (startAngle, endAngle) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  };

  // Needle position calculations
  const needleTip = polarToCartesian(needleAngle, radius - 15);
  const needleTail = polarToCartesian(needleAngle + 180, 12);

  return (
    <View style={styles.container}>
      <View style={styles.gaugeWrapper}>
        <Svg width={size} height={size / 2 + 10}>
          {/* Reckless Segment (Red) */}
          <Path
            d={describeArc(180, 108)}
            stroke="#d32f2f"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="butt"
          />
          {/* Risky Segment (Orange) */}
          <Path
            d={describeArc(108, 72)}
            stroke="#f57c00"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="butt"
          />
          {/* Normal Segment (Yellow) */}
          <Path
            d={describeArc(72, 36)}
            stroke="#fbc02d"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="butt"
          />
          {/* Excellent Segment (Green) */}
          <Path
            d={describeArc(36, 0)}
            stroke="#2e7d32"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="butt"
          />

          {/* Dynamic Needle */}
          <Line
            x1={needleTail.x}
            y1={needleTail.y}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke="#333"
            strokeWidth={4}
            strokeLinecap="round"
          />

          {/* Center anchor point for needle */}
          <Circle cx={cx} cy={cy} r={7} fill="#444" />
        </Svg>

        {/* Numeric score display overlay */}
        <Text style={styles.scoreInside}>{clampedScore}</Text>
      </View>

      {/* Threshold labels for the gauge segments */}
      <View style={styles.labelsRow}>
        <Text style={styles.rangeLabel}>Reckless</Text>
        <Text style={styles.rangeLabel}>Risky</Text>
        <Text style={styles.rangeLabel}>Normal</Text>
        <Text style={styles.rangeLabel}>Excellent</Text>
      </View>

      {/* Grade label and overall title */}
      <Text style={[styles.gradeText, { color: grade.color }]}>
        {grade.label}
      </Text>
      <Text style={styles.scoreLabel}>SAFE DRIVING SCORE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 25,
  },
  gaugeWrapper: {
    width: 220,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scoreInside: {
    position: 'absolute',
    top: 62,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0057b7',
    textAlign: 'center',
  },
  labelsRow: {
    width: 260,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16,
  },
  rangeLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: '#555',
  },
  gradeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    letterSpacing: 0.4,
  },
});