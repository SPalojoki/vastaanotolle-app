import express from 'express';
import prisma from '../db/prismaClient';
import { compressedFormSubmissionSchema } from '../types';

const doctorRouter = express.Router();

doctorRouter.post('/decode', async (req, res) => {
  if (!req.body.encodedAnswers) {
    return res.status(400).json({ error: 'Missing encoded answers' });
  }

  try {
    const decodedAnswersString = atob(req.body.encodedAnswers);
    const decodedAnswers = compressedFormSubmissionSchema.parse(JSON.parse(decodedAnswersString));

    const form = await getForm(decodedAnswers.fId);
    const questions = await getQuestions(decodedAnswers.qs.map((q) => q.qId));
    const preDefinedAnswers = await getPreDefinedAnswers(decodedAnswers.qs.map(q => q.a).flat());

    if (!form || !questions || !preDefinedAnswers) {
      throw new Error('Form, questions, or predefined answers used not found');
    }

    const richSubmission = generateRichSubmission(form, questions, preDefinedAnswers, decodedAnswers);
    return res.json(richSubmission);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Invalid encoded answers' });
  }
});

const getForm = async (formId: number) => {
  return await prisma.form.findUnique({
    where: { id: formId },
    select: { id: true, title: true },
  });
};

const getQuestions = async (questionIds: number[]) => {
  return await prisma.question.findMany({
    where: { id: { in: questionIds } },
    select: { id: true, text: true },
  });
};

const getPreDefinedAnswers = async (answerIds: (string | number)[]) => {
  const numericAnswerIds = answerIds.filter((id): id is number => typeof id === 'number');
  return await prisma.option.findMany({
    where: { id: { in: numericAnswerIds } },
    select: { id: true, text: true, reportText: true },
  });
};

const generateRichSubmission = (
  form: { id: number; title: string },
  questions: { id: number; text: string }[],
  preDefinedAnswers: { id: number; text: string; reportText: string | null }[],
  decodedAnswers: { fId: number; qs: { qId: number; a: string | number[] }[] }
) => {
  const processAnswer = (answer: string | number[], preDefinedAnswers: { id: number; text: string; reportText: string | null }[], questionTitle: string) => {
    if (typeof answer === 'string') {
      return { value: [answer], reportText: answer };
    } else {
      return {
        value: answer.map(a => preDefinedAnswers.find(ans => ans.id === a)?.text).filter(Boolean) as string[],
        reportText: `${answer.map(a => preDefinedAnswers.find(ans => ans.id === a)?.reportText).filter(Boolean).join(' & ')}`,
      };
    }
  };

  const processQuestion = (q: { qId: number; a: string | number[] }) => {
    const richQuestion = questions.find(question => q.qId === question.id);
    if (!richQuestion) {
      throw new Error('Question not found');
    }
    return {
      ...richQuestion,
      answer: processAnswer(q.a, preDefinedAnswers, richQuestion.text),
    };
  };

  return {
    formId: form.id,
    formTitle: form.title,
    questions: decodedAnswers.qs.map(q => processQuestion(q)),
  };
};

export default doctorRouter;
