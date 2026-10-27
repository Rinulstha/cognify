import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from '../utils/textChunker.js';

// ================= FLASHCARDS =================
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
      });
    }

    const cards = await geminiService.generateFlashcards(
      document.extractedText,
      parseInt(count)
    );

    const flashcard = await Flashcard.create({
      userId: req.user._id,
      documentId: document._id,
      cards,
      totalCards: cards.length
    });

    res.status(201).json({
      success: true,
      data: flashcard,
      message: 'Flashcards generated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// ================= QUIZ =================
export const generateQuiz = async (req, res, next) => {
  try {
    const { documentId, numQuestions = 5, title } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
      });
    }

    const questions = await geminiService.generateQuiz(
      document.extractedText,
      parseInt(numQuestions)
    );

    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title} - Quiz`,
      questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0
    });

    res.status(201).json({
      success: true,
      data: quiz,
      message: 'Quiz created successfully'
    });

  } catch (error) {
    next(error);
  }
};

// ================= SUMMARY =================
export const generateSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
      });
    }

    const summary = await geminiService.generateSummary(document.extractedText);

    res.status(200).json({
      success: true,
      data: {
        documentId: document._id,
        title: document.title,
        summary
      },
      message: 'Summary generated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// ================= CHAT =================
export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and question',
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
      });
    }

    // ✅ Find relevant chunks
    let relevantChunks = findRelevantChunks(document.chunks, question, 3);

    // ✅ Fallback if empty
    if (!relevantChunks || relevantChunks.length === 0) {
      relevantChunks = document.chunks.slice(0, 3);
    }

    const chunkIndices = relevantChunks.map(c => c.chunkIndex);

    // Chat history
    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        userId: req.user._id,
        documentId: document._id,
        messages: []
      });
    }

    const answer = await geminiService.chatWithContext(question, relevantChunks);

    chatHistory.messages.push(
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
        relevantChunks: []
      },
      {
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      }
    );

    await chatHistory.save();

    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id
      },
      message: 'Response generated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// ================= EXPLAIN CONCEPT =================
export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId and concept',
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: 'ready'
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found or not ready',
      });
    }

    let relevantChunks = findRelevantChunks(document.chunks, concept, 3);

    // ✅ Fallback
    if (!relevantChunks || relevantChunks.length === 0) {
      relevantChunks = document.chunks.slice(0, 3);
    }

    const context = relevantChunks.map(c => c.content).join('\n\n');

    const explanation = await geminiService.explainConcept(concept, context);

    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c => c.chunkIndex)
      },
      message: 'Explanation generated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// ================= CHAT HISTORY =================
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide documentId',
      });
    }

    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId
    }).select('messages');

    res.status(200).json({
      success: true,
      data: chatHistory?.messages || [],
      message: chatHistory
        ? 'Chat history retrieved successfully'
        : 'No chat history found for this document'
    });

  } catch (error) {
    next(error);
  }
};