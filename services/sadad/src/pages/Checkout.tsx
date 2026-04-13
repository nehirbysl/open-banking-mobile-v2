import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Stack,
  Button,
  Box,
  Divider,
  Alert,
  Loader,
} from '@mantine/core';
import {
  IconBuildingBank,
  IconArrowLeft,
  IconLock,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import { useCart } from '@/App';
import { formatOMR } from '@/utils/products';
import {
  MERCHANT,
  createPaymentConsent,
  buildPaymentRedirectUrl,
  storePaymentContext,
  generateOrderRef,
} from '@/utils/payment';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const orderRef = generateOrderRef();

      // 1. Create domestic-payment consent
      const consent = await createPaymentConsent(total, orderRef);

      // 2. Store context for callback
      storePaymentContext(consent.consent_id, orderRef);

      // 3. Redirect to BD Online for approval
      const redirectUrl = buildPaymentRedirectUrl(consent.consent_id);
      window.location.href = redirectUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to initiate payment. Please try again.'
      );
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <Header onCartOpen={() => setCartOpen(true)} />
        <CartDrawer opened={cartOpen} onClose={() => setCartOpen(false)} />
        <Container size="sm" py={80}>
          <Stack align="center" gap="md">
            <Text size="4rem" style={{ opacity: 0.3 }}>
              {'\u{1F6D2}'}
            </Text>
            <Title order={2} c="dimmed">
              Your cart is empty
            </Title>
            <Text c="dimmed">Add some items to your cart before checking out.</Text>
            <Button
              variant="light"
              color="blue"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate('/')}
            >
              Back to Store
            </Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer opened={cartOpen} onClose={() => setCartOpen(false)} />

      <Container size="sm" py="xl">
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/')}
          mb="lg"
          px={0}
        >
          Back to Store
        </Button>

        <Title order={2} mb="lg">
          Checkout
        </Title>

        {/* Order Summary */}
        <Paper shadow="sm" radius="md" p="lg" withBorder mb="lg">
          <Text fw={600} size="lg" mb="md">
            Order Summary
          </Text>

          <Stack gap="sm">
            {items.map((item) => (
              <Group key={item.product.id} justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                  <Box
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: '#f1f3f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {item.product.emoji}
                  </Box>
                  <Stack gap={0} style={{ minWidth: 0 }}>
                    <Text size="sm" fw={500} truncate="end">
                      {item.product.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatOMR(item.product.price)} x {item.quantity}
                    </Text>
                  </Stack>
                </Group>
                <Text
                  size="sm"
                  fw={600}
                  style={{ fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}
                >
                  {formatOMR(item.product.price * item.quantity)}
                </Text>
              </Group>
            ))}
          </Stack>

          <Divider my="md" />

          <Group justify="space-between">
            <Text fw={600} size="lg">
              Total
            </Text>
            <Text
              fw={700}
              size="xl"
              c="blue.7"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {formatOMR(total)}
            </Text>
          </Group>
        </Paper>

        {/* Merchant Info */}
        <Paper shadow="sm" radius="md" p="lg" withBorder mb="lg">
          <Text fw={600} size="lg" mb="md">
            Payment To
          </Text>
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Merchant</Text>
              <Group gap={8}>
                <Text size="sm" fw={500}>{MERCHANT.name}</Text>
                <Text size="sm" c="dimmed" dir="rtl">{MERCHANT.nameAr}</Text>
              </Group>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">IBAN</Text>
              <Text size="sm" fw={500} style={{ fontFamily: 'monospace', fontSize: 12 }}>
                {MERCHANT.iban}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">Currency</Text>
              <Text size="sm" fw={500}>OMR (Omani Rial)</Text>
            </Group>
          </Stack>
        </Paper>

        {/* Error */}
        {error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Payment Error"
            color="red"
            mb="lg"
            withCloseButton
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Pay button */}
        <Button
          fullWidth
          size="xl"
          radius="md"
          color="teal"
          leftSection={
            loading ? (
              <Loader size={20} color="white" />
            ) : (
              <IconBuildingBank size={22} />
            )
          }
          onClick={handlePay}
          disabled={loading}
          style={{
            height: 64,
            fontSize: 18,
          }}
        >
          {loading
            ? 'Creating payment...'
            : `Pay with Bank Dhofar \u2014 ${formatOMR(total)}`}
        </Button>

        <Group justify="center" mt="md" gap="xs">
          <IconLock size={14} color="#868e96" />
          <Text size="xs" c="dimmed">
            Secured by Bank Dhofar Open Banking. You will be redirected to approve this payment.
          </Text>
        </Group>
      </Container>
    </Box>
  );
}
