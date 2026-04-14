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
          background: 'linear-gradient(135deg, #D35400 0%, #E67E22 50%, #ffc078 100%)',
          padding: '48px 0 56px',
        }}
      >
        <Container size="lg">
          <Stack gap="sm" align="center" ta="center">
            <Badge
              variant="white"
              color="orange"
              size="lg"
              style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Authentic Omani Products
            </Badge>
            <Title order={1} c="white" size="2.5rem">
              Salalah Souq
            </Title>
            <Text size="md" c="white" style={{ opacity: 0.85 }} maw={500}>
              Oman's Premium Gift & Heritage Store.
              Pay instantly from your Bank Dhofar account via Sadad.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Trust badges */}
      <Container size="lg" mt={-28}>
        <Paper shadow="sm" radius="lg" p="lg" withBorder>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            <Group gap="sm" justify="center">
              <IconShieldCheck size={24} color="#D35400" stroke={1.5} />
              <Box>
                <Text size="sm" fw={600}>Secure Payments</Text>
                <Text size="xs" c="dimmed">Powered by Sadad Gateway</Text>
              </Box>
            </Group>
            <Group gap="sm" justify="center">
              <IconTruckDelivery size={24} color="#D35400" stroke={1.5} />
              <Box>
                <Text size="sm" fw={600}>Fast Delivery</Text>
                <Text size="xs" c="dimmed">Across Oman in 2-3 days</Text>
              </Box>
            </Group>
            <Group gap="sm" justify="center">
              <IconCurrencyDollar size={24} color="#D35400" stroke={1.5} />
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
          <Badge color="orange" variant="light" size="lg">
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
                Salalah Souq
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                Payments powered by Sadad () Payment Gateway
              </Text>
            </Box>
            <Text size="xs" c="dimmed">
              Bank Dhofar Open Banking
            </Text>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}
