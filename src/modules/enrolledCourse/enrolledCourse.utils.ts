export const calculateGradeAndPoints = (totalMarks: number) => {
  let result = {
    grade: 'NA',
    gradePoint: 0,
  };

  if (totalMarks >= 0 && totalMarks <= 19) {
    result = {
      grade: 'F',
      gradePoint: 0.0,
    };
  } else if (totalMarks >= 20 && totalMarks <= 39) {
    result = {
      grade: 'D',
      gradePoint: 2.0,
    };
  } else if (totalMarks >= 40 && totalMarks <= 59) {
    result = {
      grade: 'C',
      gradePoint: 3.0,
    };
  } else if (totalMarks >= 50 && totalMarks <= 79) {
    result = {
      grade: 'B',
      gradePoint: 3.5,
    };
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    result = {
      grade: 'A',
      gradePoint: 4.0,
    };
  } else {
    result = {
      grade: 'F',
      gradePoint: 0.0,
    };
  }

  return result;
};
