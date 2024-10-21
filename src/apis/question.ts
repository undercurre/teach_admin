import { getInitialState } from '@/app';
import { request } from '@umijs/max';
import { Result } from '.';

const questionport = '/api/questions';
const answerport = '/api/user-answers';

export type Question = {
  content: string;
  answer: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export interface CreateQuestionParams {
  content: string;
  answer: string;
}

export type Answer = {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
    phone: string | null;
  };
  question: {
    id: string;
    content: string;
    answer: string;
  };
  userAnswer: string;
  score: number;
  answeredAt: string;
};

export const getQuestions = () => {
  return request<Result<Array<Question>>>(questionport, {
    method: 'GET',
  });
};

export const createQuestion = (question: CreateQuestionParams) => {
  return request<Result<Question>>(questionport, {
    method: 'POST',
    data: question,
  });
};

export const getAnswers = async () => {
  const initState = await getInitialState();
  return request<Result<Array<Answer>>>(`${answerport}/user/${initState.currentUser?.userid}`);
};

export const updateAnswers = async (
  answerId: string,
  data: { userAnswer?: string; score?: number },
) => {
  return request<Result<Array<Answer>>>(`${answerport}/${answerId}`, {
    method: 'PUT',
    data,
  });
};
