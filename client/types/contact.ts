export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string;
  message: string | null;
  createdAt: string;
};

export type SubmitContactMessagePayload = {
  name: string;
  phone: string;
  subject: string;
  message?: string;
  email?: string;
  fbEventId?: string;
  fbc?: string;
  fbp?: string;
};

export type SubmitContactMessageResult = {
  success: true;
  message: string;
  data: ContactMessage;
};
