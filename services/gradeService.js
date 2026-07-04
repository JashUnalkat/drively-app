export function getDrivingGrade(score) {
  if (score >= 0 && score <= 40) {
    return { label: 'Reckless Driving', color: '#d32f2f' };
  }
  if (score >= 41 && score <= 60) {
    return { label: 'Risky Driving', color: '#f57c00' };
  }
  if (score >= 61 && score <= 80) {
    return { label: 'Normal Driving', color: '#fbc02d' };
  }
  return { label: 'Excellent Driving', color: '#2e7d32' };
}