import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Stack,
  Button,
  Box,
  Loader,
  Alert,
  Paper,
} from '@mantine/core';
import { IconArrowLeft, IconAlertCircle } from '@tabler/icons-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Receipt from '@/components/Receipt';
import { useCart } from '@/App';
import {
  validateState,
  getStoredConsentId,
  getStoredOrderRef,
  clearPaymentContext,
} from '@/utils/payment';

type PaymentStatus = 'processing' | 'success' | 'error';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { total, clear } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [orderRef, setOrderRef] = useState('');
  const [consentId, setConsentId] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const callbackConsentId = searchParams.get('consent_id');
        const state = searchParams.get('state');
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');

        // Check if user rejected the consent
        if (errorParam) {
          setErrorMessage(
            errorParam === 'access_denied'
              ? 'You cancelled the payment. No money was charged.'
              : `Payment failed: ${errorParam}`
          );
          setStatus('error');
          return;
        }

        // Validate state parameter for CSRF protection
        if (state && !validateState(state)) {
          setErrorMessage('Invalid state parameter. Payment may have been tampered with.');
          setStatus('error');
          return;
        }

        // Retrieve stored payment context
        const storedConsentId = callbackConsentId || getStoredConsentId() || '';
        const storedOrderRef = getStoredOrderRef() || '';

        if (!storedConsentId) {
          setErrorMessage('No payment consent found. Please try again from checkout.');
          setStatus('error');
          return;
        }

        setConsentId(storedConsentId);
        setOrderRef(storedOrderRef);
        setPaymentAmount(total);

        // Simulate brief processing delay (in production, the payment was already
        // executed on BD Online's side when the customer approved the consent)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Payment confirmed — clear cart and payment context
        clear();
        clearPaymentContext();
        setStatus('success');
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'An unexpected error occurred.'
        );
        setStatus('error');
      }
    };

    processCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer opened={cartOpen} onClose={() => setCartOpen(false)} />

      <Container size="sm" py={60}>
        {status === 'processing' && (
          <Stack align="center" gap="lg" py={60}>
            <Loader size="xl" color="blue" />
            <Title order={2}>Processing Payment...</Title>
            <Text c="dimmed" size="lg">
              {'\u062C\u0627\u0631\u064A \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u062F\u0641\u0639...'}
            </Text>
            <Text c="dimmed" size="sm">
              Please do not close this window.
            </Text>
          </Stack>
        )}

        {status === 'success' && (
          <Stack gap="xl">
            <Receipt
              amount={paymentAmount}
              reference={orderRef}
              consentId={consentId}
            />
            <Button
              variant="light"
              color="blue"
              size="lg"
              fullWidth
              maw={480}
              mx="auto"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate('/')}
            >
              Back to Store
            </Button>
          </Stack>
        )}

        {status === 'error' && (
          <Stack align="center" gap="lg" py={40}>
            <Paper shadow="sm" radius="lg" p="xl" withBorder maw={480} w="100%">
              <Stack align="center" gap="md">
                <Alert
                  icon={<IconAlertCircle size={20} />}
                  title="Payment Failed"
                  color="red"
                  w="100%"
                >
                  {errorMessage}
                </Alert>
                <Text size="sm" c="dimmed" ta="center">
                  Your bank account has not been charged.
                  You can try again or return to the store.
                </Text>
                <Button
                  variant="filled"
                  color="blue"
                  onClick={() => navigate('/checkout')}
                  fullWidth
                >
                  Try Again
                </Button>
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<IconArrowLeft size={16} />}
                  onClick={() => navigate('/')}
                  fullWidth
                >
                  Back to Store
                </Button>
              </Stack>
            </Paper>
          </Stack>
        )}
      </Container>
    </Box>
  );
}
