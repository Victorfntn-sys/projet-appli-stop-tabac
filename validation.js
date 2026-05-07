/**
 * Input validation schemas using zod
 * Prevents malicious or malformed data from reaching the database
 */

const { z } = require('zod');

// Strings: limited length, no control chars
const trimmedString = (maxLen = 500) =>
  z
    .string()
    .max(maxLen, `String must be max ${maxLen} characters`)
    .refine(str => !str.includes('\x00'), 'Null bytes not allowed')
    .refine(
      str => !/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(str),
      'Control characters not allowed'
    );

// Email validation
const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255);

// Feedback validation (client sends message + contact)
const feedbackSchema = z.object({
  message: z
    .string()
    .max(600, 'String must be max 600 characters')
    .min(5, 'Message must be at least 5 characters')
    .refine(str => !str.includes('\x00'), 'Null bytes not allowed')
    .refine(
      str => !/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(str),
      'Control characters not allowed'
    ),
  contact: trimmedString(200).optional(),
  clientId: z.string().max(80).optional(),
});

// User state validation (tracks smoking data)
const userStateSchema = z.object({
  clientId: z.string().max(80, 'Client ID too long'),
  quitDate: z.string().max(40).optional(),
  cigsPerDay: z.number().int().min(0).max(200).optional(),
  cigsPerPack: z.number().int().min(1).max(50).optional(),
  pricePerPack: z.number().min(0).max(100).optional(),
  goalName: z.string().max(150).optional(),
  goalAmount: z.number().min(0).max(10000).optional(),
  isPaused: z.boolean().optional(),
  pausedDaysTotal: z.number().int().min(0).optional(),
  daysWithoutSmoking: z.number().int().min(0).optional(),
  savedCigarettes: z.number().min(0).optional(),
  savedMoney: z.number().min(0).optional(),
  dailyCost: z.number().min(0).optional(),
});

// Analytics event validation
const analyticsEventSchema = z.object({
  name: z.string().regex(/^[a-z_]+$/, 'Event name must be lowercase with underscores'),
  meta: z.record(z.unknown()).optional(),
  clientId: z.string().max(80).optional(),
  at: z.coerce.date('Invalid timestamp').optional(),
});

// Auth registration validation
const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(256, 'Password too long'),
  name: trimmedString(100).optional(),
});

// Auth login validation
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password required'),
});

// Push subscription validation
const pushSubscriptionSchema = z.object({
  endpoint: z.string().url('Invalid endpoint URL'),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
  clientId: z.string().max(80).optional(),
});

// Account state validation (user data)
const accountStateSchema = z.object({
  quitDate: z.coerce.date().optional(),
  cigarettesPerDay: z.number().int().min(0).max(200).optional(),
  pricePerPack: z.number().min(0).max(100).optional(),
  goalName: trimmedString(100).optional(),
  goalAmount: z.number().min(0).max(10000).optional(),
});

// Validation middleware factory
function createValidator(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validated = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({
          error: 'validation-error',
          messages,
        });
      }
      res.status(500).json({ error: 'validation-failed' });
    }
  };
}

module.exports = {
  feedbackSchema,
  userStateSchema,
  analyticsEventSchema,
  registerSchema,
  loginSchema,
  pushSubscriptionSchema,
  accountStateSchema,
  createValidator,
  trimmedString,
  emailSchema,
};
