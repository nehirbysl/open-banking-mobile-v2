import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Box,
  Group,
  Badge,
  Paper,
  Stack,
} from '@mantine/core';
import { IconTruckDelivery, IconShieldCheck, IconCurrencyDollar } from '@tabler/icons-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import { PRODUCTS } from '@/utils/products';

export default function Store() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <Box style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <Header onCartOpen={() => setCartOpen(true)} />
      <CartDrawer opened={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #0984E3 0%, #74B9FF 50%, #a5d8ff 100%)',
          padding: '48px 0 56px',
        }}
      >
        <Container size="lg">
          <Stack gap="sm" align="center" ta="center">
            <Badge
              variant="white"
              color="blue"
              size="lg"
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Open Banking Payment
            </Badge>
            <Title order={1} c="white" size="2.5rem">
              Salalah Electronics
            </Title>
            <Text
              size="xl"
              c="white"
              style={{ opacity: 0.9 }}
              dir="rtl"
              fw={500}
            >
              {'\u0635\u0644\u0627\u0644\u0629 \u0644\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A'}
            </Text>
            <Text size="md" c="white" style={{ opacity: 0.8 }} maw={500}>
              Authentic Omani products, delivered to your door.
              Pay instantly from your Bank Dhofar account.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Trust badges */}
      <Container size="lg" mt={-28}>
        <Paper shadow="sm" radius="lg" p="lg" withBorder>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            <Group gap="sm" justify="center">
              <IconShieldCheck size={24} color="#0984E3" stroke={1.5} />
              <Box>
                <Text size="sm" fw={600}>Secure Payments</Text>
                <Text size="xs" c="dimmed">Bank Dhofar Open Banking</Text>
              </Box>
            </Group>
            <Group gap="sm" justify="center">
              <IconTruckDelivery size={24} color="#0984E3" stroke={1.5} />
              <Box>
                <Text size="sm" fw={600}>Fast Delivery</Text>
                <Text size="xs" c="dimmed">Across Oman in 2-3 days</Text>
              </Box>
            </Group>
            <Group gap="sm" justify="center">
              <IconCurrencyDollar size={24} color="#0984E3" stroke={1.5} />
              <Box>
                <Text size="sm" fw={600}>No Extra Fees</Text>
                <Text size="xs" c="dimmed">Direct bank transfer pricing</Text>
              </Box>
            </Group>
          </SimpleGrid>
        </Paper>
      </Container>

      {/* Product grid */}
      <Container size="lg" py="xl">
        <Group justify="space-between" align="baseline" mb="lg">
          <Box>
            <Title order={2} size="h3">
              Our Collection
            </Title>
            <Text size="sm" c="dimmed">
              Hand-picked Omani heritage products
            </Text>
          </Box>
          <Badge color="blue" variant="light" size="lg">
            {PRODUCTS.length} products
          </Badge>
        </Group>

        <SimpleGrid
          cols={{ base: 1, xs: 2, md: 3 }}
          spacing="lg"
        >
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      </Container>

      {/* Footer */}
      <Box
        py="xl"
        style={{
          borderTop: '1px solid #e9ecef',
          background: 'white',
        }}
      >
        <Container size="lg">
          <Group justify="space-between" align="center">
            <Box>
              <Text size="sm" c="dimmed">
                Salalah Electronics / {'\u0635\u0644\u0627\u0644\u0629 \u0644\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0627\u062A'}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                Powered by Sadad ({'\u0633\u062F\u0627\u062F'}) Payment Gateway
              </Text>
            </Box>
            <Text size="xs" c="dimmed">
              Bank Dhofar Open Banking PISP
            </Text>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}
