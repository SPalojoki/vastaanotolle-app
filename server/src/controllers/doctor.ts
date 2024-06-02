import express from 'express';
import prisma from '../db/prismaClient';
import { CompressedAnswer, CompressedFormSubmission, CompressedQuestion, compressedFormSubmissionSchema} from '../types';

const doctorRouter = express.Router();

doctorRouter.post('/decode', async (req, res) => {
  if (!req.body.submissionString) {
    return res.status(400).json({ error: 'Missing submission string' });
  }

  try {
    const submissionStringDecoded = atob(req.body.submissionString);
    const submission = compressedFormSubmissionSchema.parse(JSON.parse(submissionStringDecoded));

    const richSubmission = await generateRichSubmission(submission);
    console.log(richSubmission)
    return res.json(richSubmission);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Invalid encoded answers' });
  }
});

const getForm = async (formId: number) => {
  return await prisma.form.findUnique({
    where: { id: formId },
    select: { translations: { select: { language: true, title: true } },
  }});
};

const getQuestions = async (questionIds: number[]) => {
  return await prisma.question.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, type: true, translations: { select: { language: true, text: true, reportText: true }} },
  });
};

const getPreDefinedAnswers = async (answers: (number | string)[]) => {
  const numericAnswerIds = answers.filter((a) => typeof a === 'number') as number[];

  return await prisma.option.findMany({
    where: { id: { in: numericAnswerIds } },
    select: { id: true, translations: { select: { language: true, text: true, reportText: true }} },
  }) 
};

// TODO: Update for multiple languages
const generateRichSubmission = async (
  compressedSubmission: CompressedFormSubmission
)=> {
  const form = await getForm(compressedSubmission.fId);
  const questions = await getQuestions(compressedSubmission.qs.map((q) => q.qId));
  const preDefinedAnswers = await getPreDefinedAnswers(compressedSubmission.qs.map(q => q.a).flat());

  if (!form || !questions || !preDefinedAnswers) {
    throw new Error('Form, questions, or predefined answers used not found');
  }

  const processQuestion = (q: CompressedQuestion) => {
    const richQuestion = questions.find(question => q.qId === question.id);
    if (!richQuestion) {
      throw new Error('Question not found');
    }
    return {
      ...richQuestion,
      answer: processAnswer(q.a),
    };
  };

  const processAnswer = (a: CompressedAnswer) => {
    if (typeof a === 'string') {
      return {
        type: 'TEXT',
        text: a,
      };
    } else {
      return a.map((answerId) => {
        const answer = preDefinedAnswers.find((a) => a.id === answerId);
        if (!answer) {
          throw new Error('Answer not found');
        }
        return {
          type: 'MULTIPLE_CHOICE',
          translations: answer.translations,
        };
      }
    )
    }
  }

  return {
    translations: form.translations,
    questions: compressedSubmission.qs.map(q => processQuestion(q)),
  };
};

export default doctorRouter;
