'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MagicCard } from "@/components/magicui/magic-card";
import { AuroraText } from "@/components/magicui/aurora-text";
import { FaSpinner } from 'react-icons/fa';
import ReCAPTCHA from "react-google-recaptcha";

interface ContactProps {
  isOpen: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 40 },
};

const Contact: React.FC<ContactProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Reset form when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setSubmissionStatus(null);
      setErrorMessage('');
    }
    
    // Control body scroll
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleCaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus(null);
    setErrorMessage('');
    setIsSubmitting(true);

    if (recaptchaSiteKey && !recaptchaToken) {
      setSubmissionStatus('error');
      setErrorMessage('Please complete the reCAPTCHA verification');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          token: recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to send message');

      setSubmissionStatus('success');
      // Clear form data on successful submission
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setRecaptchaToken(null);

      // Close the modal after showing success message for a moment
      setTimeout(onClose, 2000);
    } catch (err) {
      setSubmissionStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle modal close - custom wrapper that resets status
  const handleClose = () => {
    setSubmissionStatus(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={handleClose}
          />
          <div className='fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2'>
            <motion.div
              className="w-full p-4 sm:p-6"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <MagicCard
                className="p-8 rounded-xl text-white"
                backgroundColor="black"
                borderWidth={2}
                gradientSize={300}
              >
                <div className="backdrop-blur-md">
                  <h2 className="text-2xl text-center font-semibold mb-4">
                    Let&apos;s <AuroraText>Connect</AuroraText>
                  </h2>
                  {submissionStatus && (
                    <div
                      className={`p-3 rounded mb-4 ${
                        submissionStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
                      } text-white`}
                      aria-live="polite"
                    >
                      {submissionStatus === 'success'
                        ? 'Your message has been sent successfully!'
                        : errorMessage || 'There was an error. Please try again later.'}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm text-gray-300 mb-1">Name</label>
                      <input
                        id="name"
                        type="text"
                        className="w-full px-3 py-2 rounded bg-[#1E2029] text-white focus:outline-none focus:ring-1 focus:ring-[#3CCF91]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        aria-label="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm text-gray-300 mb-1">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 rounded bg-[#1E2029] text-white focus:outline-none focus:ring-1 focus:ring-[#3CCF91]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        aria-label="Your email"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm text-gray-300 mb-1">Subject</label>
                      <input
                        id="subject"
                        type="text"
                        className="w-full px-3 py-2 rounded bg-[#1E2029] text-white focus:outline-none focus:ring-1 focus:ring-[#3CCF91]"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={isSubmitting}
                        aria-label="Subject"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm text-gray-300 mb-1">Message</label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-3 py-2 rounded bg-[#1E2029] text-white focus:outline-none focus:ring-1 focus:ring-[#3CCF91]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={isSubmitting}
                        aria-label="Your message"
                      />
                    </div>

                    {recaptchaSiteKey && (
                      <div className="flex justify-center">
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={recaptchaSiteKey}
                          onChange={handleCaptchaChange}
                          theme="dark"
                        />
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`bg-[#2ba577] hover:bg-[#3CCF91] text-black font-bold px-4 py-2 rounded flex items-center justify-center transition-colors ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                          </>
                        ) : (
                          'Send'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </MagicCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Contact;